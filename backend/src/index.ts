import crypto from "node:crypto";
import path from "node:path";
import cors from "cors";
import express, { type Request } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import multer from "multer";
import { PrismaClient, SubmissionType } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { allowedOrigins, env } from "./config.js";

const prisma = new PrismaClient();
const storage = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const permittedTypes = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
    ]);
    if (!permittedTypes.has(file.mimetype)) {
      callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
      return;
    }
    callback(null, true);
  },
});

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(2000),
});

const opportunitySchema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(120).optional(),
  title: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(1).max(40),
  country: z.string().trim().min(1).max(80),
  role: z.string().trim().min(1).max(80),
  type: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(3000),
  value: z.string().trim().max(100).optional(),
  contactMethod: z.string().trim().min(1).max(40),
});

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: allowedOrigins, methods: ["GET", "POST"] }));
app.use(express.json({ limit: "100kb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);

app.get("/health", (_request, response) => response.json({ status: "ok" }));

app.post("/api/submissions/contact", upload.none(), async (request, response, next) => {
  try {
    const values = contactSchema.parse(request.body);
    const submission = await prisma.submission.create({
      data: {
        type: SubmissionType.CONTACT,
        ...values,
        company: emptyToUndefined(values.company),
        phone: emptyToUndefined(values.phone),
      },
    });
    await sendCompanyEmail(
      submission.id,
      `New contact enquiry — ${values.name}`,
      formatContact(values),
      formatContactHtml(values),
      values.email,
    );
    response.status(201).json({ id: submission.id });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/submissions/opportunity",
  upload.single("document"),
  async (request, response, next) => {
    try {
      const values = opportunitySchema.parse(request.body);
      const submission = await prisma.submission.create({
        data: {
          type: SubmissionType.OPPORTUNITY,
          name: values.name,
          company: emptyToUndefined(values.company),
          email: values.email,
          phone: values.phone,
          jobTitle: emptyToUndefined(values.title),
          country: values.country,
          representativeRole: values.role,
          opportunityType: values.type,
          message: values.description,
          estimatedValue: emptyToUndefined(values.value),
          preferredContact: values.contactMethod,
        },
      });
      const attachment = request.file
        ? await saveAttachment(submission.id, request.file)
        : undefined;
      const emailAttachment = request.file
        ? {
            filename: request.file.originalname,
            content: request.file.buffer,
            contentType: request.file.mimetype,
          }
        : undefined;
      await sendCompanyEmail(
        submission.id,
        `New opportunity submission — ${values.name}`,
        formatOpportunity(values, attachment?.fileName),
        formatOpportunityHtml(values, attachment?.fileName),
        values.email,
        emailAttachment,
      );
      response.status(201).json({ id: submission.id });
    } catch (error) {
      next(error);
    }
  },
);

app.use(
  (error: unknown, _request: Request, response: express.Response, _next: express.NextFunction) => {
    if (error instanceof z.ZodError) {
      return response.status(400).json({ message: "Please review the form fields and try again." });
    }
    if (error instanceof multer.MulterError) {
      return response
        .status(400)
        .json({ message: "Documents must be one permitted file no larger than 10 MB." });
    }
    console.error(error);
    return response
      .status(500)
      .json({
        message: "We could not send your submission. Please try again or contact TEKMA directly.",
      });
  },
);

async function saveAttachment(submissionId: string, file: Express.Multer.File) {
  const extension = path.extname(file.originalname).toLowerCase();
  const storagePath = `${submissionId}/${crypto.randomUUID()}${extension}`;
  const { error } = await storage.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) throw error;
  return prisma.attachment.create({
    data: {
      submissionId,
      fileName: file.originalname,
      storagePath,
      mimeType: file.mimetype,
      size: file.size,
    },
  });
}

async function sendCompanyEmail(
  submissionId: string,
  subject: string,
  text: string,
  html: string,
  replyTo: string,
  attachment?: { filename: string; content: Buffer; contentType: string },
) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [env.COMPANY_EMAIL],
        reply_to: replyTo,
        subject: `TEKMA Website | ${subject}`,
        text,
        html,
        attachments: attachment
          ? [{ filename: attachment.filename, content: attachment.content.toString("base64") }]
          : undefined,
      }),
    });
    if (!response.ok) {
      throw new Error(`Resend request failed with status ${response.status}`);
    }
    await prisma.submission.update({ where: { id: submissionId }, data: { emailStatus: "SENT" } });
  } catch (error) {
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        emailStatus: "FAILED",
        emailError: error instanceof Error ? error.message.slice(0, 1000) : "Unknown email error",
      },
    });
    throw error;
  }
}

function emptyToUndefined(value: string | undefined) {
  return value || undefined;
}

function formatContact(values: z.infer<typeof contactSchema>) {
  return `A contact enquiry was submitted from the TEKMA website.\n\nName: ${values.name}\nCompany: ${values.company || "Not provided"}\nEmail: ${values.email}\nPhone: ${values.phone || "Not provided"}\nSubject: ${values.subject}\n\nMessage:\n${values.message}`;
}

function formatOpportunity(values: z.infer<typeof opportunitySchema>, attachmentName?: string) {
  return `A new opportunity was submitted from the TEKMA website.\n\nName: ${values.name}\nCompany: ${values.company || "Not provided"}\nJob title: ${values.title || "Not provided"}\nEmail: ${values.email}\nPhone / WhatsApp: ${values.phone}\nCountry: ${values.country}\nRepresentative role: ${values.role}\nOpportunity type: ${values.type}\nEstimated value: ${values.value || "Not provided"}\nPreferred contact: ${values.contactMethod}\nSupporting document: ${attachmentName || "None"}\n\nDescription:\n${values.description}`;
}

function formatContactHtml(values: z.infer<typeof contactSchema>) {
  return emailTemplate("New contact enquiry", values.name, [
    ["Company", values.company || "Not provided"],
    ["Email", values.email],
    ["Phone", values.phone || "Not provided"],
    ["Subject", values.subject],
    ["Message", values.message],
  ]);
}

function formatOpportunityHtml(values: z.infer<typeof opportunitySchema>, attachmentName?: string) {
  return emailTemplate("New opportunity submission", values.name, [
    ["Company", values.company || "Not provided"],
    ["Job title", values.title || "Not provided"],
    ["Email", values.email],
    ["Phone / WhatsApp", values.phone],
    ["Country", values.country],
    ["Representative role", values.role],
    ["Opportunity type", values.type],
    ["Estimated value", values.value || "Not provided"],
    ["Preferred contact", values.contactMethod],
    ["Supporting document", attachmentName || "None"],
    ["Description", values.description],
  ]);
}

function emailTemplate(title: string, senderName: string, details: Array<[string, string]>) {
  const rows = details
    .map(
      ([label, value]) =>
        `<tr><td style="padding:12px 16px;border-bottom:1px solid #e5edf3;color:#4a6072;font-size:13px;font-weight:700;vertical-align:top;width:35%;">${escapeHtml(label)}</td><td style="padding:12px 16px;border-bottom:1px solid #e5edf3;color:#18232d;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `<!doctype html><html lang="en"><body style="margin:0;background:#f5f8fa;font-family:Arial,sans-serif;color:#18232d;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:32px 16px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dce6ed;"><tr><td style="padding:28px 32px;background:#071b33;color:#ffffff;"><p style="margin:0 0 8px;color:#f5b900;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">TEKMA Global Partners Limited</p><h1 style="margin:0;font-size:24px;line-height:1.25;">${escapeHtml(title)}</h1></td></tr><tr><td style="padding:28px 32px 8px;"><p style="margin:0;color:#4a6072;font-size:14px;line-height:1.6;">A website submission has been received from <strong style="color:#18232d;">${escapeHtml(senderName)}</strong>. Reply directly to this email to contact the sender.</p></td></tr><tr><td style="padding:16px 32px 32px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5edf3;border-collapse:collapse;">${rows}</table></td></tr><tr><td style="padding:20px 32px;background:#f5f8fa;color:#667b8d;font-size:12px;line-height:1.5;">This notification was generated by the TEKMA Global Partners website.</td></tr></table></td></tr></table></body></html>`;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ??
      character,
  );
}

app.listen(env.PORT, () => console.log(`TEKMA submissions API listening on port ${env.PORT}`));

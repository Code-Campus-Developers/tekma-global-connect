import crypto from "node:crypto";
import path from "node:path";
import cors from "cors";
import express, { type Request } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import multer from "multer";
import nodemailer from "nodemailer";
import { PrismaClient, SubmissionType } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { allowedOrigins, env } from "./config.js";

const prisma = new PrismaClient();
const storage = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});
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
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false }));

app.get("/health", (_request, response) => response.json({ status: "ok" }));

app.post("/api/submissions/contact", async (request, response, next) => {
  try {
    const values = contactSchema.parse(request.body);
    const submission = await prisma.submission.create({
      data: { type: SubmissionType.CONTACT, ...values, company: emptyToUndefined(values.company), phone: emptyToUndefined(values.phone) },
    });
    await sendCompanyEmail(submission.id, "Contact enquiry", formatContact(values), values.email);
    response.status(201).json({ id: submission.id });
  } catch (error) {
    next(error);
  }
});

app.post("/api/submissions/opportunity", upload.single("document"), async (request, response, next) => {
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
    const attachment = request.file ? await saveAttachment(submission.id, request.file) : undefined;
    const emailAttachment = request.file
      ? {
          filename: request.file.originalname,
          content: request.file.buffer,
          contentType: request.file.mimetype,
        }
      : undefined;
    await sendCompanyEmail(
      submission.id,
      "New opportunity submission",
      formatOpportunity(values, attachment?.fileName),
      values.email,
      emailAttachment,
    );
    response.status(201).json({ id: submission.id });
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _request: Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    return response.status(400).json({ message: "Please review the form fields and try again." });
  }
  if (error instanceof multer.MulterError) {
    return response.status(400).json({ message: "Documents must be one permitted file no larger than 10 MB." });
  }
  console.error(error);
  return response.status(500).json({ message: "We could not send your submission. Please try again or contact TEKMA directly." });
});

async function saveAttachment(submissionId: string, file: Express.Multer.File) {
  const extension = path.extname(file.originalname).toLowerCase();
  const storagePath = `${submissionId}/${crypto.randomUUID()}${extension}`;
  const { error } = await storage.storage.from(env.SUPABASE_STORAGE_BUCKET).upload(storagePath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });
  if (error) throw error;
  return prisma.attachment.create({
    data: { submissionId, fileName: file.originalname, storagePath, mimeType: file.mimetype, size: file.size },
  });
}

async function sendCompanyEmail(
  submissionId: string,
  subject: string,
  text: string,
  replyTo: string,
  attachment?: { filename: string; content: Buffer; contentType: string },
) {
  try {
    await mailer.sendMail({
      from: env.SMTP_FROM,
      to: env.COMPANY_EMAIL,
      replyTo,
      subject: `[Website] ${subject}`,
      text,
      attachments: attachment ? [attachment] : undefined,
    });
    await prisma.submission.update({ where: { id: submissionId }, data: { emailStatus: "SENT" } });
  } catch (error) {
    await prisma.submission.update({ where: { id: submissionId }, data: { emailStatus: "FAILED", emailError: error instanceof Error ? error.message.slice(0, 1000) : "Unknown email error" } });
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

app.listen(env.PORT, () => console.log(`TEKMA submissions API listening on port ${env.PORT}`));

import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitForm } from "@/lib/submissions";

const fieldClass = "space-y-2";
const labelClass = "block text-sm font-semibold text-navy";
const selectClass =
  "min-h-12 w-full rounded-md border border-input bg-background px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type FormStatus = "idle" | "submitting" | "sent";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await submitForm("/api/submissions/contact", new FormData(event.currentTarget));
      setStatus("sent");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send your enquiry. Please try again.",
      );
      setStatus("idle");
    }
  }

  if (status === "sent") return <Success title="Enquiry sent" />;

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Name">
        <Input name="name" required maxLength={100} />
      </Field>
      <Field label="Company">
        <Input name="company" maxLength={120} />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" required maxLength={255} />
      </Field>
      <Field label="Phone">
        <Input name="phone" type="tel" maxLength={40} />
      </Field>
      <Field label="Subject" wide>
        <Input name="subject" required maxLength={160} />
      </Field>
      <Field label="Message" wide>
        <Textarea name="message" required maxLength={2000} />
      </Field>
      {error && <FormError message={error} />}
      <Button
        type="submit"
        disabled={status === "submitting"}
        className="min-h-12 rounded-none bg-navy px-8 hover:bg-petroleum sm:w-fit"
      >
        {status === "submitting" && (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        )}
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}

export function OpportunityForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await submitForm("/api/submissions/opportunity", new FormData(event.currentTarget));
      setStatus("sent");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send your opportunity. Please try again.",
      );
      setStatus("idle");
    }
  }

  if (status === "sent") return <Success title="Opportunity sent" />;

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Full Name">
        <Input name="name" required maxLength={100} />
      </Field>
      <Field label="Company">
        <Input name="company" maxLength={120} />
      </Field>
      <Field label="Job Title">
        <Input name="title" maxLength={100} />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" required maxLength={255} />
      </Field>
      <Field label="Phone / WhatsApp">
        <Input name="phone" type="tel" required maxLength={40} />
      </Field>
      <Field label="Country">
        <Input name="country" required maxLength={80} />
      </Field>
      <Field label="I represent a">
        <select name="role" required className={selectClass} defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          {["Buyer", "Seller", "Asset Owner", "Mandate Holder", "Other"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>
      <Field label="Opportunity Type">
        <select name="type" required className={selectClass} defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          {[
            "Crude Oil",
            "Natural Gas",
            "Oil Block / Acreage",
            "Energy Asset",
            "Marine Vessel",
            "Land",
            "Commercial Property",
            "Other",
          ].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>
      <Field label="Brief Description" wide>
        <Textarea name="description" required maxLength={3000} />
      </Field>
      <Field label="Estimated Transaction / Asset Value (optional)">
        <Input name="value" maxLength={100} />
      </Field>
      <Field label="Supporting Document (optional)">
        <Input name="document" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
      </Field>
      <Field label="Preferred Contact Method">
        <select name="contactMethod" required className={selectClass} defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option>Email</option>
          <option>Telephone</option>
          <option>WhatsApp</option>
        </select>
      </Field>
      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground sm:col-span-2">
        <input type="checkbox" required className="mt-1 size-5 accent-petroleum" />I confirm that
        the information supplied is accurate to the best of my knowledge.
      </label>
      {error && <FormError message={error} />}
      <Button
        type="submit"
        disabled={status === "submitting"}
        className="min-h-12 rounded-none bg-navy px-8 uppercase tracking-[0.12em] hover:bg-petroleum sm:w-fit"
      >
        {status === "submitting" && (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        )}
        {status === "submitting" ? "Sending…" : "Submit Opportunity"}
      </Button>
    </form>
  );
}

function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`${fieldClass} ${wide ? "sm:col-span-2" : ""}`}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="border-l-4 border-destructive bg-destructive/10 p-4 text-sm text-foreground sm:col-span-2"
    >
      {message}
    </p>
  );
}

function Success({ title }: { title: string }) {
  return (
    <div role="status" className="border-l-4 border-energy bg-surface p-8">
      <CheckCircle2 className="size-9 text-energy" />
      <h2 className="mt-4 text-2xl font-bold text-navy">{title}</h2>
      <p className="mt-2 leading-7 text-muted-foreground">
        Thank you. Your submission has been sent to TEKMA Global Partners Limited.
      </p>
    </div>
  );
}

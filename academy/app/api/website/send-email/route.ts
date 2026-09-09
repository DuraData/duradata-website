import { z } from "zod"

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  address: z.string().trim().min(1).max(500),
  residentialBusiness: z.enum(["Residential", "Business"]),
  message: z.string().trim().min(10).max(10_000),
})

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!)
}

export async function POST(request: Request) {
  const parsed = ContactSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 })

  const token = process.env.HOSTINGER_API_TOKEN?.trim()
  const mailboxId = process.env.HOSTINGER_MAILBOX_RESOURCE_ID?.trim()
  if (!token || !mailboxId) return Response.json({ success: false, error: "Contact email is not configured" }, { status: 503 })

  const { name, email, address, residentialBusiness, message } = parsed.data
  const response = await fetch(`https://api.mail.hostinger.com/api/v1/mailboxes/${encodeURIComponent(mailboxId)}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      to: [process.env.CONTACT_TO_EMAIL || "webrequest@duradata.co.za"],
      displayName: process.env.CONTACT_FROM_NAME || "Duradata Website",
      subject: `New Contact Form Submission - ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nAddress: ${address}\nCategory: ${residentialBusiness}\n\n${message}`,
      html: `<h1>New Contact Form Submission</h1><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Address:</strong> ${escapeHtml(address)}</p><p><strong>Category:</strong> ${escapeHtml(residentialBusiness)}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    }),
  }).catch(() => null)

  if (!response?.ok) return Response.json({ success: false, error: "Failed to send email. Please try again later." }, { status: 502 })
  return Response.json({ success: true, message: "Message sent successfully." })
}

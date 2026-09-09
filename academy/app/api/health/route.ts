import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "duradata-academy",
    timestamp: new Date().toISOString(),
  })
}

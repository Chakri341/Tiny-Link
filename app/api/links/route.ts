import prisma from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(links)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { url, code } = body

  if (!url)
    return NextResponse.json({ error: "Missing URL" }, { status: 400 })

  if (code) {
    if (!CODE_REGEX.test(code))
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })

    const exists = await prisma.link.findUnique({ where: { code } })
    if (exists)
      return NextResponse.json({ error: "Code Already exists" }, { status: 409 })
  }

  const finalCode = code || nanoid(7)

  const created = await prisma.link.create({
    data: { code: finalCode, url },
  })

  return NextResponse.json(created, { status: 201 })
}

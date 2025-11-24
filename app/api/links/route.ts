import prisma from "../../../lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"


export const revalidate = 0;
export const dynamic = "force-dynamic";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);

  const skip = (page - 1) * limit;

  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  const hasMore = links.length === limit;

  return Response.json({ links, hasMore });
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



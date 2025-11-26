import prisma from "../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  const link = await prisma.link.findUnique({
    where: { code: params.code },
  })
  if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 })
 
  return NextResponse.json(link)
}


export async function DELETE(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    await prisma.link.delete({
      where: { code: params.code },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: any) {

  const body = await req.json().catch(() => ({}));
  const { password ,code} = body;


  const link = await prisma.link.findUnique({ where: { code } });
  if (!link) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  if (link.expiresAt && new Date() > link.expiresAt) {
    return NextResponse.json({ ok: false, error: "Link expired" }, { status: 410 });
  }

  if (!link.passwordHash) {
    await prisma.link.update({
      where: { code },
      data: { clicks: { increment: 1 }, lastClicked: new Date() },
    });
    return NextResponse.json({ ok: true, url: link.url });
  }

  const match = await bcrypt.compare(password || "", link.passwordHash);
  if (!match) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  await prisma.link.update({
    where: { code },
    data: { clicks: { increment: 1 }, lastClicked: new Date() },
  });

  return NextResponse.json({ ok: true, url: link.url });
}

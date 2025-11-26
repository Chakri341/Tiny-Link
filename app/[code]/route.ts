import { getBaseUrl } from "@/utils/getBaseUrl";
import prisma from "../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const link = await prisma.link.findUnique({
    where: { code: params.code },
  })

  if (!link) return new Response("Not Found", { status: 404 })

  const origin = await getBaseUrl();

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return NextResponse.redirect(`${origin}/expired`);
  }

  if (link.passwordHash) {
    return NextResponse.redirect(`${origin}/password/${params.code}`);
  }

  await prisma.link.update({
    where: { code: params.code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  })

  return NextResponse.redirect(link.url, { status: 302 })
}

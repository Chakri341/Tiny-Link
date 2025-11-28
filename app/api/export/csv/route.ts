import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });

  // CSV Header
  let csv = "code,url,clicks,lastClicked,createdAt\n";

  links.forEach(l => {
    csv += `${l.code},${l.url},${l.clicks},${l.lastClicked ?? ""},${l.createdAt}\n`;
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="tinylink_export.csv"`,
    },
  });
}

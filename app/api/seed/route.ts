import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const items = Array.from({ length: 10 }).map((_, i) => ({
      code: Math.random().toString(36).substring(2, 10).slice(0, 8), 
      url: `https://example.com/${i}`,
      clicks: Math.floor(Math.random() * 10),
      lastClicked: new Date(),
      createdAt: new Date(),
    }));

    await prisma.link.createMany({
      data: items,
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, inserted: items.length });
  } catch (error) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: "Database insert failed" }, { status: 500 });
  }
}

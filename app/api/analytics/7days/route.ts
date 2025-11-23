import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  // Fetch all links updated in last 7 days
  const links = await prisma.link.findMany({
    where: {
      lastClicked: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      clicks: true,
      lastClicked: true,
    },
  });

  // Prepare 7-day result array
  const result = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date();
    day.setDate(today.getDate() - (6 - index));
    const formatted = day.toISOString().split("T")[0];

    // Sum clicks that happened on that day
    const clicksForDay = links
      .filter(
        (l) =>
          l.lastClicked &&
          l.lastClicked.toISOString().split("T")[0] === formatted
      )
      .reduce((sum, l) => sum + l.clicks, 0);
      
      const dateReversed =formatted.split('-').reverse().join('-')

    return {
      date: dateReversed,
      clicks: clicksForDay,
    };
  });

  return NextResponse.json(result);
}

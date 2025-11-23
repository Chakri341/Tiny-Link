import LinksTable from "./LinksTable";
import prisma from "@/lib/prisma";

const PAGE_SIZE = 20;

export default async function Dashboard() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
  });

  const hasMore = links.length === PAGE_SIZE;

  return (

    <LinksTable
      initialLinks={links}
      pageSize={PAGE_SIZE}
      initialHasMore={hasMore}
    />

  );
}

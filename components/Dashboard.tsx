import LinksTable from "./LinksTable";
import prisma from "@/lib/prisma";
import SeedButton from "./Seedbutton";

const PAGE_SIZE = 20;

export default async function Dashboard() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
  });

  const hasMore = links.length === PAGE_SIZE;

  return (
    <div className="space-y-2">
      {/* <div className="flex justify-end">
        <SeedButton />
      </div> */}

      <LinksTable
        initialLinks={links}
        pageSize={PAGE_SIZE}
        initialHasMore={hasMore}
      />
    </div>

  );
}

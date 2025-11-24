import LinksTable from "./LinksTable";
import prisma from "@/lib/prisma";
import SeedButton from "./Seedbutton";

const PAGE_SIZE = 20;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Dashboard() {
 const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links?page=1&limit=${PAGE_SIZE}`, {
    cache: "no-store",
  });

  const data = await res.json();


  return (
    <div className="space-y-2">
      {/* <div className="flex justify-end">
        <SeedButton />
      </div> */}

      <LinksTable
        initialLinks={data.links}
        pageSize={PAGE_SIZE}
        initialHasMore={data.hasMore}
      />
    </div>

  );
}

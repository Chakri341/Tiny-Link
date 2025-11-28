import { getAccessTokenFromCookies, verifyAccessToken } from "@/lib/auth";
import LinksTable from "./LinksTable";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const PAGE_SIZE = 20;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Dashboard() {


  const token = getAccessTokenFromCookies();
  if (!token) redirect("/login");

  const payload = verifyAccessToken(token);
  if (!payload) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) redirect("/login");

  const links = await prisma.link.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
  });
  const hasMore = links.length === PAGE_SIZE;


  // console.log("data dash ==>>>>>>>>>>>>", { links, hasMore });
  //   if (Math.random() > 0) {
  //   throw new Error("Test Crash");
  // }


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




// const links = await prisma.link.findMany({
//   orderBy: { createdAt: "desc" },
//   take: PAGE_SIZE,
// });

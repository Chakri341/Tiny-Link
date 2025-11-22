
import LinksTable from "./LinksTable"
import LinkForm from "./LinkForm"
import prisma from "@/lib/prisma";

export default async function Dashboard() {

  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <LinkForm />
      <LinksTable links={links} />
    </div>
  )
}

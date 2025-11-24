import prisma from "../../../lib/prisma"
import { notFound } from "next/navigation"
import StatsClient from "./StatsClient"
import { getBaseUrl } from "@/utils/getBaseUrl"

export default async function StatsPage({ params }: { params: { code: string } }) {
  const link = await prisma.link.findUnique({
    where: { code: params.code },
  })

  if (!link) return notFound()

  const origin = await getBaseUrl();
  // console.log("url origin ==> ", origin)

  const shortUrl = `${origin}/${link.code}`


  return <StatsClient link={{ ...link, shortUrl }} />
}

import prisma from "../../../lib/prisma"
import { notFound } from "next/navigation"
import StatsClient from "./StatsClient"

export default async function StatsPage({ params }: { params: { code: string } }) {
  const link = await prisma.link.findUnique({
    where: { code: params.code },
  })

  if (!link) return notFound()

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const shortUrl = `${base}/${link.code}`

  return <StatsClient link={{ ...link, shortUrl }} />
}

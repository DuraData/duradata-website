import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/rbac"
import { CurrencyCode } from "@/lib/generated/prisma/enums"
import { listQueryErrorResponse, paginationMetadata, parseListQuery } from "@/lib/list-query"
import { mysqlContainsIds } from "@/lib/mysql-search"

export async function GET(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const url = new URL(req.url)
  let list
  try {
    list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "createdAt", allowedSorts: ["createdAt", "amount", "reference"] as const })
  } catch (error) {
    return listQueryErrorResponse(error)
  }
  const type = url.searchParams.get("type")
  const status = url.searchParams.get("status")
  const q = list.search
  const userId = url.searchParams.get("userId")
  const courseId = url.searchParams.get("courseId")

  const where: Record<string, unknown> = {}
  if (type && ["enrollment", "payout", "commission", "refund", "adjustment"].includes(type)) where.type = type
  if (status && ["pending", "succeeded", "failed", "reversed"].includes(status)) where.status = status
  if (userId) where.userId = userId
  if (courseId) where.courseId = courseId
  if (q) {
    const [transactionIds, userIds, courseIds] = await Promise.all([mysqlContainsIds("Transaction", ["reference", "description"], q), mysqlContainsIds("User", ["email", "name"], q), mysqlContainsIds("Course", ["title"], q)])
    where.OR = [{ id: { in: transactionIds } }, { userId: { in: userIds } }, { courseId: { in: courseIds } }]
  }

  const [transactions, totalItems, revenueAgg, payoutAgg, commissionAgg] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { [list.sort]: list.sortDirection },
      skip: list.skip,
      take: list.take,
    }),
    prisma.transaction.count({ where }),
    prisma.transaction.aggregate({
      where: { status: "succeeded", currency: CurrencyCode.USD, type: "enrollment" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { status: "succeeded", currency: CurrencyCode.USD, type: "payout" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { status: "succeeded", currency: CurrencyCode.USD, type: "commission" },
      _sum: { amount: true },
    }),
  ])

  return Response.json({
    transactions,
    pagination: paginationMetadata(list.page, list.pageSize, totalItems), totals: {
      revenueUsd: revenueAgg._sum?.amount ?? 0,
      payoutsUsd: payoutAgg._sum?.amount ?? 0,
      commissionsUsd: commissionAgg._sum?.amount ?? 0,
    },
  })
}

const CreateSchema = z.object({
  type: z.enum(["enrollment", "payout", "commission", "refund", "adjustment"]),
  status: z.enum(["pending", "succeeded", "failed", "reversed"]).optional(),
  currency: z.enum(["USD", "ZWL", "ZAR"]).optional(),
  amount: z.number().int().positive().max(1_000_000_000),
  userId: z.string().uuid().nullable().optional(),
  courseId: z.string().uuid().nullable().optional(),
  reference: z.string().max(80).optional(),
  description: z.string().max(300).optional(),
})

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const json = await req.json().catch(() => null)
  const parsed = CreateSchema.safeParse(json)
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 })

  const created = await prisma.transaction.create({
    data: {
      type: parsed.data.type,
      status: parsed.data.status ?? "succeeded",
      currency: (parsed.data.currency ?? CurrencyCode.USD) as (typeof CurrencyCode)[keyof typeof CurrencyCode],
      amount: parsed.data.amount,
      userId: parsed.data.userId ?? null,
      courseId: parsed.data.courseId ?? null,
      reference: parsed.data.reference ?? null,
      description: parsed.data.description ?? null,
    },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      course: { select: { id: true, title: true } },
    },
  })

  return Response.json({ success: true, transaction: created })
}

const PatchSchema = z.object({
  transactionId: z.string().uuid(),
  action: z.enum(["setStatus", "updateMeta"]),
  status: z.enum(["pending", "succeeded", "failed", "reversed"]).optional(),
  reference: z.string().max(80).nullable().optional(),
  description: z.string().max(300).nullable().optional(),
})

export async function PATCH(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const json = await req.json().catch(() => null)
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 })

  const { transactionId, action, status, reference, description } = parsed.data

  if (action === "setStatus") {
    if (!status) return Response.json({ error: "Status is required" }, { status: 400 })
    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    })
    return Response.json({ success: true, transaction: updated })
  }

  const updated = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      reference: reference === undefined ? undefined : reference,
      description: description === undefined ? undefined : description,
    },
  })
  return Response.json({ success: true, transaction: updated })
}

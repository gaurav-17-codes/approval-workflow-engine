import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
// import { sendMail, emailTemplates } from "@/lib/mail"
import { sendNotificationEmail } from "@/lib/mail";
import { successResponse, errorResponse } from "@/lib/response"
import { Category, Priority, RequestStatus, Role } from "@prisma/client"
import { WORKFLOW_STEPS } from "@/lib/constants"

// ─── POST /api/approvals ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse("Unauthorized. Please log in.", 401)
    }

    const user = session.user as { id: string; name: string; role: Role }

    // Only teachers (and admins) can submit requests
    if (user.role !== Role.TEACHER && user.role !== Role.ADMIN) {
      return errorResponse("Only teachers can submit approval requests.", 403)
    }

    const body = await req.json()
    const { title, category, description, priority } = body

    // Input validation
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return errorResponse("Title must be at least 3 characters.", 400)
    }
    if (!category || !Object.values(Category).includes(category)) {
      return errorResponse(`Category must be one of: ${Object.values(Category).join(", ")}`, 400)
    }
    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return errorResponse("Description must be at least 10 characters.", 400)
    }
    if (priority && !Object.values(Priority).includes(priority)) {
      return errorResponse(`Priority must be one of: ${Object.values(Priority).join(", ")}`, 400)
    }

    // Create request + seed approval steps in one transaction
    const approvalRequest = await prisma.$transaction(async (tx) => {
      const request = await tx.approvalRequest.create({
        data: {
          title:        title.trim(),
          category,
          description:  description.trim(),
          priority:     priority ?? Priority.MEDIUM,
          status:       RequestStatus.PENDING,
          submittedById: user.id,
        },
      })

      // Create all steps; step 1 starts as ACTIVE, rest as PENDING
      const stepsData = WORKFLOW_STEPS.map((role, index) => ({
        requestId:   request.id,
        stepOrder:   index + 1,
        approverRole: role as Role,
        status:      index === 0 ? "ACTIVE" as const : "PENDING" as const,
      }))

      await tx.approvalStep.createMany({ data: stepsData })

      return tx.approvalRequest.findUnique({
        where: { id: request.id },
        include: {
          steps:       { orderBy: { stepOrder: "asc" } },
          submittedBy: { select: { id: true, name: true, email: true } },
        },
      })
    })

    // Notify first approver (HOD) by email
    const hod = await prisma.user.findFirst({ where: { role: Role.HOD } })
    if (hod) {
      sendNotificationEmail({
        to: hod.email,
        subject: `🚨 Action Required: New Request from ${user.name}`,
        html: `
          <h3>New Request Submitted</h3>
          <p><b>Title:</b> ${approvalRequest!.title}</p>
          <p><b>Category:</b> ${approvalRequest!.category}</p>
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/approvals/${approvalRequest!.id}">Click here to review</a>
        `
      });
    }

    return successResponse(approvalRequest, "Approval request created successfully.", 201)
  } catch (error) {
    console.error("[POST /api/approvals]", error)
    return errorResponse("Something went wrong. Please try again.")
  }
}

// ─── GET /api/approvals ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse("Unauthorized. Please log in.", 401)
    }

    const user = session.user as { id: string; role: Role }

    // Parse query filters
    const { searchParams } = new URL(req.url)
    const statusParam   = searchParams.get("status")   as RequestStatus | null
    const categoryParam = searchParams.get("category") as Category | null

    const where: Record<string, unknown> = {}

    // Role-based filtering: teachers see only their own; approvers see all
    if (user.role === Role.TEACHER) {
      where.submittedById = user.id
    }

    if (statusParam && Object.values(RequestStatus).includes(statusParam)) {
      where.status = statusParam
    }
    if (categoryParam && Object.values(Category).includes(categoryParam)) {
      where.category = categoryParam
    }

    const requests = await prisma.approvalRequest.findMany({
      where,
      include: {
        submittedBy: { select: { id: true, name: true, email: true } },
        steps: {
          orderBy: { stepOrder: "asc" },
          include: { actionedBy: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(requests, "Approval requests fetched successfully.")
  } catch (error) {
    console.error("[GET /api/approvals]", error)
    return errorResponse("Something went wrong. Please try again.")
  }
}
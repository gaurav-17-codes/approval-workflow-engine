import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────
// POST /api/approvals — Create new request
// ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Step 1: Read body
    const body = await req.json();
    const { title, category, description, priority, requesterId } = body;

    // Step 2: Validate — check all required fields
    if (!title || !category || !description || !requesterId) {
      return NextResponse.json(
        { success: false, data: null, message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Description must be at least 10 characters",
        },
        { status: 400 },
      );
    }

    // Step 3: Save approval request to DB
    const newRequest = await prisma.approvalRequest.create({
      data: {
        title,
        description,
        status: "PENDING",
        requesterId,
      },
    });

    // Step 4: Create first approval_step with status PENDING
    await prisma.approvalStep.create({
      data: {
        requestId: newRequest.id,
        stepNumber: 1,
        role: "HOD",
        status: "PENDING",
      },
    });

    // Step 5: Return success
    return NextResponse.json(
      {
        success: true,
        data: newRequest,
        message: "Approval request created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/approvals error:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────
// GET /api/approvals — List all requests
// Supports ?status=PENDING&category=Finance
// ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    // Step 1: Read query filters from URL
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    // Step 2: Fetch from DB with optional filters
    const requests = await prisma.approvalRequest.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(category && { category }),
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, role: true },
        },
        steps: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Step 3: Return list
    return NextResponse.json({
      success: true,
      data: requests,
      message: "OK",
    });
  } catch (error) {
    console.error("GET /api/approvals error:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
}

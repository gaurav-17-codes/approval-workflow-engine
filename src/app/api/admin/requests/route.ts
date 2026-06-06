import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    // SECURITY GATE: Strictly block anyone who is not an ADMIN
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admins only" }, { status: 403 });
    }

    // 1. Calculate System Analytics
    const total = await prisma.approvalRequest.count();
    const pending = await prisma.approvalRequest.count({ where: { status: "PENDING" } });
    const approved = await prisma.approvalRequest.count({ where: { status: "APPROVED" } });
    const rejected = await prisma.approvalRequest.count({ where: { status: "REJECTED" } });

    // 2. Fetch the Master List of all requests
    const requests = await prisma.approvalRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        submittedBy: { select: { name: true, email: true, role: true } },
      }
    });

    return NextResponse.json({
      success: true,
      stats: { total, pending, approved, rejected },
      data: requests
    });

  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch admin data" }, { status: 500 });
  }
}
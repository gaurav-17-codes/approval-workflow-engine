import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// SECURITY HELPER
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || user.role !== "ADMIN") return false;
  return true;
}


//src/app/api/admin/users/
// 1. GET: Fetch all users
export async function GET() {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
  }
}

// 2. PATCH: Update a user's role
export async function PATCH(req: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Role Update Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update role" }, { status: 500 });
  }
}
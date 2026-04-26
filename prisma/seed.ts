import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create 5 users
  const student = await prisma.user.create({
    data: {
      name: "Student User",
      email: "student@kalnet.com",
      password: "123456",
      role: "STAFF",
    },
  });

  const hod = await prisma.user.create({
    data: {
      name: "HOD User",
      email: "hod@kalnet.com",
      password: "123456",
      role: "HOD",
    },
  });

  const principal = await prisma.user.create({
    data: {
      name: "Principal User",
      email: "principal@kalnet.com",
      password: "123456",
      role: "PRINCIPAL",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@kalnet.com",
      password: "123456",
      role: "ADMIN",
    },
  });

  const teacher = await prisma.user.create({
    data: {
      name: "Teacher User",
      email: "teacher@kalnet.com",
      password: "123456",
      role: "STAFF",
    },
  });

  // Create 3 sample approval requests
  await prisma.approvalRequest.create({
    data: {
      title: "Science Fair Budget",
      description: "Requesting Rs 5000 for science fair materials",
      status: "PENDING",
      requesterId: student.id,
      steps: {
        create: { stepNumber: 1, role: "HOD", status: "PENDING" },
      },
    },
  });

  await prisma.approvalRequest.create({
    data: {
      title: "Sports Equipment",
      description: "Requesting Rs 8000 for new sports equipment",
      status: "PENDING",
      requesterId: teacher.id,
      steps: {
        create: { stepNumber: 1, role: "HOD", status: "PENDING" },
      },
    },
  });

  await prisma.approvalRequest.create({
    data: {
      title: "Library Books",
      description: "Requesting Rs 3000 for new library books",
      status: "APPROVED",
      requesterId: teacher.id,
      steps: {
        create: { stepNumber: 1, role: "HOD", status: "APPROVED" },
      },
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

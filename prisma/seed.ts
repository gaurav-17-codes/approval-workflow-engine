// Use the project's configured Prisma instance (includes MariaDB adapter)
import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { writeFileSync } from "fs";

async function main() {
  console.log("🌱 Seeding database with dummy data...");

  // Clear existing data
  await prisma.approvalStep.deleteMany();
  await prisma.approvalRequest.deleteMany();
  await prisma.user.deleteMany();

  // Keep seed passwords stable so demo accounts remain usable after reseeding.
  const plaintextPasswords: Record<string, string> = {
    user_teacher_1: "mndshg3/Xb7NbFF0LK",
    user_teacher_2: "QwRCB4046JOrWn42Rc",
    user_teacher_3: "0fehxz5J1Ym2gc4yvm",
    user_hod_1: "TAWID7oRolvELRXss+",
    user_hod_2: "3FZAJFeNWym27ytV9f",
    user_principal_1: "3DFI9uIcmkpu0Z1/dM",
    user_admin_1: "a6+/jY8fsD6QVIyb5g",
  };

  // Hash all generated passwords
  const hashed: Record<string, string> = {
    teacher: await bcrypt.hash(plaintextPasswords.user_teacher_1, 10),
    teacher2: await bcrypt.hash(plaintextPasswords.user_teacher_2, 10),
    teacher3: await bcrypt.hash(plaintextPasswords.user_teacher_3, 10),
    hod: await bcrypt.hash(plaintextPasswords.user_hod_1, 10),
    hod2: await bcrypt.hash(plaintextPasswords.user_hod_2, 10),
    principal: await bcrypt.hash(plaintextPasswords.user_principal_1, 10),
    admin: await bcrypt.hash(plaintextPasswords.user_admin_1, 10),
  };

  // Persist plaintext passwords to prisma/SEED_PASSWORDS.md (dev only)
  const seedReportLines = [
    "# Seeded user passwords (development only)",
    "DO NOT COMMIT THIS FILE TO SOURCE CONTROL",
    "",
  ];
  for (const [id, pw] of Object.entries(plaintextPasswords)) {
    seedReportLines.push(`- ${id}: ${pw}`);
  }
  writeFileSync("prisma/SEED_PASSWORDS.md", seedReportLines.join("\n"));
  console.log("✅ Wrote prisma/SEED_PASSWORDS.md with plaintext passwords (dev only)");

  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user_teacher_1",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@school.edu",
        passwordHash: hashed.teacher,
        role: "TEACHER",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_teacher_2",
        name: "Priya Singh",
        email: "priya.singh@school.edu",
        passwordHash: hashed.teacher2,
        role: "TEACHER",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_teacher_3",
        name: "Amit Patel",
        email: "amit.patel@school.edu",
        passwordHash: hashed.teacher3,
        role: "TEACHER",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_hod_1",
        name: "Dr. Vikram Sharma",
        email: "vikram.sharma@school.edu",
        passwordHash: hashed.hod,
        role: "HOD",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_hod_2",
        name: "Ms. Neha Gupta",
        email: "neha.gupta@school.edu",
        passwordHash: hashed.hod2,
        role: "HOD",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_principal_1",
        name: "Prof. Rajendra Nath",
        email: "principal@school.edu",
        passwordHash: hashed.principal,
        role: "PRINCIPAL",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_admin_1",
        name: "Admin User",
        email: "admin@school.edu",
        passwordHash: hashed.admin,
        role: "ADMIN",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create Approval Requests
  const requests = await Promise.all([
    prisma.approvalRequest.create({
      data: {
        id: "req_001",
        title: "Annual Leave Request - Summer Vacation",
        category: "LEAVE",
        description:
          "Requesting 2 weeks leave during summer break for family vacation",
        priority: "MEDIUM",
        status: "PENDING",
        submittedById: "user_teacher_1",
      },
    }),
    prisma.approvalRequest.create({
      data: {
        id: "req_002",
        title: "Budget Allocation for Science Lab",
        category: "BUDGET",
        description:
          "Need budget approval for new microscopes and chemistry equipment for the science lab",
        priority: "HIGH",
        status: "PENDING",
        submittedById: "user_hod_1",
      },
    }),
    prisma.approvalRequest.create({
      data: {
        id: "req_003",
        title: "New Classroom Infrastructure",
        category: "INFRASTRUCTURE",
        description:
          "Requesting funds to upgrade 3 classrooms with smart boards and improved seating",
        priority: "HIGH",
        status: "APPROVED",
        submittedById: "user_teacher_2",
      },
    }),
    prisma.approvalRequest.create({
      data: {
        id: "req_004",
        title: "Academic Curriculum Update",
        category: "ACADEMIC",
        description:
          "Proposal to introduce coding and digital literacy in the 9th-grade curriculum",
        priority: "MEDIUM",
        status: "PENDING",
        submittedById: "user_hod_2",
      },
    }),
    prisma.approvalRequest.create({
      data: {
        id: "req_005",
        title: "Professional Development Training",
        category: "OTHER",
        description:
          "Requesting approval to attend international educators conference",
        priority: "LOW",
        status: "APPROVED",
        submittedById: "user_teacher_3",
      },
    }),
    prisma.approvalRequest.create({
      data: {
        id: "req_006",
        title: "Medical Leave Request",
        category: "LEAVE",
        description: "Emergency medical leave for personal health reasons - 3 days",
        priority: "HIGH",
        status: "PENDING",
        submittedById: "user_teacher_1",
      },
    }),
    prisma.approvalRequest.create({
      data: {
        id: "req_007",
        title: "Sports Equipment Purchase",
        category: "BUDGET",
        description:
          "Requesting budget for new cricket and badminton equipment for school sports",
        priority: "MEDIUM",
        status: "APPROVED",
        submittedById: "user_teacher_2",
      },
    }),
    prisma.approvalRequest.create({
      data: {
        id: "req_008",
        title: "Library Renovation Project",
        category: "INFRASTRUCTURE",
        description: "Complete renovation of library with digital catalog system",
        priority: "URGENT",
        status: "PENDING",
        submittedById: "user_hod_1",
      },
    }),
  ]);

  console.log(`✅ Created ${requests.length} approval requests`);

  // Create Approval Steps
  const steps = await Promise.all([
    // req_001 steps
    prisma.approvalStep.create({
      data: {
        id: "step_001_1",
        stepOrder: 1,
        approverRole: "HOD",
        status: "ACTIVE",
        requestId: "req_001",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_001_2",
        stepOrder: 2,
        approverRole: "PRINCIPAL",
        status: "PENDING",
        requestId: "req_001",
      },
    }),
    // req_002 steps
    prisma.approvalStep.create({
      data: {
        id: "step_002_1",
        stepOrder: 1,
        approverRole: "HOD",
        status: "APPROVED",
        comment: "Approved by HOD. Lab equipment essential for curriculum.",
        actionedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actionedById: "user_hod_1",
        requestId: "req_002",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_002_2",
        stepOrder: 2,
        approverRole: "PRINCIPAL",
        status: "ACTIVE",
        requestId: "req_002",
      },
    }),
    // req_003 steps
    prisma.approvalStep.create({
      data: {
        id: "step_003_1",
        stepOrder: 1,
        approverRole: "HOD",
        status: "APPROVED",
        comment: "Good infrastructure plan",
        actionedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        actionedById: "user_hod_2",
        requestId: "req_003",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_003_2",
        stepOrder: 2,
        approverRole: "PRINCIPAL",
        status: "APPROVED",
        comment: "Approved. Budget allocated.",
        actionedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        actionedById: "user_principal_1",
        requestId: "req_003",
      },
    }),
    // req_004 steps
    prisma.approvalStep.create({
      data: {
        id: "step_004_1",
        stepOrder: 1,
        approverRole: "HOD",
        status: "ACTIVE",
        requestId: "req_004",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_004_2",
        stepOrder: 2,
        approverRole: "PRINCIPAL",
        status: "PENDING",
        requestId: "req_004",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_004_3",
        stepOrder: 3,
        approverRole: "ADMIN",
        status: "PENDING",
        requestId: "req_004",
      },
    }),
    // req_005 steps
    prisma.approvalStep.create({
      data: {
        id: "step_005_1",
        stepOrder: 1,
        approverRole: "HOD",
        status: "APPROVED",
        comment: "Professional development is crucial",
        actionedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        actionedById: "user_hod_1",
        requestId: "req_005",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_005_2",
        stepOrder: 2,
        approverRole: "PRINCIPAL",
        status: "APPROVED",
        comment: "Excellent opportunity for teacher growth",
        actionedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        actionedById: "user_principal_1",
        requestId: "req_005",
      },
    }),
    // req_006 steps
    prisma.approvalStep.create({
      data: {
        id: "step_006_1",
        stepOrder: 1,
        approverRole: "HOD",
        status: "ACTIVE",
        requestId: "req_006",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_006_2",
        stepOrder: 2,
        approverRole: "PRINCIPAL",
        status: "PENDING",
        requestId: "req_006",
      },
    }),
    // req_007 steps
    prisma.approvalStep.create({
      data: {
        id: "step_007_1",
        stepOrder: 1,
        approverRole: "HOD",
        status: "APPROVED",
        comment: "Sports equipment essential for physical education",
        actionedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actionedById: "user_hod_2",
        requestId: "req_007",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_007_2",
        stepOrder: 2,
        approverRole: "PRINCIPAL",
        status: "APPROVED",
        comment: "Approved. Purchase can proceed.",
        actionedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        actionedById: "user_principal_1",
        requestId: "req_007",
      },
    }),
    // req_008 steps
    prisma.approvalStep.create({
      data: {
        id: "step_008_1",
        stepOrder: 1,
        approverRole: "HOD",
        status: "ACTIVE",
        requestId: "req_008",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_008_2",
        stepOrder: 2,
        approverRole: "PRINCIPAL",
        status: "PENDING",
        requestId: "req_008",
      },
    }),
    prisma.approvalStep.create({
      data: {
        id: "step_008_3",
        stepOrder: 3,
        approverRole: "ADMIN",
        status: "PENDING",
        requestId: "req_008",
      },
    }),
  ]);

  console.log(`✅ Created ${steps.length} approval steps`);
  console.log("✨ Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

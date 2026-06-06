import * as prismaModule from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

// Safely extract your pre-configured TiDB Prisma instance
// @ts-ignore
const prisma = prismaModule.prisma || prismaModule.default || prismaModule.db

async function main() {
  console.log('Clearing old database records...')
  
  // MUST delete in this exact order to satisfy foreign key constraints!
  await prisma.approvalStep.deleteMany({})
  await prisma.approvalRequest.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Generating secure unique hashes...')

  const teacherHash = await bcrypt.hash('TeacherSecure$2026', 10)
  const hodHash = await bcrypt.hash('HodApproval#2026', 10)
  const principalHash = await bcrypt.hash('PrincipalTop@2026', 10)
  const adminHash = await bcrypt.hash('AdminMaster!2026', 10)

  // Added the 'name' field to satisfy the database schema
  await prisma.user.create({
    data: { name: 'Demo Teacher', email: 'teacher@school.com', passwordHash: teacherHash, role: 'TEACHER' }
  })
  console.log('Created user: teacher@school.com')

  await prisma.user.create({
    data: { name: 'Demo HOD', email: 'hod@school.com', passwordHash: hodHash, role: 'HOD' }
  })
  console.log('Created user: hod@school.com')

  await prisma.user.create({
    data: { name: 'Demo Principal', email: 'principal@school.com', passwordHash: principalHash, role: 'PRINCIPAL' }
  })
  console.log('Created user: principal@school.com')

  await prisma.user.create({
    data: { name: 'Demo Admin', email: 'admin@school.com', passwordHash: adminHash, role: 'ADMIN' }
  })
  console.log('Created user: admin@school.com')

  console.log('🌱 Seeding complete! Role-based security active.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
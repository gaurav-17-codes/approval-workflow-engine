import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany({})

  console.log('Generating secure unique hashes...')

  const teacherHash = await bcrypt.hash('TeacherSecure$2026', 10)
  const hodHash = await bcrypt.hash('HodApproval#2026', 10)
  const principalHash = await bcrypt.hash('PrincipalTop@2026', 10)
  const adminHash = await bcrypt.hash('AdminMaster!2026', 10)

  const teacher = await prisma.user.create({
    data: {
      email: 'teacher@school.com',
      passwordHash: teacherHash,
      role: 'TEACHER',
    },
  })
  console.log(`Created user: ${teacher.email}`)

  const hod = await prisma.user.create({
    data: {
      email: 'hod@school.com',
      passwordHash: hodHash,
      role: 'HOD',
    },
  })
  console.log(`Created user: ${hod.email}`)

  const principal = await prisma.user.create({
    data: {
      email: 'principal@school.com',
      passwordHash: principalHash,
      role: 'PRINCIPAL',
    },
  })
  console.log(`Created user: ${principal.email}`)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@school.com',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  })
  console.log(`Created user: ${admin.email}`)

  console.log('🌱 Seeding complete! Role-based security active.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

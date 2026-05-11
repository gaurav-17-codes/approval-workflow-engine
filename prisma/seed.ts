// // import { PrismaClient, Role } from "@prisma/client"
// // // import { PrismaClient, Role } from "../node_modules/.prisma/client/index.js"
// // // import { PrismaClient, Role } from "../src/generated/prisma/index.js"
// // import bcrypt from "bcryptjs"

// // const prisma = new PrismaClient()





// // async function main() {
// //   console.log("Seeding database...")

// //   const users = [
// //     { name: "Alice Teacher",    email: "teacher@school.edu",   role: Role.TEACHER,   password: "teacher123" },
// //     { name: "Bob HOD",          email: "hod@school.edu",       role: Role.HOD,        password: "hod123" },
// //     { name: "Carol Principal",  email: "principal@school.edu", role: Role.PRINCIPAL,  password: "principal123" },
// //     { name: "Dave Admin",       email: "admin@school.edu",     role: Role.ADMIN,      password: "admin123" },
// //   ]

// //   for (const u of users) {
// //     const passwordHash = await bcrypt.hash(u.password, 10)
// //     await prisma.user.upsert({
// //       where:  { email: u.email },
// //       update: {},
// //       create: { name: u.name, email: u.email, passwordHash, role: u.role },
// //     })
// //     console.log(`  Created user: ${u.email} (${u.role})`)
// //   }

// //   console.log("Seeding complete.")
// // }

// // main()
// //   .catch((e) => { console.error(e); process.exit(1) })
// //   .finally(() => prisma.$disconnect())












// import { PrismaClient, Role } from "@prisma/client"
// import bcrypt from "bcryptjs"

// const prisma = new PrismaClient()

// async function main() {
//   console.log("Seeding database...")

//   const users = [
//     { name: "Alice Teacher",    email: "teacher@school.edu",   role: Role.TEACHER,   password: "teacher123" },
//     { name: "Bob HOD",          email: "hod@school.edu",       role: Role.HOD,        password: "hod123" },
//     { name: "Carol Principal",  email: "principal@school.edu", role: Role.PRINCIPAL,  password: "principal123" },
//     { name: "Dave Admin",       email: "admin@school.edu",     role: Role.ADMIN,      password: "admin123" },
//   ]

//   for (const u of users) {
//     const passwordHash = await bcrypt.hash(u.password, 10)
//     await prisma.user.upsert({
//       where:  { email: u.email },
//       update: {},
//       create: { name: u.name, email: u.email, passwordHash, role: u.role },
//     })
//     console.log(`  Created user: ${u.email} (${u.role})`)
//   }

//   console.log("Seeding complete.")
// }

// main()
//   .catch((e) => { console.error(e); process.exit(1) })
//   .finally(() => prisma.$disconnect())






import { PrismaClient, Role } from "../node_modules/.prisma/client/index.js"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import bcrypt from "bcryptjs"
import "dotenv/config"

// 1. Configure the adapter directly for your local MySQL server
const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // Homebrew default is blank
  database: "approval_engine"
})

// 2. Initialize Prisma Client WITH the adapter (Strictly required in v7!)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

const users = [
    { name: "YASH",             email: "teacher@school.com",   role: Role.TEACHER,    password: "teacher123" },
    { name: "Bob HOD",          email: "hod@school.com",       role: Role.HOD,        password: "hod123" },
    { name: "Carol Principal",  email: "principal@school.com", role: Role.PRINCIPAL,  password: "principal123" },
    { name: "Dave Admin",       email: "admin@school.com",     role: Role.ADMIN,      password: "admin123" },
  ]

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10)
    await prisma.user.upsert({
      where:  { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash, role: u.role },
    })
    console.log(`  Created user: ${u.email} (${u.role})`)
  }

  console.log("Seeding complete.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
# Approval Workflow Engine - Dummy Data Reference

## Overview
This document describes the dummy data seeded into the approval workflow database.

## Users Created (7 total)

### Teachers (3)
| ID | Name | Email | Role |
|---|---|---|---|
| user_teacher_1 | Rajesh Kumar | rajesh.kumar@school.edu | TEACHER |
| user_teacher_2 | Priya Singh | priya.singh@school.edu | TEACHER |
| user_teacher_3 | Amit Patel | amit.patel@school.edu | TEACHER |

### HOD (Head of Department) (2)
| ID | Name | Email | Role |
|---|---|---|---|
| user_hod_1 | Dr. Vikram Sharma | vikram.sharma@school.edu | HOD |
| user_hod_2 | Ms. Neha Gupta | neha.gupta@school.edu | HOD |

### Principal (1)
| ID | Name | Email | Role |
|---|---|---|---|
| user_principal_1 | Prof. Rajendra Nath | principal@school.edu | PRINCIPAL |

### Admin (1)
| ID | Name | Email | Role |
|---|---|---|---|
| user_admin_1 | Admin User | admin@school.edu | ADMIN |

---

## Approval Requests Created (8 total)

### 1. **req_001** - Annual Leave Request - Summer Vacation
- **Category:** LEAVE
- **Priority:** MEDIUM
- **Status:** PENDING
- **Submitted By:** Rajesh Kumar (user_teacher_1)
- **Description:** Requesting 2 weeks leave during summer break for family vacation
- **Approval Flow:** HOD → PRINCIPAL

### 2. **req_002** - Budget Allocation for Science Lab
- **Category:** BUDGET
- **Priority:** HIGH
- **Status:** PENDING
- **Submitted By:** Dr. Vikram Sharma (user_hod_1)
- **Description:** Need budget approval for new microscopes and chemistry equipment
- **Approval Flow:** HOD (✅ Approved) → PRINCIPAL (⏳ Active)

### 3. **req_003** - New Classroom Infrastructure
- **Category:** INFRASTRUCTURE
- **Priority:** HIGH
- **Status:** APPROVED ✅
- **Submitted By:** Priya Singh (user_teacher_2)
- **Description:** Upgrade 3 classrooms with smart boards and improved seating
- **Approval Flow:** HOD (✅) → PRINCIPAL (✅)

### 4. **req_004** - Academic Curriculum Update
- **Category:** ACADEMIC
- **Priority:** MEDIUM
- **Status:** PENDING
- **Submitted By:** Ms. Neha Gupta (user_hod_2)
- **Description:** Introduce coding and digital literacy in 9th-grade curriculum
- **Approval Flow:** HOD (⏳ Active) → PRINCIPAL (Pending) → ADMIN (Pending)

### 5. **req_005** - Professional Development Training
- **Category:** OTHER
- **Priority:** LOW
- **Status:** APPROVED ✅
- **Submitted By:** Amit Patel (user_teacher_3)
- **Description:** Attend international educators conference
- **Approval Flow:** HOD (✅) → PRINCIPAL (✅)

### 6. **req_006** - Medical Leave Request
- **Category:** LEAVE
- **Priority:** HIGH
- **Status:** PENDING
- **Submitted By:** Rajesh Kumar (user_teacher_1)
- **Description:** Emergency medical leave - 3 days
- **Approval Flow:** HOD (⏳ Active) → PRINCIPAL (Pending)

### 7. **req_007** - Sports Equipment Purchase
- **Category:** BUDGET
- **Priority:** MEDIUM
- **Status:** APPROVED ✅
- **Submitted By:** Priya Singh (user_teacher_2)
- **Description:** New cricket and badminton equipment for school sports
- **Approval Flow:** HOD (✅) → PRINCIPAL (✅)

### 8. **req_008** - Library Renovation Project
- **Category:** INFRASTRUCTURE
- **Priority:** URGENT
- **Status:** PENDING
- **Submitted By:** Dr. Vikram Sharma (user_hod_1)
- **Description:** Complete library renovation with digital catalog system
- **Approval Flow:** HOD (⏳ Active) → PRINCIPAL (Pending) → ADMIN (Pending)

---

## Approval Steps Summary

### Status Distribution
- **PENDING:** Waiting for action
- **ACTIVE:** Currently being reviewed
- **APPROVED:** ✅ Completed successfully
- **REJECTED:** ❌ Not in current seed data

### Workflow Stages
1. **2-Step Approvals:** LEAVE and simple BUDGET requests (HOD → PRINCIPAL)
2. **3-Step Approvals:** ACADEMIC and complex infrastructure (HOD → PRINCIPAL → ADMIN)

---

## How to Seed the Database

### Option 1: Using Prisma Seed Command
```bash
npm run prisma:seed
# or
npx prisma db seed
```

### Option 2: Manual Migration
```bash
npx prisma migrate deploy
```

### Option 3: Reset Database (Warning: Clears all data)
```bash
npx prisma migrate reset
```

---

## Database Connection Info

- **Database Type:** PostgreSQL (Aiven) / MySQL (TiDB)
- **Host:** See `.env` file
- **Default Database Name:** `defaultdb` (Aiven) or `approval_engine` (TiDB)

---

## Test Scenarios

Use the seeded data to test:

1. **Role-Based Access Control (RBAC)**
   - Test teacher submitting requests
   - Test HOD approving/rejecting
   - Test principal final approval

2. **Multi-Step Approval Workflows**
   - Track req_002 through HOD → PRINCIPAL stages
   - Monitor req_004 through 3-level approval

3. **Dashboard Views**
   - PENDING requests for active review
   - APPROVED requests for completed workflows
   - Different status distributions per category

4. **Email Notifications**
   - Approval step assignments
   - Request status changes

---

## Notes

- All `passwordHash` values are dummy placeholders - use bcrypt for production
- Dates are relative to current time for realistic testing
- Foreign key relationships are properly established
- All required fields are populated

---

**Last Updated:** 2026-06-07
**Seed Count:** 7 users, 8 requests, 18 approval steps

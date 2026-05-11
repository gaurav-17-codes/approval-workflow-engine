import { Role, Category, Priority, RequestStatus, StepStatus } from "@prisma/client"

// ─── Role ────────────────────────────────────────────────────────────
export const ROLES = Object.values(Role)

// ─── Category ────────────────────────────────────────────────────────
export const CATEGORIES = Object.values(Category)

// ─── Priority ────────────────────────────────────────────────────────
export const PRIORITIES = Object.values(Priority)

// ─── Request Status ──────────────────────────────────────────────────
export const REQUEST_STATUSES = Object.values(RequestStatus)

// ─── Step Status ─────────────────────────────────────────────────────
export const STEP_STATUSES = Object.values(StepStatus)

// ─── Workflow definition ─────────────────────────────────────────────
// Order matters: index 0 = Step 1, index 1 = Step 2
export const WORKFLOW_STEPS: Role[] = [Role.HOD, Role.PRINCIPAL]

// ─── Roles that can approve/reject ───────────────────────────────────
export const APPROVER_ROLES: Role[] = [Role.HOD, Role.PRINCIPAL]
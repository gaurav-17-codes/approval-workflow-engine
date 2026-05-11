import { Role, Category, Priority, RequestStatus, StepStatus } from "@prisma/client"

export type { Role, Category, Priority, RequestStatus, StepStatus }

export type SessionUser = {
  id:    string
  name:  string
  email: string
  role:  Role
}

export type CreateApprovalInput = {
  title:       string
  category:    Category
  description: string
  priority:    Priority
}

export type ApprovalAction = "APPROVE" | "REJECT"

export type PatchApprovalInput = {
  action:  ApprovalAction
  comment?: string
}

export type ApprovalListFilters = {
  status?:   RequestStatus
  category?: Category
}
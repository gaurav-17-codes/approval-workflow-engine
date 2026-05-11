// import { NextRequest } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import { sendMail, emailTemplates } from "@/lib/mail"
// import { successResponse, errorResponse } from "@/lib/response"
// import { Role, RequestStatus, StepStatus } from "@prisma/client"

// type RouteParams = { params: { id: string } }

// // ─── GET /api/approvals/[id] ─────────────────────────────────────────
// export async function GET(_req: NextRequest, { params }: RouteParams) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session?.user) return errorResponse("Unauthorized.", 401)

//     const request = await prisma.approvalRequest.findUnique({
//       where: { id: params.id },
//       include: {
//         submittedBy: { select: { id: true, name: true, email: true, role: true } },
//         steps: {
//           orderBy: { stepOrder: "asc" },
//           include: { actionedBy: { select: { id: true, name: true } } },
//         },
//       },
//     })

//     if (!request) return errorResponse("Request not found.", 404)

//     return successResponse(request, "Approval request fetched successfully.")
//   } catch (error) {
//     console.error("[GET /api/approvals/[id]]", error)
//     return errorResponse("Something went wrong.")
//   }
// }

// // ─── PATCH /api/approvals/[id] ───────────────────────────────────────
// export async function PATCH(req: NextRequest, { params }: RouteParams) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session?.user) return errorResponse("Unauthorized.", 401)

//     const user = session.user as { id: string; name: string; email: string; role: Role }

//     // Only HOD and PRINCIPAL can take action
//     if (user.role !== Role.HOD && user.role !== Role.PRINCIPAL) {
//       return errorResponse("You do not have permission to action approval requests.", 403)
//     }

//     const body = await req.json()
//     const { action, comment } = body

//     if (!action || !["approve", "reject"].includes(action)) {
//       return errorResponse('Action must be either "approve" or "reject".', 400)
//     }

//     // Fetch the request with all steps
//     const request = await prisma.approvalRequest.findUnique({
//       where: { id: params.id },
//       include: {
//         steps:       { orderBy: { stepOrder: "asc" } },
//         submittedBy: { select: { id: true, name: true, email: true } },
//       },
//     })

//     if (!request) return errorResponse("Request not found.", 404)

//     if (request.status !== RequestStatus.PENDING) {
//       return errorResponse("This request has already been resolved.", 400)
//     }

//     // Find the current active step
//     const activeStep = request.steps.find((s) => s.status === StepStatus.ACTIVE)
//     if (!activeStep) {
//       return errorResponse("No active step found for this request.", 400)
//     }

//     // Verify the current user's role matches the active step's role
//     if (activeStep.approverRole !== user.role) {
//       return errorResponse(`This step requires a ${activeStep.approverRole} to action it.`, 403)
//     }

//     const newStepStatus = action === "approve" ? StepStatus.APPROVED : StepStatus.REJECTED
//     const now = new Date()

//     if (action === "reject") {
//       // Reject this step and close the entire request
//       await prisma.$transaction([
//         prisma.approvalStep.update({
//           where: { id: activeStep.id },
//           data: {
//             status:      StepStatus.REJECTED,
//             comment:     comment ?? null,
//             actionedAt:  now,
//             actionedById: user.id,
//           },
//         }),
//         prisma.approvalRequest.update({
//           where: { id: request.id },
//           data:  { status: RequestStatus.REJECTED },
//         }),
//       ])

//       // Notify requester of rejection
//       const template = emailTemplates.rejected(
//         request.submittedBy.name,
//         request.title,
//         user.name,
//         comment ?? null,
//         request.id
//       )
//       await sendMail({ to: request.submittedBy.email, ...template })

//       const updated = await prisma.approvalRequest.findUnique({
//         where: { id: request.id },
//         include: { steps: { orderBy: { stepOrder: "asc" } }, submittedBy: { select: { id: true, name: true, email: true } } },
//       })

//       return successResponse(updated, "Request has been rejected.")
//     }

//     // Approve: move to next step or finalize
//     const nextStep = request.steps.find((s) => s.stepOrder === activeStep.stepOrder + 1)

//     if (nextStep) {
//       // Activate the next step
//       await prisma.$transaction([
//         prisma.approvalStep.update({
//           where: { id: activeStep.id },
//           data: {
//             status:      StepStatus.APPROVED,
//             comment:     comment ?? null,
//             actionedAt:  now,
//             actionedById: user.id,
//           },
//         }),
//         prisma.approvalStep.update({
//           where: { id: nextStep.id },
//           data:  { status: StepStatus.ACTIVE },
//         }),
//       ])

//       // Notify the next approver
//       const nextApprover = await prisma.user.findFirst({ where: { role: nextStep.approverRole } })
//       if (nextApprover) {
//         const template = emailTemplates.stepApproved(request.title, user.name, request.id)
//         await sendMail({ to: nextApprover.email, ...template })
//       }

//       const updated = await prisma.approvalRequest.findUnique({
//         where: { id: request.id },
//         include: { steps: { orderBy: { stepOrder: "asc" } }, submittedBy: { select: { id: true, name: true, email: true } } },
//       })

//       return successResponse(updated, `Step approved. Request moved to ${nextStep.approverRole} for review.`)
//     } else {
//       // No more steps — fully approved
//       await prisma.$transaction([
//         prisma.approvalStep.update({
//           where: { id: activeStep.id },
//           data: {
//             status:      StepStatus.APPROVED,
//             comment:     comment ?? null,
//             actionedAt:  now,
//             actionedById: user.id,
//           },
//         }),
//         prisma.approvalRequest.update({
//           where: { id: request.id },
//           data:  { status: RequestStatus.APPROVED },
//         }),
//       ])

//       // Notify requester of final approval
//       const template = emailTemplates.finalApproved(request.submittedBy.name, request.title, request.id)
//       await sendMail({ to: request.submittedBy.email, ...template })

//       const updated = await prisma.approvalRequest.findUnique({
//         where: { id: request.id },
//         include: { steps: { orderBy: { stepOrder: "asc" } }, submittedBy: { select: { id: true, name: true, email: true } } },
//       })

//       return successResponse(updated, "Request has been fully approved.")
//     }
//   } catch (error) {
//     console.error("[PATCH /api/approvals/[id]]", error)
//     return errorResponse("Something went wrong.")
//   }
// }









// import { NextRequest } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import { successResponse, errorResponse } from "@/lib/response"
// import { RequestStatus, Role, StepStatus } from "@prisma/client"
// // Assuming you have this set up; if not, you can comment mail out for now
// // import { sendMail, emailTemplates } from "@/lib/mail" 

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // const session = await getServerSession(authOptions)
//     // if (!session?.user) {
//     //   return errorResponse("Unauthorized. Please log in.", 401)
//     // }

//     // const user = session.user as { id: string; role: Role; name: string }




//     const testHod = await prisma.user.findFirst({ where: { role: 'HOD' } })
//     const user = { id: testHod!.id, name: testHod!.name, role: testHod!.role }
//     // --- TEMP POSTMAN BYPASS END ---






//     const requestId = params.id
//     const body = await req.json()
//     const { action, comment } = body // action should be "APPROVE" or "REJECT"

//     if (action !== "APPROVE" && action !== "REJECT") {
//       return errorResponse("Invalid action. Must be APPROVE or REJECT.", 400)
//     }

//     // 1. Fetch the request with its steps
//     const approvalRequest = await prisma.approvalRequest.findUnique({
//       where: { id: requestId },
//       include: {
//         submittedBy: { select: { name: true, email: true } },
//         steps: { orderBy: { stepOrder: "asc" } },
//       },
//     })

//     if (!approvalRequest) return errorResponse("Request not found", 404)
//     if (approvalRequest.status !== RequestStatus.PENDING) {
//       return errorResponse(`Request is already ${approvalRequest.status}`, 400)
//     }

//     // 2. Find the current ACTIVE step
//     const currentStep = approvalRequest.steps.find((s) => s.status === StepStatus.ACTIVE)
    
//     if (!currentStep) {
//       return errorResponse("No active step found for this request.", 400)
//     }

//     // 3. Verify the logged-in user is authorized for this step
//     if (currentStep.approverRole !== user.role) {
//       return errorResponse(`Unauthorized. Waiting for ${currentStep.approverRole} approval.`, 403)
//     }

//     let emailPromise: Promise<void> | null = null;

//     // 4. Process the Approval or Rejection in a transaction
//     await prisma.$transaction(async (tx) => {
//       const stepUpdateStatus = action === "APPROVE" ? StepStatus.APPROVED : StepStatus.REJECTED

//       // Update the current step
//       await tx.approvalStep.update({
//         where: { id: currentStep.id },
//         data: {
//           status: stepUpdateStatus,
//           comment: comment || null,
//           actionedById: user.id,
//           actionedAt: new Date(),
//         },
//       })

//       if (action === "REJECT") {
//         // If rejected, the whole request dies here
//         await tx.approvalRequest.update({
//           where: { id: requestId },
//           data: { status: RequestStatus.REJECTED },
//         })
        
//         const template = emailTemplates.rejected(
//           approvalRequest.submittedBy.name,
//           approvalRequest.title,
//           user.name,
//           comment || null,
//           requestId
//         )
//         emailPromise = sendMail({ to: approvalRequest.submittedBy.email, ...template })
//       } 
      
//       if (action === "APPROVE") {
//         // Find the next step
//         const nextStep = approvalRequest.steps.find(
//           (s) => s.stepOrder === currentStep.stepOrder + 1
//         )

//         if (nextStep) {
//           // Activate the next step (e.g., handoff to Principal)
//           await tx.approvalStep.update({
//             where: { id: nextStep.id },
//             data: { status: StepStatus.ACTIVE },
//           })
          
//           const nextApprover = await tx.user.findFirst({ where: { role: nextStep.approverRole } })
//           if (nextApprover) {
//             const template = emailTemplates.stepApproved(approvalRequest.title, user.name, requestId)
//             emailPromise = sendMail({ to: nextApprover.email, ...template })
//           }
//         } else {
//           // No more steps! The request is fully approved.
//           await tx.approvalRequest.update({
//             where: { id: requestId },
//             data: { status: RequestStatus.APPROVED },
//           })
          
//           const template = emailTemplates.finalApproved(approvalRequest.submittedBy.name, approvalRequest.title, requestId)
//           emailPromise = sendMail({ to: approvalRequest.submittedBy.email, ...template })
//         }
//       }
//     })

//     // 5. Fire off the email notification asynchronously outside the transaction
//     if (emailPromise) {
//       emailPromise.catch(err => console.error("Failed to send workflow email:", err));
//     }

//     return successResponse(null, `Request ${action.toLowerCase()}ed successfully.`, 200)

//   } catch (error) {
//     console.error("[PATCH /api/approvals/[id]]", error)
//     return errorResponse("Something went wrong processing the approval.")
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 1. GET METHOD: Sends the request data to the frontend when the page loads
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const request = await prisma.approvalRequest.findUnique({
      where: { id: params.id },
      include: {
        submittedBy: { select: { name: true, email: true } },
        steps: {
          orderBy: { stepOrder: "asc" },
          include: { actionedBy: { select: { name: true } } }
        }
      }
    });

    if (!request) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: request });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch request" }, { status: 500 });
  }
}

// // 2. PATCH METHOD: Runs when the user clicks "Approve" or "Reject"
// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const user = session.user as any;
//     const body = await req.json();
//     const { action, comment } = body; // "APPROVE" or "REJECT"

//     // Find the request and its steps
//     const request = await prisma.approvalRequest.findUnique({
//       where: { id: params.id },
//       include: { steps: { orderBy: { stepOrder: "asc" } } }
//     });

//     if (!request) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

//     // Identify the currently active step
//     const activeStep = request.steps.find((s) => s.status === "ACTIVE");
//     if (!activeStep || activeStep.approverRole !== user.role) {
//       return NextResponse.json({ success: false, message: "Not authorized to approve this step" }, { status: 403 });
//     }

//     // Update the current step
//     const newStepStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
//     await prisma.step.update({
//       where: { id: activeStep.id },
//       data: {
//         status: newStepStatus,
//         comment: comment || null,
//         actionedById: user.id,
//         actionedAt: new Date()
//       }
//     });

//     // Advance the workflow logic
//     if (action === "REJECT") {
//       // If rejected, the whole request is immediately rejected
//       await prisma.approvalRequest.update({
//         where: { id: request.id },
//         data: { status: "REJECTED" }
//       });
//     } else if (action === "APPROVE") {
//       // If approved, check if there is a next step
//       const nextStep = request.steps.find((s) => s.stepOrder === activeStep.stepOrder + 1);
      
//       if (nextStep) {
//         // Activate the next person in line
//         await prisma.step.update({
//           where: { id: nextStep.id },
//           data: { status: "ACTIVE" }
//         });
//       } else {
//         // No more steps! The whole request is fully approved
//         await prisma.approvalRequest.update({
//           where: { id: request.id },
//           data: { status: "APPROVED" }
//         });
//       }
//     }

//     // Fetch the fresh, updated data to send back to the UI
//     const updatedRequest = await prisma.approvalRequest.findUnique({
//       where: { id: params.id },
//       include: {
//         submittedBy: { select: { name: true, email: true } },
//         steps: {
//           orderBy: { stepOrder: "asc" },
//           include: { actionedBy: { select: { name: true } } }
//         }
//       }
//     });

//     return NextResponse.json({ success: true, data: updatedRequest });

//   } catch (error) {
//     console.error("PATCH Error:", error);
//     return NextResponse.json({ success: false, message: "Failed to process approval" }, { status: 500 });
//   }
// }


// 2. PATCH METHOD: Runs when the user clicks "Approve" or "Reject"
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found in DB" }, { status: 404 });
    }

    const body = await req.json();
    const { action, comment } = body; 

    const request = await prisma.approvalRequest.findUnique({
      where: { id: params.id },
      include: { steps: { orderBy: { stepOrder: "asc" } } }
    });

    if (!request) return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });

    const activeStep = request.steps.find((s) => s.status === "ACTIVE");
    
    if (!activeStep || activeStep.approverRole !== dbUser.role) {
      return NextResponse.json({ success: false, message: "Not authorized to approve this step" }, { status: 403 });
    }

    const newStepStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
    
    // FIX 1: Changed prisma.step to prisma.approvalStep
    await prisma.approvalStep.update({
      where: { id: activeStep.id },
      data: {
        status: newStepStatus,
        comment: comment || null,
        actionedById: dbUser.id, 
        actionedAt: new Date()
      }
    });

    if (action === "REJECT") {
      await prisma.approvalRequest.update({
        where: { id: request.id },
        data: { status: "REJECTED" }
      });
    } else if (action === "APPROVE") {
      const nextStep = request.steps.find((s) => s.stepOrder === activeStep.stepOrder + 1);
      
      if (nextStep) {
        // FIX 2: Changed prisma.step to prisma.approvalStep
        await prisma.approvalStep.update({
          where: { id: nextStep.id },
          data: { status: "ACTIVE" }
        });
      } else {
        await prisma.approvalRequest.update({
          where: { id: request.id },
          data: { status: "APPROVED" }
        });
      }
    }

    const updatedRequest = await prisma.approvalRequest.findUnique({
      where: { id: params.id },
      include: {
        submittedBy: { select: { name: true, email: true } },
        steps: {
          orderBy: { stepOrder: "asc" },
          include: { actionedBy: { select: { name: true } } }
        }
      }
    });

    return NextResponse.json({ success: true, data: updatedRequest });

  } catch (error) {
    console.error("PATCH Error Details:", error);
    return NextResponse.json({ success: false, message: "Failed to process approval" }, { status: 500 });
  }
}
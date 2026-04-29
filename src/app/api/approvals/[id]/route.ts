import { prisma } from "@/lib/prisma";
import { RequestStatus, StepStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function sendEmail(
  to: string,
  title: string,
  status: string,
  comment: string,
) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  transporter.verify(function (error, success) {
    if (error) {
      console.log("Mailtrap error:", error);
    } else {
      console.log("Mailtrap connected ✅");
    }
  });

  await transporter.sendMail({
    from: "noreply@kalnet.com",
    to: to,
    subject: `Your request "${title}" has been ${status}`,
    html: `
      <h2>Request Status Update</h2>
      <p>Your request <strong>${title}</strong> has been <strong>${status}</strong>.</p>
      <p>Comment: ${comment || "No comment provided"}</p>
      <br/>
      <p>KALNET Approval System</p>
    `,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const { action, comment } = body;

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Action must be approve or reject",
        },
        { status: 400 },
      );
    }

    const existingRequest = await prisma.approvalRequest.findUnique({
      where: { id },
      include: {
        requester: true,
        steps: { orderBy: { stepNumber: "asc" } },
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, data: null, message: "Request not found" },
        { status: 404 },
      );
    }

    const currentStep = existingRequest.steps.find(
      (step) => step.status === StepStatus.PENDING,
    );

    if (!currentStep) {
      return NextResponse.json(
        { success: false, data: null, message: "No pending step found" },
        { status: 400 },
      );
    }

    const newStepStatus =
      action === "approve" ? StepStatus.APPROVED : StepStatus.REJECTED;
    const newRequestStatus =
      action === "approve" ? RequestStatus.APPROVED : RequestStatus.REJECTED;

    await prisma.approvalStep.update({
      where: { id: currentStep.id },
      data: {
        status: newStepStatus,
        comments: comment || null,
        decidedAt: new Date(),
      },
    });

    let requestStatus: RequestStatus = newRequestStatus;
    if (action === "approve") {
      const nextStep = existingRequest.steps.find(
        (step) => step.stepNumber === currentStep.stepNumber + 1,
      );
      if (nextStep) {
        requestStatus = RequestStatus.PENDING;
      }
    }

    const updatedRequest = await prisma.approvalRequest.update({
      where: { id },
      data: { status: requestStatus },
      include: { requester: true },
    });

    await sendEmail(
      updatedRequest.requester.email,
      updatedRequest.title,
      newRequestStatus,
      comment,
    );

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: `Request ${newRequestStatus.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("PATCH /api/approvals/[id] error:", error);
    return NextResponse.json(
      { success: false, data: null, message: "Internal server error" },
      { status: 500 },
    );
  }
}

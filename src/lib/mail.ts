// import nodemailer from "nodemailer"

// const transporter = nodemailer.createTransport({
//   host:   process.env.MAIL_HOST,
//   port:   Number(process.env.MAIL_PORT),
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// })

// type MailOptions = { to: string; subject: string; html: string }

// export async function sendMail({ to, subject, html }: MailOptions): Promise<void> {
//   try {
//     await transporter.sendMail({
//       from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
//       to,
//       subject,
//       html,
//     })
//     console.log(`[Mail] ✓ Sent to ${to}: ${subject}`)
//   } catch (error) {
//     // Never crash the API on email failure
//     console.error("[Mail] ✗ Failed:", error)
//   }
// }

// const BASE_URL = process.env.NEXTAUTH_URL

// function btn(href: string, label: string, color: string) {
//   return `<a href="${href}" style="display:inline-block;padding:12px 28px;background:${color};color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;margin-top:20px">${label}</a>`
// }

// function layout(title: string, color: string, body: string) {
//   return `
//   <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:580px;margin:auto;padding:32px 24px;background:#fff">
//     <div style="border-left:4px solid ${color};padding-left:16px;margin-bottom:24px">
//       <h2 style="margin:0;color:${color};font-size:20px">${title}</h2>
//     </div>
//     ${body}
//     <p style="color:#94a3b8;font-size:11px;margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0">
//       This is an automated message from <strong>Approval Workflow Engine</strong>. Do not reply.
//     </p>
//   </div>`
// }

// export const emailTemplates = {

//   // Sent to HOD when a teacher submits a new request
//   newRequest(requesterName: string, title: string, requestId: string) {
//     return {
//       subject: `[Action Required] New approval request: ${title}`,
//       html: layout("New Request Awaiting Your Approval", "#1d4ed8", `
//         <p style="color:#374151">Hello,</p>
//         <p style="color:#374151"><strong>${requesterName}</strong> has submitted a new request that requires your review.</p>
//         <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
//           <tr style="background:#f8fafc">
//             <td style="padding:10px 14px;font-weight:600;color:#374151;width:100px">Title</td>
//             <td style="padding:10px 14px;color:#374151">${title}</td>
//           </tr>
//           <tr>
//             <td style="padding:10px 14px;font-weight:600;color:#374151">Submitted by</td>
//             <td style="padding:10px 14px;color:#374151">${requesterName}</td>
//           </tr>
//         </table>
//         ${btn(`${BASE_URL}/approvals/${requestId}`, "Review Request →", "#1d4ed8")}
//       `),
//     }
//   },

//   // Sent to Principal when HOD approves
//   stepApproved(title: string, approverName: string, requestId: string) {
//     return {
//       subject: `[Action Required] ${title} — approved by ${approverName}`,
//       html: layout("Your Review is Required", "#16a34a", `
//         <p style="color:#374151">Hello,</p>
//         <p style="color:#374151">The following request was approved by <strong>${approverName}</strong> and now requires your review.</p>
//         <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
//           <tr style="background:#f8fafc">
//             <td style="padding:10px 14px;font-weight:600;color:#374151;width:130px">Request</td>
//             <td style="padding:10px 14px;color:#374151">${title}</td>
//           </tr>
//           <tr>
//             <td style="padding:10px 14px;font-weight:600;color:#374151">Approved by</td>
//             <td style="padding:10px 14px;color:#374151">${approverName}</td>
//           </tr>
//         </table>
//         ${btn(`${BASE_URL}/approvals/${requestId}`, "Review Request →", "#16a34a")}
//       `),
//     }
//   },

//   // Sent to teacher when all steps are approved
//   finalApproved(requesterName: string, title: string, requestId: string) {
//     return {
//       subject: `✅ Approved: ${title}`,
//       html: layout("Your Request Has Been Fully Approved", "#16a34a", `
//         <p style="color:#374151">Hello <strong>${requesterName}</strong>,</p>
//         <p style="color:#374151">Great news! Your request has successfully completed all approval steps.</p>
//         <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0">
//           <p style="margin:0;font-weight:600;color:#166534">${title}</p>
//           <p style="margin:4px 0 0;font-size:13px;color:#15803d">Status: Fully Approved</p>
//         </div>
//         ${btn(`${BASE_URL}/approvals/${requestId}`, "View Request →", "#16a34a")}
//       `),
//     }
//   },

//   // Sent to teacher when any step rejects
//   rejected(
//     requesterName: string,
//     title: string,
//     rejectorName: string,
//     comment: string | null,
//     requestId: string
//   ) {
//     return {
//       subject: `❌ Rejected: ${title}`,
//       html: layout("Your Request Has Been Rejected", "#dc2626", `
//         <p style="color:#374151">Hello <strong>${requesterName}</strong>,</p>
//         <p style="color:#374151">Unfortunately, your request was rejected by <strong>${rejectorName}</strong>.</p>
//         <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0">
//           <p style="margin:0;font-weight:600;color:#991b1b">${title}</p>
//           ${comment
//             ? `<p style="margin:8px 0 0;font-size:13px;color:#b91c1c"><strong>Reason:</strong> ${comment}</p>`
//             : ""}
//         </div>
//         ${btn(`${BASE_URL}/approvals/${requestId}`, "View Request →", "#dc2626")}
//       `),
//     }
//   },

//   // Sent when a new user account is created by admin
//   welcomeUser(name: string, email: string, role: string, tempPassword: string) {
//     return {
//       subject: `Welcome to Approval Workflow Engine`,
//       html: layout("Your Account Has Been Created", "#1d4ed8", `
//         <p style="color:#374151">Hello <strong>${name}</strong>,</p>
//         <p style="color:#374151">Your account has been created on the Approval Workflow Engine.</p>
//         <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
//           <tr style="background:#f8fafc">
//             <td style="padding:10px 14px;font-weight:600;color:#374151;width:120px">Email</td>
//             <td style="padding:10px 14px;color:#374151">${email}</td>
//           </tr>
//           <tr>
//             <td style="padding:10px 14px;font-weight:600;color:#374151">Role</td>
//             <td style="padding:10px 14px;color:#374151">${role}</td>
//           </tr>
//           <tr style="background:#f8fafc">
//             <td style="padding:10px 14px;font-weight:600;color:#374151">Password</td>
//             <td style="padding:10px 14px;color:#374151;font-family:monospace">${tempPassword}</td>
//           </tr>
//         </table>
//         <p style="color:#ef4444;font-size:13px">Please change your password after logging in.</p>
//         ${btn(`${BASE_URL}/login`, "Login Now →", "#1d4ed8")}
//       `),
//     }
//   },
// }





// //The Central Mail Utility
// import nodemailer from "nodemailer";

// // Create the transporter once
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_APP_PASSWORD,
//   },
// });

// type EmailPayload = {
//   to: string;
//   subject: string;
//   html: string;
// };


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// ... the rest of your sendNotificationEmail function stays exactly the same

// The central function we will call from our APIs
export async function sendNotificationEmail({ to, subject, html }: EmailPayload) {
  try {
    const info = await transporter.sendMail({
      from: `"Approval Engine" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
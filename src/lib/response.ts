import { NextResponse } from "next/server"

export function successResponse(data: unknown, message = "Success", status = 200): NextResponse {
  return NextResponse.json({ success: true, data, message }, { status })
}

export function errorResponse(message: string, status = 500): NextResponse {
  return NextResponse.json({ success: false, data: null, message }, { status })
}
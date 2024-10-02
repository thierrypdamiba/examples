import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Ingest functionality has been removed." },
    { status: 400 }
  );
}

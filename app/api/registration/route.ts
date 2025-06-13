import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import bcrypt from "bcryptjs";
export async function POST(req: NextRequest) {
  try {
    const { fullName, email, username, phoneNumber, dob, password } = await req.json();

    if (!fullName || !email || !username || !phoneNumber || !dob || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Step 1: Extract IP and device fingerprint
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const device = req.headers.get("user-agent") || "unknown";

    // Step 2: Check risk with FastAPI
    const riskRes = await fetch("https://python-ml-social-media-algorithm-production.up.railway.app/check-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip, device }),
    });

    const riskData = await riskRes.json();

    if (riskData.risk === "high") {
      return NextResponse.json({ error: "Blocked: suspicious activity detected" }, { status: 403 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Step 3: Proceed if risk is low/medium
   const newUser = await db.user.create({
  data: {
    fullName,
    email,
    username,
    phoneNumber,
    dob,
    password:hashedPassword,
    followers: 0, // or 0, or any default
    following: 0,  // or 0, or any default
    verified:false
  },
});

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error("[POST REGISTRATION]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

/** GET /api/categories */
export async function GET() {
  const items = await getCategories();
  return NextResponse.json({ items });
}

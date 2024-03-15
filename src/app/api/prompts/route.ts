import { prisma } from "@/services/database";

export async function GET() {
  const prompts = await prisma.prompt.findMany();

  return Response.json(prompts);
}

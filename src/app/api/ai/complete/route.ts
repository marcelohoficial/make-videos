import { openai } from "@/lib/openai";
import { streamToString } from "@/lib/stream-to-string";
import { prisma } from "@/services/database";
import { z } from "zod";

const bodySchema = z.object({
  videoId: z.string().uuid(),
  template: z.string(),
  temperature: z.number().min(0).max(1).default(0.5),
});

export async function POST({ body, url }: Request) {
  let data = await streamToString(body);
  const { videoId, template, temperature } = JSON.parse(data);

  const video = await prisma.video.findUniqueOrThrow({
    where: {
      id: videoId,
    },
  });

  if (!video.transcription) {
    return Response.json({
      error: "Video transcription was not generated yet.",
    });
  }

  const promptMessage = template.replace(
    "{transcription}",
    video.transcription
  );

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    temperature,
    messages: [{ role: "user", content: promptMessage }],
  });

  return Response.json(response);
}

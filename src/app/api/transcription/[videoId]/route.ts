import { openai } from "@/lib/openai";
import { streamToString } from "@/lib/stream-to-string";
import { prisma } from "@/services/database";
import { createReadStream } from "fs";
import { z } from "zod";

const VideoIdSchema = z.string().uuid();

const RequestBodySchema = z.object({
  prompt: z.string(),
});

export async function POST({ body, url }: Request) {
  const data = await streamToString(body);
  let [, videoId] = url.split("transcription/");

  try {
    const validVideoId = VideoIdSchema.parse(videoId as string);

    const { prompt } = RequestBodySchema.parse(JSON.parse(data));

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: data,
      },
    });

    const videoPath = video.path;
    const audioReadStream = createReadStream(videoPath);

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
      prompt,
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: "Error transcription create" });
  }
}

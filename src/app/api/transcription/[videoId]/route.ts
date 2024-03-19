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
  const [, audioId] = url.split("transcription/");
  const { prompt, videoId } = JSON.parse(data);

  try {
    const audio = await prisma.video.findUniqueOrThrow({
      where: {
        id: audioId,
      },
    });

    const [, format] = audio.name.split(".");

    if (format !== "mp3") throw new Error("Error on format file");

    const videoPath = "".concat("./public/", audio.path);

    const audioReadStream = createReadStream(videoPath);

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
      prompt,
    });

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription: response.text,
      },
    });

    return Response.json({ transcription: response.text });
  } catch (error) {
    return Response.json({ error: "Error transcription create" });
  }
}

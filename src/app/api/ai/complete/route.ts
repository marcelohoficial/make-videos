import { NextApiResponse } from "next";
import { z } from "zod";

import { openai } from "@/lib/openai";
import { streamToString } from "@/lib/stream-to-string";
import { prisma } from "@/services/database";

const bodySchema = z.object({
  videoId: z.string().uuid(),
  template: z.string(),
  temperature: z.number().min(0).max(1).default(0.5),
});

interface onCompletions {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: [
    {
      index: number;
      message: {
        role: string;
        content: string;
      };
      logprobs: any;
      finish_reason: string | null;
    }
  ];
  usage: {
    prompt_tokens: number | null;
    completion_tokens: number | null;
    total_tokens: number | null;
  };
  system_fingerprint: string | number | null;
}

export async function POST({ body, url }: Request, res: NextApiResponse) {
  let data = await streamToString(body);
  const { videoId, prompt, temperature } = JSON.parse(data);

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

  const promptMessage = prompt.replace("{transcription}", video.transcription);

  try {
    const { choices } = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      temperature,
      messages: [{ role: "user", content: promptMessage }],
      // stream: true,
    });
    // const stream = OpenAIStream(response);
    // console.log(stream);
    // return streamToResponse(stream, res, {
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    //   },
    // });
    return Response.json(choices[0].message.content);
  } catch (error) {
    return res.status(500).json("Error on prompt generate");
  }
}

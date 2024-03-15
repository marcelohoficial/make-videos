import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { z } from "zod";

// Defina o esquema de validação para o ID do vídeo usando Zod
const VideoIdSchema = z.string().uuid();

// Defina o esquema de validação para o corpo da solicitação usando Zod
const RequestBodySchema = z.object({
  prompt: z.string(),
});

async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function POST(req: NextRequest, res: NextApiResponse) {
  // const data = await streamToString(req.query);
  const data = await req.url;
  console.log(data);

  // const { videoId } = req.json();
  // try {
  //   // Valide o ID do vídeo
  //   const validVideoId = VideoIdSchema.parse(videoId as string);

  //   // Valide o corpo da solicitação
  //   const { prompt } = RequestBodySchema.parse(req.body);

  //   // Aqui você pode fazer o processamento necessário com o ID do vídeo e o corpo da solicitação

  //   res.status(200).json({ message: "Transcrição iniciada com sucesso." });
  // } catch (error) {
  //   // Se houver erros de validação, retorne uma resposta de erro
  //   res.status(400).json({ error: "Error transcription create" });
  // }
  return [];
}

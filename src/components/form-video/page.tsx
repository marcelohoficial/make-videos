"use client";

import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { RocketIcon, UploadIcon, VideoIcon } from "@radix-ui/react-icons";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

type statusT =
  | "awaiting"
  | "converting"
  | "uploading"
  | "generating"
  | "success"
  | "error";

const statusMessages = {
  converting: "Convertendo...",
  generating: "Transcrevendo...",
  uploading: "Carregando...",
  error: "Erro...",
  success: "Sucesso!",
};

export function FormVideo() {
  const [status, setStatus] = useState<statusT>("awaiting");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const resultTextAreaRef = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again",
      });

      return;
    }

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  }

  async function convertVideoToAudio(video: File) {
    console.log("Convert started");

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    // ffmpeg.on("log", (log) => {
    //   console.log(log);
    // });

    ffmpeg.on("progress", (progress) => {
      console.log("Convert progress: " + Math.round(progress.progress * 100));
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    return audioFile;
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let prompt = promptInputRef.current?.value;

    if (!videoFile) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again",
      });

      return;
    }

    setStatus("uploading");

    const formVideo = new FormData();
    formVideo.append("file", videoFile);

    const uploadedVideo = await fetch("/api/upload-file", {
      method: "POST",
      body: formVideo,
    })
      .then((response) => response.json())
      .then((data) => {
        toast({
          title: "Success",
          description: "Upload finished",
        });

        return data;
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error || "An error occurred on upload. Please try again",
        });
      });

    if (!uploadedVideo.id) {
      toast({
        title: "Error",
        description: "An error occurred on upload vídeo.",
      });

      return;
    }

    setStatus("converting");

    const audioFile = await convertVideoToAudio(videoFile);

    setStatus("uploading");

    const formAudio = new FormData();
    formAudio.append("file", audioFile);

    fetch("/api/upload-file", {
      method: "POST",
      body: formAudio,
    })
      .then((response) => {
        const data = response.json();

        toast({
          title: "Success",
          description: "Upload finished",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error || "An error occurred on upload. Please try again",
        });
      });

    if (!prompt?.length) {
      toast({
        title: "Error",
        description: "An error occurred on prompt.",
      });

      return;
    }

    setStatus("generating");

    fetch(`/api/transcription/${uploadedVideo.id}`, {
      method: "POST",
      body: prompt,
    })
      .then((response) => {
        const data = response.json();

        toast({
          title: "Success",
          description: "Transcription as finished",
        });
        console.log(data);
        setStatus("success");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description:
            error || "An error occurred on transcription. Please try again",
        });
        setStatus("error");
      })
      .finally(() => {
        setVideoFile(null);
      });
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <label
        htmlFor="video"
        className="border flex rounded-md aspect-video cursor-pointer 
                border-dashed text-sm flex-col items-center justify-center text-muted-foreground 
                hover:bg-primary/5
              "
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none"
          />
        ) : (
          <>
            <VideoIcon className="size-4" />
            Selecione um vídeo
          </>
        )}
      </label>
      <input
        type="file"
        name="video"
        id="video"
        accept="video/[mp4, mkv, avi]"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          id="transcription_prompt"
          className="h-24 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula [,]"
          ref={promptInputRef}
        />
      </div>

      <Button
        data-success={status === "success"}
        data-error={status === "error"}
        type="submit"
        className="w-full gap-2 data-[success=true]:bg-emerald-400 data-[error=true]:bg-red-500"
        disabled={!previewURL || status !== "awaiting"}
      >
        {status !== "awaiting" ? (
          <>
            Carregar vídeo
            <UploadIcon className="size-4" />
          </>
        ) : (
          <>
            {status !== "awaiting" && statusMessages[status]}
            <RocketIcon className="size-4 animate-pulse" />
          </>
        )}
      </Button>
    </form>
  );
}

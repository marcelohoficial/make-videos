"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { RocketIcon, UploadIcon, VideoIcon } from "@radix-ui/react-icons";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

export default function Page() {
  const [videoFile, setVideoFile] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);

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

  function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!videoFile) {
      toast({
        title: "Error",
        description: "An error occurred on file. Please try again",
      });

      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", videoFile);

    fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
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
      })
      .finally(() => {
        setVideoFile(null);
        setUploading(false);
      });
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <main className="h-screen">
      <form
        onSubmit={handleUploadVideo}
        className="h-full py-10 px-40 space-y-4"
      >
        <label
          htmlFor="video"
          className="border flex rounded-md aspect-video cursor-pointer 
                border-dashed text-sm flex-col items-center justify-center text-muted-foreground 
                hover:bg-primary/5 overflow-hidden
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

        <Button className="w-full gap-2" disabled={!previewURL || uploading}>
          {uploading ? (
            <>
              Carregando
              <RocketIcon className="size-4 animate-pulse" />
            </>
          ) : (
            <>
              Carregar vídeo
              <UploadIcon className="size-4" />
            </>
          )}
        </Button>
      </form>
    </main>
  );
}

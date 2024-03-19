"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PromptI {
  id: string;
  title: string;
  template: string;
}

interface PromptSelectProps {
  onPromptSelected: (template: string) => void;
}

export function PromptSelect(props: PromptSelectProps) {
  const [prompts, setPrompts] = useState<PromptI[]>([]);

  useEffect(() => {
    fetch("/api/prompts", {
      method: "GET",
    })
      .then((response) => {
        const data: any = response.json();
        return data;
      })
      .then((data) => {
        setPrompts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts.find((prompt) => prompt.id === promptId);

    if (!selectedPrompt) return;

    props.onPromptSelected(selectedPrompt.template);
  }

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt" />
      </SelectTrigger>
      <SelectContent>
        {prompts.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        )) || (
          <SelectItem value="empty" disabled>
            Nenhum prompt
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}

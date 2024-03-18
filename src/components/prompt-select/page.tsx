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
  id: String;
  title: String;
  template: String;
}

export function PromptSelect() {
  const [prompts, setPrompts] = useState<PromptI[]>([]);

  useEffect(() => {
    fetch("/api/prompts", {
      method: "GET",
    })
      .then((response) => {
        const data: any = response.json();
        setPrompts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="title">Título do YouTube</SelectItem>
        <SelectItem value="description">Descrição do YouTube</SelectItem>
      </SelectContent>
    </Select>
  );
}

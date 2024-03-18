import { FormVideo } from "@/components/form-video/page";
import { Header } from "@/components/interface/header";
import { PromptSelect } from "@/components/prompt-select/page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { MagicWandIcon } from "@radix-ui/react-icons";

export default function UploadAI() {
  return (
    <main className="flex flex-col min-h-screen min-w-full">
      <Header />
      <section className="flex flex-1 gap-4 p-4">
        <div className="grid grid-rows-2 flex-1 gap-4">
          <Textarea
            className="resize-none p-4 leading-relaxed"
            placeholder="Inclua o prompt para a IA..."
          />
          <Textarea
            className="resize-none p-4 leading-relaxed"
            placeholder="Resultado gerado pela IA..."
          />
        </div>
        <aside
          id="sidebar"
          className="flex w-1/4 border-l flex-col space-y-6 p-4"
        >
          <FormVideo />
          <Separator />
          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect />
              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider min={0} max={1} step={0.1} />

              <span className="block text-xs text-muted-foreground italic">
                Valores mais altos tendem a deixar o resultados mais criativo e
                com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button className="w-full gap-2">
              Executar
              <MagicWandIcon className="size-4" />
            </Button>
          </form>
        </aside>
      </section>
    </main>
  );
}

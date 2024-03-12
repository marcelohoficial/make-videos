import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header(children?: any) {
  return (
    <main className="w-full h-14 border-b px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold">upload.ai</h1>
      <p className="text-sm text-muted-foreground">Teste 123</p>
    </main>
  );
}

export function HeaderUser() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>T</Avatar>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}

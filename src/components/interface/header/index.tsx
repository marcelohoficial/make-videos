import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/services/auth";

export async function Header(children?: any) {
  const data = await auth();

  return (
    <main className="w-full h-14 border-b px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold">uPload.AI</h1>
      <p className="text-sm text-muted-foreground">
        {data?.user.name || "user"}
      </p>
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

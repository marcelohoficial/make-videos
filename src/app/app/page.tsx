import { Button } from "@/components/ui/button";
import { auth } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  return (
    <main>
      <pre>{JSON.stringify(session?.user, null, 1)}</pre>

      <Button onClick={redirect("/app/upload-ai")}>Upload AI</Button>
    </main>
  );
}

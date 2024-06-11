"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const route = useRouter();
  useEffect(() => {
    route.push("/app/upload");
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen min-w-full animate-pulse">
      Loading
    </div>
  );
}

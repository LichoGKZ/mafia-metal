"use client";

import { useLenis } from "@/hooks/useLenis";

export default function HomeClient({ children }: { children: React.ReactNode }) {
  useLenis();
  return <>{children}</>;
}

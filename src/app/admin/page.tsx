"use client";

import { useMap } from "@/hooks/useMap";
import { useRef } from "react";

export function AdminPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  return <div className="h-full w-full" ref={mapContainerRef}></div>;
}

export default AdminPage;

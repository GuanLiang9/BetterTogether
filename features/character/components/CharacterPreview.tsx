"use client";
import { CharacterBodySVG } from "./CharacterBodySVG";
import type { CharacterData } from "@/types/character.types";

interface CharacterPreviewProps {
  character: CharacterData;
  size?: "sm" | "md" | "lg";
  name?: string;
}

export function CharacterPreview({ character, size = "md", name }: CharacterPreviewProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <CharacterBodySVG character={character} size={size} />
      {name && (
        <span className="text-sm text-slate-300 font-medium truncate max-w-full">
          {name}
        </span>
      )}
    </div>
  );
}

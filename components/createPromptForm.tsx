// File: components/createPromptForm.tsx
import { useEffect, useState } from "react";
import { CreatePromptProps } from "../lib/types";

export default function CreatePromptForm(props: CreatePromptProps) {
  const { exInput, exOutput, isOpen, problem, setExInput, setExOutput } = props;

  return (
    <>
      <textarea
        className={
          (isOpen ? "h-32 opacity-100" : "h-0 opacity-0") +
          " w-full md:w-1/2 p-3 mt-2 text-xl text-gray-700 bg-gray-200 rounded-lg focus:outline-blue-700 focus:bg-gray-100 transition-all duration-750 ease-out"
        }
        aria-multiline={isOpen}
        rows={1}
        placeholder="Here's what I put in:"
        value={exInput}
        onChange={(e) => setExInput(e.target.value)}
      />
      <textarea
        className={
          (isOpen ? "h-32 opacity-100" : "h-0 opacity-0") +
          " w-full md:w-1/2 p-3 mt-2 text-xl text-gray-700 bg-gray-200 rounded-lg focus:outline-blue-700 focus:bg-gray-100 transition-all duration-750 ease-out"
        }
        aria-multiline={isOpen}
        rows={1}
        placeholder="And here is what I want out:"
        value={exOutput}
        onChange={(e) => setExOutput(e.target.value)}
      />
    </>
  );
}

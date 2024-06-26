"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function Loader({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <p>{text}</p>
    </div>
  );
}

interface SubmitButtonProps {
  text?: string;
  children?: React.ReactNode;
  loadingText?: string;
  className?: string;
  loading?: boolean;
}

export function SubmitButton({
  text,
  children,
  loadingText,
  loading,
  className,
}: Readonly<SubmitButtonProps>) {
  const status = useFormStatus();
  return (
    <button 
      type="submit" 
      aria-disabled={status.pending || loading}
      disabled={status.pending || loading}
      className={cn(className)}
    >
      {status.pending || loading ? <Loader text={loadingText || "Loading..."} /> : text || children}
    </button>
  );
}
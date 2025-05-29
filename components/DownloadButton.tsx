"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
  onClick: () => void;
};

export const DownloadButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick} className="gap-2 cursor-pointer">
      <Download className="w-4 h-4" />
      Download
    </Button>
  );
};
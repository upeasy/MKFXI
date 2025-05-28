"use client";
import { Upload } from "lucide-react";

type Props = {
  label: string;
  inputId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ImageUploader = ({ label, inputId, onChange }: Props) => {
  return (
    <div
      onClick={() => document.getElementById(inputId)?.click()}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-full h-full -translate-y-1/2 rounded-full flex justify-center items-center cursor-pointer text-primary"
    >
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
      <div className="text-center w-full flex flex-col justify-center items-center gap-4">
        <Upload className="w-12 h-12" />
        <p>{label}</p>
      </div>
    </div>
  );
};

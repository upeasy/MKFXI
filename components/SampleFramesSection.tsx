"use client";
import React from "react";
import Image from "next/image";

type Props = {
  setFrameImage: (url: string) => void;
  is3DMode: boolean;
};

export const SampleFramesSection = ({ setFrameImage, is3DMode }: Props) => {
  const sampleFrames = [
    {
      name: "Flower Frame",
      url: "/frame.png",
      type: "2D",
    },
    {
      name: "Flower Frame",
      url: "/frame-3d.png",
      type: "3D",
    },
  ];

  // Show only 3D frames if is3DMode is true, otherwise show all frames
  const filteredFrames = is3DMode
    ? sampleFrames.filter((frame) => frame.type === "3D")
    : sampleFrames.filter((frame) => frame.type === "2D");

  return (
    <div className="mt-6 w-full max-w-md">
      <h3 className="text-center font-medium text-slate-700 mb-2">
        Try sample frames:
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {filteredFrames.map((frame) => (
          <button
            key={frame.url}
            onClick={() => setFrameImage(frame.url)}
            className="w-40 h-40 rounded-md overflow-hidden border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer relative"
          >
            <span className="inline-block bg-gradient-to-t rounded-br-2xl font-semibold text-white text-sm absolute top-0 left-0 from-orange-500 to-orange-200 px-3 py-1">
              {frame.type}
            </span>
            <Image
              src={frame.url}
              alt={frame.name}
              width={160}
              height={160}
              className="w-full h-full object-cover pointer-events-none"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

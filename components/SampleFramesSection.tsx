"use client";
import React from "react";

type Props = {
  setFrameImage: (url: string) => void;
};

export const SampleFramesSection = ({ setFrameImage }: Props) => {
  const sampleFrames = [
    {
      name: "Flower Frame",
      url: "/frame.png",
    },
    {
      name: "Sports Frame",
      url: "/frame1.png",
    },
  ];

  return (
    <div className="mt-6 w-full max-w-md">
      <h3 className=" text-center font-medium text-slate-700 mb-2">
        Try sample frames:
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {sampleFrames.map((frame) => (
          <button
            key={frame.name}
            onClick={() => setFrameImage(frame.url)}
            className="w-40 h-40 rounded-md overflow-hidden border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer"
          >
            <img
              src={frame.url}
              alt={frame.name}
              className="w-full h-full object-cover pointer-events-none"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

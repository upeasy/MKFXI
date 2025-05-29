"use client";
import { Settings } from "lucide-react";
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  frameDepthRatio: number;
  setFrameDepthRatio: (value: number) => void;
  canvasBackgroundColor: string;
  setCanvasBackgroundColor: (value: string) => void;
};

const ThreeDFrameControl = ({
  frameDepthRatio,
  setFrameDepthRatio,
  canvasBackgroundColor,
  setCanvasBackgroundColor,
}: Props) => {
  // Minimal preset colors: neutral tones + a few accents
  const presetColors = [
    "#ffffff", // White
    "#f3f4f6", // Light Gray
    "#d1d5db", // Gray
    "#374151", // Dark Gray
    "#2563eb", // Blue
    "#16a34a", // Green
    "#dc2626", // Red
  ];

  return (
    <TooltipProvider>
      <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-xs p-4 max-w-sm mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-800">
            Frame Settings
          </h3>
        </div>

        <div className="space-y-6">
          {/* Depth Ratio Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Depth Ratio: {Math.round(frameDepthRatio * 100)}%
            </label>
            <Slider
              min={0.3}
              max={0.8}
              step={0.05}
              value={[frameDepthRatio]}
              onValueChange={(value) => setFrameDepthRatio(value[0])}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Inner Frame</span>
              <span>Outer Frame</span>
            </div>
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <p><strong>30-50%:</strong> Formal look</p>
              <p><strong>60-70%:</strong> Balanced (recommended)</p>
              <p><strong>70-80%:</strong> Dramatic effect</p>
            </div>
          </div>

          {/* Background Color Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={canvasBackgroundColor}
                onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                className="w-10 h-10 rounded-md border border-gray-200 cursor-pointer bg-transparent hover:ring-2 hover:ring-blue-200 transition-all"
                title="Select background color"
              />
              <span className="text-sm text-gray-600">{canvasBackgroundColor}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {presetColors.map((color) => (
                <Tooltip key={color}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCanvasBackgroundColor(color)}
                      className={`w-7 h-7 rounded-md border cursor-pointer transition-all duration-200 hover:scale-110 ${
                        canvasBackgroundColor === color
                          ? "border-blue-500 ring-2 ring-blue-100"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{color}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ThreeDFrameControl;
"use client";

import { DownloadButton } from "@/components/DownloadButton";
import { ImageUploader } from "@/components/ImageUploader";
import { PreviewCanvas } from "@/components/PreviewCanvas";
import { SampleFramesSection } from "@/components/SampleFramesSection";
import ThreeDFrameControl from "@/components/ThreeDFrameControl";
import TransformControls from "@/components/TransformControls";
import { Button } from "@/components/ui/button";
import PWAInstaller from "@/components/PWAInstaller";
import OfflineIndicator from "@/components/OfflineIndicator";
import { Box, Image as ImageIcon, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

interface ImageTransform {
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  translateX: number;
  translateY: number;
}

export default function HomePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [frameDepthRatio, setFrameDepthRatio] = useState(0.6);
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDownload, setIsDownload] = useState(false);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#f3f4f6");

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imageTransform.translateX,
      y: e.clientY - imageTransform.translateY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setImageTransform({
        ...imageTransform,
        translateX: e.clientX - dragStart.x,
        translateY: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle dragging via touch
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - imageTransform.translateX,
        y: touch.clientY - imageTransform.translateY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      if (touch) {
        setImageTransform({
          ...imageTransform,
          translateX: touch.clientX - dragStart.x,
          translateY: touch.clientY - dragStart.y,
        });
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Update transforms
  const updateTransform = (updates: Partial<ImageTransform>) => {
    setImageTransform((prev) => ({ ...prev, ...updates }));
  };

  // Reset all transformations
  const resetTransforms = () => {
    setImageTransform({
      scale: 1,
      rotation: 0,
      flipX: false,
      flipY: false,
      translateX: 0,
      translateY: 0,
    });
  };

  // File upload handlers
  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          resetTransforms();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFrameUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFrameImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download handler
  const handleDownload = () => {
    setIsDownload(true);
  };

  return (
    <div className="min-h-screen isolate bg-slate-50 p-4 md:p-8 relative">
      <PWAInstaller />
      <OfflineIndicator />
      <div className="absolute inset-0 -z-10 filter brightness-100 contrast-150 bg-[url(/noise.svg)] opacity-35 pointer-events-none" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="max-w-6xl mx-auto pt-20">
      

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2 flex flex-col items-center">
            {/* Frame Mode Toggle */}
            <div className="mb-6 bg-white/50 backdrop-blur-md overflow-hidden rounded-3xl shadow-xs p-4">
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm font-medium text-slate-600">
                  Frame Mode:
                </span>
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setIs3DMode(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                      !is3DMode
                        ? "bg-white text-purple-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    2D
                  </button>
                  <button
                    onClick={() => setIs3DMode(true)}
                    className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      is3DMode
                        ? "bg-white text-purple-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <Box className="w-4 h-4" />
                    3D
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <PreviewCanvas
                profileImage={profileImage}
                frameImage={frameImage}
                imageTransform={imageTransform}
                is3DFrame={is3DMode}
                frameDepthRatio={frameDepthRatio}
                isDragging={isDragging}
                handleMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                handleTouchStart={handleTouchStart}
                handleTouchMove={handleTouchMove}
                handleTouchEnd={handleTouchEnd}
                canvasRef={canvasRef}
                isDownload={isDownload}
                setIsDownload={setIsDownload}
                canvasBackgroundColor={canvasBackgroundColor}
              />

              {!profileImage && (
                <ImageUploader
                  label={
                    is3DMode
                      ? "Upload Your Transparent Profile Image"
                      : "Upload Your Profile Image"
                  }
                  inputId="profile-input"
                  onChange={handleProfileUpload}
                />
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {profileImage && (
                <div
                  onClick={() =>
                    document.getElementById("profile-input")?.click()
                  }
                >
                  <input
                    id="profile-input"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() =>
                      document.getElementById("profile-input")?.click()
                    }
                    className="gap-2 cursor-pointer"
                    variant="outline"
                  >
                    <Upload className="w-4 h-4" />
                    Profile Image
                  </Button>
                </div>
              )}
              {profileImage && frameImage && (
                <>
                  <DownloadButton onClick={handleDownload} />

                  <Button
                    onClick={resetTransforms}
                    variant="outline"
                    className="gap-2 cursor-pointer"
                  >
                    Reset
                  </Button>
                </>
              )}
            </div>

            <SampleFramesSection
              setFrameImage={setFrameImage}
              is3DMode={is3DMode}
            />
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <TransformControls
              imageTransform={imageTransform}
              updateTransform={updateTransform}
              resetTransforms={resetTransforms}
              frameDepthRatio={frameDepthRatio}
              setFrameDepthRatio={setFrameDepthRatio}
              canvasBackgroundColor={canvasBackgroundColor}
              setCanvasBackgroundColor={setCanvasBackgroundColor}
              is3DMode={is3DMode}
            />

            {/* 3D Frame Controls */}
            {is3DMode && profileImage && frameImage && (
              <ThreeDFrameControl
                frameDepthRatio={frameDepthRatio}
                setFrameDepthRatio={setFrameDepthRatio}
                canvasBackgroundColor={canvasBackgroundColor}
                setCanvasBackgroundColor={setCanvasBackgroundColor}
              />
            )}
          </div>
        </div>

        {/* Hidden inputs */}
        <input
          id="frame-input"
          type="file"
          accept="image/*"
          onChange={handleFrameUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}

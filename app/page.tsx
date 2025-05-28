"use client";
import { DownloadButton } from "@/components/DownloadButton";
import { ImageUploader } from "@/components/ImageUploader";
import { PreviewCanvas } from "@/components/PreviewCanvas";
import { SampleFramesSection } from "@/components/SampleFramesSection";
import { TransformControls } from "@/components/TransformControls";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
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
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 0.7,
    rotation: 0,
    flipX: false,
    flipY: false,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Update transforms
  const updateTransform = (updates: Partial<ImageTransform>) => {
    setImageTransform((prev) => ({ ...prev, ...updates }));
  };

  // Reset all transformations
  const resetTransforms = () => {
    setImageTransform({
      scale: 0.7,
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

  // Canvas drawing logic
  const drawToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !profileImage || !frameImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 500;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const profileImg = new Image();
    const frameImg = new Image();

    profileImg.onload = () => {
      frameImg.onload = () => {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.translate(imageTransform.translateX, imageTransform.translateY);
        ctx.scale(
          imageTransform.scale * (imageTransform.flipX ? -1 : 1),
          imageTransform.scale * (imageTransform.flipY ? -1 : 1)
        );
        ctx.rotate((imageTransform.rotation * Math.PI) / 180);

        const aspectRatio = profileImg.width / profileImg.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        if (aspectRatio > 1) {
          drawHeight = canvas.width / aspectRatio;
        } else {
          drawWidth = canvas.height * aspectRatio;
        }

        ctx.drawImage(
          profileImg,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        );
        ctx.restore();

        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
      };
      frameImg.src = frameImage;
    };
    profileImg.src = profileImage;
  };

  const handleDownload = () => {
    if (!profileImage || !frameImage) return;
    drawToCanvas();
    setTimeout(() => {
      const link = document.createElement("a");
      const canvas = canvasRef.current;
      if (!canvas) return;
      link.href = canvas.toDataURL("image/png");
      link.download = "framed-profile.png";
      link.click();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Profile Picture Frame Editor
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload your photo and a frame image (with transparent center) to
            create framed profile pictures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="relative">
              <PreviewCanvas
                profileImage={profileImage}
                frameImage={frameImage}
                imageTransform={imageTransform}
                isDragging={isDragging}
                handleMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
              {!profileImage && (
                <ImageUploader
                  label="Upload Your Profile Image"
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
                    id={"profile-input"}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileUpload}
                    className="hidden"
                  />
                  <div>
                    <Button
                      onClick={() =>
                        document.getElementById("profile-input")?.click()
                      }
                      className="gap-2 "
                      variant="outline"
                    >
                      <Upload className="w-4 h-4" />
                      {"Profile Image"}
                    </Button>
                  </div>
                </div>
              )}
              {profileImage && frameImage && (
                <>
                  <DownloadButton onClick={handleDownload} />
                  <Button
                    onClick={resetTransforms}
                    variant="outline"
                    className="gap-2"
                  >
                    Reset
                  </Button>
                </>
              )}
            </div>

            <SampleFramesSection setFrameImage={setFrameImage} />
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <TransformControls
              imageTransform={imageTransform}
              updateTransform={updateTransform}
              resetTransforms={resetTransforms}
            />
          </div>
        </div>

        {/* Hidden inputs */}
        <input
          id="profile-input"
          type="file"
          accept="image/*"
          onChange={handleProfileUpload}
          className="hidden"
        />
        <input
          id="frame-input"
          type="file"
          accept="image/*"
          onChange={handleFrameUpload}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

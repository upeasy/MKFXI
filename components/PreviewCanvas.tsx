"use client";
import React, { useEffect, useRef } from "react";

interface ImageTransform {
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  translateX: number;
  translateY: number;
}

type Props = {
  profileImage: string | null;
  frameImage: string | null;
  imageTransform: ImageTransform;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
};

export const PreviewCanvas = ({
  profileImage,
  frameImage,
  imageTransform,
  handleMouseDown,
  onMouseMove,
  onMouseUp,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!profileImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set fixed size for canvas
    const width = 400;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Load profile image
    const img = new Image();
    img.crossOrigin = "anonymous"; // To avoid tainted canvas issues
    img.src = profileImage;

    img.onload = () => {
      // Save context before transforms
      ctx.save();

      // Translate to center of canvas
      ctx.translate(width / 2, height / 2);
      ctx.translate(imageTransform.translateX, imageTransform.translateY);
      ctx.scale(
        imageTransform.scale * (imageTransform.flipX ? -1 : 1),
        imageTransform.scale * (imageTransform.flipY ? -1 : 1)
      );
      ctx.rotate((Math.PI / 180) * imageTransform.rotation);

      // Calculate aspect ratio and draw image
      const aspectRatio = img.width / img.height;
      let drawWidth = width;
      let drawHeight = height;

      if (aspectRatio > 1) {
        drawHeight = width / aspectRatio;
      } else {
        drawWidth = height * aspectRatio;
      }

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );
      ctx.restore();

      // Draw frame image on top (if exists)
      if (frameImage) {
        const frameImg = new Image();
        frameImg.crossOrigin = "anonymous";
        frameImg.src = frameImage;
        frameImg.onload = () => {
          ctx.drawImage(frameImg, 0, 0, width, height);
        };
      }
    };
  }, [profileImage, frameImage, imageTransform]);

  return (
    <div
      className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-white shadow-lg rounded-full overflow-hidden mx-auto transition-all duration-300 ease-in"
      onMouseDown={handleMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Preview Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Overlay Frame (optional if needed) */}
      {frameImage && (
        <img
          src={frameImage}
          alt="Default Frame"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
};

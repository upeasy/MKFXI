"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

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
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isDownload: boolean;
  setIsDownload: React.Dispatch<React.SetStateAction<boolean>>;
  is3DFrame?: boolean; // New prop to enable 3D frame mode
  frameDepthRatio?: number; // Ratio to determine where the frame "cuts" the image (0.0 to 1.0)
  canvasBackgroundColor?: string; // Background color for the canvas
};

export const PreviewCanvas = ({
  profileImage,
  frameImage,
  imageTransform,
  isDragging,
  handleMouseDown,
  onMouseMove,
  onMouseUp,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  canvasRef,
  isDownload,
  setIsDownload,
  is3DFrame = false,
  frameDepthRatio = 0.6, // Default: 60% of image above frame, 40% below
  canvasBackgroundColor = "#ffffff", // Default white background
}: Props) => {
  const profileImageRef = useRef<HTMLImageElement | null>(null);
  const frameImageRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastProfileImage = useRef<string | null>(null);
  const lastFrameImage = useRef<string | null>(null);

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary high-resolution canvas for download
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Set high-resolution size (e.g., 1600x1600 for better quality)
    const downloadScale = 4; // Scale factor for download resolution
    tempCanvas.width = canvas.width * downloadScale;
    tempCanvas.height = canvas.height * downloadScale;

    // Scale the context to match the high-resolution canvas
    tempCtx.scale(downloadScale, downloadScale);

    // Redraw content on the temporary canvas using the same draw logic
    drawCanvasContent(tempCtx, canvas.width, canvas.height);

    // Draw credit text in bottom right corner
    tempCtx.font = "8px Arial";
    tempCtx.fillStyle = "white";
    tempCtx.textBaseline = "bottom";
    tempCtx.textAlign = "right";
    tempCtx.fillText(
      "Made with ❤️ by Nazmul H. Sourab",
      canvas.width - 10,
      canvas.height - 10
    );

    // Download the image
    const link = document.createElement("a");
    link.download = "mkfxi-profile.png";
    link.href = tempCanvas.toDataURL("image/png"); // Use PNG for lossless quality
    link.click();
    link.remove();
    tempCanvas.remove();
  };

  // Separate function to handle the drawing logic for both preview and download
  const drawCanvasContent = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Clear canvas with background color
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(0, 0, width, height);

    if (!is3DFrame) {
      // Original drawing logic for non-3D frames
      drawProfileImage(ctx, width, height, false);
      drawFrameImage(ctx, width, height);
    } else {
      // 3D Frame logic: Draw in layers

      // 1. First, draw the lower part of the profile image (behind frame)
      drawProfileImage(ctx, width, height, true, "lower");

      // 2. Then draw the frame
      drawFrameImage(ctx, width, height);

      // 3. Finally, draw the upper part of the profile image (in front of frame)
      drawProfileImage(ctx, width, height, true, "upper");
    }
  };

  const drawProfileImage = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    isClipped: boolean = false,
    clipRegion?: "upper" | "lower"
  ) => {
    if (!profileImageRef.current) return;

    ctx.save();

    // Apply clipping for 3D effect
    if (isClipped && clipRegion) {
      const clipY = height * frameDepthRatio;

      ctx.beginPath();
      if (clipRegion === "upper") {
        // Clip to show only the upper part (head and shoulders)
        ctx.rect(0, 0, width, clipY);
      } else {
        // Clip to show only the lower part
        ctx.rect(0, clipY, width, height - clipY);
      }
      ctx.clip();
    }

    ctx.translate(width / 2, height / 2);
    ctx.translate(imageTransform.translateX, imageTransform.translateY);
    ctx.scale(
      imageTransform.scale * (imageTransform.flipX ? -1 : 1),
      imageTransform.scale * (imageTransform.flipY ? -1 : 1)
    );
    ctx.rotate((Math.PI / 180) * imageTransform.rotation);

    const img = profileImageRef.current;
    const aspectRatio = img.width / img.height;
    let drawWidth = width;
    let drawHeight = height;

    if (aspectRatio > 1) {
      drawHeight = width / aspectRatio;
    } else {
      drawWidth = height * aspectRatio;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    ctx.restore();
  };

  const drawFrameImage = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    if (!frameImageRef.current) return;
    ctx.drawImage(frameImageRef.current, 0, 0, width, height);
  };

  // Draw canvas function
  const drawCanvas = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      drawCanvasContent(ctx, width, height);
    });
  };

  // Set up canvas and load images
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set fixed size for canvas
    const width = 400;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Load profile image if changed
    if (profileImage && profileImage !== lastProfileImage.current) {
      profileImageRef.current = null; // Clear ref to force reload
      lastProfileImage.current = profileImage;
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = profileImage;
      img.onload = () => {
        profileImageRef.current = img;
        drawCanvas();
      };
    }

    // Load frame image if changed
    if (frameImage && frameImage !== lastFrameImage.current) {
      frameImageRef.current = null; // Clear ref to force reload
      lastFrameImage.current = frameImage;
      const frameImg = new window.Image();
      frameImg.crossOrigin = "anonymous";
      frameImg.src = frameImage;
      frameImg.onload = () => {
        frameImageRef.current = frameImg;
        drawCanvas();
      };
    }

    // Trigger redraw if either image is already loaded
    if (profileImageRef.current || frameImageRef.current) {
      drawCanvas();
    }

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [profileImage, frameImage]);

  // Redraw canvas when transforms change
  useEffect(() => {
    drawCanvas();
  }, [imageTransform, is3DFrame, frameDepthRatio, canvasBackgroundColor]);

  useEffect(() => {
    if (isDownload) {
      downloadCanvas();
      setIsDownload(false);
    }
  }, [isDownload, setIsDownload]);

  return (
    <div
      className={`relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] shadow-lg overflow-hidden mx-auto transition-all duration-300 ease-in ${
        is3DFrame ? "shadow-2xl transform perspective-1000" : ""
      }`}
      style={{
        backgroundColor: canvasBackgroundColor,
        borderColor: canvasBackgroundColor,
        borderWidth: "2px",
        borderStyle: "solid",
        touchAction: "none",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Only show the overlay frame image for non-3D mode */}
      {frameImage && !is3DFrame && (
        <Image
          src={frameImage}
          alt="Default Frame"
          fill
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ objectFit: "cover" }}
          priority
        />
      )}

      {/* Add depth indicator for 3D frames */}
      {is3DFrame && (
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-blue-300 opacity-30 pointer-events-none"
          style={{
            top: `${frameDepthRatio * 100}%`,
            transition: "top 0.3s ease",
          }}
        />
      )}
    </div>
  );
};

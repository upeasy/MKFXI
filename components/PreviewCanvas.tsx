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
}: Props) => {
  const profileImageRef = useRef<HTMLImageElement | null>(null);
  const frameImageRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastProfileImage = useRef<string | null>(null);
  const lastFrameImage = useRef<string | null>(null);

  // Download canvas as high-quality image
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

    // Redraw content on the temporary canvas
    const width = canvas.width;
    const height = canvas.height;

    // Draw profile image if loaded
    if (profileImageRef.current) {
      tempCtx.save();
      tempCtx.translate(width / 2, height / 2);
      tempCtx.translate(imageTransform.translateX, imageTransform.translateY);
      tempCtx.scale(
        imageTransform.scale * (imageTransform.flipX ? -1 : 1),
        imageTransform.scale * (imageTransform.flipY ? -1 : 1)
      );
      tempCtx.rotate((Math.PI / 180) * imageTransform.rotation);

      const img = profileImageRef.current;
      const aspectRatio = img.width / img.height;
      let drawWidth = width;
      let drawHeight = height;

      if (aspectRatio > 1) {
        drawHeight = width / aspectRatio;
      } else {
        drawWidth = height * aspectRatio;
      }

      tempCtx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );
      tempCtx.restore();
    }

    // Draw frame image if loaded
    if (frameImageRef.current) {
      tempCtx.drawImage(frameImageRef.current, 0, 0, width, height);
    }

    // Draw credit text in bottom right corner
    tempCtx.font = "8px Arial";
    tempCtx.fillStyle = "white";
    tempCtx.textBaseline = "bottom";
    tempCtx.textAlign = "right";
    tempCtx.fillText(
      "Made with ❤️ by Nazmul H. Sourab",
      width - 10,
      height - 10
    );

    // Download the image
    const link = document.createElement("a");
    link.download = "mkfxi-profile.png";
    link.href = tempCanvas.toDataURL("image/png"); // Use PNG for lossless quality
    link.click();
    link.remove();
    tempCanvas.remove();
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

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw profile image if loaded
      if (profileImageRef.current) {
        ctx.save();
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

        ctx.drawImage(
          img,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        );
        ctx.restore();
      }

      // Draw frame image if loaded
      if (frameImageRef.current) {
        ctx.drawImage(frameImageRef.current, 0, 0, width, height);
      }
    });
  };

  // Set up canvas and load images
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-resolution canvas size
    const pixelRatio =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const displaySize = 400; // Display size in CSS pixels
    const canvasSize = displaySize * pixelRatio; // Actual canvas resolution
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Scale the context to account for pixel ratio
    ctx.scale(pixelRatio, pixelRatio);

    // Set CSS size to maintain display size
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    // Load profile image if changed
    if (profileImage && profileImage !== lastProfileImage.current) {
      profileImageRef.current = null;
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
      frameImageRef.current = null;
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
  }, [imageTransform]);

  useEffect(() => {
    if (isDownload) {
      downloadCanvas();
      setIsDownload(false);
    }
  }, [isDownload, setIsDownload]);

  return (
    <div
      className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-white shadow-lg rounded-full overflow-hidden mx-auto transition-all duration-300 ease-in"
      onMouseDown={handleMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: "none",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {frameImage && (
        <Image
          src={frameImage}
          alt="Default Frame"
          fill
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ objectFit: "cover" }}
          priority
        />
      )}
    </div>
  );
};

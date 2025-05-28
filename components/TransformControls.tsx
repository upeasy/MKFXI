"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
    FlipHorizontal,
    FlipVertical,
    RotateCcw,
    RotateCw,
    ZoomIn,
    ZoomOut
} from "lucide-react";

interface ImageTransform {
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  translateX: number;
  translateY: number;
}

type Props = {
  imageTransform: ImageTransform;
  updateTransform: (updates: Partial<ImageTransform>) => void;
  resetTransforms: () => void;
};

export const TransformControls = ({
  imageTransform,
  updateTransform,
  resetTransforms,
}: Props) => {
  const handleZoom = (delta: number) => {
    const newScale = Math.max(0.1, Math.min(3, imageTransform.scale + delta));
    updateTransform({ scale: newScale });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editing Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rotate & Flip */}
        <div>
          <h3 className="text-sm font-medium mb-2">Rotate & Flip</h3>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateTransform({ rotation: imageTransform.rotation - 90 })}
            >
              <RotateCcw className="w-4 h-4 mr-1" /> -90°
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateTransform({ rotation: imageTransform.rotation + 90 })}
            >
              <RotateCw className="w-4 h-4 mr-1" /> +90°
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateTransform({ flipX: !imageTransform.flipX })}
            >
              <FlipHorizontal className="w-4 h-4 mr-1" /> X
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateTransform({ flipY: !imageTransform.flipY })}
            >
              <FlipVertical className="w-4 h-4 mr-1" /> Y
            </Button>
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="text-sm font-medium block mb-2">
            Horizontal: {imageTransform.translateX}px
          </label>
          <Slider
            value={[imageTransform.translateX]}
            onValueChange={([value]) => updateTransform({ translateX: value })}
            min={-150}
            max={150}
            step={1}
          />
          <label className="text-sm font-medium block mt-4 mb-2">
            Vertical: {imageTransform.translateY}px
          </label>
          <Slider
            value={[imageTransform.translateY]}
            onValueChange={([value]) => updateTransform({ translateY: value })}
            min={-150}
            max={150}
            step={1}
          />
        </div>

        {/* Zoom */}
        <div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom(-0.1)}
              className="flex-1 gap-1"
            >
              <ZoomOut className="w-4 h-4" />
              Zoom Out
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom(0.1)}
              className="flex-1 gap-1"
            >
              <ZoomIn className="w-4 h-4" />
              Zoom In
            </Button>
          </div>
          <label className="text-sm font-medium block mt-4 mb-2">
            Scale: {imageTransform.scale.toFixed(2)}x
          </label>
          <Slider
            value={[imageTransform.scale]}
            onValueChange={([value]) => updateTransform({ scale: value })}
            min={0.1}
            max={3}
            step={0.05}
          />
        </div>

        <Button onClick={resetTransforms} variant="outline" className="w-full mt-2">
          Reset All
        </Button>
      </CardContent>
    </Card>
  );
};
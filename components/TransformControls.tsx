"use client";
import { Slider } from "@/components/ui/slider";
import {
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Move,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";

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

export default function TransformControls({
  imageTransform = {
    scale: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
    translateX: 0,
    translateY: 0,
  },
  updateTransform = () => {},
  resetTransforms = () => {},
}: Partial<Props>) {
  const [activeTab, setActiveTab] = useState("transform");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's 'sm' breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleZoom = (delta: number) => {
    const newScale = Math.max(0.1, Math.min(3, imageTransform.scale + delta));
    updateTransform({ scale: newScale });
  };

  interface TabButtonProps {
    id: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }

  const TabButton = ({
    icon: Icon,
    label,
    isActive,
    onClick,
  }: TabButtonProps) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-[70px] cursor-pointer ${
        isActive
          ? "bg-purple-800 text-white shadow-lg"
          : "bg-gray-100 text-purple-800 hover:bg-gray-200"
      }`}
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  interface QuickActionButtonProps {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    variant?: "default" | "primary";
  }

  const QuickActionButton = ({
    icon: Icon,
    label,
    onClick,
    variant = "default",
  }: QuickActionButtonProps) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 active:scale-95 cursor-pointer ${
        variant === "primary"
          ? "bg-purple-800 text-white shadow-lg hover:bg-purple-800"
          : "bg-white text-purple-800 hover:bg-purple-800 hover:text-white shadow-md hover:shadow-lg border border-gray-200"
      }`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const renderTransformTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        <QuickActionButton
          icon={RotateCcw}
          label="Rotate Left"
          onClick={() =>
            updateTransform({ rotation: imageTransform.rotation - 90 })
          }
        />
        <QuickActionButton
          icon={RotateCw}
          label="Rotate Right"
          onClick={() =>
            updateTransform({ rotation: imageTransform.rotation + 90 })
          }
        />
        <QuickActionButton
          icon={FlipHorizontal}
          label="Flip H"
          onClick={() => updateTransform({ flipX: !imageTransform.flipX })}
          variant={imageTransform.flipX ? "primary" : "default"}
        />
        <QuickActionButton
          icon={FlipVertical}
          label="Flip V"
          onClick={() => updateTransform({ flipY: !imageTransform.flipY })}
          variant={imageTransform.flipY ? "primary" : "default"}
        />
      </div>
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-purple-800" />
            <span className="text-sm font-medium text-purple-800">
              Rotation
            </span>
          </div>
          <span className="text-sm text-purple-800 bg-white px-2 py-1 rounded-lg">
            {imageTransform.rotation}°
          </span>
        </div>
        <Slider
          value={[imageTransform.rotation]}
          onValueChange={([value]) => updateTransform({ rotation: value })}
          min={-180}
          max={180}
          step={1}
          className="mt-2 cursor-pointer"
        />
      </div>
    </div>
  );

  const renderScaleTab = () => (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={() => handleZoom(-0.1)}
          className="flex-1 flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md cursor-pointer transition-all hover:text-white duration-200 hover:bg-purple-800 active:scale-95"
        >
          <ZoomOut className="w-5 h-5" />
          <span className="font-medium">Zoom Out</span>
        </button>
        <button
          onClick={() => handleZoom(0.1)}
          className="flex-1 flex items-center justify-center gap-2 p-4 bg-white hover:text-white rounded-2xl hover:bg-purple-800 cursor-pointer transition-all duration-200 active:scale-95 border border-gray-200"
        >
          <ZoomIn className="w-5 h-5" />
          <span className="font-medium">Zoom In</span>
        </button>
      </div>
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-purple-800" />
            <span className="text-sm font-medium text-purple-800">Scale</span>
          </div>
          <span className="text-sm text-purple-800 bg-white px-2 py-1 rounded-lg">
            {imageTransform.scale.toFixed(2)}×
          </span>
        </div>
        <Slider
          value={[imageTransform.scale]}
          onValueChange={([value]) => updateTransform({ scale: value })}
          min={0.1}
          max={3}
          step={0.05}
          className="mt-2 cursor-pointer"
        />
        <div className="flex gap-2 mt-4">
          {[0.5, 1, 1.5, 2].map((scale) => (
            <button
              key={scale}
              onClick={() => updateTransform({ scale })}
              className={`flex-1 py-2 px-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 ${
                Math.abs(imageTransform.scale - scale) < 0.05
                  ? "bg-purple-800 text-white"
                  : "bg-white text-purple-800 hover:bg-gray-100"
              }`}
            >
              {scale}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPositionTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Move className="w-4 h-4 text-purple-800" />
          <span className="text-sm font-medium text-purple-800">Position</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-800">Horizontal</span>
            <span className="text-sm text-purple-800 bg-white px-2 py-1 rounded-lg">
              {imageTransform.translateX}px
            </span>
          </div>
          <Slider
            value={[imageTransform.translateX]}
            onValueChange={([value]) => updateTransform({ translateX: value })}
            min={-150}
            max={150}
            step={1}
            className=" cursor-pointer"
          />
        </div>
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-800">Vertical</span>
            <span className="text-sm text-purple-800 bg-white px-2 py-1 rounded-lg">
              {imageTransform.translateY}px
            </span>
          </div>
          <Slider
            value={[imageTransform.translateY]}
            onValueChange={([value]) => updateTransform({ translateY: value })}
            min={-150}
            max={150}
            step={1}
            className=" cursor-pointer"
          />
        </div>
        <button
          onClick={() => updateTransform({ translateX: 0, translateY: 0 })}
          className="w-full mt-4 py-3 bg-white text-purple-800 hover:text-white rounded-xl border border-gray-200 font-medium hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer hover:bg-primary"
        >
          Center Image
        </button>
      </div>
    </div>
  );

  const renderDrawer = () => (
    <div
      className={`fixed inset-x-0 bottom-0 w-full bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isDrawerOpen ? "translate-y-0" : "translate-y-full"
      } sm:hidden max-h-[80vh] flex flex-col z-50`}
    >
      {/* Drawer Handle */}
      <div className="flex justify-center pt-3">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>
      {/* Close Button */}
      <button
        onClick={() => setIsDrawerOpen(false)}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
      >
        <X className="w-5 h-5 text-purple-800" />
      </button>
      {/* Drawer Header */}
      <div className="flex gap-2 p-4 border-b bg-gray-50">
        <TabButton
          id="transform"
          icon={RotateCw}
          label="Transform"
          isActive={activeTab === "transform"}
          onClick={() => setActiveTab("transform")}
        />
        <TabButton
          id="scale"
          icon={ZoomIn}
          label="Scale"
          isActive={activeTab === "scale"}
          onClick={() => setActiveTab("scale")}
        />
        <TabButton
          id="position"
          icon={Move}
          label="Position"
          isActive={activeTab === "position"}
          onClick={() => setActiveTab("position")}
        />
      </div>
      {/* Drawer Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {activeTab === "transform" && renderTransformTab()}
        {activeTab === "scale" && renderScaleTab()}
        {activeTab === "position" && renderPositionTab()}
      </div>
      {/* Bottom Actions */}
      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={() => {
            resetTransforms();
            setIsDrawerOpen(false);
          }}
          className="w-full py-3 cursor-pointer bg-amber-600 text-white rounded-2xl font-medium hover:bg-amber-500 transition-all duration-200 active:scale-95"
        >
          Reset All Changes
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger Button */}
      {isMobile && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed bottom-4 right-4 sm:hidden bg-purple-800 text-white p-4 rounded-full shadow-lg hover:bg-purple-800 transition-all duration-200 z-50"
        >
          <Settings className="w-6 h-6" />
        </button>
      )}
      {/* Drawer for Mobile */}
      {isMobile && renderDrawer()}
      {/* Original Layout for Non-Mobile */}
      {!isMobile && (
        <div className="w-full max-w-sm mx-auto bg-white/50 backdrop-blur-md overflow-hidden rounded-3xl shadow-xs">
          <div className="flex gap-2 p-4 bg-gray-50/50 border-b">
            <TabButton
              id="transform"
              icon={RotateCw}
              label="Transform"
              isActive={activeTab === "transform"}
              onClick={() => setActiveTab("transform")}
            />
            <TabButton
              id="scale"
              icon={ZoomIn}
              label="Scale"
              isActive={activeTab === "scale"}
              onClick={() => setActiveTab("scale")}
            />
            <TabButton
              id="position"
              icon={Move}
              label="Position"
              isActive={activeTab === "position"}
              onClick={() => setActiveTab("position")}
            />
          </div>
          <div className="p-4">
            {activeTab === "transform" && renderTransformTab()}
            {activeTab === "scale" && renderScaleTab()}
            {activeTab === "position" && renderPositionTab()}
          </div>
          <div className="p-4 border-t bg-gray-50/50">
            <button
              onClick={resetTransforms}
              className="w-full py-3 cursor-pointer bg-amber-600 text-white rounded-2xl font-medium hover:bg-amber-500 transition-all duration-200 active:scale-95"
            >
              Reset All Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}

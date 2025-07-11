import { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";

type CardData = {
  title: string;
  url: string;
  license: string;
  thumbnail: string;
  attribution: string;
  extension?: string;
  width: number;
  height: number;
};

export type CanvasRef = {
  undo: () => void;
  redo: () => void;
  resetZoom: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (scale: number) => void;
  fitToScreen: () => void;
  saveHistory: () => void;
  startCrop: () => void;
  cancelCrop: () => void;
  applyCrop: () => void;
  setCropAspectRatio?: (ratio: number | null) => void;
  setLockAspect?: (lock: boolean) => void;
};

type HistorySnapshot = {
  json: string;
  zoom: number;
  viewportTransform: number[] | null;
};

declare global {
  namespace fabric {
    interface Object {
      id?: string;
    }
  }
}

const CanvasApp = ({
  activeEditCard,
  onReady,
  isZoomingRef,
  setZoomValue,
}: {
  activeEditCard: CardData | null;
  onReady: (ref: CanvasRef) => void;
  isZoomingRef: React.RefObject<boolean>;
  setZoomValue: (e: number) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasState, setCanvasState] = useState<fabric.Canvas>();
  const current = useRef<number>(-1);
  const history = useRef<HistorySnapshot[]>([]);
  const hasUndoneRef = useRef(false);
  const isRestoringRef = useRef(false);

  const cropRectRef = useRef<fabric.Rect | null>(null);
  const isCroppingRef = useRef(false);
  const cropAspectRatioRef = useRef<number | null>(null);
  const lockAspectRef = useRef<boolean>(false);

  const startCrop = () => {
    if (!canvasState) return;

    const bg = canvasState.backgroundImage as fabric.Image;
    if (!bg) return;
    console.log("en");

    const imageLeft = bg.left ?? 0;
    const imageTop = bg.top ?? 0;
    const imageWidth = (bg.width ?? 0) * (bg.scaleX ?? 1);
    const imageHeight = (bg.height ?? 0) * (bg.scaleY ?? 1);

    isCroppingRef.current = true;

    // Initial crop size: half of image dimensions
    const cropW = imageWidth / 2;
    const cropH = imageHeight / 2;
    const cropX = imageLeft + (imageWidth - cropW) / 2;
    const cropY = imageTop + (imageHeight - cropH) / 2;

    const cropRect = new fabric.Rect({
      left: cropX,
      top: cropY,
      width: cropW,
      height: cropH,
      fill: "rgba(0,0,0,0.1)",
      stroke: "#007bff",
      strokeWidth: 1,
      hasBorders: true,
      hasControls: true,
      lockRotation: true,
      cornerColor: "#007bff",
      transparentCorners: false,
      objectCaching: false,
      selectable: true,
    });

    // Aspect ratio locking
    cropRect.on("scaling", () => {
      if (!canvasState || !bg) return;

      if (lockAspectRef.current && cropAspectRatioRef.current) {
        const w = cropRect.getScaledWidth();
        const h = w / cropAspectRatioRef.current;
        cropRect.scaleY = h / cropRect.height!;
      }

      // Enforce max size within image
      const maxW = imageWidth - (cropRect.left! - imageLeft);
      const maxH = imageHeight - (cropRect.top! - imageTop);

      const scaledW = cropRect.getScaledWidth();
      const scaledH = cropRect.getScaledHeight();

      if (scaledW > maxW) {
        cropRect.scaleX = maxW / cropRect.width!;
      }
      if (scaledH > maxH) {
        cropRect.scaleY = maxH / cropRect.height!;
      }
    });

    // Prevent moving beyond image bounds
    cropRect.on("moving", () => {
      if (!canvasState || !bg) return;

      const obj = cropRect;
      const scaledW = obj.getScaledWidth();
      const scaledH = obj.getScaledHeight();

      const maxLeft = imageLeft + imageWidth - scaledW;
      const maxTop = imageTop + imageHeight - scaledH;

      obj.left = Math.min(Math.max(obj.left!, imageLeft), maxLeft);
      obj.top = Math.min(Math.max(obj.top!, imageTop), maxTop);
    });

    cropRectRef.current = cropRect;
    canvasState.add(cropRect);
    canvasState.setActiveObject(cropRect);
    canvasState.renderAll();
  };

  const cancelCrop = () => {
    if (!canvasState || !cropRectRef.current) return;
    canvasState.remove(cropRectRef.current);
    cropRectRef.current = null;
    isCroppingRef.current = false;
    canvasState.discardActiveObject();
    canvasState.renderAll();
  };

  const applyCrop = () => {
    if (!canvasState || !cropRectRef.current) return;

    const rect = cropRectRef.current;
    const { left, top, width, height, scaleX, scaleY } = rect;

    const cropX = left!;
    const cropY = top!;
    const cropW = width! * scaleX!;
    const cropH = height! * scaleY!;

    const bg = canvasState.backgroundImage as fabric.Image;
    if (!bg) return;

    // Create a new image with clipPath
    const cropped = new fabric.Image(bg.getElement(), {
      clipPath: new fabric.Rect({
        left: cropX,
        top: cropY,
        width: cropW,
        height: cropH,
        absolutePositioned: true,
      }),
      objectCaching: false,
      selectable: false,
      evented: false,
    });

    // Fit cropped image to canvas
    const canvasWidth = canvasState.getWidth();
    const canvasHeight = canvasState.getHeight();
    const scale = Math.min(canvasWidth / cropW, canvasHeight / cropH);

    cropped.scaleX = scale;
    cropped.scaleY = scale;
    cropped.left = (canvasWidth - cropW * scale) / 2;
    cropped.top = (canvasHeight - cropH * scale) / 2;
    cropped.id = `img-${Date.now()}`;

    // Clear canvas and add new image
    canvasState.clear();
    canvasState.setBackgroundColor("#fff", () => {});
    canvasState.add(cropped);
    canvasState.renderAll();

    // Reset crop state
    cropRectRef.current = null;
    isCroppingRef.current = false;
    saveHistory();
    startCrop();
  };

  const setCropAspectRatio = (ratio: number | null) => {
    cropAspectRatioRef.current = ratio;
  };

  const setLockAspect = (lock: boolean) => {
    lockAspectRef.current = lock;
  };

  const saveHistory = useCallback(() => {
    if (!canvasState || isRestoringRef.current) return;

    if (isZoomingRef.current) {
      console.log(isZoomingRef.current);
      return;
    }
    const json = JSON.stringify(canvasState.toJSON());
    const zoom = canvasState.getZoom();
    const viewportTransform = canvasState.viewportTransform
      ? [...canvasState.viewportTransform]
      : null;

    const lastSnapshot = history.current[current.current];
    const snapshot = JSON.stringify({ json, zoom, viewportTransform });

    if (JSON.stringify(lastSnapshot) === snapshot) return;

    // Only truncate redo history if not restoring
    if (hasUndoneRef.current && !isRestoringRef.current) {
      history.current = history.current.slice(0, current.current + 1);
      hasUndoneRef.current = false;
    }

    history.current.push({ json, zoom, viewportTransform });
    current.current++;
  }, [canvasState]);

  const loadHistory = useCallback(
    (index: number) => {
      if (!canvasState || !history.current[index]) return;

      const { json, viewportTransform, zoom } = history.current[index];
      isRestoringRef.current = true;

      const parsed = JSON.parse(json);

      const currentObjects = canvasState.getObjects();
      const restoredObjects = parsed.objects || [];

      // Match objects by id, update their props
      for (let restored of restoredObjects) {
        const target = currentObjects.find((o) => o?.id === restored.id);
        if (target) {
          target.set(restored);
          target.setCoords();
        }
      }

      if (viewportTransform) {
        canvasState.setViewportTransform(viewportTransform);
      } else {
        canvasState.setZoom(zoom);
      }

      setZoomValue(zoom * 100);

      requestAnimationFrame(() => {
        canvasState?.requestRenderAll();
        isRestoringRef.current = false;
      });
    },
    [canvasState]
  );

  useEffect(() => {
    if (!canvasRef.current || !activeEditCard) return;

    const container = canvasRef.current.parentElement;
    const canvasWidth = container?.clientWidth ?? 800;
    const canvasHeight = Math.max((container?.clientHeight ?? 0) * 0.65, 500);

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
    });

    initCanvas.setBackgroundColor("#fff", () => initCanvas.renderAll());
    setCanvasState(initCanvas);

    return () => {
      initCanvas.dispose(); // ✅ cleanup is done here
    };
  }, [activeEditCard]);

  useEffect(() => {
    if (!canvasState || !activeEditCard?.thumbnail) return;

    const loadImage = async () => {
      try {
        const img = await loadFabricImage(activeEditCard.thumbnail);

        const canvasWidth = canvasState.getWidth();
        const canvasHeight = canvasState.getHeight();

        const scale = Math.min(
          canvasWidth / img.width!,
          canvasHeight / img.height!
        );

        const imgWidth = img.width! * scale;
        const imgHeight = img.height! * scale;
        const left = (canvasWidth - imgWidth) / 2;
        const top = (canvasHeight - imgHeight) / 2;

        const clip = new fabric.Rect({
          width: imgWidth,
          height: imgHeight,
          rx: 16,
          ry: 16,
          left,
          top,
          absolutePositioned: true,
        });

        img.set({
          left,
          top,
          scaleX: scale,
          scaleY: scale,
          clipPath: clip,
          shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.2)",
            blur: 12,
            offsetX: 0,
            offsetY: 4,
          }),
          selectable: false,
          evented: true,
          objectCaching: false,
          id: `img-${Date.now()}`,
        });

        canvasState.clear(); // Optional
        canvasState.setBackgroundColor("#fff", () => {});
        canvasState.setBackgroundImage(img, () => {
          canvasState.renderAll();
          startCrop(); // ✅ Now works because backgroundImage is set
          saveHistory();
        });
      } catch (err) {
        console.error("Failed to load image:", err);
      }
    };

    loadImage(); // Call the async function
  }, [canvasState, activeEditCard, saveHistory]);

  useEffect(() => {
    if (!canvasState) return;
    let timeout: NodeJS.Timeout | null = null;

    const saveOnModify = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(saveHistory, 300);
    };

    canvasState.on("object:modified", saveOnModify);
    canvasState.on("object:added", saveOnModify);
    canvasState.on("object:removed", saveOnModify);

    return () => {
      canvasState.off("object:modified", saveOnModify);
      canvasState.off("object:added", saveOnModify);
      canvasState.off("object:removed", saveOnModify);
    };
  }, [canvasState, saveHistory]);

  useEffect(() => {
    if (!canvasState) return;

    onReady({
      undo: () => {
        if (current.current > 0) {
          current.current--;
          hasUndoneRef.current = true;
          loadHistory(current.current);
        }
      },
      redo: () => {
        if (current.current < history.current.length - 1) {
          current.current++;
          loadHistory(current.current);
          hasUndoneRef.current = false;
        }
      },
      zoomIn: () => {
        const zoom = canvasState.getZoom() + 0.1;
        const center = canvasState.getCenter();
        canvasState.zoomToPoint(
          new fabric.Point(center.left, center.top),
          zoom
        );
        canvasState.renderAll();
        saveHistory();
      },
      zoomOut: () => {
        const zoom = canvasState.getZoom() - 0.1;
        const center = canvasState.getCenter();
        canvasState.zoomToPoint(
          new fabric.Point(center.left, center.top),
          zoom
        );
        canvasState.renderAll();
        saveHistory();
      },
      setZoom: (scale: number) => {
        isZoomingRef.current = true;
        const center = canvasState.getCenter();
        canvasState.zoomToPoint(
          new fabric.Point(center.left, center.top),
          scale
        );
        canvasState.renderAll();
        saveHistory();
      },
      resetZoom: () => {
        const center = canvasState.getCenter();
        canvasState.zoomToPoint(new fabric.Point(center.left, center.top), 1);
        canvasState.renderAll();
        saveHistory();
      },
      fitToScreen: () => {
        const objects = canvasState.getObjects();
        if (objects.length === 0) return;

        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        for (const obj of objects) {
          const rect = obj.getBoundingRect(true);
          minX = Math.min(minX, rect.left);
          minY = Math.min(minY, rect.top);
          maxX = Math.max(maxX, rect.left + rect.width);
          maxY = Math.max(maxY, rect.top + rect.height);
        }

        const boundsWidth = maxX - minX;
        const boundsHeight = maxY - minY;
        const canvasWidth = canvasState.getWidth();
        const canvasHeight = canvasState.getHeight();
        const scale = Math.min(
          canvasWidth / boundsWidth,
          canvasHeight / boundsHeight
        );

        const center = canvasState.getCenter();
        canvasState.zoomToPoint(
          new fabric.Point(center.left, center.top),
          scale
        );
        canvasState.renderAll();
        saveHistory();
      },
      saveHistory,
      startCrop,
      cancelCrop,
      applyCrop,
      setCropAspectRatio,
      setLockAspect,
    });
  }, [canvasState, loadHistory, saveHistory, onReady, isZoomingRef]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full max-h-[70vh] bg-transparent"
    />
  );
};

export default CanvasApp;

function loadFabricImage(url: string): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(url, (img) => {
      if (img) {
        resolve(img);
      } else {
        reject(new Error("Failed to load image"));
      }
    });
  });
}

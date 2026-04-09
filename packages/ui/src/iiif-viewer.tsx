'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Maximize,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  ScanLine,
} from 'lucide-react';
import type OpenSeadragon from 'openseadragon';
import { type ReactNode, useCallback, useEffect, useRef } from 'react';

type ToolbarButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

const ToolbarButton = ({ icon: Icon, label, onClick }: ToolbarButtonProps) => (
  <button
    className="flex items-center justify-center size-9 rounded-md bg-neutral-800 text-neutral-100 hover:bg-neutral-700 active:bg-neutral-600 transition-colors cursor-pointer"
    aria-label={label}
    onClick={onClick}
  >
    <Icon className="size-4" />
  </button>
);

const ToolbarSeparator = () => <div className="mx-1 h-5 w-px bg-neutral-600" />;

type ToolbarProps = {
  children: ReactNode;
};

const Toolbar = ({ children }: ToolbarProps) => (
  <div className="flex items-center justify-center gap-1 rounded-lg bg-neutral-900 p-1">
    {children}
  </div>
);

type IiifViewerProps = {
  infoJsonUrl: string;
};

export const IiifViewer = ({ infoJsonUrl }: IiifViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // NOTE: OpenSeadragon は document に依存するため、動的 import でクライアント側のみで読み込む
    import('openseadragon').then((OSD) => {
      if (!containerRef.current) return;

      viewerRef.current = OSD.default({
        element: containerRef.current,
        tileSources: infoJsonUrl,
        showNavigationControl: false,
      });
    });

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [infoJsonUrl]);

  const zoomIn = useCallback(() => {
    const v = viewerRef.current;
    if (!v) return;
    v.viewport.zoomBy(1.5);
    v.viewport.applyConstraints();
  }, []);

  const zoomOut = useCallback(() => {
    const v = viewerRef.current;
    if (!v) return;
    v.viewport.zoomBy(0.667);
    v.viewport.applyConstraints();
  }, []);

  const rotateLeft = useCallback(() => {
    const v = viewerRef.current;
    if (!v) return;
    v.viewport.setRotation(v.viewport.getRotation() - 90);
  }, []);

  const rotateRight = useCallback(() => {
    const v = viewerRef.current;
    if (!v) return;
    v.viewport.setRotation(v.viewport.getRotation() + 90);
  }, []);

  const resetView = useCallback(() => {
    viewerRef.current?.viewport.goHome();
  }, []);

  const fullPage = useCallback(() => {
    viewerRef.current?.setFullScreen(!viewerRef.current.isFullPage());
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50"
        style={{ height: '600px' }}
      />
      <Toolbar>
        <ToolbarButton icon={Plus} label="Zoom in" onClick={zoomIn} />
        <ToolbarButton icon={Minus} label="Zoom out" onClick={zoomOut} />
        <ToolbarSeparator />
        <ToolbarButton
          icon={RotateCcw}
          label="Rotate left"
          onClick={rotateLeft}
        />
        <ToolbarButton
          icon={RotateCw}
          label="Rotate right"
          onClick={rotateRight}
        />
        <ToolbarSeparator />
        <ToolbarButton icon={ScanLine} label="Reset view" onClick={resetView} />
        <ToolbarButton icon={Maximize} label="Full screen" onClick={fullPage} />
      </Toolbar>
    </div>
  );
};

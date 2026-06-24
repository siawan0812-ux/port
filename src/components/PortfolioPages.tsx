import React, { useState, useRef } from "react";
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  FileImage, 
  HelpCircle,
  CheckCircle,
  FileUp
} from "lucide-react";
import { PortfolioPage } from "../types";

// Spiral Binder Ring decoration for empty/placeholder state
const SpiralBinder: React.FC = () => {
  const rings = Array.from({ length: 14 });
  return (
    <div className="absolute top-0 left-0 right-0 h-8 flex justify-around px-8 pointer-events-none z-20">
      {rings.map((_, index) => (
        <div key={index} className="relative flex flex-col items-center -translate-y-[12px]">
          {/* Paper Hole */}
          <div className="w-2 h-2 bg-slate-600/30 rounded-full shadow-inner"></div>
          {/* Metal Ring Hoop */}
          <div className="w-3 h-8 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-full border border-slate-300 shadow-sm -translate-y-0.5"></div>
          {/* Back Paper Hole */}
          <div className="w-2 h-2 bg-slate-800/40 rounded-full shadow-inner -translate-y-0.5"></div>
        </div>
      ))}
    </div>
  );
};

// Seaside Shells decoration for empty/placeholder state
const SeasideDecorations: React.FC = () => {
  return (
    <>
      <div className="absolute -bottom-4 -left-4 w-12 h-12 pointer-events-none select-none z-10 opacity-75">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm text-amber-500/60 fill-current">
          <path d="M50,5 L61,38 L95,38 L68,58 L78,92 L50,71 L22,92 L32,58 L5,38 L39,38 Z" />
        </svg>
      </div>
      <div className="absolute -bottom-3 -right-3 w-10 h-10 pointer-events-none select-none z-10 rotate-12 opacity-75">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm text-sky-200/80 fill-current">
          <path d="M50,15 C25,15 15,45 15,75 C15,85 25,85 50,85 C75,85 85,85 85,75 C85,45 75,15 50,15 Z" />
        </svg>
      </div>
    </>
  );
};

interface PageRendererProps {
  id: number;
  imageSrc?: string;
  onUpload: (id: number, dataUrl: string) => void;
}

const PageRenderer: React.FC<PageRendererProps> = ({ id, imageSrc, onUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("请上传图片文件 (JPG / PNG / JPEG)！");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        onUpload(id, e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  // Static directory image path as fallback
  const staticPath = `/src/assets/images/${id}.jpg`;

  if (imageSrc) {
    return (
      <div className="w-full h-full bg-white rounded-3xl overflow-hidden relative border-8 border-white shadow-2xl select-none group/page">
        {/* Full Portfolio Image */}
        <img 
          src={imageSrc} 
          alt={`Sia作品集 - 第 ${id} 页`} 
          className="w-full h-full object-cover rounded-2xl border border-slate-100"
          referrerPolicy="no-referrer"
        />

        {/* Realistic Page Lighting Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/5 via-transparent to-black/5 pointer-events-none rounded-2xl"></div>

        {/* Elegant hover badge to replace image */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/page:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-300 rounded-2xl">
          <button 
            onClick={triggerUpload}
            className="px-4 py-2 bg-white/95 text-slate-800 rounded-full font-medium text-xs shadow-md flex items-center gap-1.5 hover:bg-white hover:scale-105 active:scale-95 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-sky-500" />
            更换这一页的图片
          </button>
          <span className="text-[10px] text-white/70 font-mono">Page {id} • JPG</span>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    );
  }

  // Beautiful Placeholder State (Seaside Notebook Design)
  return (
    <div 
      className={`w-full h-full bg-linear-to-b from-sky-50/10 to-white/95 rounded-3xl p-8 pt-14 relative flex flex-col justify-between border-8 border-sky-100 shadow-2xl select-none overflow-hidden transition-all duration-300 ${
        isDragOver ? "border-sky-400 bg-sky-50/40 scale-[0.99] shadow-inner" : ""
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={triggerUpload}
    >
      {/* Grid Pattern Background for Notebook */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

      <SpiralBinder />
      <SeasideDecorations />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-sky-100/60 pb-3 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="bg-sky-500 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-sm shadow-xs">
            {id < 10 ? `0${id}` : id}
          </div>
          <span className="text-sm font-bold text-slate-700">
            {id === 1 ? "Sia作品集 • 封面" : `Sia作品集 • 第 ${id} 页`}
          </span>
        </div>
        <div className="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          画册展示
        </div>
      </div>

      {/* Center Upload Prompt */}
      <div className="grow flex flex-col items-center justify-center text-center z-10 pointer-events-none my-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 ${
          isDragOver ? "bg-sky-500 text-white scale-110" : "bg-sky-50 text-sky-500 border border-sky-100 shadow-2xs"
        }`}>
          {isDragOver ? (
            <FileUp className="w-8 h-8 animate-bounce" />
          ) : (
            <ImageIcon className="w-8 h-8" />
          )}
        </div>
        
        <h3 className="font-bold text-slate-800 text-base mb-1.5">
          {id === 1 ? "上传作品集封面" : `导入第 ${id} 页内容`}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
          拖拽 JPG 图片到这里，或 <span className="text-sky-500 font-semibold underline">点击浏览本地文件</span>
        </p>

        {/* Code hint badge */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 font-mono">
          或在代码目录添加: <span className="text-amber-600">/src/assets/images/{id}.jpg</span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-sky-50/50 flex justify-between items-center text-[9px] text-slate-400 font-mono z-10 pointer-events-none">
        <span>Sia Portfolio • Creative Edition</span>
        <span>Drag & Drop Support</span>
      </div>
    </div>
  );
};

export const getPortfolioPages = (
  images: Record<number, string>,
  onUpload: (id: number, dataUrl: string) => void
): PortfolioPage[] => {
  return Array.from({ length: 18 }, (_, index) => {
    const pageNum = index + 1;
    return {
      id: pageNum,
      section: pageNum === 1 ? "Cover" : `第 ${pageNum} 页`,
      title: `Page ${pageNum}`,
      render: () => (
        <PageRenderer 
          id={pageNum} 
          imageSrc={images[pageNum]} 
          onUpload={onUpload} 
        />
      )
    };
  });
};

// Deprecated static array to satisfy types during transition
export const portfolioPages: PortfolioPage[] = [];

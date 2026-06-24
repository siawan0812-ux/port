import React, { useState, useEffect, useRef } from "react";
import { PageTurner } from "./components/PageTurner";
import { getPortfolioPages } from "./components/PortfolioPages";
import { getPageImages, savePageImage, clearAllPageImages } from "./utils/db";
import { CustomCursor } from "./components/CustomCursor";
import { 
  UploadCloud, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  FileImage,
  Layers
} from "lucide-react";

// @ts-ignore
import beachBg from "./assets/images/beach_background_user_1782290971820.jpg";
// @ts-ignore
import logoImg from "./assets/images/regenerated_image_1782292462774.png";

// @ts-ignore
import p1 from "./assets/images/1.jpg";
// @ts-ignore
import p2 from "./assets/images/2.jpg";
// @ts-ignore
import p3 from "./assets/images/3.jpg";
// @ts-ignore
import p4 from "./assets/images/4.jpg";
// @ts-ignore
import p5 from "./assets/images/5.jpg";
// @ts-ignore
import p6 from "./assets/images/6.jpg";
// @ts-ignore
import p7 from "./assets/images/7.jpg";
// @ts-ignore
import p8 from "./assets/images/8.jpg";
// @ts-ignore
import p9 from "./assets/images/9.jpg";
// @ts-ignore
import p10 from "./assets/images/10.jpg";
// @ts-ignore
import p11 from "./assets/images/11.jpg";
// @ts-ignore
import p12 from "./assets/images/12.jpg";
// @ts-ignore
import p13 from "./assets/images/13.jpg";
// @ts-ignore
import p14 from "./assets/images/14.jpg";
// @ts-ignore
import p15 from "./assets/images/15.jpg";
// @ts-ignore
import p16 from "./assets/images/16.jpg";
// @ts-ignore
import p17 from "./assets/images/17.jpg";
// @ts-ignore
import p18 from "./assets/images/18.jpg";

const defaultImages: Record<number, string> = {
  1: p1,
  2: p2,
  3: p3,
  4: p4,
  5: p5,
  6: p6,
  7: p7,
  8: p8,
  9: p9,
  10: p10,
  11: p11,
  12: p12,
  13: p13,
  14: p14,
  15: p15,
  16: p16,
  17: p17,
  18: p18,
};

export default function App() {
  const [images, setImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved images from IndexedDB and fallback to statically imported assets on startup
  useEffect(() => {
    const loadImages = async () => {
      try {
        const dbImages = await getPageImages();
        const mergedImages = { ...dbImages };

        // Fallback to our high-quality generated default static images (production-safe)
        for (let i = 1; i <= 18; i++) {
          if (!mergedImages[i]) {
            mergedImages[i] = defaultImages[i];
          }
        }

        setImages(mergedImages);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Show a disappearing message notification
  const notify = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Upload an image for a specific page
  const handleUploadPage = async (id: number, dataUrl: string) => {
    const updated = { ...images, [id]: dataUrl };
    setImages(updated);
    await savePageImage(id, dataUrl);
    notify(`第 ${id} 页已成功上传！`);
  };

  // Batch upload multiple pages at once
  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files) as File[];
    const imageFiles = filesArray.filter(file => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      alert("请选择图片文件 (JPG / PNG)！");
      return;
    }

    // Helper to extract a number (1 to 18) from filename
    const getPageNumber = (filename: string, index: number, total: number): number => {
      // Find matches for numbers in the filename
      const match = filename.match(/\b(0?[1-9]|1[0-8])\b/);
      if (match) {
        return parseInt(match[1], 10);
      }
      
      const matchAnyNumber = filename.match(/(\d+)/);
      if (matchAnyNumber) {
        const num = parseInt(matchAnyNumber[1], 10);
        if (num >= 1 && num <= 18) return num;
      }

      // Fallback: If 18 files were uploaded, map them alphabetically by name
      if (total === 18) {
        return index + 1;
      }
      return -1;
    };

    // Sort files alphabetically to ensure consistent fallback mapping
    const sortedFiles = [...imageFiles].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    let successCount = 0;
    let failCount = 0;

    const newImages = { ...images };

    sortedFiles.forEach((file, index) => {
      const pageNum = getPageNumber(file.name, index, sortedFiles.length);
      
      if (pageNum >= 1 && pageNum <= 18) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result && typeof event.target.result === "string") {
            const dataUrl = event.target.result;
            newImages[pageNum] = dataUrl;
            setImages({ ...newImages });
            await savePageImage(pageNum, dataUrl);
          }
        };
        reader.readAsDataURL(file);
        successCount++;
      } else {
        failCount++;
      }
    });

    setTimeout(() => {
      if (successCount > 0) {
        notify(`成功导入 ${successCount} 张图片！`);
      }
      if (failCount > 0) {
        alert(`${failCount} 张图片未能匹配到页码 (1-18)，请确认文件名中包含数字。`);
      }
    }, 500);
  };

  // Clear all uploaded images
  const handleClearAlbum = async () => {
    if (confirm("确定要恢复画册为默认海洋主题图片吗？此操作会清除您手动上传的图片缓存。")) {
      setImages({ ...defaultImages });
      await clearAllPageImages();
      notify("已重置为默认海洋主题图片！");
    }
  };

  const triggerBatchUpload = () => {
    fileInputRef.current?.click();
  };

  const activePagesCount = Object.keys(images).length;
  const portfolioPages = getPortfolioPages(images, handleUploadPage);

  return (
    <div className="w-screen h-screen overflow-hidden relative flex flex-col items-center justify-center bg-slate-100">
      
      {/* Non-functional transparent background white text box in the top-left corner */}
      <div 
        id="sia-corner-badge"
        className="absolute top-4 left-4 md:top-6 md:left-6 z-20 px-4 py-2 bg-transparent text-white font-medium text-base tracking-widest select-none pointer-events-none"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        Sia Wan
      </div>

      {/* Interactive transparent background white text box in the top-right corner to turn to last page */}
      <button 
        id="contact-corner-badge"
        onClick={() => setCurrentIndex(portfolioPages.length - 1)}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 px-4 py-2 bg-transparent text-white hover:text-white/80 active:scale-95 transition-all font-medium text-base tracking-widest select-none cursor-pointer"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        Contact
      </button>

      {/* Immersive Beach Background Flat-lay */}
      <div 
        id="app-beach-background"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 select-none pointer-events-none scale-102 filter brightness-[0.97]"
        style={{ backgroundImage: `url(${beachBg})` }}
      />
      
      {/* Soft Beach Shadows Overlay for Depth */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-900/10 to-slate-900/20 pointer-events-none select-none z-1"></div>

      {/* Logo in the center top */}
      <div className="relative z-20 mb-2 flex justify-center items-center group cursor-pointer">
        <img 
          src={logoImg} 
          alt="Portfolio Logo" 
          className="h-16 md:h-20 lg:h-24 w-auto object-contain select-none pointer-events-none mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Main Container centering the 3D Book */}
      <main className="w-[92vw] max-w-5xl aspect-video max-h-[82vh] relative z-10 flex flex-col items-center justify-center mt-6">
        {loading ? (
          <div className="bg-white/80 backdrop-blur-md px-8 py-5 rounded-3xl border border-sky-100 shadow-2xl flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-slate-700 font-mono">Initializing Portfolio Database...</span>
          </div>
        ) : (
          <PageTurner pages={portfolioPages} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
        )}
      </main>

      {/* Floating Help Information Sidebar */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-sky-100 shadow-2xl space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">画册图片导入指引</h3>
                <p className="text-[10px] text-slate-400 font-mono">Sia Portfolio Help Manual</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-3.5 leading-relaxed">
              <p className="font-medium text-slate-700">
                本网页支持完美、直接地展示您的画册第 1 至 18 页 JPG 内容，您可以通过以下两种简单方式导入：
              </p>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 font-bold text-[10px] flex items-center justify-center shrink-0">1</div>
                  <div>
                    <span className="font-bold text-slate-800">在线批量导入 (极速 & 推荐)：</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      点击右上角的 <span className="font-semibold text-sky-500">“批量导入 1-18 页”</span>，一次性框选您的 18 张图片。系统会根据文件名自动进行数字排序填入 1-18 页，并在浏览器本地（IndexedDB）永久储存，无需重复操作。
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 font-bold text-[10px] flex items-center justify-center shrink-0">2</div>
                  <div>
                    <span className="font-bold text-slate-800">逐页拖入/选择：</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      您也可以在画册翻页时，对未上传的空白页面进行直接拖放 (Drag & Drop) 或点击页面中间选择本地图片，独立完成某一页的更新。
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 font-bold text-[10px] flex items-center justify-center shrink-0">3</div>
                  <div>
                    <span className="font-bold text-slate-800">代码静态编译：</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      若要打包发给他人，也可直接将 18 张 JPG 图片放入代码文件夹 <span className="font-mono text-amber-600">/src/assets/images/</span> 内，命名为 <span className="font-mono text-amber-600">1.jpg</span> 至 <span className="font-mono text-amber-600">18.jpg</span>。系统会自动感知并直接加载展示。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
            >
              我知道了，开始使用
            </button>
          </div>
        </div>
      )}

      {/* Floating Notifications toast */}
      {showNotification && (
        <div className="absolute bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white border border-slate-800 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          <span className="text-xs font-medium">{showNotification}</span>
        </div>
      )}

      {/* Interactive Custom Starfish Cursor */}
      <CustomCursor />

    </div>
  );
}

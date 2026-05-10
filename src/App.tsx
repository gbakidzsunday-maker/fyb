import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Upload, 
  RefreshCcw, 
  Check,
  AlertCircle,
  Pencil
} from 'lucide-react';
import html2canvas from 'html2canvas';

import { TemplateA } from './components/TemplateA';
import { TemplateB } from './components/TemplateB';
import { PhotoEditor } from './components/PhotoEditor';
import { FormData, TemplateId } from './types';
import { INITIAL_FORM_DATA } from './constants';

export default function App() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<TemplateId>('A');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPosition, setPhotoPosition] = useState({ x: 0, y: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('finalist_generator_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || INITIAL_FORM_DATA);
        setTemplate(parsed.template || 'A');
        if (parsed.photoUrl) setPhotoUrl(parsed.photoUrl);
        if (parsed.photoZoom) setPhotoZoom(parsed.photoZoom);
        if (parsed.photoPosition) setPhotoPosition(parsed.photoPosition);
      } catch (e) {
        console.error('Failed to load session');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const session = {
      formData,
      template,
      photoUrl,
      photoZoom,
      photoPosition
    };
    localStorage.setItem('finalist_generator_session', JSON.stringify(session));
  }, [formData, template, photoUrl, photoZoom, photoPosition]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Photo size too large (max 10MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
        setPhotoZoom(1);
        setPhotoPosition({ x: 0, y: 0 });
        setIsEditingPhoto(true);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (s: number) => {
    if (s === 1 && !template) {
      setError('Please select a template');
      return false;
    }
    if (s === 2 && !photoUrl) {
      setError('Please upload a student photo');
      return false;
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const generateAndDownload = async () => {
    if (!captureRef.current) return;
    setIsGenerating(true);
    try {
      // Ensure all images are loaded
      const images = Array.from(captureRef.current.getElementsByTagName('img')) as HTMLImageElement[];
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // Wait for fonts
      await document.fonts.ready;
      
      // Delay to ensure rendering
      await new Promise(r => setTimeout(r, 1000));
      
      const canvas = await html2canvas(captureRef.current, {
        scale: 3, // High quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#042f1a',
        width: 1080,
        height: 1920,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('capture-area') as HTMLElement;
          if (el) {
            el.style.transform = 'none';
            el.style.position = 'static';
            el.style.width = '1080px';
            el.style.height = '1920px';
          }
        }
      });

      const link = document.createElement('a');
      link.download = `${formData.surname}_Finalist.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error(err);
      setError('Export failed. Please check your internet connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen bg-[#020d08] text-white flex flex-col font-sans overflow-hidden">
      {/* GLOBAL HEADER */}
      <header className="h-20 border-b border-white/5 bg-[#042f1a]/80 backdrop-blur-xl flex items-center justify-between px-10 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex -space-x-4">
             <div className="w-12 h-12 rounded-full bg-white p-1 shadow-xl border-2 border-emerald-500/30 overflow-hidden">
               <img src="https://github.com/perfectgbakidz/hostingimage/blob/main/NACOSMM.png?raw=true" alt="NACOS" className="w-full h-full object-contain" />
             </div>
             <div className="w-12 h-12 rounded-full bg-white p-1 shadow-xl border-2 border-emerald-500/30 overflow-hidden">
               <img src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/download%20(3).png" alt="MAPOLY" className="w-full h-full object-contain" />
             </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
              Finalist <span className="text-emerald-500">Generator</span>
            </h1>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[4px] mt-1 italic">
              Dan Sugar LED Administration
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
           <StepDot active={step >= 1} current={step === 1} label="Draft" />
           <div className="w-12 h-[2px] bg-white/5" />
           <StepDot active={step >= 2} current={step === 2} label="Profile" />
           <div className="w-12 h-[2px] bg-white/5" />
           <StepDot active={step >= 3} current={step === 3} label="Export" />
        </div>

        <button onClick={() => setStep(1)} className="p-3 rounded-full hover:bg-white/5 transition-colors">
          <RefreshCcw size={20} className="text-emerald-500" />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
         
         {/* LEFT SIDE: CONTROLS */}
         <aside className="w-full md:w-[450px] border-r border-white/5 bg-[#042f1a]/50 flex flex-col shrink-0 overflow-y-auto scroll-hide">
            <div className="p-8 space-y-10">
               <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-12"
                    >
                      <SectionTitle number="01" title="Choose Template" />
                      <div className="grid grid-cols-2 gap-6">
                         <TemplateCard 
                           active={template === 'A'} 
                           onClick={() => setTemplate('A')} 
                           label="Modern Glow" 
                           desc="Vibrant & Bold"
                         />
                         <TemplateCard 
                           active={template === 'B'} 
                           onClick={() => setTemplate('B')} 
                           label="Premium Editorial" 
                           desc="Elegant & Minimal"
                         />
                      </div>

                      <SectionTitle number="02" title="Student Photo" />
                      {!photoUrl ? (
                         <div 
                           onClick={() => document.getElementById('photo-input')?.click()}
                           className="w-full aspect-[4/3] border-2 border-dashed border-white/10 rounded-[30px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-all p-10 text-center"
                         >
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                               <Camera size={32} />
                            </div>
                            <div>
                               <p className="font-bold text-white mb-1">Upload Portrait Photo</p>
                               <p className="text-xs text-white/40">High quality JPEG or PNG</p>
                            </div>
                            <input id="photo-input" type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                         </div>
                      ) : (
                         <div className="space-y-4">
                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                               <img src={photoUrl} className="w-full h-full object-cover" alt="Profile" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                  <button onClick={() => setIsEditingPhoto(true)} className="p-3 bg-white text-black rounded-full shadow-xl">
                                     <Pencil size={20} />
                                  </button>
                                  <button onClick={() => setPhotoUrl(null)} className="p-3 bg-red-500 text-white rounded-full shadow-xl">
                                     <RefreshCcw size={20} />
                                  </button>
                               </div>
                            </div>
                            <p className="text-[10px] text-white/40 uppercase tracking-[2px] text-center">Photo attached successfully</p>
                         </div>
                      )}

                      <button 
                        onClick={nextStep}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-5 rounded-[20px] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20"
                      >
                         CONTINUE TO PROFILE <ChevronRight size={20} />
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-4 mb-2">
                         <button onClick={prevStep} className="p-2 rounded-full hover:bg-white/5">
                            <ChevronLeft size={24} />
                         </button>
                         <SectionTitle number="03" title="Profile Information" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <FormInput label="Surname" value={formData.surname} onChange={(v: string) => handleInputChange('surname', v)} placeholder="e.g. ADEOLA" />
                         <FormInput label="First Name" value={formData.firstName} onChange={(v: string) => handleInputChange('firstName', v)} placeholder="e.g. Sunday" />
                      </div>
                      
                      <div className="space-y-6">
                        <FormInput label="Nickname" value={formData.nickname} onChange={(v: string) => handleInputChange('nickname', v)} />
                        <FormInput label="State of Origin" value={formData.stateOfOrigin} onChange={(v: string) => handleInputChange('stateOfOrigin', v)} />
                        <FormInput label="Relationship" type="select" options={['Single', 'In a relationship', 'Taken', 'Focused']} value={formData.relationshipStatus} onChange={(v: string) => handleInputChange('relationshipStatus', v)} />
                        <FormInput label="Social Media Handle" value={formData.socialMediaHandle} onChange={(v: string) => handleInputChange('socialMediaHandle', v)} placeholder="@username" />
                        <FormInput label="Institution Name" value={formData.institutionName} onChange={(v: string) => handleInputChange('institutionName', v)} />
                        <FormInput label="Specialization" type="select" options={['Software Developer', 'Network Engineer', 'Data Scientist', 'General']} value={formData.specialization} onChange={(v: string) => handleInputChange('specialization', v)} />
                        <FormInput label="What next after school?" value={formData.whatNextAfterSchool} onChange={(v: string) => handleInputChange('whatNextAfterSchool', v)} />
                        <FormInput label="Favorite Quote" value={formData.favoriteQuote} onChange={(v: string) => handleInputChange('favoriteQuote', v)} type="textarea" />
                      </div>

                      <button 
                        onClick={nextStep}
                        className="w-full bg-white text-emerald-900 font-black py-5 rounded-[20px] transition-all flex items-center justify-center gap-3 shadow-2xl"
                      >
                         FINALIZE & PREVIEW <ChevronRight size={20} />
                      </button>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-12"
                    >
                      <div className="flex items-center gap-4">
                         <button onClick={prevStep} className="p-2 rounded-full hover:bg-white/5">
                            <ChevronLeft size={24} />
                         </button>
                         <SectionTitle number="04" title="Export Design" />
                      </div>

                      <div className="p-8 rounded-[30px] bg-white/5 border border-white/10 space-y-4">
                         <div className="flex justify-between items-center text-xs text-white/40 font-bold uppercase tracking-widest">
                            <span>Resolution</span>
                            <span className="text-emerald-500">HD Ultra (3240x5760 px)</span>
                         </div>
                         <div className="flex justify-between items-center text-xs text-white/40 font-bold uppercase tracking-widest">
                            <span>Template</span>
                            <span className="text-white">{template === 'A' ? 'Modern Glow' : 'Editorial Premium'}</span>
                         </div>
                         <p className="text-xs text-white/30 pt-4 leading-relaxed italic border-t border-white/5">
                           Please wait for a few seconds during export as we render your design at maximum quality.
                         </p>
                      </div>

                      <button 
                        onClick={generateAndDownload}
                        disabled={isGenerating}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-8 rounded-[30px] transition-all flex flex-col items-center justify-center gap-2 shadow-2xl shadow-emerald-500/30 grow"
                      >
                         {isGenerating ? (
                           <>
                             <RefreshCcw size={32} className="animate-spin mb-2" />
                             <span className="text-xl uppercase tracking-widest">Generating Image...</span>
                           </>
                         ) : (
                           <>
                              <Download size={32} className="mb-2" />
                              <span className="text-2xl uppercase tracking-tighter">Download PNG</span>
                              <span className="text-[10px] font-bold opacity-50 tracking-[4px]">Ready for Print & Web</span>
                           </>
                         )}
                      </button>
                      
                      <button onClick={prevStep} className="w-full text-white/30 font-bold text-xs uppercase tracking-[5px] hover:text-white transition-colors">
                         Back to Edit
                      </button>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </aside>

         {/* RIGHT SIDE: PREVIEW */}
         <section className="flex-1 relative overflow-hidden flex items-center justify-center p-8 lg:p-12">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[#020d08]" />
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, #0f7b3e 1px, transparent 0)', 
                backgroundSize: '40px 40px' 
              }} 
            />

            <div className="relative w-full h-full flex items-center justify-center">
               <motion.div 
                 className="relative z-10"
                 animate={{ scale: step === 3 ? 0.38 : 0.30 }}
                 transition={{ type: "spring", stiffness: 100, damping: 20 }}
               >
                  <div className="bg-[#042f1a] border-[16px] border-white/5 rounded-[80px] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] overflow-hidden scale-container">
                     <div ref={captureRef} id="capture-area">
                        {template === 'A' ? (
                          <TemplateA data={formData} photoUrl={photoUrl} photoZoom={photoZoom} photoPosition={photoPosition} />
                        ) : (
                          <TemplateB data={formData} photoUrl={photoUrl} photoZoom={photoZoom} photoPosition={photoPosition} />
                        )}
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* Float Labels */}
            <div className="absolute bottom-10 right-10 flex items-center gap-4 pointer-events-none">
               <div className="px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[4px] text-white/40">
                  {template === 'A' ? 'Modern Glow' : 'Editorial'} Template
               </div>
               <div className="px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[4px] text-white/40">
                  1080 x 1920 PX
               </div>
            </div>
         </section>
      </main>

      {/* PHOTO EDITOR OVERLAY */}
      <AnimatePresence>
        {isEditingPhoto && photoUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-10"
          >
            <div className="w-full max-w-4xl bg-[#042f1a] rounded-[60px] p-12 border border-white/10 shadow-3xl">
              <div className="mb-12 flex justify-between items-center">
                 <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Position Student Photo</h2>
                    <p className="text-white/40 text-sm mt-2 uppercase tracking-widest font-bold">Zoom and Drag to fit the frame</p>
                 </div>
                 <button onClick={() => setIsEditingPhoto(false)} className="bg-emerald-500 text-black font-black px-10 py-4 rounded-full uppercase text-sm shadow-xl">
                    Save Changes
                 </button>
              </div>

              <div className="h-[500px]">
                <PhotoEditor 
                  photoUrl={photoUrl}
                  photoZoom={photoZoom}
                  setPhotoZoom={setPhotoZoom}
                  photoPosition={photoPosition}
                  setPhotoPosition={setPhotoPosition}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR TOAST */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[2000] bg-red-500 text-white px-10 py-5 rounded-full shadow-3xl flex items-center gap-4"
          >
            <AlertCircle size={24} />
            <span className="font-bold uppercase tracking-widest text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-4 opacity-50 hover:opacity-100">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function StepDot({ active, current, label }: { active: boolean; current: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-3 transition-opacity ${active ? 'opacity-100' : 'opacity-20'}`}>
       <div className={`w-3 h-3 rounded-full ${current ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : active ? 'bg-emerald-500/50' : 'bg-white/20'}`} />
       <span className="text-[10px] font-black uppercase tracking-[3px]">{label}</span>
    </div>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
       <span className="text-emerald-500 font-black text-xl italic">{number}</span>
       <h3 className="text-xl font-black uppercase tracking-tighter">{title}</h3>
    </div>
  );
}

function TemplateCard({ active, onClick, label, desc }: { active: boolean; onClick: () => void; label: string; desc: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative group w-full aspect-[4/3] rounded-[30px] border-2 transition-all p-6 text-left flex flex-col justify-end gap-1 ${
        active ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'
      }`}
    >
       <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? 'border-emerald-500 bg-emerald-500' : 'border-white/10'}`}>
         {active && <Check size={14} className="text-black" />}
       </div>
       <p className={`font-black uppercase tracking-tighter text-lg leading-none ${active ? 'text-white' : 'text-white/40'}`}>{label}</p>
       <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">{desc}</p>
    </button>
  );
}

function FormInput({ label, value, onChange, type = 'text', placeholder, options }: any) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px] ml-1">{label}</label>
      {type === 'select' ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-emerald-500 transition-all appearance-none cursor-pointer"
          >
            {options.map((opt: string) => <option key={opt} value={opt} className="bg-[#042f1a]">{opt}</option>)}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
             <ChevronRight size={16} className="rotate-90" />
          </div>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-semibold text-white focus:border-emerald-500 transition-all resize-none h-[120px]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-emerald-500 transition-all"
        />
      )}
    </div>
  );
}

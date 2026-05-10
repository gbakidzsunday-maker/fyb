import React from 'react';
import { TemplateProps } from '../types';

export const TemplateB: React.FC<TemplateProps> = ({ data, photoUrl, photoZoom, photoPosition }) => {
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-4 border-b border-[rgba(255,255,255,0.1)] w-full">
      <span className="text-[#ffd700] uppercase text-[12px] font-black tracking-widest w-[40%] text-left opacity-80">{label}</span>
      <span className="text-white text-[18px] font-bold w-[60%] text-right truncate">
        {value || '---'}
      </span>
    </div>
  );

  return (
    <div 
      id="template-b"
      className="relative w-[1080px] h-[1920px] flex flex-col font-sans overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #021a11 0%, #064e3b 50%, #0f7b3e 100%)',
      }}
    >
      {/* 1. Artistic Overlays */}
      <div className="absolute inset-x-0 top-0 h-[800px] bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none border-[30px] border-[rgba(255,255,255,0.03)] z-50 pointer-events-none" />

      {/* 2. Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] z-0">
        <img 
          src="https://github.com/perfectgbakidz/hostingimage/blob/main/NACOSMM.png?raw=true" 
          alt="NACOS" 
          className="w-[1500px] h-auto object-contain blur-[8px]"
          crossOrigin="anonymous"
        />
      </div>

      {/* 3. Main Layout Container */}
      <div className="relative z-20 flex-1 flex flex-col p-20">
        
        {/* TOP SECTION: LOGOS AND TITLES */}
        <header className="flex flex-col items-center mb-20 text-center">
            <div className="flex gap-10 mb-8">
                <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center border-4 border-white overflow-hidden shadow-2xl">
                  <img crossOrigin="anonymous" src="https://github.com/perfectgbakidz/hostingimage/blob/main/NACOSMM.png?raw=true" alt="NACOS" className="max-w-[70%] max-h-[70%] object-contain" />
                </div>
                <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center border-4 border-white overflow-hidden shadow-2xl">
                  <img crossOrigin="anonymous" src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/download%20(3).png" alt="MAPOLY" className="max-w-[70%] max-h-[70%] object-contain" />
                </div>
            </div>
            
            <h1 className="text-white text-[72px] font-black uppercase leading-none tracking-tighter" style={{ textShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
              THE FINALIST
            </h1>
            <div className="mt-4 flex items-center gap-4">
               <div className="h-[2px] w-12 bg-[#ffd700]" />
               <span className="text-[#ffd700] text-3xl font-black italic tracking-[10px] uppercase">CLASS OF {data.year || '2026'}</span>
               <div className="h-[2px] w-12 bg-[#ffd700]" />
            </div>
            
            <p className="text-white text-[20px] font-bold uppercase tracking-[6px] mt-8 opacity-70">
              {data.institutionName || 'Moshood Abiola Polytechnic'}
            </p>
        </header>

        {/* MIDDLE SECTION: TWO COLUMNS */}
        <div className="grid grid-cols-2 gap-20 grow items-center">
          
          {/* Left Column: Personality & Background */}
          <div className="flex flex-col">
            <div 
              className="relative aspect-[3/4] rounded-tr-[80px] rounded-bl-[80px] overflow-hidden border-[8px] border-white/10 group"
              style={{ boxShadow: '30px 30px 80px rgba(0,0,0,0.5)' }}
            >
              {photoUrl ? (
                <img
                  crossOrigin="anonymous"
                  src={photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  style={{ transform: `scale(${photoZoom}) translate(${photoPosition.x}px, ${photoPosition.y}px)` }}
                />
              ) : (
                <div className="w-full h-full bg-[#042f1a] flex items-center justify-center text-white/10 text-6xl font-black">PHOTO</div>
              )}
              
              {/* Overlay Label */}
              <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <span className="text-[#ffd700] text-xl font-black uppercase tracking-widest">{data.nickname || 'Finalist'}</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col">
               <span className="font-outfit text-white text-[100px] font-black uppercase leading-[0.8] tracking-tighter" style={{ textShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
                 {data.surname || 'SURNAME'}
               </span>
               <span className="font-serif text-[#ffd700] italic text-[64px] leading-none mt-2 opacity-90 pl-2">
                 {data.firstName || 'FirstName'}
               </span>
            </div>
          </div>

          {/* Right Column: Key Details */}
          <div className="flex flex-col bg-white/5 backdrop-blur-lg p-12 rounded-[40px] border border-white/10 shadow-2xl">
            <Row label="NICKNAME" value={data.nickname} />
            <Row label="ORIGIN" value={data.stateOfOrigin} />
            <Row label="STATUS" value={data.relationshipStatus} />
            <Row label="FAV COURSE" value={data.favoriteCourse} />
            <Row label="BEST LEVEL" value={data.bestLevel} />
            <Row label="CHALLENGE" value={data.mostChallengingCourse} />
            <Row label="BEST BUDDY" value={data.bestClassBuddy} />
            <Row label="WHAT NEXT" value={data.whatNextAfterSchool} />
            
            <div className="mt-12 flex flex-col gap-4">
               <span className="text-[#ffd700] text-sm font-black uppercase tracking-widest">BEST MOMENT</span>
               <p className="text-white text-xl font-medium leading-relaxed italic opacity-80">
                 "{data.bestMemorableMoment || 'The journey was everything...'}"
               </p>
            </div>
            
            <div className="mt-auto pt-12 flex justify-end">
               <div className="flex items-center gap-4 text-white">
                  <span className="text-2xl font-black tracking-widest">@{data.socialMediaHandle || 'HANDLE'}</span>
               </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 flex justify-between items-end border-t border-white/10 pt-10">
           <div className="flex flex-col gap-1">
             <p className="text-white text-[16px] font-black uppercase tracking-[4px]">OFFICE OF THE SOCIAL DIRECTOR</p>
             <p className="text-[#ffd700] text-[14px] font-bold uppercase tracking-[2px]">{data.associationName || 'NACOS'} {data.chapter || 'MAPOLY'}</p>
           </div>
           
           <div className="text-right flex flex-col items-end">
              <span className="font-serif italic text-white text-[48px] leading-tight">Meet the Finalist</span>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Digital Yearbook Experience</p>
           </div>
        </footer>
      </div>
    </div>
  );
};

import React from 'react';
import { TemplateProps } from '../types';

export const TemplateA: React.FC<TemplateProps> = ({ data, photoUrl, photoZoom, photoPosition }) => {
  // Common Info Card Component
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div 
      className="flex flex-col p-5 rounded-2xl h-full"
      style={{ 
        background: 'rgba(2, 44, 24, 0.6)', 
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
      }}
    >
      <span className="text-[#ffd700] text-[12px] font-black uppercase tracking-[2px] opacity-80 mb-2">
        {label}
      </span>
      <span className="text-white text-[16px] font-bold leading-tight break-words">
        {value || '---'}
      </span>
    </div>
  );

  return (
    <div 
      id="template-a"
      className="relative w-[1080px] h-[1920px] flex flex-col font-sans overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #042f1a 0%, #064e3b 50%, #042f1a 100%)',
      }}
    >
      {/* 1. Deep Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_600px_rgba(0,0,0,0.8)] z-10" />

      {/* 2. Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <img 
          src="https://github.com/perfectgbakidz/hostingimage/blob/main/NACOSMM.png?raw=true" 
          alt="Watermark" 
          className="w-[120%] h-auto blur-[4px] grayscale brightness-200"
          crossOrigin="anonymous"
        />
      </div>

      {/* 3. Content Container (Using Flex/Grid) */}
      <div className="relative z-20 flex-1 flex flex-col px-12 py-16">
        
        {/* HEADER SECTION */}
        <header className="flex justify-between items-start mb-16">
          <div className="flex gap-5">
            <div className="w-[100px] h-[100px] rounded-full bg-white p-2 border-4 border-white overflow-hidden shadow-2xl flex items-center justify-center">
              <img 
                src="https://github.com/perfectgbakidz/hostingimage/blob/main/NACOSMM.png?raw=true" 
                alt="NACOS" 
                className="max-w-full max-h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div className="w-[100px] h-[100px] rounded-full bg-white p-2 border-4 border-white overflow-hidden shadow-2xl flex items-center justify-center">
              <img 
                src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/download%20(3).png" 
                alt="MAPOLY" 
                className="max-w-full max-h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
          </div>
          
          <div className="text-right flex flex-col gap-2">
            <h1 className="text-white text-[72px] font-black leading-none tracking-tighter" style={{ textShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
              MEET THE<br />FINALIST
            </h1>
            <div className="bg-[#cc0000] py-2 px-6 rounded-lg self-end mt-2 shadow-lg">
              <span className="text-white text-2xl font-black italic tracking-[2px]">CLASS OF {data.year || '2026'}</span>
            </div>
          </div>
        </header>

        {/* TOP META INFO */}
        <div className="mb-12 flex flex-col gap-2">
           <p className="text-white text-[16px] font-bold uppercase tracking-[4px] opacity-70">
             {data.institutionName || 'Moshood Abiola Polytechnic'}
           </p>
           <p className="text-[#ffd700] text-[20px] font-black uppercase tracking-[2px]">
             {data.associationName || 'National Association of Computer Science Students'}
           </p>
        </div>

        {/* MIDDLE SECTION: PROFILE & CORE DATA */}
        <section className="grid grid-cols-12 gap-10 items-center grow mb-16">
          {/* Photo & Identity (Centered or Balanced) */}
          <div className="col-span-7 flex flex-col items-center">
            <div 
              className="w-full aspect-[4/5] rounded-[40px] overflow-hidden border-[6px] border-[rgba(255,255,255,0.2)] relative"
              style={{ 
                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8), 0 0 50px rgba(15, 123, 62, 0.4)'
              }}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Finalist"
                  className="w-full h-full object-cover origin-center"
                  style={{ transform: `scale(${photoZoom}) translate(${photoPosition.x}px, ${photoPosition.y}px)` }}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full bg-[#021a11] flex items-center justify-center text-[rgba(255,255,255,0.1)] text-6xl font-black uppercase">
                  Photo
                </div>
              )}
            </div>
          </div>

          {/* Core Info beside photo */}
          <div className="col-span-5 flex flex-col gap-6">
            <div className="flex flex-col">
              <span className="text-[#ffd700] text-[18px] font-black uppercase tracking-[4px] mb-2">Surname</span>
              <h2 className="text-white text-[72px] font-black leading-none truncate break-all" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.4)' }}>
                {data.surname || 'SURNAME'}
              </h2>
            </div>
            <div className="flex flex-col">
              <span className="text-[#ffd700] text-[18px] font-black uppercase tracking-[4px] mb-2">First Name</span>
              <h3 className="text-white text-[48px] font-bold leading-tight truncate">
                {data.firstName || 'First Name'}
              </h3>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex flex-col">
                <span className="text-white text-[12px] font-bold uppercase tracking-widest opacity-60">Nickname</span>
                <span className="text-[#ffd700] text-2xl font-black">{data.nickname || '---'}</span>
              </div>
              <div className="flex flex-col border-l border-[rgba(255,255,255,0.2)] pl-4">
                <span className="text-white text-[12px] font-bold uppercase tracking-widest opacity-60">D.O.B</span>
                <span className="text-white text-2xl font-black">{data.dateOfBirth || '---'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* LOWER SECTION: GRID INFO CARDS */}
        <section className="grid grid-cols-3 gap-6 auto-rows-[140px]">
          <InfoItem label="Skills & Hobbies" value={data.skillsAndHobbies} />
          <InfoItem label="State of Origin" value={data.stateOfOrigin} />
          <InfoItem label="Relationship Status" value={data.relationshipStatus} />
          <InfoItem label="Favorite Course" value={data.favoriteCourse} />
          <InfoItem label="Best Level" value={data.bestLevel} />
          <InfoItem label="Most Challenging Course" value={data.mostChallengingCourse} />
          <InfoItem label="Most Challenging Level" value={data.mostChallengingLevel} />
          <InfoItem label="Memorable Moment" value={data.bestMemorableMoment} />
          <InfoItem label="Advice for Freshers" value={data.adviceForFreshers} />
        </section>

        {/* FOOTER AREA */}
        <footer className="mt-auto pt-16 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[#ffd700] text-[12px] font-black uppercase tracking-[4px] mb-2opacity-80">Social Handle</span>
            <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] px-5 py-2 rounded-full border border-[rgba(255,255,255,0.1)]">
              <span className="text-white italic text-xl">@</span>
              <span className="text-white text-2xl font-black tracking-wider uppercase">{data.socialMediaHandle || 'handle'}</span>
            </div>
          </div>
          
          <div className="text-right">
             <p className="text-white text-[24px] font-black uppercase tracking-[4px]">
               {data.associationName || 'NACOS'} {data.chapter || 'MAPOLY'} CHAPTER
             </p>
             <p className="text-[rgba(255,255,255,0.5)] text-[14px] font-bold uppercase tracking-[2px] mt-1">
               OFFICE OF THE SOCIAL DIRECTOR
             </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

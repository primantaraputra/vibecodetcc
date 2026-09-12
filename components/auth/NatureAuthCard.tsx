'use client';

import React from 'react';
import { NatureFoliageHeader, BotanicalSproutLogo } from './NatureLeaves';

interface NatureAuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function NatureAuthCard({
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
}: NatureAuthCardProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 md:p-8 bg-gradient-to-br from-emerald-50/60 via-[#f8faf8] to-teal-50/40 relative overflow-hidden">
      {/* Background Decorative Ambient Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

      {/* Main Elevated Card - Fully Responsive for Mobile & Desktop */}
      <div
        className={`w-full ${maxWidth} bg-white rounded-3xl shadow-xl shadow-emerald-950/5 border border-emerald-100/80 relative overflow-hidden transition-all duration-300 z-10`}
      >
        {/* Top Organic Leaf Foliage */}
        <NatureFoliageHeader />

        {/* Card Content */}
        <div className="relative z-10 px-6 sm:px-9 pt-10 sm:pt-12 pb-7 sm:pb-9 space-y-6">
          {/* Sprout Logo & Header */}
          <div className="flex flex-col items-center text-center space-y-2 pt-2">
            <div className="p-2 rounded-2xl bg-white/80 shadow-xs border border-emerald-100/60 flex items-center justify-center mb-1">
              <BotanicalSproutLogo className="w-10 h-10 sm:w-11 sm:h-11" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] tracking-tight">
              {title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Form & Children Content */}
          <div className="pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

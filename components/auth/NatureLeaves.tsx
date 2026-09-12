'use client';

import React from 'react';

/**
 * Botanical Sprout Emblem Logo
 * Inspired by the 3-leaf sprout icon in the design
 */
export function BotanicalSproutLogo({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central Stem */}
      <path
        d="M24 38V22"
        stroke="#10b981"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Center Leaf (Upright) */}
      <path
        d="M24 10C24 10 20 15 20 20C20 22.2 21.8 24 24 24C26.2 24 28 22.2 28 20C28 15 24 10 24 10Z"
        fill="#10b981"
      />
      {/* Left Leaf (Angled 45 deg) */}
      <path
        d="M23 23C23 23 16 20 14 16C12 12 15 11 17 12C20 14 22 18 23 23Z"
        fill="#34d399"
      />
      {/* Right Leaf (Angled 45 deg) */}
      <path
        d="M25 23C25 23 32 20 34 16C36 12 33 11 31 12C28 14 26 18 25 23Z"
        fill="#059669"
      />
      {/* Base Little Sprout Bulbs */}
      <circle cx="24" cy="38" r="2.5" fill="#047857" />
    </svg>
  );
}

/**
 * Leafy Branch Foliage Illustration (Top-Left & Top-Right)
 * Translucent watercolor-style botanical leaves framing the card
 */
export function NatureFoliageHeader() {
  return (
    <div className="absolute inset-x-0 top-0 h-44 sm:h-52 overflow-hidden pointer-events-none z-0 rounded-t-3xl">
      {/* Subtle Pastel Nature Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/70 via-emerald-50/40 to-transparent" />

      {/* Top Left Leaf Cluster */}
      <svg
        className="absolute -top-4 -left-4 w-44 h-44 sm:w-56 sm:h-56 opacity-85"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="leafGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Branch 1 */}
        <path
          d="M-10 -10 C 30 30, 60 70, 95 105"
          stroke="#059669"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* Leaf 1 - Large Angled Down */}
        <path
          d="M30 40 C 20 80, 50 110, 75 95 C 90 85, 70 50, 30 40 Z"
          fill="url(#leafGrad1)"
        />
        {/* Leaf 2 - Hanging Downward */}
        <path
          d="M10 20 C -5 65, 20 90, 40 75 C 55 60, 40 30, 10 20 Z"
          fill="url(#leafGrad2)"
        />
        {/* Leaf 3 - Droplet Sprout */}
        <path
          d="M60 70 C 65 115, 100 120, 110 100 C 115 80, 90 65, 60 70 Z"
          fill="url(#leafGrad1)"
        />
        {/* Leaf 4 - Tip Leaf */}
        <path
          d="M95 105 C 110 140, 135 140, 140 125 C 145 105, 120 95, 95 105 Z"
          fill="url(#leafGrad3)"
        />
        {/* Leaf 5 - Small Accent Leaf */}
        <path
          d="M50 35 C 75 45, 90 30, 85 15 C 70 5, 55 20, 50 35 Z"
          fill="url(#leafGrad2)"
        />
      </svg>

      {/* Top Right Leaf Cluster */}
      <svg
        className="absolute -top-4 -right-4 w-44 h-44 sm:w-56 sm:h-56 opacity-85 scale-x-[-1]"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Branch 2 */}
        <path
          d="M-10 -10 C 30 30, 60 70, 95 105"
          stroke="#059669"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* Leaf 1 */}
        <path
          d="M30 40 C 20 80, 50 110, 75 95 C 90 85, 70 50, 30 40 Z"
          fill="url(#leafGrad1)"
        />
        {/* Leaf 2 */}
        <path
          d="M10 20 C -5 65, 20 90, 40 75 C 55 60, 40 30, 10 20 Z"
          fill="url(#leafGrad2)"
        />
        {/* Leaf 3 */}
        <path
          d="M60 70 C 65 115, 100 120, 110 100 C 115 80, 90 65, 60 70 Z"
          fill="url(#leafGrad1)"
        />
        {/* Leaf 4 */}
        <path
          d="M95 105 C 110 140, 135 140, 140 125 C 145 105, 120 95, 95 105 Z"
          fill="url(#leafGrad3)"
        />
      </svg>
    </div>
  );
}

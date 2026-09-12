'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [, startTransition] = useTransition();

  // Reset when path changes
  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on navigation links
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Only handle internal links without new tab
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        (!targetAttr || targetAttr === '_self') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // If clicking the current exact URL, ignore
        const currentUrl = window.location.pathname + window.location.search;
        if (href === currentUrl) return;

        setIsVisible(true);
        setProgress(25);

        startTransition(() => {
          setTimeout(() => setProgress(65), 100);
          setTimeout(() => setProgress(85), 250);
        });
      }
    };

    const handlePopState = () => {
      setIsVisible(true);
      setProgress(40);
      setTimeout(() => setProgress(80), 100);
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400 shadow-[0_0_10px_rgba(34,197,94,0.7)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
}

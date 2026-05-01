'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      gsap.to(follower, {
        x: clientX,
        y: clientY,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, follower], { scale: 0.8, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Hover effect for interactive elements
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(follower, { scale: 2.5, backgroundColor: 'rgba(15, 150, 156, 0.15)', border: '1px solid rgba(15, 150, 156, 0.5)', duration: 0.3 });
        gsap.to(cursor, { scale: 0.5, opacity: 0, duration: 0.3 });
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(follower, { scale: 1, backgroundColor: 'transparent', border: '1px solid rgba(15, 150, 156, 0.3)', duration: 0.3 });
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
      });
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[99999]">
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-teal-400 rounded-full -translate-x-1/2 -translate-y-1/2" 
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border border-teal-400/30 rounded-full -translate-x-1/2 -translate-y-1/2" 
      />
    </div>
  );
}

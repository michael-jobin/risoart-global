import { useRef, useEffect, useCallback, useState } from 'react';
import { lerp } from '../utils';

const useScroll = (isHomePage: boolean, isTablet: boolean, isMobile: boolean) => {
 const pageWrapperRef = useRef<HTMLDivElement>(null);
 const maxScrollRef = useRef(0);
 const scrollPositionRef = useRef(0);
 const targetScrollPositionRef = useRef(0);
 const [scrollBlock, setScrollBlock] = useState(false);

 const refreshScroll = useCallback(() => {
  if (pageWrapperRef.current) {
   console.log('refreshScroll')
   const pageContainerHeight = window.innerHeight;
   const pageWrapperHeight = pageWrapperRef.current.scrollHeight;
   maxScrollRef.current = pageWrapperHeight - pageContainerHeight;
   if (scrollPositionRef.current > maxScrollRef.current && maxScrollRef.current > 0) {
    targetScrollPositionRef.current = maxScrollRef.current;
   }
   window.scrollTo(0, 0);
  }
 }, []);

 const scrollTo = (target: number | string, options: { immediate?: boolean } = {}) => {
  const { immediate = false } = options;

  let targetPosition = 0;
  if (typeof target === 'number') {
   targetPosition = target;
  } else if (typeof target === 'string') {
   const element = document.querySelector(target);
   if (element && pageWrapperRef.current) {
    const elementRect = element.getBoundingClientRect();
    const pageWrapperRect = pageWrapperRef.current.getBoundingClientRect();
    targetPosition = elementRect.top - pageWrapperRect.top;
   }
  }

  if (isMobile || isTablet) {
   setTimeout(() => {
    window.scrollTo({ top: targetPosition, behavior: immediate ? 'auto' : 'smooth' });
   }, 200);
  } else {
   if (immediate) {
    scrollPositionRef.current = targetPosition;
    targetScrollPositionRef.current = targetPosition;
    if (pageWrapperRef.current) {
     pageWrapperRef.current.style.transform = `translate3d(0, ${-targetPosition}px, 0)`;
    }
   } else {
    targetScrollPositionRef.current = targetPosition;
   }
  }
 };

 useEffect(() => {
  if (!pageWrapperRef.current) return;

  const resizeObserver = new ResizeObserver(() => {
   refreshScroll();
  });

  resizeObserver.observe(pageWrapperRef.current);

  return () => {
   if (pageWrapperRef.current) {
    resizeObserver.unobserve(pageWrapperRef.current);
   }
  };
 }, [refreshScroll]);

 useEffect(() => {
  if (isHomePage || isTablet || isMobile) return;
  let requestId: number;

  const handleWheel = (event: WheelEvent) => {
   console.log(event.deltaY)
   if (scrollBlock) return;
   event.preventDefault();
   targetScrollPositionRef.current = Math.max(
    0,
    Math.min(targetScrollPositionRef.current + event.deltaY, maxScrollRef.current)
   );
  };

  const animateScroll = () => {
   scrollPositionRef.current = lerp(
    scrollPositionRef.current,
    targetScrollPositionRef.current,
    0.1
   );
   if (pageWrapperRef.current) {
    pageWrapperRef.current.style.transform = `translate3d(0, ${-scrollPositionRef.current}px, 0)`;
   }
   requestId = requestAnimationFrame(animateScroll);
  };

  window.addEventListener('wheel', handleWheel, { passive: false });
  animateScroll();

  return () => {
   window.removeEventListener('wheel', handleWheel);
   cancelAnimationFrame(requestId);
  };
 }, [isHomePage, isTablet, isMobile, scrollBlock]);

 return {
  pageWrapperRef,
  refreshScroll,
  scrollTo,
  setScrollBlock,
 };
};

export default useScroll;

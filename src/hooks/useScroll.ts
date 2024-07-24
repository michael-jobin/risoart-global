import { useEffect, useRef, useState } from 'react'
import { isTablet, isMobile } from 'react-device-detect'
import { lerp } from '../utils'

const useScroll = (isHomePage: boolean, scrollBlock: boolean) => {
 const pageWrapperRef = useRef<HTMLDivElement>(null)
 const [maxScroll, setMaxScroll] = useState(0)
 const [scrollPosition, setScrollPosition] = useState(0)
 const [targetScrollPosition, setTargetScrollPosition] = useState(0)

 const refreshScroll = () => {
  if (pageWrapperRef.current) {
   const pageContainerHeight = window.innerHeight
   const pageWrapperHeight = pageWrapperRef.current.scrollHeight
   setMaxScroll(pageWrapperHeight - pageContainerHeight)
  }
 }

 useEffect(() => {
  window.scrollTo(0, 0)
 }, [])

 useEffect(() => {
  if (!pageWrapperRef.current) return

  const resizeObserver = new ResizeObserver(() => {
   refreshScroll()
  })

  resizeObserver.observe(pageWrapperRef.current)

  return () => {
   if (pageWrapperRef.current) {
    resizeObserver.unobserve(pageWrapperRef.current)
   }
  }
 }, [])

 useEffect(() => {
  if (isHomePage || isTablet || isMobile) return
  let requestId: number

  const handleWheel = (event: WheelEvent) => {
   if (scrollBlock) return
   event.preventDefault()
   setTargetScrollPosition((prev) => Math.max(0, Math.min(prev + event.deltaY, maxScroll)))
  }

  const animateScroll = () => {
   setScrollPosition((prev) => {
    const newScrollPosition = lerp(prev, targetScrollPosition, 0.1)
    if (pageWrapperRef.current) {
     pageWrapperRef.current.style.transform = `translate3d(0, ${-newScrollPosition}px, 0)`
    }
    return newScrollPosition
   })
   requestId = requestAnimationFrame(animateScroll)
  }

  window.addEventListener('wheel', handleWheel, { passive: false })
  animateScroll()

  return () => {
   window.removeEventListener('wheel', handleWheel)
   cancelAnimationFrame(requestId)
  }
 }, [maxScroll, isHomePage, targetScrollPosition])

 useEffect(() => {
  if (pageWrapperRef.current) {
   pageWrapperRef.current.style.transform = `translate3d(0, ${-scrollPosition}px, 0)`
  }
 }, [scrollPosition])

 const scrollTo = (target: number | string, options: { immediate?: boolean } = {}) => {
  const { immediate = false } = options

  let targetPosition = 0
  if (typeof target === 'number') {
   targetPosition = target
  } else if (typeof target === 'string') {
   const element = document.querySelector(target)
   if (element && pageWrapperRef.current) {
    const elementRect = element.getBoundingClientRect()
    const pageWrapperRect = pageWrapperRef.current.getBoundingClientRect()
    targetPosition = elementRect.top - pageWrapperRect.top
   }
  }

  if (isMobile || isTablet) {
   setTimeout(() => {
    window.scrollTo({ top: targetPosition, behavior: immediate ? 'auto' : 'smooth' })
   }, 200)
  } else {
   if (immediate) {
    setScrollPosition(targetPosition)
    setTargetScrollPosition(targetPosition)
   } else {
    setTargetScrollPosition(targetPosition)
   }
  }
 }

 return { pageWrapperRef, scrollTo, refreshScroll }
}

export default useScroll

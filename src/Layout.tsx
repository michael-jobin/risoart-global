import { useEffect, useRef, useState, Suspense } from 'react'
import { Outlet, useLocation, useBlocker } from 'react-router-dom'
import { isTablet, isMobile } from 'react-device-detect'
import { Canvas } from '@react-three/fiber'
import Carousel from './three/components/Carousel'
import Loader from './three/components/Loader'
import Cursor from './components/Cursor'
import Header from './sections/Header'
import gsap from 'gsap'
import Menu from './components/Menu'
import { lerp } from './utils'
import type { ArtList } from './types'
import useFetch from './hooks/useFetch'

const Layout = () => {
  const location = useLocation()
  const pageWrapperRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const isHomePage = location.pathname === '/'
  const overlayRef = useRef<HTMLDivElement>(null)
  // scroll
  const [maxScroll, setMaxScroll] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [targetScrollPosition, setTargetScrollPosition] = useState(0)
  const [scrollBlock, _setScrollBlock] = useState(false)

  // -----------------------
  // fetch list
  // -----------------------
  const {
    data: artList,
    loading: listLoading,
    error,
  } = useFetch<ArtList[]>('https://risoart.onten.jp/wp/wp-json/acf/v3/art/')
  const listLoaded = !listLoading

  // -----------------------
  // page transition
  // -----------------------
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    // page transition for every case, except from the home to the artist page
    const regex = /\/art-list\/([^\/]+)\/?$/
    const toArtistPage = nextLocation.pathname.match(regex)
    if (currentLocation.pathname === '/' && toArtistPage) return false
    if (nextLocation.pathname === currentLocation.pathname) {
      if (nextLocation.hash) scrollTo(nextLocation.hash)
      return false
    }
    return true
  })

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const tl = gsap.timeline()
      tl.set(overlayRef.current, { xPercent: -100, display: 'block' })
        .to(overlayRef.current, {
          xPercent: 0,
          ease: 'expo.inOut',
          onComplete: () => {
            blocker.proceed()
            scrollTo(0, { immediate: true })
          },
        })
        .to(overlayRef.current, {
          duration: 1,
          delay: 0.1,
          xPercent: 100,
          ease: 'expo.inOut',
        })
        .add(() => {
          if (blocker.location.hash) scrollTo(blocker.location.hash, { immediate: true })
        }, '-=0.6')
    }
  }, [blocker.state])

  // -----------------------
  // scroll
  // -----------------------
  const refreshScroll = () => {
    if (pageWrapperRef.current) {
      const pageContainerHeight = window.innerHeight
      const pageWrapperHeight = pageWrapperRef.current.scrollHeight
      setMaxScroll(pageWrapperHeight - pageContainerHeight)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

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
      // Use normal scroll for mobile/tablet
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

  return (
    <>
      {!isMobile && !isTablet && <Cursor />}
      <Menu />
      <div className="overlay" ref={overlayRef}></div>
      {isHomePage && <Header />}
      <div
        className={`pageContainer ${isMobile && 'mobile'} ${isTablet && 'tablet'}`}
        style={{ zIndex: location.pathname === '/' ? '0' : '10' }}
      >
        <div className="pageWrapper" ref={pageWrapperRef}>
          {!isHomePage && <Header />}
          {listLoaded && (loaded || isHomePage) && <Outlet context={artList} />}
        </div>
      </div>
      {listLoaded && (
        <div className="canvasContainer" style={{ zIndex: 5 }}>
          <Canvas>
            <Suspense fallback={<Loader setLoaded={setLoaded} />}>
              <Carousel loaded={loaded} page={location.pathname} artList={artList || []} />
            </Suspense>
          </Canvas>
          {error.state && <p>{error.msg} </p>}
        </div>
      )}
    </>
  )
}

export default Layout

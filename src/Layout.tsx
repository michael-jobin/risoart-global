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
import type { ArtList } from './types'
import useFetch from './hooks/useFetch'
import useScroll from './hooks/useScroll'

const Layout = () => {
  console.log('Layout')
  const location = useLocation()
  const [loaded, setLoaded] = useState<boolean>(false)
  const isHomePage = location.pathname === '/'
  const overlayRef = useRef<HTMLDivElement>(null)

  const { pageWrapperRef, refreshScroll, scrollTo, setScrollBlock } = useScroll(
    isHomePage,
    isTablet,
    isMobile
  )

  const {
    data: artList,
    loading: listLoading,
    error,
  } = useFetch<ArtList[]>('https://risoart.onten.jp/wp/wp-json/acf/v3/art/')
  const listLoaded = !listLoading

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
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
  }, [blocker.state, scrollTo])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

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

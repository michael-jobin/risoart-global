import { useEffect, useMemo, useRef, useState } from 'react'
import type { CarouselProps } from '../../types'
import CarouselItem from './CarouselItem'
import type { Object3D, Group } from 'three'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { shuffleArray, lerp } from '../../utils'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useMediaQuery } from 'react-responsive'

const Carousel: React.FC<CarouselProps> = ({
  // loaded,
  page,
  artList,
}) => {
  const { camera, viewport } = useThree()
  // refs vars
  // const groupRef = useRef<Group | null>(null)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [wrapper, setWrapper] = useState<Group | null>(null)
  const items = useMemo<Object3D[] | undefined>(() => {
    if (wrapper) return wrapper.children as Object3D[]
  }, [wrapper])

  // positions vars
  const positions = useRef<number[]>([])
  const progress = useRef(0)
  const targetProgress = useRef(0)
  const loopCounters = useRef<number[]>([])
  const totalWidth = useRef(0)

  // events vars
  const scrollRef = useRef(0)
  const isDown = useRef(false)
  const startX = useRef(0)
  const speedDrag = -0.1
  const speedWheel = 0.007
  const initialRotation = useRef(camera.rotation.clone())
  const targetRotation = useRef(camera.rotation.clone())

  // activations vars
  const activeProgress = useRef(0)
  const [activePlane, setActivePlane] = useState<number | null>(null)
  const [anyPlaneActive, setAnyPlaneActive] = useState(false)
  const [blockEvents, setBlockEvents] = useState(true)

  // others init
  const [params, _setParams] = useState({
    width: 2.1,
    height: 2.48,
    gap: 0,
  })
  const filteredArtlist = artList.filter(
    (item) => item.acf && item.acf.carouselImage && item.acf.showInCarousel === true
  )
  const shuffledArtList = shuffleArray([...filteredArtlist])
  const [randomArtList, _setRandomArtList] = useState(shuffledArtList)
  // setRandomArtList(shuffledArtList)
  const starting = useRef(0)

  // -----------------------
  // init
  // -----------------------
  useEffect(() => {
    if (page === '/') {
      if (starting.current !== 0) {
        // come back to home page
        gsap.set(activeProgress, {
          current: 0,
          // duration: 1,
          // ease: 'expo.inOut',
          onComplete: () => {
            setActivePlane(null)
            setAnyPlaneActive(false)
            setBlockEvents(false)
          },
        })
      } else {
        // first time in home page
        setActivePlane(null)
        setAnyPlaneActive(false)
        // const shuffledArtList = shuffleArray([...filteredArtlist])
        // setRandomArtList(shuffledArtList)
        const tl = gsap.timeline()
        if (wrapper) {
          tl.set(starting, { current: 0.0001 })
            .fromTo(
              wrapper.scale,
              {
                y: 0,
                x: 0,
                z: 0,
              },
              {
                y: 1.4,
                x: 1.4,
                z: 1.4,
                duration: 3,
                delay: 0.1,
                ease: 'expo.inOut',
              }
            )
            .fromTo(
              wrapper.rotation,
              {
                x: -1.5,
                z: -1.5,
                y: -1.5,
              },
              {
                x: 0,
                z: 0,
                y: 0,
                duration: 3,
                ease: 'expo.inOut',
              },
              '-=3'
            )
            .to(
              starting,
              {
                current: 0.03,
                duration: 1.1,
                ease: 'expo.in',
              },
              '-=1'
            )
            .fromTo(
              scrollRef,
              {
                current: -50,
              },
              {
                current: 0,
                duration: 3,
                ease: 'linear',
              }
            )
            .to(
              wrapper.scale,
              {
                y: 1,
                x: 1,
                z: 1,
                duration: 3,
                ease: 'expo.out',
              },
              '-=3'
            )
            .to(
              starting,
              {
                current: 1,
                duration: 3,
                ease: 'expo.out',
              },
              '-=3'
            )
            .add(() => {
              setBlockEvents(false)
            }, '-=2')
            .add(() => {
              document.body.classList.add('started')
            }, '+=2')
        }
      }
    } else {
      // if (starting.current !== 0) {
      //   // begin directly to art page
      // } else {
      //   // come to art page after viewed the home page
      // }
      const match = page.match(/^\/art-list\/([^\/]+)\/?$/)
      if (match) {
        const slug = match[1]
        const index = randomArtList.findIndex((art) => art.acf.slug === slug)
        if (index !== -1) {
          setActivePlane(index)
        }
      } else {
        // other pages
        setActivePlane(null)
        setAnyPlaneActive(false)
        activeProgress.current = 0
      }
    }
  }, [wrapper, page])

  //trigger when activate plane
  useEffect(() => {
    if (activePlane !== null) {
      setAnyPlaneActive(true)
    } else {
      setAnyPlaneActive(false)
    }
  }, [activePlane])
  // follow above
  useGSAP(() => {
    if (anyPlaneActive) {
      gsap.to(activeProgress, { current: 1, duration: 1.5, ease: 'expo.inOut' })
    } else {
      gsap.set(activeProgress, { current: 0 })
    }
  }, [anyPlaneActive])

  // calculate initial positions
  useEffect(() => {
    if (items) {
      const centerIndex = Math.floor(items.length / 2)
      const positionsArray = items.map((_, i) => {
        const positionIndex = (i - 1 - centerIndex + items.length) % items.length
        return (positionIndex - centerIndex) * (params.width + params.gap)
      })
      positions.current = positionsArray
      totalWidth.current = positionsArray.length * (params.width + params.gap)
      loopCounters.current = new Array(items.length).fill(0)
    }
  }, [items])

  // -----------------------
  // tick
  // -----------------------
  useFrame((_state, delta) => {
    // lerp
    progress.current = lerp(progress.current, targetProgress.current, delta * 3.33)
    camera.rotation.x = lerp(camera.rotation.x, targetRotation.current.x, 0.1)
    camera.rotation.y = lerp(camera.rotation.y, targetRotation.current.y, 0.1)

    items?.forEach((item, i) => {
      // Initial position
      const finalXPosition =
        positions.current[i] - progress.current + loopCounters.current[i] * totalWidth.current
      item.position.x = lerp(0, finalXPosition, starting.current)

      // looping
      if (item.position.x < -totalWidth.current / 2) {
        loopCounters.current[i] += 1
        item.position.x += totalWidth.current
      }
      if (item.position.x > totalWidth.current / 2) {
        loopCounters.current[i] -= 1
        item.position.x -= totalWidth.current
      }

      // ajust z position
      const distanceFromCenter = Math.abs(item.position.x)
      const maxDistance = totalWidth.current / 2
      const normalizedDistance = distanceFromCenter / maxDistance
      const exponent = 1.7

      item.position.z =
        Math.sign(item.position.x) * (3 - Math.pow(1 - normalizedDistance, exponent) * 3) +
        (isMobile ? 0.4 : 0.9)

      // ajusting positions
      const zOffsetFactor = 0.5 * starting.current
      const yOffsetFactor = -0.425 * starting.current
      item.position.x -=
        item.position.z * zOffsetFactor + 0.5 * starting.current - 0.7 * starting.current
      item.position.y =
        item.position.z * yOffsetFactor +
        0.5 * starting.current +
        (isMobile ? 0.8 : 0.4) * starting.current

      if (anyPlaneActive) {
        item.position.x = lerp(item.position.x, 0, activeProgress.current)
        item.position.y = lerp(item.position.y, 0, activeProgress.current)
        item.position.z = lerp(item.position.z, 0, activeProgress.current)
      }

      // prevent collision between planes
      if (i === activePlane && item.position.x <= 0) {
        item.position.z += 0.6
      } else if (i === activePlane && item.position.x > 0) {
        item.position.z -= 0.6
      }
    })
  })

  // -----------------------
  // events
  // -----------------------
  const handleWheel = (e: ThreeEvent<WheelEvent>) => {
    const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
    const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
    targetProgress.current = targetProgress.current + wheelProgress * speedWheel
    scrollRef.current = wheelProgress
  }
  const handleDown = (e: ThreeEvent<PointerEvent>) => {
    isDown.current = true
    startX.current = e.clientX
  }
  const handleUp = () => {
    isDown.current = false
  }
  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    // drag
    if (!isDown.current) return
    const x = e.clientX
    const mouseProgress = (x - startX.current) * speedDrag
    targetProgress.current = targetProgress.current + mouseProgress
    scrollRef.current += mouseProgress * 50
    startX.current = x
  }

  const handleCameraRotation = (e: MouseEvent) => {
    if (isMobile || (activeProgress.current > 0 && activeProgress.current < 1)) return
    const x = e.clientX
    const y = e.clientY
    const offsetX = (x / window.innerWidth - 0.5) * 2
    const offsetY = (y / window.innerHeight - 0.5) * 2
    targetRotation.current.x = -(initialRotation.current.x + offsetY * 0.02) + 0
    targetRotation.current.y = -(initialRotation.current.y + offsetX * 0.03) + 0
  }

  const handleMouseLeave = () => {
    targetRotation.current.copy(initialRotation.current)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleCameraRotation)
    window.addEventListener('mouseout', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleCameraRotation)
      window.removeEventListener('mouseout', handleMouseLeave)
    }
  }, [])

  const Events = () => {
    return (
      !blockEvents && (
        <mesh
          position={[0, 0, 3]}
          onWheel={handleWheel}
          onPointerDown={handleDown}
          onPointerUp={handleUp}
          onPointerMove={handleMove}
          onPointerLeave={handleUp}
          onPointerCancel={handleUp}
        >
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial transparent={true} opacity={0} />
        </mesh>
      )
    )
  }

  return (
    <>
      <Events />
      <group ref={setWrapper}>
        {randomArtList?.map((art, i) => (
          <CarouselItem
            width={params.width}
            height={params.height}
            i={i}
            art={art}
            key={i}
            setActivePlane={setActivePlane}
            activePlane={activePlane}
            anyPlaneActive={anyPlaneActive}
            blockEvents={blockEvents}
            setBlockEvents={setBlockEvents}
            scrollRef={scrollRef}
          />
        ))}
      </group>
    </>
  )
}

export default Carousel

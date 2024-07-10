import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Group } from 'three'
import type { CarouselItemProps } from '../../types'
import Plane from './Plane'
import { Html } from '@react-three/drei'
import gsap from 'gsap'

const CarouselItem = ({
  width,
  height,
  setActivePlane,
  activePlane,
  anyPlaneActive,
  art,
  i,
  blockEvents,
  scrollRef,
  setBlockEvents,
  ...props
}: CarouselItemProps) => {
  const groupRef = useRef<Group>(null)
  const [isActive, setIsActive] = useState(false)
  const [hover, setHover] = useState(false)
  const navigate = useNavigate()

  //setActivePlane
  useEffect(() => {
    if (activePlane === i) {
      setIsActive(activePlane === i)
    } else {
      setIsActive(false)
    }
  }, [activePlane])

  // -----------------------
  // Hover
  // -----------------------
  useEffect(() => {
    const x = hover ? -0.3 : 0
    const y = hover ? 0.2 : 0
    const z = hover ? 0 : 0
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        x,
        y,
        z,
        duration: 0.6,
        ease: 'power3.out',
      })
      gsap.to(groupRef.current.rotation, {
        x: hover ? 0 : 0,
        y: hover ? 0 : 0,
        z: hover ? -0.05 : 0,
        duration: 0.6,
        ease: 'power3.out',
      })
    }
  }, [hover])

  const handleClick = (e: any) => {
    if (blockEvents) return
    e.stopPropagation()
    setBlockEvents(true)
    navigate(`art-list/${art.acf.slug}`)
    setTimeout(() => {
      setHover(false)
      setActivePlane(i)
    }, 200)
  }

  const handlePointerEnter = (e: any) => {
    if (blockEvents) return
    e.stopPropagation()
    setHover(true)
    document.body.style.cursor = 'pointer'
  }
  const handlePointerLeave = (e: any) => {
    if (blockEvents) return
    e.stopPropagation()
    setHover(false)
    document.body.style.cursor = 'default'
  }

  // remove hover when scrolling
  useEffect(() => {
    const handleWheel = () => {
      if (hover) setHover(false)
    }
    window.addEventListener('wheel', handleWheel)
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [hover])

  return (
    <group
      onPointerEnter={(e) => handlePointerEnter(e)}
      onPointerLeave={(e) => handlePointerLeave(e)}
      onClick={(e) => handleClick(e)}
    >
      <group ref={groupRef}>
        <Html
          as="div"
          wrapperClass={`carousel__item ${hover ? 'hover' : ''} ${anyPlaneActive ? 'active' : ''}`}
          transform
          scale={0.168}
          position={[0, 1.38, 0]}
        >
          <div className="carousel__item__info">
            <img src={art.acf.flag} alt={art.acf.country} width="92" height="55" />
            <p>
              <em>{art.acf.name}</em>
              <span>{art.acf.country}</span>
            </p>
          </div>
        </Html>
        <Plane
          width={width}
          height={height}
          // i={i}
          scrollRef={scrollRef}
          art={art}
          {...props}
          active={isActive}
          opacity={anyPlaneActive && !isActive ? 0 : 1}
          blockEvents={blockEvents}
        />
      </group>
    </group>
  )
}

export default CarouselItem

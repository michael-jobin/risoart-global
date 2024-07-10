import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

interface GalleryWrapperProps {
  index: number
  itemsLength: number
}

const GalleryWrapper = ({ index, itemsLength }: GalleryWrapperProps) => {
  gsap.registerPlugin(useGSAP)
  const ref = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      {
        xPercent: index * 100,
      },
      {
        xPercent: index === 0 ? -100 : 0,
        duration: 40,
        ease: 'linear',
        repeat: -1,
      }
    )
  })

  return (
    <div className="about__gallery__wrapper" ref={ref}>
      {Array.from({ length: itemsLength }).map((_, i) => {
        return (
          <div className="about__gallery__item" key={i}>
            <img
              src={`https://risoart.onten.jp/wp/ondo_work_${i + 1}/`}
              alt="gallery"
              width="375"
              height="375"
            />
          </div>
        )
      })}
    </div>
  )
}

export default GalleryWrapper

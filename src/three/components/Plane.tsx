import { useMemo, useRef } from 'react'
import type { Mesh, ShaderMaterial } from 'three'
import { useTexture } from '@react-three/drei'
import type { PlaneProps } from '../../types'
import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'
import { useThree, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { MathUtils } from 'three'
import { useMediaQuery } from 'react-responsive'

const Plane = ({
  // i,
  width,
  height,
  scrollRef,
  active,
  opacity,
  art,
}: // blockEvents,
// ...props
PlaneProps) => {
  const ref = useRef<Mesh>(null)
  const { viewport } = useThree()
  const scrollDelta = useRef(0)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const tex = useTexture(
    isMobile && art.acf.carouselImage_sp ? art.acf.carouselImage_sp : art.acf.carouselImage
  )

  useGSAP(() => {
    const material = ref.current?.material as ShaderMaterial | undefined
    if (material) {
      material.uniforms.uZoomScale.value.x = viewport.width / width
      material.uniforms.uZoomScale.value.y = viewport.height / height

      gsap.to(material.uniforms.uProgress, {
        value: active ? 1 : 0,
        duration: active ? 2 : 1,
        delay: active ? 0.6 : 0.1,
        ease: 'expo.inOut',
      })
      gsap.to(material.uniforms.uRes.value, {
        x: active ? viewport.width : width,
        y: active ? viewport.height : height,
        duration: active ? 2 : 1,
        delay: active ? 0.6 : 0.1,
        ease: 'expo.inOut',
      })
      gsap.to(material.uniforms.uOpacity, {
        value: opacity,
        duration: 0.3,
      })
    }
  }, [ref, opacity, active, viewport, width, height])

  useGSAP(() => {
    const material = ref.current?.material as ShaderMaterial | undefined
    if (material) {
      //inertia
      gsap.set(material.uniforms.uSpeed, { value: active ? 2 : 0 })
      const tl = gsap.timeline()
      tl.fromTo(
        material.uniforms.uFrequency.value,
        {
          y: 0,
        },
        {
          y: 1.3,
          duration: active ? 1 : 0.1,
          delay: active ? 1.8 : 0,
          ease: 'power4.out',
        }
      ).to(material.uniforms.uFrequency.value, {
        y: 0,
        duration: active ? 4 : 0.1,
        ease: 'power1.out',
      })
    }
  }, [active])

  useFrame((_state, delta) => {
    const material = ref.current?.material as ShaderMaterial | undefined
    if (material?.uniforms) {
      if (active) {
        material.uniforms.uTime.value += delta
      }
      const targetElevationScale =
        scrollRef.current !== 0 ? MathUtils.clamp(scrollRef.current / 100, -1, 1) : 0
      scrollDelta.current = MathUtils.lerp(scrollDelta.current, targetElevationScale * 1, delta * 6)
      material.uniforms.uElevationScale.value = scrollDelta.current
      scrollRef.current *= 0.99
    }
  })

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uProgress: { value: 0 },
        uZoomScale: { value: { x: 1, y: 1 } },
        uTex: { value: tex },
        uRes: { value: { x: 1, y: 1 } },
        uImageRes: {
          value: { x: tex.source.data.width, y: tex.source.data.height },
        },
        uFrequency: { value: { x: 0.2, y: 0 } },
        uTime: { value: 0 },
        uElevationScale: { value: 0 },
        uElevationExponent: { value: 0 },
        uSpeed: { value: 0 },
        uHeight: { value: height },
        uOpacity: { value: 1 },
      },
      vertexShader,
      fragmentShader,
    }),
    [tex]
  )

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <planeGeometry args={[width, height, 30, 30]} />
      <shaderMaterial args={[shaderArgs]} transparent={true} />
    </mesh>
  )
}

export default Plane

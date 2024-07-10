import { useEffect } from 'react'
import { useProgress, Html } from '@react-three/drei'

interface LoaderProps {
  setLoaded: any
}

const Loader = ({ setLoaded }: LoaderProps) => {
  const { progress } = useProgress()

  useEffect(() => {
    setCssVarProgress(progress)
  }, [progress])

  const setCssVarProgress = (progress: number) => {
    const scale = progress / 100
    document.documentElement.style.setProperty('--progress', `${scale}`)
    if (progress === 100) {
      document.body.classList.add('loaded')
      setLoaded(true)
    }
  }

  return <Html center>{`${Math.round(progress)}%`}</Html>
}
export default Loader

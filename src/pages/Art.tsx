import { useParams } from 'react-router-dom'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SnsList from '../components/SnsList'
import Footer from '../sections/Footer'
import { useOutletContext } from 'react-router-dom'
import Artist from '../components/Artist'
import type { ArtList } from '../types'

const Art = () => {
  const { slug } = useParams()
  const artList = useOutletContext<ArtList[]>()
  const thisArt = artList?.find((art) => art.acf.slug === slug)
  const container = useRef() as React.MutableRefObject<HTMLDivElement>
  const artistChars = thisArt?.acf.name.split('').map((char) => (char === ' ' ? '\u00A0' : char))

  useGSAP(
    () => {
      const tl = gsap.timeline()
      tl.to('.artMain__frame__mask.left', { x: 0, duration: 1, ease: 'expo.out', delay: 2.5 })
        .to('.artMain__frame__mask.right', { x: 0, duration: 1, ease: 'expo.out' }, '-=1')
        .to('.artMain__frame__mask.top', { y: 0, duration: 1, ease: 'expo.out' }, '-=0.5')
        .set('.artHead', { opacity: 1 }, '-=2')
        .to('.artHead__artist span', {
          transform: 'translateY(0)',
          duration: 1,
          ease: 'expo.out',
          stagger: 0.05,
        })
        .to('.fadeIn', { opacity: 1, stagger: 0.2 }, '-=0.1')
    },
    { scope: container }
  )

  if (!thisArt) return <div>Art not found</div>

  return (
    <div className={`page-art ${thisArt.acf.showInCarousel ? '' : 'noCarousel'}`} ref={container}>
      <section className="artHead">
        <img src={thisArt.acf.flag} alt={thisArt.acf.country} className="artHead__flag fadeIn" />
        <p className="artHead__country fadeIn">{thisArt.acf.country}</p>
        <h1 className="artHead__artist">
          {artistChars?.map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </h1>
      </section>
      <div className="artMain__frame__mask left"></div>
      <div className="artMain__frame__mask right"></div>
      <div className="artMain">
        <div className="artMain__frame">
          <div className="artMain__frame__mask top"></div>
        </div>
        {!thisArt.acf.showInCarousel && (
          <picture className="artMain__background">
            {thisArt.acf.carouselImageSp && (
              <source srcSet={thisArt.acf.carouselImageSp} media="(max-width: 768px)" />
            )}
            <img src={thisArt.acf.carouselImage} alt={thisArt.acf.name} width="1440" height="720" />
          </picture>
        )}
      </div>
      <div className="whiteBackground">
        <section className="artDetails">
          <div className="basic__container">
            <h2 className="artDetails__title">{thisArt.acf.title}</h2>
            <div className="artDetails__description basic__grid">
              <div>
                <h3 className="artDetails__description__title">Name of artwork</h3>
              </div>
              <div>
                <h3 className="artDetails__description__title">Description</h3>
                {thisArt.acf.description && (
                  <p className="artDetails__description__text basic__text pre-line">
                    {thisArt.acf.description}
                  </p>
                )}
              </div>
            </div>
            <div className="artDetails__gallery basic__grid">
              {thisArt.acf.scene01 && (
                <picture className={`basic__grid__half`}>
                  <img src={thisArt.acf.scene01} alt={thisArt.acf.name} width="1202" height="602" />
                </picture>
              )}
              {thisArt.acf.scene02 && (
                <picture className={`basic__grid__half`}>
                  <img src={thisArt.acf.scene02} alt={thisArt.acf.name} width="1202" height="602" />
                </picture>
              )}
              {thisArt.acf.scene03 && (
                <picture className={`basic__grid__full`}>
                  <img src={thisArt.acf.scene03} alt={thisArt.acf.name} width="1202" height="602" />
                </picture>
              )}
            </div>
            <div className="artDetails__profile basic__grid">
              <div className="artDetails__profile__card">
                <picture>
                  <img
                    src={thisArt.acf.profilePhoto}
                    alt={thisArt.acf.title}
                    width="841"
                    height="601"
                  />
                </picture>
                <div className="artList__item__info">
                  <Artist name={thisArt.acf.name} />
                  {thisArt.acf.instagram && <SnsList instagram={thisArt.acf.instagram} />}
                </div>
              </div>
              <div>
                {thisArt.acf.profile && (
                  <p className="basic__smalltext pre-line">{thisArt.acf.profile}</p>
                )}
              </div>
            </div>
            <div className="artDetails__country basic__grid">
              <div className="artDetails__country__map">
                <img src={thisArt.acf.map} alt={thisArt.acf.country} width="1001" height="1001" />
              </div>
              <div className="artDetails__country__text">
                <h3 className="artDetails__country__title">
                  <span>Tell me what you like about your country.</span>
                  <em>{thisArt.acf.country}</em>
                </h3>
                {thisArt.acf.aboutCountry && (
                  <p className="basic__smalltext pre-line">{thisArt.acf.aboutCountry}</p>
                )}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  )
}

export default Art

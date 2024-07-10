import OndoSns from '../components/OndoSns'
import GalleryWrapper from '../components/GalleryWrapper'
import Footer from '../sections/Footer'
import { useEffect, useState } from 'react'

const About = () => {
  const [mapInteraction, setMapInteraction] = useState(false)

  // -----------------------
  // fetch
  // -----------------------

  interface Data {
    introduction_title: string
    introduction_english: string
    introduction_japanese: string
    introduction_image: string
    details_title: string
    details_english: string
    details_japanese: string
    about_title: string
    about_english: string
    about_japanese: string
    onten_title: string
    onten_english: string
    onten_japanese: string
    onten_image_01: string
    onten_image_02: string
    ondo_works_lenght: number
  }

  const [data, setData] = useState<Data>()
  const [_dataLoaded, setDataLoaded] = useState<boolean>(false)
  const [_error, setError] = useState<{ msg: string; state: boolean }>({
    msg: '',
    state: false,
  })

  useEffect(() => {
    fetch('https://risoart.onten.jp/wp/?rest_route=/wp/v2/pages/83/')
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} Error, something went wrong`)
        return response.json()
      })
      .then((data) => {
        setData(data.acf)
        setDataLoaded(true)
      })
      .catch((err) => {
        setError({
          msg: err.message,
          state: true,
        })
        setDataLoaded(true)
      })
  }, [])

  return (
    <div className="page-about basic__page whiteBackground">
      <section className="about__introduction" id="introduction">
        <div className="basic__container">
          {data?.introduction_title && <h1 className="basic__title">{data.introduction_title}</h1>}
          <div className="basic__grid">
            <div>
              {data?.introduction_english && (
                <p className="basic__text pre-line">{data.introduction_english}</p>
              )}
            </div>
            <div>
              {data?.introduction_japanese && (
                <p className="basic__jatext pre-line">{data.introduction_japanese}</p>
              )}
            </div>
          </div>
        </div>
        {data?.introduction_image && (
          <div className="basic__fullImage">
            <img src={data.introduction_image} alt="about" width="3602" height="1252" />
          </div>
        )}
      </section>
      <section className="about__details" id="details">
        <div className="basic__container">
          {data?.details_title && <h2 className="basic__title">{data.details_title}</h2>}
          <div className="basic__grid">
            <div>
              {data?.details_english && (
                <p className="basic__text pre-line">{data.details_english}</p>
              )}
            </div>
            <div>
              {data?.details_japanese && (
                <p className="basic__jatext pre-line">{data.details_japanese}</p>
              )}
            </div>
          </div>
        </div>
        <div
          className="basic__fullImage mapContainer"
          onClick={() => setMapInteraction(true)}
          onPointerLeave={() => setMapInteraction(false)}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.897163075864!2d139.7901736757887!3d35.704148172579856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188fd62918b4c7%3A0x7f1359f4354d020c!2zb250ZW4gLSBvbmRvIGJyYW5kaW5nIHBhcmsgLSDlrozlhajkuojntITliLY!5e0!3m2!1sen!2sjp!4v1718686800957!5m2!1sen!2sjp"
            width="100%"
            height="100%"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={mapInteraction ? { pointerEvents: 'auto' } : { pointerEvents: 'none' }}
          ></iframe>
        </div>
      </section>
      <section className="about__about" id="about">
        <div className="basic__container">
          {data?.about_title && <h2 className="basic__title">{data.about_title}</h2>}
          <div className="about__branding">
            <p>Branding by</p>
            <img
              src="/global/assets/images/common/logo_ondo.svg"
              alt="ondo"
              width="401"
              height="144"
            />
          </div>
          <div className="basic__grid">
            <div>
              {data?.about_english && (
                <p className="basic__mediumtext pre-line">{data.about_english}</p>
              )}
            </div>
            <div>
              {data?.about_japanese && (
                <p className="basic__jatext pre-line">{data.about_japanese}</p>
              )}
            </div>
          </div>
          <p className="about__contact">
            <span>Contact us :</span>
            <a className="about__contact__link" href="mailto:contact@ondo-inc.jp">
              contact@ondo-inc.jp
            </a>
            <OndoSns />
          </p>
        </div>
      </section>
      <section className="about__gallery">
        <GalleryWrapper index={0} itemsLength={data?.ondo_works_lenght || 0} />
        <GalleryWrapper index={1} itemsLength={data?.ondo_works_lenght || 0} />
      </section>
      <section className="about__onten">
        <div className="basic__container">
          <div className="about__onten__logo">
            <img
              src="/global/assets/images/common/logo_onten.svg"
              alt="onten"
              width="320"
              height="391"
            />
          </div>
          <div className="basic__grid">
            <div>
              {data?.onten_english && (
                <p className="basic__mediumtext pre-line">{data.onten_english}</p>
              )}
            </div>
            <div>
              {data?.onten_japanese && (
                <p className="basic__jatext pre-line">{data.onten_japanese}</p>
              )}
            </div>
          </div>
        </div>
        <div className="about__onten__gallery">
          {data?.onten_image_01 && (
            <picture>
              <img src={data.onten_image_01} alt="onten kuramae" width="2652" height="1001" />
            </picture>
          )}
          {data?.onten_image_02 && (
            <picture>
              <img src={data.onten_image_02} alt="onten kuramae" width="1206" height="1001" />
            </picture>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default About

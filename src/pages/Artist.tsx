import ArtListItem from '../components/ArtListItem'
import Footer from '../sections/Footer'
import { useOutletContext } from 'react-router-dom'
import type { ArtList } from '../types'
import { shuffleArray } from '../utils'

const ArtList = () => {
  const artList = useOutletContext<ArtList[]>()
  const randomizedArtList = shuffleArray(artList)

  return (
    <div className="page-artList basic__page whiteBackground">
      <div className="basic__container">
        <h1 className="basic__title">Art list</h1>
        <section className="artList">
          <div className="artList__container">
            {randomizedArtList.map((item, i) => (
              <ArtListItem key={i} art={item} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default ArtList

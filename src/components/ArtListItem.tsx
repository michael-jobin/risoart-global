import { Link } from 'react-router-dom'
import Artist from './Artist'
import SnsList from './SnsList'
import type { ArtList } from '../types'

const ArtListItem = ({ art }: { art: ArtList }) => {
  return (
    <article className="artList__item">
      <Link to={`/art-list/${art.acf.slug}`}>
        <picture className="artList__item__picture cover">
          <img src={art.acf.profilePhoto} alt={art.acf.name} width="841" height="601" />
        </picture>
      </Link>
      <div className="artList__item__info">
        <Link to={`/art-list/${art.acf.slug}`} className="artList__item__info__left">
          <picture className="artList__item__info__left__flag cover">
            <img src={art.acf.flag} alt={art.acf.country} width="38" height="38" />
          </picture>
          <Artist name={art.acf.name} />
        </Link>
        {(art.acf.instagram || art.acf.website) && (
          <SnsList instagram={art.acf.instagram} website={art.acf.website} />
        )}
      </div>
    </article>
  )
}

export default ArtListItem

import Navigation from '../components/Navigation'
import { Link } from 'react-router-dom'
import OndoSns from '../components/OndoSns'
import { useMediaQuery } from 'react-responsive'
import ContactLink from '../components/ContactLink'

const Header = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__logo">
          <Link to="/">
            <img
              src={`/global/assets/images/common/logo_01${isMobile ? '_sp' : ''}.svg`}
              alt="Global RISOART Exhibition"
              width="287"
              height="140"
            />
            <small>
              Branding by ondo
              <br />
              Global RISOART Exhibition
              <br />
              2024.7.28-8.31
            </small>
          </Link>
        </h1>
        {!isMobile && (
          <>
            <Navigation />
            <div className="header__contact">
              <OndoSns />
              <p className="header__contact__mail">
                <ContactLink />
              </p>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Header

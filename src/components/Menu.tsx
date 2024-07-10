import { Link } from 'react-router-dom'
import Navigation from './Navigation'
import OndoSns from './OndoSns'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react'
import ContactLink from './ContactLink'

const Menu = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menuOpen', isOpen)
  }, [isOpen])

  return (
    isMobile && (
      <>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={isOpen ? 'menu__button menu__button--open' : 'menu__button'}
          aria-label="open close menu"
        ></button>
        {isOpen && (
          <aside className="menu">
            <div className="menu__inner">
              <div className="menu__container">
                <div className="menu__logo">
                  <Link to="/" onClick={() => setIsOpen(false)}>
                    <img
                      src={`/global/assets/images/common/logo_01_sp.svg`}
                      alt="Global RISOART Exhibition"
                      width="287"
                      height="140"
                    />
                  </Link>
                </div>
                <Navigation setIsOpen={setIsOpen} />
                <div className="menu__sns">
                  <OndoSns />
                </div>
                <p className="menu__mail">
                  <ContactLink />
                </p>
                <a
                  href="https://www.ondo-inc.jp/"
                  target="_blank"
                  className="footer__smallLogo"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src="/global/assets/images/common/logo_03.svg"
                    alt="Branding by Ondo | onten"
                    width="548"
                    height="66"
                  />
                </a>
              </div>
            </div>
          </aside>
        )}
      </>
    )
  )
}

export default Menu

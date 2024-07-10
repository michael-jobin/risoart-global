import { useMediaQuery } from 'react-responsive'

const Footer = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__bigLogo">
          <span>2024.7.12-8.31</span>
          <img
            src={`/global/assets/images/common/logo_02${isMobile ? '_sp' : ''}.svg`}
            alt="Global RISOART Exhibition"
            width="1848"
            height="476"
          />
        </div>
        <a href="https://www.ondo-inc.jp/" target="_blank" className="footer__smallLogo">
          <img
            src="/global/assets/images/common/logo_03.svg"
            alt="Branding by Ondo | onten"
            width="548"
            height="66"
          />
        </a>
        <p className="footer__copyright">
          <small>Copyright © RISO ART STUDIO all rights reserved.</small>
        </p>
      </div>
    </footer>
  )
}

export default Footer

import { Link } from 'react-router-dom'

interface NavigationProps {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const Navigation: React.FC<NavigationProps> = ({ setIsOpen }) => {
  const handleClick = () => {
    if (setIsOpen) setIsOpen(false)
  }

  return (
    <nav className="navigation">
      <ul>
        {/* <li onClick={handleClick}>
          <Link to="/about/#introduction">Introduction</Link>
        </li> */}
        <li onClick={handleClick}>
          <Link to="/art-list/">Art list</Link>
        </li>
        <li onClick={handleClick}>
          <Link to="/about/">About</Link>
        </li>
        <li onClick={handleClick}>
          <Link to="/about/#details">Details</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation

import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext' // useAuthContext hook'unu import edin

// styles & images
import './Navbar.css'

export default function Navbar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext() // useAuthContext hook'unu kullanarak mevcut kullanıcıyı alın

  return (
      <nav className="navbar">
        <ul>
          <li className="logo">
            <span>Mealicious Management System</span>
          </li>
          <li><Link to="/login">Login</Link></li>
          {user && <li> {/* Eğer kullanıcı giriş yapmışsa, Logout butonunu göster */}
            {!isPending && <button className="btn" onClick={logout}>Logout</button>}
            {isPending && <button className="btn" disabled>Logging out...</button>}
          </li>}
        </ul>
      </nav>
  )
}
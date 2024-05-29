import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { Button } from 'antd'; // Ant Design Button bileşenini import edin

// styles & images
import './Navbar.css'

export default function Navbar() {
    const { logout, isPending } = useLogout()
    const { user } = useAuthContext()

    return (
        <nav className="navbar">
            <ul>
                <li className="logo">
                    <span>Mealicious Management System</span>
                </li>
                {!user && <li><Link to="/login"><Button>Login</Button></Link></li>} {/* Ant Design Button bileşenini kullanın */}
                {user && <li>
                    {!isPending && <Button onClick={logout}>Logout</Button>}
                    {isPending && <Button disabled>Logging out...</Button>}
                </li>}
            </ul>
        </nav>
    )
}
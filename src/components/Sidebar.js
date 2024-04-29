import { NavLink } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext";
import { projectAuth, projectFirestore } from '../firebase/config'

// styles & images
import "./Sidebar.css"
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'

export default function Sidebar() {
  const { currentUser } = useAuthContext();

  return (
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="user">
            <p>@restaurantName</p> {/* Kullanıcının adını burada gösteriyoruz */}
          </div>
          <nav className="links">
            <ul>
              <li>
                <NavLink to="/dashboard">
                  <img src={DashboardIcon} alt="dashboard icon" />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders">
                  <img src={AddIcon} alt="add project icon" />
                  <span>Orders</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  )
}

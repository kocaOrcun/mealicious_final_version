import { NavLink } from "react-router-dom" //
import { useAuthContext } from "../hooks/useAuthContext";
// styles & images
import "./Sidebar.css"
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'

export default function Sidebar() {
  return (
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="user">
            <p>@Restaurant</p>
          </div>
          <nav className="links">
            <ul>
              <li>
                <NavLink to="/dashboard">
                  <img src={DashboardIcon} alt="Icon"/>
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders">
                  <img src={AddIcon} alt="Icon"/>
                  <span>Orders</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="#">
                  <img src={DashboardIcon} alt="Icon"/>
                  <span>Add Product</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="#">
                  <img src={DashboardIcon} alt="Icon"/>
                  <span>Edit Menu</span>
                </NavLink>
              </li>

            </ul>
          </nav>
        </div>
      </div>
  )
}

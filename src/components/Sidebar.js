import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import DashboardIcon from '../assets/dashboard_icon.svg';
import AddIcon from '../assets/add_icon.svg';

export default function Sidebar() {

  return (
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="user">
            <p>MLC</p> {/* restaurantName değerini göster veya placeholder metin göster */}
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
                <NavLink to="/addProduct">
                  <img src={AddIcon} alt="Icon"/>
                  <span>Add Product</span>
                </NavLink>
                <NavLink to="/editProduct">
                  <img src={AddIcon} alt="Icon"/>
                  <span>Edit Product</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  );
}
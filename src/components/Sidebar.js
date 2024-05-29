import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import {PlusOutlined, EditOutlined, ShopOutlined } from '@ant-design/icons';

export default function Sidebar() {


  return (
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="user">
            <p>MLC</p>
          </div>
          <nav className="links">
            <ul>
              <li>
                <NavLink to="/orders">
                  <ShopOutlined />
                  <span> Orders</span>
                </NavLink>
                <NavLink to="/addProduct">
                  <PlusOutlined />
                  <span> Add Product</span>
                </NavLink>
                <NavLink to="/editProduct">
                  <EditOutlined />
                  <span> Edit Product</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  );
}
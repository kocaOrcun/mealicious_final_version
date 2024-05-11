import { BrowserRouter, Route, Switch } from 'react-router-dom'

// styles
import './App.css'

// pages & components
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import {Toaster} from "react-hot-toast";
import Orders from "./pages/orders/Orders";
import Menus from "./pages/addProduct/addProduct";
import AddProduct from "./pages/addProduct/addProduct";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster position="top-right"/>
        <Sidebar />
        <div className="container">
          <Navbar />
          <Switch>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/orders">
              <Orders/>
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path={"/addProduct"}>
              <AddProduct/>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App

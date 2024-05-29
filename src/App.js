import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'

import { useAuthContext } from './hooks/useAuthContext'; // useAuthContext hook'unu import edin
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
import AddProduct from "./pages/addProduct/addProduct";
import EditProduct from "./pages/editProduct/editProduct";

function App() {
  const { user } = useAuthContext(); // useAuthContext hook'unu kullanarak mevcut kullanıcıyı alın

  return (
      <div className="App">
        <BrowserRouter>
          <Toaster position="top-right"/>
          {user && <Sidebar />} {/* Kullanıcı giriş yapmışsa Sidebar bileşenini render et */}
          <div className="container">
            <Navbar />
            <Switch>
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
              <Route path="/login">
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
              <Route path={"/editProduct"}>
                <EditProduct/>
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
  );
}

export default App

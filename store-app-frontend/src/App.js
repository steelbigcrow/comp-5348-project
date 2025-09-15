import React, { Component } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages";
import Login from "./pages/auth/Login/Login";
import Navbar from "./components/navbar/navbar";
import Register from "./pages/auth/Register/Register";
import UserProfile from "./pages/user/profile";
import OrderInfo from "./pages/order/order_info";
import PaymentInfo from "./pages/payment/payment_info";
import OrderList from "./pages/order/order_list";

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="mt-3">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/order-info" element={<OrderInfo />} />
            <Route path="/payment-info" element={<PaymentInfo />} />
            <Route path="/order-list" element={<OrderList />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;

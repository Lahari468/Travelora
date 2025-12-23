import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlaceDetail from './pages/PlaceDetail';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Trips from './pages/Trips';
import Plans from './pages/Plans';
import PackageDetail from './pages/PackageDetail';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Routes>
      {/* Layout wrapper */}
      <Route path="/" element={<Layout />}>

        {/* PUBLIC ROUTES */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="places/:id" element={<PlaceDetail />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Features */}
          <Route path="hotels" element={<Hotels />} />
          <Route path="hotels/:id" element={<HotelDetail />} />
          <Route path="trips" element={<Trips />} />
          <Route path="plans" element={<Plans />} />
          <Route path="plans/:id" element={<PackageDetail />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookings" element={<MyBookings />} />

        </Route>

      </Route>
    </Routes>
  );
}

export default App;

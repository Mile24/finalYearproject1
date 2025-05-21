import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/HomeComponents/Home';
import Register from './Components/HomeComponents/Register';
import Login from './Components/HomeComponents/Login';
import AdminDashBoard from './Components/AdminComponents/AdminDashboard';
import CustomerDashBoard from './Components/CustomerComponents/CustomerDashboard';
import ServiceProviderDashBoard from './Components/ServiceProvidersComponents/DashBoard';
import ViewCustomers from './Components/AdminComponents/ViewCustomers';
import ViewServiceProviders from './Components/AdminComponents/ViewServiceProviders';
import ViewFeedbacks from './Components/AdminComponents/ViewFeedbacks';
import FindServicesComp from './Components/CustomerComponents/FindServicesComp';
import RespondToRequest from './Components/CustomerComponents/Respond';
import TrackServ from './Components/CustomerComponents/TrackServ';
import ViewMyFeedback from './Components/CustomerComponents/ViewMyFeedback';
import SPFeedback from './Components/ServiceProvidersComponents/SPFeedbacks';
import Track from './Components/ServiceProvidersComponents/Track';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminDB" element={<AdminDashBoard />} />
        <Route path="/customerDB" element={<CustomerDashBoard />} />
        <Route path="/serviceProviderDB" element={<ServiceProviderDashBoard />} />
        <Route path="/viewCustomers" element={<ViewCustomers />} />
        <Route path="/viewServiceProviders" element={<ViewServiceProviders />} />
        <Route path="/viewFeedbacks" element={<ViewFeedbacks />} />
        <Route path="/findServices" element={<FindServicesComp />} />
        <Route path="/respond" element={<RespondToRequest />} />
        <Route path="/trackServices" element={<TrackServ />} />
        <Route path='/feedback' element={<ViewMyFeedback />} />
      <Route path='/spfeedbacks' element={<SPFeedback />} />
      <Route path='/trackSP' element = {<Track />} /> 
      </Routes> 
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from '../components/Home';
import Login from '../pages/Login/Login';
import UserHomePage from '../pages/UserHome/UserHomePage';
import SignUp from '../pages/SignUp/SignUp';
import UserHome from '../pages/UserHome/UserHome';
import WasteManagement from '../pages/WasteManagement/WasteManagement';
import WasteManagementPage from '../pages/Admin/WasteManagementPage/WasteManagementPage';
import SpecialRequestsPage from '../pages/Admin//SpecialRequests/SpecialRequestsPage';
import ScheduleCollection from '../pages/SheduleWaste/ScheduleCollection';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../pages/Login/Unauthorized';
import Payment from '../pages/Payment/Payment';


import AdminDashBoard from '../pages/Admin/AdminDashBoard';
import ReportIssue from '../pages/Support/ReportIssue';
//import CollectionRouting from '../pages/SheduleWaste/CollectionRouting';
import UsersPage from '../pages/Admin/UsersPage/UsersPage';
import PaymentPage from '../pages/Admin/PaymentPage/PaymentPage';



import RouteShedule from '../pages/Admin/WasteCollection/RouteShedule';
import DateShedule from '../pages/Admin/WasteCollection/DateShedule';
import Issues from '../pages/Admin/Support/SupportDashboard';
import DriversPage from '../pages/Admin/DriversPage/DriversPage';
import CreateRoute from '../pages/Admin/WasteCollection/CreateRoute';
import DisplayRoutes from '../pages/Admin/WasteCollection/DisplayRoutes';
import ViewRoute from '../pages/Admin/WasteCollection/ViewRoute';
import DriverHome from '../pages/Driver/DriverHome';
import DriverSupport from '../pages/Driver/DriverReportIssue';








import ViewDriverShedules from '../pages/Driver/ViewDriverShedules';




const AppRoutes = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          
          {/* Protected routes for users */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute component={UserHomePage} allowedRoles={['User']} />} 
          />
          <Route 
            path="/userHome" 
            element={<ProtectedRoute component={UserHome} allowedRoles={['User']} />} 
          />
          <Route 
            path="/waste" 
            element={<ProtectedRoute component={WasteManagement} allowedRoles={['User']} />} 
          />
          <Route 
            path="/admindashboard/waste-management" 
            element={<ProtectedRoute component={WasteManagementPage} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admindashboard/special-requests-management" 
            element={<ProtectedRoute component={SpecialRequestsPage} allowedRoles={['admin']} />} 
          />









          <Route 
            path="/sheduleCollection" 
            element={<ProtectedRoute component={ScheduleCollection} allowedRoles={['User']} />} 
          />
          <Route 
            path="/report-issue" 
            element={<ProtectedRoute component={ReportIssue} allowedRoles={['User']} />} 
          />

<Route 
            path="/payments" 
            element={<ProtectedRoute component={Payment} allowedRoles={['User']} />} 
          />

      

          {/* Example protected route for admin */}
          <Route 
            path="/admindashboard" 
            element={<ProtectedRoute component={AdminDashBoard} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admindashboard/users" 
            element={<ProtectedRoute component={UsersPage} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admindashboard/collection-routine" 
            element={<ProtectedRoute component={RouteShedule} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admindashboard/collection-routine/dateShedule" 
            element={<ProtectedRoute component={DateShedule} allowedRoles={['admin']} />} 
          />
          <Route 
            path="admindashboard/issues" 
            element={<ProtectedRoute component={Issues} allowedRoles={['admin']} />} 
          />
          <Route 
            path="admindashboard/drivers" 
            element={<ProtectedRoute component={DriversPage} allowedRoles={['admin']} />} 
          />

<Route 
            path="admindashboard/payments" 
            element={<ProtectedRoute component={PaymentPage} allowedRoles={['admin']} />} 
          />


          <Route 
            path="admindashboard/createRoute" 
            element={<ProtectedRoute component={CreateRoute} allowedRoles={['admin']} />} 
          />
          <Route 
            path="admindashboard/displayRoutes" 
            element={<ProtectedRoute component={DisplayRoutes} allowedRoles={['admin']} />} 
          />
          <Route 
            path="admindashboard/view-route" 
            element={<ProtectedRoute component={ViewRoute} allowedRoles={['admin']} />} 
          />















          <Route 
            path="/driverHome" 
            element={<ProtectedRoute component={DriverHome} allowedRoles={['Driver']} />} 
          />

          <Route 
            path="/driverShedule" 
            element={<ProtectedRoute component={ViewDriverShedules} allowedRoles={['Driver']} />} 
          />

          <Route 
            path="/driver-support" 
            element={<ProtectedRoute component={DriverSupport} allowedRoles={['Driver']} />} 
          />



        </Routes>
      </Router>
    </>
  );
}

export default AppRoutes;

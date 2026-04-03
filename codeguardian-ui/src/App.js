import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import UpgradePro from './components/UpgradePro';
import PaymentPage from './components/PaymentPage'; // Import your component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/Register" element={<Register />} />
        {/* User Route */}
        <Route path="/Dashboard" element={<Dashboard />} />
        
        {/* Admin Route - THIS IS THE MISSING PIECE */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
         
         <Route path="/upgrade" element={<UpgradePro />} />
         <Route path="/checkout" element={<PaymentPage />} />
        {/* Fallback for 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>
    </Router>
  );
}

export default App;
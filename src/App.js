import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from "./pages/Homepage";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/dashboard" element={<DashboardPage/>} />
                <Route path="/" element={<Homepage />} />
            </Routes>
        </BrowserRouter> 
    </div>
  );
}

export default App;

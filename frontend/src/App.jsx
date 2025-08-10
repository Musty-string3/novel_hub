import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Profile from './pages/Profile/Profile'
import Top from './pages/Top'
import Signup from './pages/auth/Signup'
import VerifyEmail from './pages/auth/VerifyEmail'
import Login from './pages/auth/Login'
import { Toaster } from "./components/ui/toaster";

import './App.css'
import Logout from './pages/auth/Logout'


function App() {
	return (
		<BrowserRouter>
			<Toaster/>
			<Routes>
				<Route path="/" element={<Top />} />
				<Route path="/profile" element={<Profile />} />
				{/* <Route path="/profile/update" element={<ProfileUpdate />} /> */}
				<Route path="/signup" element={<Signup />} />
				<Route path="/accounts/verify_email" element={<VerifyEmail />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
  	)
}

export default App

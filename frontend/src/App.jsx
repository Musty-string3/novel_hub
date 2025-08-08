import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Profile from './pages/Profile/Profile'
import Top from './pages/Top'
import Signup from './pages/auth/Signup'
import VerifyEmail from './pages/auth/VerifyEmail'

import './App.css'


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Top />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/accounts/verify_email" element={<VerifyEmail />} />
				<Route path="/logout" element={<Signup />} />
				<Route path="/login" element={<Signup />} />
			</Routes>
		</BrowserRouter>
  	)
}

export default App

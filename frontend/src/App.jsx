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
				<Route path="/accounts" element={<Profile />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/accounts/verify_email" element={<VerifyEmail />} />
			</Routes>
		</BrowserRouter>
  	)
}

export default App

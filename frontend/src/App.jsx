import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Profile from './pages/Profile/Profile'
import Top from './pages/Top'
import Signup from './pages/auth/Signup'
import VerifyEmail from './pages/auth/VerifyEmail'
import Login from './pages/auth/Login'
import Logout from './pages/auth/Logout'
import ProfileUpdate from './pages/Profile/ProfileUpdate'
import FolderList from './pages/folder/FolderList'
import FolderProvider from './context/FolderContext'
import FolderDetail from './pages/folder/FolderDetail'

import { Toaster } from "./components/ui/toaster";
import './App.css'


function App() {
	return (
		<BrowserRouter>
			<Toaster/>
			<Routes>
				<Route path="/" element={<Top />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/accounts/verify_email" element={<VerifyEmail />} />
				<Route path="/login" element={<Login />} />
				<Route path="/logout" element={<Logout />} />

				<Route path="/profile" element={<Profile />} />
				<Route path="/profile/update" element={<ProfileUpdate />} />

				<Route path="/folders" element={<FolderProvider><FolderList/></FolderProvider>} />
				<Route path="/folders/:id" element={<FolderProvider><FolderDetail/></FolderProvider>} />
			</Routes>
		</BrowserRouter>
  	)
}

export default App

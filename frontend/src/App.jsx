import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

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


// ログイン必須ページ用ラッパー
// ログインしていない場合はログイン画面にリダイレクトさせる
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("accessToken");
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
	return (
		<BrowserRouter>
			<Toaster/>
			<Routes>
				{/* ログインが不要なページ */}
				<Route path="/" element={<Top />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/accounts/verify_email" element={<VerifyEmail />} />
				<Route path="/login" element={<Login />} />

				{/* ログインが必須なページ */}
				<Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
				<Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
				<Route path="/profile/update" element={<PrivateRoute><ProfileUpdate /></PrivateRoute>} />
				<Route path="/folders" element={<PrivateRoute><FolderProvider><FolderList/></FolderProvider></PrivateRoute>} />
				<Route path="/folders/:id" element={<PrivateRoute><FolderProvider><FolderDetail/></FolderProvider></PrivateRoute>} />
			</Routes>
		</BrowserRouter>
  	)
}

export default App

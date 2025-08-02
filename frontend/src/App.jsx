import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile/Profile'
import Top from './pages/Top'

import './App.css'


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Top />} />
				<Route path="/accounts" element={<Profile />} />
			</Routes>
		</BrowserRouter>
  	)
}

export default App

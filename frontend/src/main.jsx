import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import { store } from './app/store';
import { Provider } from 'react-redux';
import App from './App.jsx'

import './index.css'


createRoot(document.getElementById('root')).render(
	<StrictMode>
		{/* Reduxでの全体の状態管理 */}
		<Provider store={store}>
			{/* chakraUIをAppコンポーネントにラッピングすることで全てのコンポーネントやページで使用できる */}
			<ChakraProvider value={defaultSystem}>
				<App />
			</ChakraProvider>
		</Provider>
	</StrictMode>,
)

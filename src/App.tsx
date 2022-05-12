import React from "react";
import { ChakraProvider } from '@chakra-ui/react'
import Main from "./Main";

const App: React.FC = () => {
	return <React.StrictMode>
		<ChakraProvider>
			<Main />
		</ChakraProvider>
	</React.StrictMode>
}

export default App;
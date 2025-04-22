import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { NuiProvider, useNuiEvent, useNuiContext } from "./hooks/useNui";

function AppContent() {
	const { setVisible } = useNuiContext();

	useNuiEvent("toggleUi", (data) => {
		setVisible(data.show);
	});

	return (
		<>
			<h1 style={{ backgroundColor: "black", color: "white" }}>
				The ui is showed
			</h1>
		</>
	);
}

function App() {
	return (
		<NuiProvider>
			<AppContent />
		</NuiProvider>
	);
}

export default App;

import "./App.css";
import { NuiProvider, useNuiEvent, useNuiContext } from "./hooks/useNui";
function App() {
	const { setVisible } = useNuiContext();

	useNuiEvent("toggleUi", (data) => {
		setVisible(data.show);
	});
	return (
		<NuiProvider>
			<AppContent />
		</NuiProvider>
	);
}

export default App;

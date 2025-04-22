import { createContext, useContext, useEffect, useState } from "react";

// Context for managing NUI visibility state
const NuiContext = createContext({
	visible: false,
	setVisible: () => {},
});

/**
 * NuiProvider component that manages the visibility state of the UI
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const NuiProvider = ({ children }) => {
	const [visible, setVisible] = useState(false);

	return (
		<NuiContext.Provider value={{ visible, setVisible }}>
			{visible && <div id="nui-root">{children}</div>}
		</NuiContext.Provider>
	);
};

/**
 * Hook to listen for NUI events from the FiveM client
 * @param {string} action - The action to listen for
 * @param {Function} handler - Callback function to handle the event
 */
export const useNuiEvent = (action, handler) => {
	useEffect(() => {
		const eventListener = (event) => {
			const { data } = event;
			if (data?.action === action) {
				handler(data);
			}
		};

		window.addEventListener("message", eventListener);
		return () => window.removeEventListener("message", eventListener);
	}, [action, handler]);
};

// Listen for ESC key to close UI
window.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		fetch(`https://${GetParentResourceName()}/closeUi`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});
	}
});

/**
 * Hook to access the NUI context
 * @returns {Object} NUI context value
 */
export const useNuiContext = () => {
	return useContext(NuiContext);
};

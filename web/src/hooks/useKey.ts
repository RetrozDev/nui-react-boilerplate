import { useEffect, useState } from "react";

export default function useKey(
	targetKey: string,
	callback: () => void,
	onRelease?: () => void,
) {
	// State for keeping track of whether key is pressed
	const [keyPressed, setKeyPressed] = useState(false);

	// If pressed key is our target key then set to true
	function downHandler({ key }: { key: string }) {
		if (key.toLowerCase() === targetKey.toLowerCase()) {
			setKeyPressed(true);
			callback();
		}
	}

	// If released key is our target key then set to false
	const upHandler = ({ key }: { key: string }) => {
		if (key.toLowerCase() === targetKey.toLowerCase()) {
			setKeyPressed(false);
			onRelease?.();
		}
	};

	// Add event listeners
	useEffect(() => {
		window.addEventListener("keydown", downHandler);
		window.addEventListener("keyup", upHandler);

		// Remove event listeners on cleanup
		return () => {
			window.removeEventListener("keydown", downHandler);
			window.removeEventListener("keyup", upHandler);
		};
	});

	return keyPressed;
}

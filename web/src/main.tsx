import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Ui from "./Ui";
import "./_reset.scss";

// biome-ignore lint/style/noNonNullAssertion: <Default react>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Ui />
	</StrictMode>,
);

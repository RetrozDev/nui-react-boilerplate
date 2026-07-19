import { lazy, Suspense, useState, type LazyExoticComponent } from "react";
import { data } from "./data/default";
import { useNuiEvent } from "./hooks/useNuiEvent";

declare global {
	interface Window {
		GetParentResourceName?: () => string;
	}
}

const params = new URLSearchParams(window.location.search);
const isDev = typeof window.GetParentResourceName !== "function";

type BaseUiMap = {
	menu: typeof data.menu;
};

type BaseUiItem<K extends keyof BaseUiMap> = {
	component: LazyExoticComponent<React.FC<{ data: BaseUiMap[K] }>>;
	data: BaseUiMap[K];
	persistent: boolean;
};

type BaseUi = {
	[K in keyof BaseUiMap]: BaseUiItem<K>;
};

const baseUi: BaseUi = {
	// Example remove when a new UI is created
	menu: {
		component: lazy(() => import("./ui/Menu/Menu")),
		data: data.menu,
		persistent: false,
	},
};

type UiKey = keyof typeof baseUi;

type AnyUiItem = {
	component: LazyExoticComponent<React.FC<{ data: unknown }>>;
	data: unknown;
	persistent: boolean;
	hideHud: boolean;
};

type WebviewToggle = {
	component: UiKey;
	visible: boolean;
	data?: Partial<(typeof baseUi)[UiKey]["data"]>;
};

const isObject = (item: unknown): item is Record<string, unknown> => {
	return !!item && typeof item === "object" && !Array.isArray(item);
};

function deepMerge(
	target: Record<string, unknown>,
	source: Record<string, unknown>,
): Record<string, unknown> {
	if (!source) return target;
	const output = { ...target };
	if (isObject(target) && isObject(source)) {
		for (const key of Object.keys(source)) {
			if (isObject(source[key])) {
				if (!(key in target)) {
					output[key] = source[key];
				} else {
					output[key] = deepMerge(
						target[key] as Record<string, unknown>,
						source[key] as Record<string, unknown>,
					);
				}
			} else {
				output[key] = source[key];
			}
		}
	}
	return output;
}

const Ui = () => {
	const [uiState, setUiState] = useState(baseUi);
	// Set the UI you want to see when you dev
	const [visibleUi, setVisibleUi] = useState<UiKey[]>(isDev ? ["menu"] : []);

	useNuiEvent<WebviewToggle>(
		"toggleWebView",
		({ component, visible, data }) => {
			if (data) {
				setUiState((prev) => ({
					...prev,
					[component]: {
						...prev[component],
						data: deepMerge(
							prev[component].data as Record<string, unknown>,
							data as Record<string, unknown>,
						) as BaseUiMap[typeof component],
					},
				}));
			}

			if (visible) {
				setVisibleUi((prev) => {
					if (prev.includes(component)) return prev;
					return [...prev, component];
				});
			} else {
				setVisibleUi((prev) => prev.filter((key) => key !== component));
			}
		},
	);

	useNuiEvent<{ text: string }>("nui:clipboard", ({ text }) => {
		const el = document.createElement("textarea");
		el.value = text;
		el.style.position = "fixed";
		el.style.opacity = "0";
		document.body.appendChild(el);
		el.focus();
		el.select();
		document.execCommand("copy");
		document.body.removeChild(el);
	});

	const hasPanelParam = Boolean(params.get("panel"));

	const renderComponent = (key: UiKey) => {
		const {
			component: Component,
			data,
			persistent,
		} = uiState[key] as AnyUiItem;
		const isVisible = visibleUi.includes(key);
		const active = isVisible;

		if (persistent) {
			return (
				<div
					key={key}
					style={{
						display: active ? "block" : "none",
						width: "100%",
						height: "100%",
						position: "absolute",
					}}
				>
					<Component data={data} />
				</div>
			);
		}

		if (!isVisible) return null;

		return <Component key={key} data={data} />;
	};

	const persistentKeys = Object.keys(uiState).filter(
		(key) => uiState[key as UiKey].persistent,
	);
	const overlayKeys = Object.keys(uiState).filter(
		(key) => !uiState[key as UiKey].persistent,
	);

	return (
		<main className={isDev ? "dev_bg" : ""}>
			<Suspense fallback={<div />}>
				{hasPanelParam
					? Object.keys(uiState).map((key) => renderComponent(key as UiKey))
					: [
							...persistentKeys.map((key) => renderComponent(key as UiKey)),
							...overlayKeys.map((key) => renderComponent(key as UiKey)),
						]}
			</Suspense>
		</main>
	);
};

export default Ui;

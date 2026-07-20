# ERA-UI — FiveM NUI Boilerplate

A modern, type-safe boilerplate for building NUI  overlays in FiveM using **React 19**, **TypeScript**, and **Vite**. The Lua client communicates with the React frontend through FiveM's `SendNUIMessage` protocol, enabling rich, interactive in-game interfaces.

---

## Architecture

```
┌─────────────────────┐     NUI messages     ┌──────────────────────┐
│   Lua Game Client   │ ◄──────────────────► │   React Frontend     │
│   (client/)         │                      │   (web/src/)         │
│                     │   fetchNui() calls   │                      │
│   Toggles UI        │ ◄──────────────────  │   Renders components │
│   Passes data       │                      │   Listens to events  │
│   Manages focus     │                      │   Calls back to game │
└─────────────────────┘                      └──────────────────────┘
```

- **`web/`** — React + Vite + TypeScript frontend (the NUI layer)
- **`client/`** — Lua scripts loaded by FiveM (toggles UI, passes data)
- **`app/`** — Built output from Vite (served as the NUI page by FiveM)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 (with React Compiler) |
| Language | TypeScript ~6.0 |
| Bundler | Vite 8 |
| Styling | Sass (SCSS) |
| Package Manager | pnpm 10 |
| Linting | ESLint 10 (flat config) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+
- A FiveM server (or [cfx-server-data](https://github.com/citizenfx/cfx-server-data)) for testing in-game

### Installation

```bash
pnpm install
```

### Development

Run the Vite dev server with hot module replacement (HMR) on port 5173:

```bash
pnpm web
```

When running in a browser (not inside FiveM), the menu component displays automatically with a GTA-themed background for easier development. No FiveM client is required for UI development.

### Production Build

Build the React app:

```bash
pnpm build
```

This outputs:
- The React bundle to `app/` (served as the NUI page by FiveM)
- Compiled game scripts to `game/client/` and `game/server/`

---

## Project Structure

```
era-ui/
├── fxmanifest.lua          # FiveM resource manifest
├── .gitignore
├── app/                    # Vite build output (served as ui_page)
│   └── index.html
├── client/                 # Lua client scripts
│   ├── main.lua            # Registers commands (e.g. /test-ui)
│   └── nui/
│       ├── main.lua        # Core Nui.Toggle() helper
│       └── menu.lua        # Menu-specific toggle logic
├── game/                   # TypeScript game scripts
│   ├── client/
│   └── server/
└── web/                    # React frontend source
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx         # React entry point
        ├── Ui.tsx           # Core UI orchestrator
        ├── _reset.scss      # CSS reset (Tailwind Preflight-inspired)
        ├── _ui.scss         # Dev-mode background
        ├── data/default/    # Default component data
        │   ├── index.ts
        │   └── menu.ts
        ├── hooks/           # Custom React hooks
        │   ├── fetchNui.ts       # NUI callback to game
        │   ├── useNuiEvent.ts    # NUI message listener
        │   ├── useKey.ts         # Keyboard input
        │   └── playsound.ts      # Audio playback
        ├── types/data/      # TypeScript types for component data
        │   ├── index.ts
        │   └── menu.d.ts
        └── ui/Menu/        # Example UI component
            └── Menu.tsx
```

---

## Communication Flow

### Lua → React (toggle UI / pass data)

```lua
-- client/nui/menu.lua
Nui.Toggle('menu', true, { title = 'Inventory' }, true, false, false)
--          ^name   ^show  ^data                    ^mouse ^input ^blur
```

The core `Nui.Toggle` function in `client/nui/main.lua` sends a structured message:

```lua
SendNUIMessage({
    action = "toggleWebView",
    data = {
        component = "menu",
        visible = true,
        data = { title = "Inventory" }
    }
})
```

On the React side (`src/Ui.tsx`), `useNuiEvent` listens for `window.message` events, matches `toggleWebView`, and toggles the component. The Lua-side data is **deep-merged** with the component's default data, allowing partial updates.

### React → Lua (call game server)

```ts
import { fetchNui } from "./hooks/fetchNui";

await fetchNui<ReturnType>("myEvent", { payload: "data" });
```

This sends a `POST` request to `https://{resourceName}/myEvent`, which FiveM intercepts and routes to the corresponding server-side callback.

---

## Adding a New UI Component

### 1. Define the type

```ts
// src/types/data/inventory.d.ts
export type InventoryData = {
    title: string;
    items: { name: string; count: number }[];
};
```

Re-export it in `src/types/data/index.ts`:

```ts
export type { InventoryData } from "./inventory";
```

### 2. Add default data

```ts
// src/data/default/inventory.ts
import type { InventoryData } from "../../types/data";

export const menuData: InventoryData = {
    title: "Inventory",
    items: [],
};
```

### 3. Register the component in `BaseUiMap`

In `src/Ui.tsx`, add the type mapping:

```ts
type BaseUiMap = {
    menu: typeof data.menu;       // existing
    inventory: InventoryData;     // new
};
```

Then add it to the `baseUi` registry:

```ts
const baseUi: BaseUi = {
    menu: { /* ... */ },
    inventory: {
        component: lazy(() => import("./ui/Inventory/Inventory")),
        data: data.inventory,
        persistent: false,  // true = stays mounted, toggled via display
    },
};
```

### 4. Create the component

```tsx
// src/ui/Inventory/Inventory.tsx
import type { InventoryData } from "../../types/data";

const Inventory: React.FC<{ data: InventoryData }> = ({ data }) => {
    return <h1>{data.title}</h1>;
};

export default Inventory;
```

### 5. Add Lua toggle

```lua
-- client/nui/inventory.lua
Nui.Inventory = {}
local opened = false
Nui.Inventory.Toggle = function()
    opened = not opened
    Nui.Toggle('inventory', opened, {
        items = { { name = 'Water', count = 3 } }
    }, true, false, false)
end
```

---

## Nui.Toggle Parameters

`client/nui/main.lua`:

| Parameter | Type | Description |
|---|---|---|
| `component` | `string` | React component key (matches `baseUi` registry) |
| `visible` | `boolean` | Show or hide the UI |
| `data` | `any` | Data passed as props to the component |
| `useMouse` | `boolean` | Enable mouse focus in NUI |
| `keepInput` | `boolean` | Allow game input while NUI is focused |
| `blur` | `boolean` | Apply screen blur behind the UI |

---

## Hooks Reference

### `useNuiEvent(eventName, handler)`

Listens for NUI messages of a specific type. Automatically cleans up on unmount.

```ts
useNuiEvent<{ text: string }>("myEvent", (data) => {
    console.log(data.text);
});
```

### `fetchNui(eventName, data)`

Sends a callback to the FiveM server / client.

```ts
const result = await fetchNui<{ success: boolean }>("saveItems", { items });
```

### `useKey(key, options)`

Tracks key press state.

```ts
const isPressed = useKey("E", {
    onPress: () => interact(),
    onRelease: () => stopInteract(),
});
```

### `playsound`

Plays an audio file.

```ts
playsound("assets/sounds/click.ogg");
```

---

## Dev Mode

When running in a browser (outside FiveM), the app detects dev mode automatically:

- The `menu` component is shown by default
- A GTA-themed background is applied (see `_ui.scss`)
- `fetchNui` calls will fail gracefully (no FiveM server)
- Use `?panel` in the URL to render all registered components simultaneously

---

## Scripts

### Web (`web/`)

| Script | Description |
|---|---|
| `pnpm dev` | Start Vite dev server (port 5173) |
| `pnpm build` | `tsc -b && vite build` |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview production build locally |

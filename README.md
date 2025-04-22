# NUI React Boilerplate for FiveM

A modern React boilerplate for creating NUI (New User Interface) resources for FiveM.

## Features

- React 18 
- Vite for fast development and building
- TailwindCSS for styling
- Biome Js for code quality
- Hot module replacement (HMR) for development
- Pre-configured FiveM NUI callbacks and events

## Getting Started

1. Clone this repository into your FiveM resources folder
2. Install dependencies:
    ```
    cd nui-react-boilerplate
    npm install
    ```
3. Start development server:
    ```
    npm run dev
    ```
4. Build for production:
    ```
    npm run build
    ```

## Structure

```
nui-react-boilerplate/
├── fxmanifest.lua       # FiveM resource manifest
├── client/              # Client-side scripts
├── server/              # Server-side scripts
└── web/                 # React NUI application
     ├── public/          # Static assets
     ├── src/             # Source code
     ├── package.json     # Dependencies
     └── vite.config.ts   # Vite configuration
```

## Usage

Import the NuiProvider and useNuiEvent hook in your components to communicate with the FiveM client:

```jsx
import { NuiProvider, useNuiEvent } from './hooks/useNui';

function App() {
  useNuiEvent('showUI', (data) => {
     // Handle event from client
  });
  
  return (
     <NuiProvider>
        {/* Your UI components */}
     </NuiProvider>
  );
}
```

## License

MIT

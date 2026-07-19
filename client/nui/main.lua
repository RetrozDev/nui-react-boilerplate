Nui = Nui or {}

---@desc Toggles a NUI (React) interface, handling visibility, focus, input behavior, and screen blur.
---
---@param component string @Name of the React component to display (e.g. "inventory", "menu")
---@param visible boolean @Whether the UI should be shown or hidden
---@param data any @Data passed to the component (props on the React side)
---@param useMouse boolean @Enables or disables mouse focus for the NUI
---@param keepInput boolean @Allows game input to continue while the UI is focused
---@param blur boolean @Enables or disables screen blur effect
---
---@return nil
Nui.Toggle = function(component, visible, data, useMouse, keepInput, blur)
    SendNUIMessage({
        action = "toggleWebView",
        data = {
            component = component,
            visible = visible,
            data = data
        }
    })

    if blur == true then
        TriggerScreenblurFadeIn(250.0)
    else
        TriggerScreenblurFadeOut(250.0)
    end

    SetNuiFocus(useMouse, useMouse)
    SetNuiFocusKeepInput(keepInput)
end

local isUiShowing = false

local function toggleUi(show)
    isUiShowing = show
    SetNuiFocus(show, show)
    SendNUIMessage({
        action = "toggleUi",
        show = show
    })
end

RegisterCommand("ui", function()
    toggleUi(not isUiShowing)
end, false)

RegisterNUICallback("closeUi", function(data, cb)
    toggleUi(false)
    cb("ok")
end)
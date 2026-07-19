Nui = Nui or {}

Nui.Menu = {}
local menuOppened = false
Nui.Menu.Toggle = function()
    menuOppened = not menuOppened
    Nui.Toggle('menu', menuOppened, {
        title = 'Hello world'
    }, true, false, false)
end

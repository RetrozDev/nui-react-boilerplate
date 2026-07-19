fx_version "cerulean"
games      { "gta5" }

client_script "game/client/index.js"
server_script "game/server/index.js"



ui_page 'app/index.html'

files {
    'app/**/*',
    'app/index.html',
}


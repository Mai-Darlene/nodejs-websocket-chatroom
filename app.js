var ws = require('nodejs-websocket')
var server = ws.createServer(function (conn) {
    console.log('已经监听')

    conn.on('text', function (str) {
        console.log(str)
        // boardcast(str)
        var data = JSON.parse(str)
        switch (data.type) {
            case 'setname':
                conn.nickname = data.name;
                boardcast(JSON.stringify({
                    name: 'Server',
                    text: data.name + '加入了房间'
                }))
                break
            case 'chat':
                boardcast(JSON.stringify({
                    name: conn.nickname,
                    text: data.text,
                    type: 'chat'
                }))
                break
            case 'file':
                var host = 'http://localhost:3002/'
                var location = data.text.path.split('\\').join('/')
                boardcast(JSON.stringify({
                    name: conn.nickname,
                    text: host + location,
                    type: 'file'
                }))
                break
            default:
                break
        }
    })
    conn.on('file', function (blob) {

    })
    conn.on('close', function () {
        boardcast(JSON.stringify({
            name: 'Server',
            text: conn.nickname + '加入了房间'
        }))
    })
    conn.on('error', function (e) {
        console.log(e)
    })

}).listen(2333)


function boardcast(str) {
    server.connections.forEach(function (conn) {
        conn.sendText(str)
    })
}
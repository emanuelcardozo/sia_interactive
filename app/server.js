const path = require('path')
const app = require('express')()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3001;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

io.on('connection', function() {
    console.log('new Connection')
})

server.listen(port, function(){
    console.log('Server listening on port', port)
})
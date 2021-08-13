const path = require('path')
const app = require('express')()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
const port = 3001;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/video', function(req, res) {
    const videoPath = path.join(__dirname, 'public', 'video.mp4');
    const fileSize = fs.statSync(videoPath).size
    const { range } = req.headers

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(videoPath, {start, end})
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(videoPath).pipe(res)
    }
});

io.on('connection', function(socket) {
    socket.on('play', function(){
        console.log('Broadcasting play event...')
        socket.broadcast.emit('play')
    })

    socket.on('pause', function(){
        console.log('Broadcasting pause event...')
        socket.broadcast.emit('pause')
    })

    socket.on('progressChange', function(currentTime){
        console.log('Broadcasting progress change event...')
        socket.broadcast.emit('progressChange', currentTime)
    })
})

server.listen(port, function(){
    console.log('Server listening on port', port)
})
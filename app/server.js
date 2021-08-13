const path = require('path')
const app = require('express')()
const port = 3000

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.listen(port, function(){
    console.log('Server listening on port', port)
})
const dnaManagerClass = require('./typingdnaREST.js'),
      dnaManagerObj = new dnaManagerClass('e28793ebc23875f80328ebfab3e975f2','ca80f232cede48799ee23625318f9fba'),
      express = require('express'),
      app = express(),
      port = process.env.port || 3000,
      cors = require('cors')

app.use(cors())

app.listen(port, () => {
    console.log(`port ${port} active listening`)
}) 

app.get('/', (req,res) => {
    res.send("Welcome to the api home page")
})

app.get('/api/get/user/:id', (req,res) => {
    dnaManagerObj.checkUser(req.params.id, (val) => {
        res.send(val)
    })
})

app.get('/api/get/verifyPattern/:id/:pattern/:quality',( req,res) => {
    
    dnaManagerObj.verifyPattern(req.params.id, req.params.pattern, req.params.quality, (val) => {
        res.send(val)
    })
})

app.get('/api/post/addPattern/:id/:pattern', (req, res) => {
    dnaManagerObj.addPattern(req.params.id, req.params.pattern, (val) => {
        res.send(val)
    })
})

app.get('/api/post/deleteUser/:id', (req,res) => {
    dnaManagerObj.deleteUser(req.params.id, (val) => {
        res.send(val)
    })
})


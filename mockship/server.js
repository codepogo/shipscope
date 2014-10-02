var projects = require('./data.js').projects,
    express = require('express')

/**
 * 1. open server
 * 2. respond to requests with project
 */

var app = express(),
    server = app.listen(3030, function() {
      console.log('mockserver is ready to go on port 3030')
    })

app.get('/', function(req, res) {
  res.type('application/json').send(projects)
})
app.get('/projects.json', function(req, res) {
  res.type('application/json').send(projects)
})

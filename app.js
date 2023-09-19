const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

// const { Server } = require ("socket.io");
// const { v4: uuidV4 } = require ('uuid');
// const http = require('http');
// const server = http.createServer(app);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8082');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//videos route
const Videos = require('./routes/Videos')
app.use('/videos', Videos)
app.use('/videos/video/:id', Videos)
app.use('/videos/video/:id/caption', Videos)
app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
 });



app.listen(5000, () => {
    console.log('Listening on port 5000!')
});
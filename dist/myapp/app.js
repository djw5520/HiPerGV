'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var Parser = require('./public/javascripts/Parser');
var Graph = require('./public/javascripts/Graph');
var Vertex = require('./public/javascripts/Vertex');
var Edge = require('./public/javascripts/Edge');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var G = void 0,
    LH = void 0,
    filename = null;

var d1 = new Date();
var t1 = d1.getTime();

if (process.argv.length === 4) {
    filename = process.argv[2];
    var delimiter = process.argv[3];

    // Populate G with the Graph returned from Parser
    Parser.parseInputTabs(filename, delimiter).then(function (G) {
        LH = G;
        LH.init();
        LH.kcore_imp();

        var d2 = new Date();
        var t2 = d2.getTime();

        console.log("Up and running in " + (t2 - t1) + " milliseconds");
    });

    //
    // LH.BCCDecomp();
} else {
    console.log('Not enough arguments: please format you command as: "npm start \'testfile\' t|s"');
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
module.exports = app;
//# sourceMappingURL=app.js.map
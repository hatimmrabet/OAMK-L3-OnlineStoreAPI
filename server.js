const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const userComponent = require('./components/users');
const itemComponent = require('./components/items');
const loginComponent = require('./components/login')
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

// You can store key-value pairs in express, here we store the port setting
app.set('port', (process.env.PORT || port));

app.get('/', function(req, res) {
    res.status(200);
    res.send("Welcome to My API, M'rabet El Khomssi Hatim");
});

app.use('/users/login', loginComponent.router)
app.use('/users', userComponent);
app.use('/items', itemComponent);


/* This will be activated as the last if no other route matches. */
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404; // Set status code to 404
    next(err);  /* If you pass anything to the next() function (except the string 'route'),
                 Express regards the current request as being an error and will skip any
                 remaining non-error handling routing and middleware functions. */
});

/* This is an error handling middleware, the function has four parameters.
   See https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling */
app.use((err, req, res, next) => {
    if(err.hasOwnProperty('status') == true) {
      const date = new Date();
      console.error(date.toUTCString() + ' - ' + err.toString());
      console.error('Path attempted - ' + req.path)

      res.status(err.status);
      res.json({
        reason: err.toString()
      });
    }
    else {
      next();
    }
});

let serverInstance = null;

module.exports = {
  start: function() {
    serverInstance = app.listen(app.get('port'), () => {
      console.log(`\nExample API listening on http://localhost:`+app.get('port'));
      console.log('Available API endpoints');
      console.log('  /users \t\t\t[GET, POST]');
      console.log('  /users/{username}\t\t[GET]');
      console.log('  /users/login\t\t\t[GET]');
      console.log('-- Private endpoints :');
      console.log('  /items\t\t\t\t[GET, POST]');
      console.log('  /items/{itemID}\t\t\t[GET, PUT, DELETE]');
      console.log('  /items/{itemID}/images\t\t[POST]');
      console.log('  /items/{itemID}/images/{imageID}\t[PUT]');
      console.log('-- Public endpoints :');
      console.log('  /items/search-by/category/{categoryName}\t\t[GET]');
      console.log('  /items/search-by/location/{contryCode}/{cityName\t[GET]');
      console.log('  /items/search-by/date/{startDate}/{endDate}\t\t[GET]');
      console.log(' -> Use for example curl or Postman tools to send HTTP requests to the endpoints\t');
    })
  },
  startTest: function() { //start server for Mocha tests
    serverInstance = app.listen(port, () => {})
  },
  close: function() {
    serverInstance.close();
  },
}
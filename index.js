var request = require('request'); // for making API calls
var bodyParser = require('body-parser');
var pg = require('pg');
var FormData = require('form-data');

// port = process.env.PORT for deploying on cloud host (need this for heroku anyway, 8080 for local testing

// setting up express 4 server & socket.io
var express = require('express');
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var server = require('http').createServer(app);
var io = require('socket.io').listen(server)

var port = process.env.PORT || 8080;
server.listen(port, function() {
    console.log('Server running on :' + port);
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// static files are stored in the public folder
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/genometoken', function(req, res) {
    var accessToken;
    console.log(req.query.code);
    res.render('index');

    request.post('https://api.23andme.com/token/', {
      form: {
        client_id : 'be256e46c1e76dd5e8c76197f9168bed' ,
        client_secret : 'fdc2dceabe85b0336e7bc99b5eb6a4c3' ,
        grant_type: 'authorization_code',
        code : req.query.code ,
        redirect_uri : 'http://localhost:8080/genometoken',
        scope :'genomes basic'
      },
      json: true
    }, function (error, response, body) {
      // assert.equal(typeof body, 'object')
      if(error) {
          console.log(error);
      } else {
          console.log(response.statusCode, body);
          console.log(body.access_token);
          accessToken = body.access_token;
          //getting the user id
          request({
              url: 'https://api.23andme.com/1/user/', //URL to hit
              method: 'GET', //Specify the method
              headers: { //We can define headers too
                  'Authorization': 'Bearer' + ' ' + accessToken
              }
          }, function(error, response, body){
              if(error) {
                  console.log(error);
              } else {
                  console.log(response.statusCode, body);
                  console.log(body.profiles[0].id);
              }
          });
        }
    });


    /*request({
        url: 'https://api.23andme.com/token/', //URL to hit
        //qs: {from: 'blog example', time: +new Date()}, //Query string data
        method: 'POST',
        //Lets post the following key/values as form
        /*auth: {

        },*/
        /*json: true,
        formData: {
          client_id : 'be256e46c1e76dd5e8c76197f9168bed' ,
          client_secret : 'fdc2dceabe85b0336e7bc99b5eb6a4c3' ,
          grant_type: 'authorization_code',
          code : req.query ,
          redirect_uri : 'http://localhost:8080/genometoken',
          scope :'genomes'
        }*/
        /*json: {
            "client_id" : "be256e46c1e76dd5e8c76197f9168bed" ,
            "client_secret" : "fdc2dceabe85b0336e7bc99b5eb6a4c3" ,
            'grant_type' : 'authorization_code',
            "code" : req.query ,
            "redirect_uri" : "http://localhost:8080/genometoken",
            "scope" :"genomes"
        }
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
    }
  });*/
});

//initialize and authenticate watson PI
/*var watson = require('watson-developer-cloud/personality-insights/v3');
var personality_insights = new PersonalityInsightsV3({
  username: 'd46914ad-553b-4f92-a85a-d3f1f7ed1379',
  password: '87htHzhora8H',
  version-date: '2016-10-20'
});

var params = {
  // Get the content items from the JSON file.
  content_items: require('./profile.json').contentItems,
  consumption_preferences: true,
  raw_scores: true,
  headers: {
    'accept-language': 'en',
    'accept': 'application/json'
  }
};

personality_insights.profile(params, function(error, response) {
  if (error)
    console.log('error:', error);
  else
    console.log(JSON.stringify(response, null, 2));
  }
);*/

io.on("connection", function(socket) {
    socket.emit("whatever", {
        item1: "this is the first item",
        item2: "this is the second item",
        someNumbers: [1, 2, 3, 4]
    });
});

setTimeout(function() {
    // or to just emit at an arbitary time:
    io.sockets.emit("whatever", {
        item1: "this is the first item",
        item2: "this is the second item",
        someNumbers: [1, 2, 3, 4]
    });
}, 7000);

app.post('/test', function(req, res) {
    console.log('user clicked button');
    //console.log(JSON.stringify(req));
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.body.data1));

    var client = new pg.Client();

    var client = new pg.Client();

    // connect to our database
    client.connect(function (err) {
    if (err) throw err;

    // execute a query on our database
    client.query('INSERT INTO testtable VALUES (-99, -99)', function (err, result) {
        if (err) throw err;

        client.end(function (err) {
        if (err) throw err;

        else {
            console.log(JSON.stringify(result.rows));
        }
        });
    });
    });

    res.send({status: "Success"});


})

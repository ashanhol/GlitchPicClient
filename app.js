var express = require('express');
var https = require('https');
var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage })

var app = express();
app.use(express.static('public'))

app.get('/', function () {})

app.listen(3000, function () {
  console.log('Glitch app listening on port 3000!')
})

//Post request when user uploads a file
app.post('/upload', upload.single('file'), function (req, res, next) {

  console.log(req.body.type);
  //Data is the JSON object sent to the Azure function. Will contain the type of glitch and picture. 
  var data = {"type": req.body.type, "base64Picture": req.file.buffer.toString('base64')};
  var options = {
    hostname: 'glitchfunction.azurewebsites.net',
    port: 443,
    path: '/api/GlitchWebhookCsharp?code=AaiiPgczD04wrwJpC0taN4oZdpD1D/bPFZtIfIlyekU4gBnjwZWK4g==',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  //The actual http request sent to azure functions
  var funcreq = https.request(options, function(funcres) {
  
    console.log('STATUS: ' + funcres.statusCode);
    console.log('HEADERS: ' + JSON.stringify(funcres.headers));
    funcres.setEncoding('utf8');

    //Get back the glitched picture from azure functions
    var picData = "";
    funcres.on('data', function (chunk) {
      picData += chunk; 
    });
    
    funcres.on('end', function(){
      var jsonResponse = JSON.parse(picData);
      if (jsonResponse.base64Picture) {
        console.log('got image back from azure function');
        // send json response back to front end client
        res.send({image: jsonResponse.base64Picture});
      } else {
        // oops something went wrong
        res.status(500).send({error: "we could not get your pic glitched, sorry :("});
      }
    })
  });

  funcreq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  funcreq.write(JSON.stringify(data));
  funcreq.end();

});


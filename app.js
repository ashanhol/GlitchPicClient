var express = require('express');
var https = require('https');
var base64Img = require('base64-img');
var fs = require('fs');
var nbaseimg = require('node-base64-image'); 

var app = express();
//var server = require('http').createServer(app); 
//var port = process.env.PORT || 3000;
//server.listen(port);




/*JSON.parse(JSON.stringify(data), function(key, value){
      if(key == "base64Picture"){
        var buf = Buffer.from(value);
        fs.writeFile('glitch.png', buf, 'base64', function(err){
          console.log(err);
        })
      }
        fs.writeFile("glitchpic.txt", value, function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("The file was saved!"); 
        });
        base64Img.img(value, '', 'glitchpic.jpg', function(err, filepath) {console.log(err)});
      }
    });*/


var options = {
  hostname: 'glitchfunction.azurewebsites.net',
  port: 443,
  path: '/api/GlitchWebhookCsharp?code=AaiiPgczD04wrwJpC0taN4oZdpD1D/bPFZtIfIlyekU4gBnjwZWK4g==',
  method: 'POST',
  headers: {
        'Content-Type': 'application/json',
    }
};

var req = https.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  var picData = [];
  res.on('data', function (chunk) {
    picData.push(chunk); 
  }).on('end', function(){
    JSON.parse(picData, function(key, value){
      if(key == "base64Picture"){
        fs.writeFile("glitchpic.jpeg", response, 'base64', function(err) {
          if(err) {
            console.log(err);
          }
          console.log("The file was saved!"); 
        });
        //base64Img.img(value, '', 'glitchpic.jpg', function(err, filepath) {console.log(err)});
      }
    })
  })
});



req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(JSON.stringify(data));
req.end();
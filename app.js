var express = require('express');
var https = require('https');
var fs = require('fs');
var path = require('path');
//var bodyParser = require('body-parser')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var app = express();
app.use(express.static('public'))

app.get('/', function (req, res) {
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
//var server = require('http').createServer(app); 
//var port = process.env.PORT || 3000;
//server.listen(port);

//Post request when user uploads a file
app.post('/upload', upload.single('file'), function (req, res, next) {
    var tempPath = req.file.path,
        targetPath = path.resolve('./temp/image.png');
    
    //Turn file user uploaded into a buffer
    fs.readFile(tempPath, (rderr, filedata) => {
      if (rderr) console.log(rderr);

      //Data is the JSON object sent to the Azure function. Will contain the type of glitch and picture. 
      var data = {"type": "3", "base64Picture": new Buffer(filedata).toString('base64')};
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
      var req = https.request(options, function(res) {
        //try to delete the uploaded picture file since it's already read in
        fs.unlink(tempPath, function (delerr) {
              if (delerr) console.log(relerr);
        });
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');

        //Get back the glitched picture from azure functions
        var picData = "";
        res.on('data', function (chunk) {
          picData += chunk; 
        }).on('end', function(){
          JSON.parse(picData, function(key, value){
            if(key == "base64Picture"){
              //Decode the picture and write it to a file 
              //TODO: make it display on the web page
              var imageBuffer = decodeBase64Image(value);
              fs.writeFile("temp/glitchpic.jpg", imageBuffer.data, function(wrterr) {
                if(wrterr) console.log(err);
                console.log("The file was saved!"); 
              });
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

    });
  //  if (path.extname(req.file.toString()).toLowerCase() === '.png') {
        

        
        /*fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            console.log("Upload completed!");
        });*/
 //   } else {
  //      fs.unlink(tempPath, function () {
   //         if (err) throw err;
   //         console.error("Only .png files are allowed!");
   //     });
   // }
  });



function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};
    if (matches.length !== 3) { return new Error('Invalid input string'); }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

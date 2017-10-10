var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var twilio = require('twilio');

var oConnections = {};

// Define the port to run on
app.set('port', process.env.PORT || parseInt(process.argv.pop()) || 5100);

// Define the Document Root path
var sPath = path.join(__dirname, '.');

app.use(express.static(sPath));
app.use(bodyParser.urlencoded({ extended: true }));

function fChestOrWindow(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("chest") != -1){
    twiml.message("You find yourself in the attic of a haunted house. Will you inspect the wooden chest or the dusty window?");
    oConnections[sFrom].fCurState = fChestOrWindow;
  }else if(sAction.toLowerCase().search("window") != -1){  
    twiml.message("You walk into the kitchen, where you find another staircase. Will you go down?");
    oConnections[sFrom].fCurState = fDownStaircase
  }else {
    twiml.message("I'm sorry, I didn't understand that. Will you inspect the wooden chest or the dusty window?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fDownStaircase(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("yes") != -1){
    twiml.message("You find yourself in the attic of a haunted house. Will you inspect the wooden chest or the dusty window?");
    oConnections[sFrom].fCurState = fChestOrWindow;
  }else if(sAction.toLowerCase().search("no") != -1){  
    twiml.message("You walk into the kitchen, where you find another staircase. Will you go down?");
    oConnections[sFrom].fCurState = fDownStaircase
  }else {
    twiml.message("That was a yes or no question. Will you descend the staircase?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fUpStaircase(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("yes") != -1){
    twiml.message("You find yourself in the attic of a haunted house. Will you inspect the wooden chest or the dusty window?");
    oConnections[sFrom].fCurState = fChestOrWindow;
  }else if(sAction.toLowerCase().search("no") != -1){  
    twiml.message("You walk into the kitchen, where you find another staircase. Will you go down?");
    oConnections[sFrom].fCurState = fDownStaircase
  }else {
    twiml.message("That was a yes or no question. Will you ascend the staircase?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fBeginning(req, res){
  var sFrom = req.body.From;
  oConnections[sFrom].fCurState = fUpStaircase;
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('You find yourself in a haunted house. It is spooky scary. You see a staircase. Will you go up?');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());

}

//define a method for the twilio webhook
app.post('/sms', function(req, res) {
  var sFrom = req.body.From;
  if(!oConnections.hasOwnProperty(sFrom)){
    oConnections[sFrom] = {"fCurState":fBeginning};
  }
  oConnections[sFrom].fCurState(req, res);
});

// Listen for requests
var server = app.listen(app.get('port'), () =>{
  var port = server.address().port;
  console.log('Listening on localhost:' + port);
  console.log("Document Root is " + sPath);
});
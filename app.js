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

function fCellphone(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("yes") != -1){
    twiml.message("You look at your phone, and notice that you had accidentally left J.S. Bach's Well-Tempered Klavier playing on your phone. Whoops! You exit the haunted house, and listen to Bach in peace.");
    oConnections[sFrom].fCurState = fBeginning;
  }else if(sAction.toLowerCase().search("no") != -1){  
    twiml.message("There must be a ghost playing the piano! You wait for him to finish playing, and then applaud. Out of gratitude, he shows you to the end of the game. Congratulations!");
    oConnections[sFrom].fCurState = fBeginning
  }else {
    twiml.message("That was a yes or no question. Could the music be coming from your cellphone?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fLivingRoomOrLeave(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("enter") != -1){
    twiml.message("You enter the living room and notice a piano. You hear music, although you see nobody playing. Could the music simply be coming from your cellphone?");
    oConnections[sFrom].fCurState = fCellphone;
  }else if(sAction.toLowerCase().search("leave") != -1){  
    twiml.message("You have left the haunted house. Congratulations!");
    oConnections[sFrom].fCurState = fBeginning
  }else {
    twiml.message("I didn't understand that. Will you ENTER the living room or LEAVE the haunted house?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fScreenDoor(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("yes") != -1){
    twiml.message("You exit through the screen door and notice that you've left the haunted house. Congratulations!");
    oConnections[sFrom].fCurState = fBeginning;
  }else if(sAction.toLowerCase().search("no") != -1){  
    twiml.message("Will you enter the living room or leave the haunted house?");
    oConnections[sFrom].fCurState = fLivingRoomOrLeave
  }else {
    twiml.message("That was a yes or no question. Will you leave through the screen door?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fSandwich(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("yes") != -1){
    twiml.message("You bite into the sandwich and find something crunchy... It's the end of the game, congratulations!");
    oConnections[sFrom].fCurState = fBeginning;
  }else if(sAction.toLowerCase().search("no") != -1){  
    twiml.message("You see a screen door leading to the backyard. Will you leave through the screen door?");
    oConnections[sFrom].fCurState = fScreenDoor
  }else {
    twiml.message("That was a yes or no question. Will you make a sandwich?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fDownStaircase(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("yes") != -1){
    twiml.message("You find yourself in the basement of a haunted house. It is super spooky scary. It's so scary that you get scared and run out of the house. Congratulations!");
    oConnections[sFrom].fCurState = fBeginning;
  }else if(sAction.toLowerCase().search("no") != -1){  
    twiml.message("You investigate the fridge. Will you make a sandwich?");
    oConnections[sFrom].fCurState = fSandwich
  }else {
    twiml.message("That was a yes or no question. Will you descend the staircase?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fBackDownstairs(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("yes") != -1){
    twiml.message("You go back downstairs and walk into the kitchen, where you find another staircase. Will you go down?");
    oConnections[sFrom].fCurState = fDownStaircase;
  }else if(sAction.toLowerCase().search("no") != -1){  
    twiml.message("You are eaten by a grue.");
    oConnections[sFrom].fCurState = fBeginning
  }else {
    twiml.message("That was a yes or no question. Will you go back downstairs?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fDustWindow(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("yes") != -1){
    twiml.message("You dust the window, and you find that it is now clean. You look out the window and find the end of the game. Congratulations!");
    oConnections[sFrom].fCurState = fBeginning;
  }else if(sAction.toLowerCase().search("no") != -1){  
    twiml.message("You are in a cold, dark, dusty attic. You have a suspicion that you are likely to be eaten by a grue. Will you go back downstairs?");
    oConnections[sFrom].fCurState = fBackDownstairs
  }else {
    twiml.message("That was a yes or no question. Will you dust the dusty window?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fChestOrWindow(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("chest") != -1){
    twiml.message("You open a chest and you find the end of the game. Congratulations!");
    oConnections[sFrom].fCurState = fBeginning;
  }else if(sAction.toLowerCase().search("window") != -1){  
    twiml.message("You approach the dusty window, and find that it's even dustier than you expected. Will you dust the window?");
    oConnections[sFrom].fCurState = fDustWindow
  }else {
    twiml.message("I'm sorry, I didn't understand that. Will you inspect the wooden chest or the dusty window?")
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
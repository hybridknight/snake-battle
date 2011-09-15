var fs = require('fs');
var nowjs = require('now');
var Snake = require('./Snake').Snake;
var Map = require('./Snake').Map;

var server = require('http').createServer(function(req, response) {
  fs.readFile('../client/index.html', function(err, data) {
    response.writeHead(200, {
      'Content-Type' : 'text/html'
    });
    response.write(data);
    response.end();
  });
});
server.listen(80);

var everyone = nowjs.initialize(server);

var groupName = 'level1';
var gameSpeed = 500;
var group = nowjs.getGroup(groupName);
var gameStepInterval;
var map;
var mapWidth = 60;
var mapHeight = 40;

everyone.connected(function() {
  console.log("Joined: " + this.now.name + ' clientId: ' + this.socket.id);
  group.addUser(this.socket.id);
  
  printGroupList();
  
  checkGameLoop(this.socket.id);
  map.spawnSnake(this.socket.id);
});

everyone.disconnected(function() {
  console.log("Left: " + this.now.name + ' clientId: ' + this.socket.id);
  group.removeUser(this.socket.id);
  
  printGroupList();
  
  checkGameLoop(this.socket.id);
  map.destroySnake(this.socket.id);
});

function checkGameLoop(clientId){
  group.count(function (ct) {
    if(ct > 0 && !gameStepInterval){
      setupGame();
      gameStepInterval = setInterval(function(){
        gameStep();
      }, gameSpeed);
      console.log('start game loop');
    }else if(ct === 0){
      clearInterval(gameStepInterval);
      console.log('stop game loop');
      gameStepInterval = null;
    }
  });
}

function setupGame(){
  map = new Map(mapWidth, mapHeight);
}

function gameStep(){
  var gotMap = map.getMap();
  group.now.drawMap(gotMap);
  //console.log(gotMap.snakes);
}

function printGroupList(){
  console.log('group: ' + groupName);
  group.getUsers(function (users) {
    for (var i = 0; i < users.length; i++) console.log((i + 1) + '. ' + users[i]);
  });
}

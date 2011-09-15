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
var gameSpeed = 250;
var group = nowjs.getGroup(groupName);
var gameStepInterval;
var maps = {};
var mapWidth = 60;
var mapHeight = 40;

everyone.connected(function() {
  console.log("Joined: " + this.now.name + ' clientId: ' + this.socket.id);
  group.addUser(this.socket.id);
  
  printGroupList();
  checkGameLoop();
  var snake = maps[groupName].spawnSnake(this.now.name);
});

everyone.disconnected(function() {
  console.log("Left: " + this.now.name + ' clientId: ' + this.socket.id);
  group.removeUser(this.socket.id);
  
  printGroupList();
  checkGameLoop();
  maps[groupName].destroySnake(this.now.name);
});

function checkGameLoop(){
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
  var map = new Map(mapWidth, mapHeight);
  maps[groupName] = map;
}

function gameStep(){
	var map = maps[groupName];
	map.moveSnakes();
  var gotMap = map.getMap();
  group.now.drawMap(gotMap);
}

everyone.now.setDirection = function(direction){
	var map = maps[groupName];
	var snake = map.getSnake(this.now.name);
	if(snake){
		var got = snake.setDirection(parseInt(direction));
	}
}

function printGroupList(){
  console.log('group: ' + groupName);
  group.getUsers(function (users) {
    for (var i = 0; i < users.length; i++) console.log((i + 1) + '. ' + users[i]);
  });
}

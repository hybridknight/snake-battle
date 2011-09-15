var Snake = function(name, map, x, y){
  this.name = name;
  this.map = map;
  this.body = [{
    x: x,
    y: y
  }];
  this.direction = 1;
  console.log('Snake ' + name + ' was born at ' + x + ', ' + y);
}

Snake.prototype.move = function(){
  for(var i in this.body){
    var segment = this.body[i];
    // @TODO: move snakes !!!
  }
}

Snake.prototype.setDirection = function(direction){
  this.direction = direction < 4 && direction >= 0 ? direction : this.direction;
}

var Map = function(width, height){
  this.width = width;
  this.height = height;
  this.snakes = {};
}

Map.prototype.moveSnake = function(){
  for(var i in this.snakes){
    snakes[i].move();
  }
}

Map.prototype.spawnSnake = function(name){
  var x;
  var y;
  var snakes = this.snakes;
  var width = this.width;
  var height = this.height;
  while(true){
    x = Math.floor(Math.random() * width - 1);
    y = Math.floor(Math.random() * height - 1);
    var found = false;
    for(var i in snakes){
      var snake = snakes[i];
      for(var j in snake.body){
        if(snake.body[j].x == x && snake.body[j].y == y){
          found = true;
          break;
        }
      }
    }
    if(!found){
      break;
    }
  }
  
  var snake = new Snake(name, this, x, y);
  snakes[name] = snake;
}

Map.prototype.destroySnake = function(name){
  delete this.snakes[name];
}

Map.prototype.getSnakes = function(){
  var snakes = {}
  for(var i in this.snakes){
    snakes[i] = {};
    snakes[i].name = this.snakes[i].name;
    snakes[i].body = this.snakes[i].body;
  }
  return snakes;
}

Map.prototype.getMap = function(){
  return {
    width: this.width,
    height: this.height,
    snakes: this.getSnakes()
  }
}

exports.Map = Map;
exports.Snake = Snake;
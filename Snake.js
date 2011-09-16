var CHERRY_SCORE = 5;
var CHERRY_COLOR = 'red';
var Snake = function(id, name, map, x, y){
  this.id = id;
  this.score = 0;
  this.name = name;
  this.map = map;
  this.die = false;
  this.head = {
    x: x,
    y: y
  }
  
  this.body = [{
    x: x,
    y: y
  },{
  	x: x + 1,
  	y: y
  }];
  
  this.tail = null;
  this.direction = 1;
  this.toDirection = 1;
  this.color = get_random_color();
  console.log('Snake ' + name + ' was born at ' + x + ', ' + y);
}

Snake.prototype.setName = function(name){
  this.name = name;
}

Snake.prototype.move = function(){
	var body = this.body;
	var width = this.map.width;
	var height = this.map.height;
	var direction = this.direction = this.toDirection;
	var head = body[0];
	var x = head.x;
	var y = head.y;
	
	switch(direction){
		case 0:{ // up
			y = head.y - 1 < 0 ? height - 1 : head.y - 1;
			break;
		}
		case 1:{ // right
			x = head.x + 1 === width ? 0 : head.x + 1;
			break;
		}
		case 2:{ // down
			y = head.y + 1 === height ? 0 : head.y + 1;
			break;
		}
		case 3:{ // left
			x = head.x - 1 < 0 ? width - 1 : head.x - 1;
			break;
		}
		default:{ // wtf?
			x = head.x + 1 === width ? 0 : head.x + 1;
			break;
		}
	}
	
	//console.log(head.x + ', ' + head.y + ' to ' +);
	this.head = {x: x,y: y}
	this.tail = body[body.length - 1];
	this.body = [{x: x,y: y}].concat(body.slice(0, body.length - 1));
}

Snake.prototype.advance = function(cherry){
  this.score += cherry.score;
  this.body.push(this.tail);
}

Snake.prototype.setDirection = function(direction){
  this.toDirection = direction < 4
   && direction >= 0
   && Math.abs(direction - this.direction) !== 2
   	? direction : this.toDirection;
  return this.toDirection;
}

Snake.prototype.destroy = function(){
	this.die = true;
	console.log(this.name + ' must die now.');
}

var Map = function(width, height){
  this.width = width;
  this.height = height;
  this.snakes = {};
  this.cherries = {};
  this.cherrySpawned = 0;
}

Map.prototype.spawnCherry = function(){
  var x;
  var y;
  var snakes = this.snakes;
  var cherries = this.cherries;
  var width = this.width;
  var height = this.height;
  while(true){
    x = Math.floor(Math.random() * 10000 % width);
    y = Math.floor(Math.random() * 10000 % height);
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
      for(var i in cherries){
        var cherry = cherries[i];
        if(cherry.x == x && cherry.y == y){
          found = true;
          break;
        }
      }
    }
    
    if(!found){
      break;
    }
  }
  
  var cherry = {
    x: x,
    y: y,
    score: CHERRY_SCORE,
    color: CHERRY_COLOR,
    cherryNo: ++this.cherrySpawned
  };
  this.cherries[cherry.cherryNo] = cherry;
  console.log('Cherry was spawned at ' + x + ', ' + y);
  return cherry;
}

Map.prototype.destroyCherry = function(cherryNo){
  delete this.cherries[cherryNo];
}

Map.prototype.moveSnakes = function(){
  for(var i in this.snakes){
  	if(!this.snakes[i].die){
  		this.snakes[i].move();
  	}
  }
  this.checkHealth();
}

Map.prototype.checkHealth = function(){
	for(var i in this.snakes){
  	if(!this.snakes[i].die){
  		var head = this.snakes[i].head;
  		for(var j in this.snakes){
  			var targetBody = this.snakes[i].name == this.snakes[j].name ? 
  			                 this.snakes[j].body.slice(1)
  			                 : this.snakes[j].body;
  			for(var k in targetBody){
  				var segment = targetBody[k];
  				if(head.x === segment.x && head.y === segment.y){
  					this.snakes[i].destroy();
  				}
  			}
  		}
  		
  		for(var k in this.cherries){
  		  var cherry = this.cherries[k];
  		  if(head.x === cherry.x && head.y === cherry.y){
  		    this.snakes[i].advance(cherry);
          this.destroyCherry(cherry.cherryNo);
          this.spawnCherry();
        }
  		}
  	}
  }
}

Map.prototype.spawnSnake = function(id, name){
  var x;
  var y;
  var snakes = this.snakes;
  var width = this.width;
  var height = this.height;
  while(true){
    x = Math.floor(Math.random() * 10000 % width);
    y = Math.floor(Math.random() * 10000 % height);
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
  
  var snake = new Snake(id, name, this, x, y);
  snakes[id] = snake;
  return snake;
}

Map.prototype.destroySnake = function(id){
  delete this.snakes[id];
}

Map.prototype.getSnakes = function(){
  var snakes = {}
  for(var i in this.snakes){
    snakes[i] = {};
    snakes[i].id = this.snakes[i].id;
    snakes[i].name = this.snakes[i].name;
    snakes[i].direction = this.snakes[i].direction;
    snakes[i].head = this.snakes[i].head;
    snakes[i].body = this.snakes[i].body;
    snakes[i].color = this.snakes[i].color;
    snakes[i].die = this.snakes[i].die;
    snakes[i].score = this.snakes[i].score;
  }
  return snakes;
}

Map.prototype.getSnake = function(id){
	return this.snakes[id] || null;
}

Map.prototype.getMap = function(){
  return {
    width: this.width,
    height: this.height,
    snakes: this.getSnakes(),
    cherries: this.cherries
  }
}

function get_random_color() {
    var letters = '0123456789ABCD'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 13)];
    }
    return color;
}

exports.Map = Map;
exports.Snake = Snake;
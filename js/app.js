//****
//* Superclass: Avatar
//****
//Make a Superclass for both Enemy and Player to extend from - I'll call it Avatar
var Avatar = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  // The sprite uses a helper we've provided to easily load images
  //default sprite will be char-boy
  this.sprite = 'images/char-boy.png';
}

// Update position, required method for game
// Parameter: dt, a time delta between ticks
Avatar.prototype.update = function(dt) {
  //by default, nothing happening here - override this in subclasses
}

//Draw on the screen, required method for game
Avatar.prototype.render = function() {
  //by default, draw the sprite with the x, y coordinates
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//****
//Set variables for ROW and COL sizes on grid for movement
var COL = 83;
var ROW = 101;
//co-ordinate min and max values
var X_MIN = 0;
var X_MAX = 404;
var Y_MIN = -11;
var Y_MAX = 404;

var enemyRow = function() {
  var row = Math.floor((Math.random() *3)+1);
  console.log(row);
  switch (row) {
    case 1:
      row = 72;
      break;
    case 2:
      row = 155;
      break;
    case 3:
      row = 238;
      break;
  }
  console.log(row);
  return row;
}

//****
//* Subclass: Enemy
//****
// Enemies our player must avoid
var Enemy = function() {
  Avatar.call(this);
  this.sprite = 'images/enemy-bug.png';
  //need to define x and y
  this.x = 0;
  this.y = enemyRow();
  this.speed = 10 + Math.random() * 200;
}
//extend from Avatar Prototype
Enemy.prototype = Object.create(Avatar.prototype);
Enemy.prototype.constructor = Enemy;

//Override the update function, for specific enemy features
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (this.x < X_MAX) {
    this.x = (this.x + (Math.random() * 0.8)) * (1 + dt);
  } else {
    //reset enemy to start of grid
    this.x = 0;
  }
  if ((Math.floor(this.x) == player.x) && (Math.floor(this.y) == player.y)) {
    console.log("player dead");
    player.x = COL * 0;
    player.y = ROW * 4;
  }
}

//****
//* Subclass: Player
//****
// This class uses a update(), render() from superclass and
// a handleInput() method is implemented locally.
var Player = function() {
  Avatar.call(this);
  this.sprite = 'images/char-boy.png';
  this.x = COL * 0;
  this.y = ROW * 4;
}
//Extend from Avatar prototype
Player.prototype = Object.create(Avatar.prototype);
Player.prototype.constructor = Player;
//specific method to player
Player.prototype.handleInput = function(input) {
  switch (input) {
    case "up":
      if (this.y > Y_MIN) {
        this.y -= COL;
      } else {
        //got to the water, should set to next level here
      }
      break;
    case "down":
      if (this.y < Y_MAX) {
        this.y = this.y + 83;
      }
      break;
    case "left":
      if (this.x > X_MIN) {
        this.x = this.x - 101;
      }
      break;
    case "right":
      if (this.x < X_MAX) {
        this.x = this.x + 101;
      }
      break;
    case "esc":
      //reset here
      break;
  }
  console.log("x coordinate: " + this.x + ", y coordinate: " + this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [new Enemy(), new Enemy(), new Enemy()];
player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  console.log(e.keyCode);
  var allowedKeys = {
    27: 'esc', //reset game
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

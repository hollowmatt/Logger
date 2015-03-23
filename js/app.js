//**
//* CONSTANTS
//*

// Set variables for ROW and COL sizes on grid for movement
var COL = 83;
var ROW = 101;

// co-ord min and max values
var X_MIN = 0;
var X_MAX = 404;
var Y_MIN = -11;
var Y_MAX = 404;

// Level Of the game, and lives (Player gets 3 lives)
var LEVEL = 1;
var LIVES = 3;

// Sprites for gameplay
var USER_SPRITE = 'images/char-boy.png'; // consider letting user choose in future
var ENEMY_SPRITE = 'images/enemy-bug.png';

//*
//* END CONSTANTS
//*

//**
//* Superclass: Avatar
//*             Make a Superclass for both Enemy and Player
//*             to extend from - I'll call it Avatar
//*
var Avatar = function() {
  // The sprite uses a helper we've provided to easily load images
  // default sprite will be char-boy
  this.sprite = 'images/char-boy.png';
};

//** 
//* Avatar.prototype.update
//*   Update position, required method for game
//*   Parameter: dt, a time delta between ticks
Avatar.prototype.update = function(dt) {
  // by default, nothing happening here - override this in subclasses
};

//**
//* Avatar.prototype.render
//*   Draw on the screen, required method for game
Avatar.prototype.render = function() {
  // draw the sprite with the x, y coordinates
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//**
//* Subclass: Enemy (subclass of Avatar)
//*           Enemies our player must avoid
//*
var Enemy = function() {
  Avatar.call(this);
  this.sprite = ENEMY_SPRITE;
  // need to define x and y of enemy
  this.x = 0;
  this.y = this.row();
};

//**
//* Extend Enemy Prototype from Avatar Prototype.
//* Be sure to set constructor back to proper object.
Enemy.prototype = Object.create(Avatar.prototype);
Enemy.prototype.constructor = Enemy;

//**
//* Enemy.prototype.row
//*   This class method will set a row (y coordinate) for an enemy instance
//*   It will randomly place the new enemy on one of the rows of stones.
Enemy.prototype.row = function() {
  var row = Math.floor((Math.random() * 3) + 1);
  return (row - 1) * COL + 72;  
}

//**
//* Enemy.prototype.update
//*   This is an override of the superclass method, for updating the enemy instance
//*   and detecting collisions with the player.
Enemy.prototype.update = function(dt) {
  // Multiply movement by the dt parameter to ensure consistent speed for all computers.
  if (this.x < X_MAX) {
    this.x = (this.x + (Math.random() * 0.8)) * (1 + dt);
  } else {
    // reset enemy to start of grid
    this.x = 0;
  }
  // this will check for collisions with the player, and take appropriate action
  if (collide(this.x, player.x) && collide(this.y, player.y)) {
      console.log("player dead, reset to starting position");
    LIVES--;
    console.log("lives is:" + LIVES);
    if (LIVES < 1) {
      // if you run out of lives, reset game;
      reset_game();
    } else {
      // if you have lives left, reset the player location
      player.reset();
    }
  }
};

//*
//* END of Subclass: Enemy
//*

//**
//* Subclass: Player
//*           This class uses the update(), render() from superclass.
//*           A handleInput() method is implemented locally.
//*
var Player = function() {
  Avatar.call(this);
  this.sprite = USER_SPRITE;
  this.x = COL * 0;
  this.y = ROW * 4;
};

//**
//* Extend Player Prototype from Avatar Prototype.
//* Be sure to set constructor back to proper object.
Player.prototype = Object.create(Avatar.prototype);
Player.prototype.constructor = Player;


//**
//* Player.prototype.handleInput
//*   Specific method to player to handle the player movement.
//*   This will check to see if the player is within the bounds of the game.
//*   If the player reaches the top, and hits up again, increments the level
//*   of the game, and moves player back to start.
Player.prototype.handleInput = function(input) {
  switch (input) {
    case "up":
      if (this.y > (Y_MIN + ROW)) {
        this.y -= COL;
      } else {
        allEnemies.push(new Enemy());
        LEVEL++;
        this.reset();
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
      reset_game();
      break;
  }
  console.log("x coordinate: " + this.x + ", y coordinate: " + this.y);
};

//**
//* Player.prototype.reset
//*   Specific method to reset the player location on the board, 
//*   makes a call to update_board() to update any information on 
//*   levels or lives.
Player.prototype.reset = function() {
  player.x = COL * 0;
  player.y = ROW * 4;
  update_board();
};

//*
//* END of Subclass: Player
//*

//**
//* GLOBAL METHODS
//*

//**
//* collide(enemy, player)
//*   This will check for the collision: 20px buffer around the location of the enemy
//*   for the detection to ensure accuracy - return true if collsion, false if not
var collide = function(enemy, player) {
  if (Math.floor(enemy) < (player + 20) && Math.floor(enemy) >(player - 20)) {
    return true;
  } else {
    return false;
  }
};

//**
//* reset_game()
//*   function to reset game to initial values
//*    - instantiates the allEnemies array and player
var reset_game = function() {
  player = new Player();
  allEnemies = [];
  allEnemies.push(new Enemy());
  LIVES = 3;
  LEVEL = 1;
  player.reset();
};

//**
//* update_board()
//*   function to update the Round and Lives on the board
var update_board = function() {
  //change the value in the CSS id="round" and CSS id="lives"
  document.getElementById("round").innerHTML = LEVEL;
  document.getElementById("lives").innerHTML = LIVES;
};

//*
//* END GLOBAL METHODS
//*

//**
//* Event Listener for keyboard input
//*   This listens for key presses and sends the keys to your
//*   Player.handleInput() method. Modified to add 'esc' key.
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

//** 
//* Call to start game.
reset_game();
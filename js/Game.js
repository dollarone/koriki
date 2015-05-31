var Koriki = Koriki || {};

//title screen
Koriki.Game = function(){};

var player_direction = 0; // 0=down,1=left,2=up,3=right
var troll_direction = 0; // 0=down,1=left,2=up,3=right
//var velocity = 10;

Koriki.Game.prototype = {
  create: function() {
    this.map = this.game.add.tilemap('level1');

    this.velocity = 50;

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('example', 'gameTiles');

    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.mountainLayer = this.map.createLayer('mountainLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.waterLayer = this.map.createLayer('waterLayer');

    //resizes the game world to match the layer dimensions
    this.backgroundLayer.resizeWorld();

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
    this.blockedLayer.visible = false;
    this.mountainLayer.visible = false;
    this.waterLayer.visible = false;


    this.createItems();
    this.createDoors();    
    this.createCharacters();

    //create player
    var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'all_sprites'); 
    //'game_spritesheet'); // max length of var?
    var result = this.findObjectsByType('trollStart', this.map, 'objectsLayer');
    this.troll = this.game.add.sprite(result[0].x, result[0].y, 'all_sprites');

    this.game.physics.arcade.enable(this.player);
    this.game.physics.arcade.enable(this.troll);

    this.player.animations.add('walk_up', [7, 8]);
    this.player.animations.add('walk_left', [4, 5]);
    this.player.animations.add('walk_right', [4, 5]);
    this.player.animations.add('walk_down', [1, 2]);
          // Set Anchor to the center of your sprite
    this.player.anchor.setTo(0.5, 0);

    this.troll.animations.add('walk_up', [16, 17]);
    this.troll.animations.add('walk_left', [13, 14]);
    this.troll.animations.add('walk_right', [13, 14]);
    this.troll.animations.add('walk_down', [10, 11]);
    this.troll.anchor.setTo(0.5, 0);

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();


    this.marker = new Phaser.Point();
    this.turnPoint = new Phaser.Point();

    this.directions = [ null, null, null, null, null ];
    this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

    this.current = Phaser.NONE;
    this.turning = Phaser.NONE;

  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;    
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },
  createDoors: function() {
    //create doors
    this.doors = this.game.add.group();
    this.doors.enableBody = true;
    result = this.findObjectsByType('door', this.map, 'objectsLayer');

    result.forEach(function(element){
      this.createFromTiledObject(element, this.doors);
    }, this);
  },
  createCharacters: function() {
    //create doors
    this.characters = this.game.add.group();
    this.characters.enableBody = true;
    result = this.findObjectsByType('character', this.map, 'objectsLayer');

    result.forEach(function(element){
      this.createFromTiledObject(element, this.characters);
    }, this);
  },

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  checkDirection: function(turnTo) {
// The first thing it does is bail-out should any of the following conditions be met:
// * The car is already set to turn in that direction
// * There isn’t a tile in that direction
// * The tile in that direction isn’t a ‘safe tile’ (i.e. is a wall)
    if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
    {
      //  Invalid direction if they're already set to turn that way
      //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
      return;
    }
    if (this.current === this.opposites[turnTo])
    {
      this.move(turnTo);
    }
    else
    {
      this.turning = turnTo;
 
      this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
      this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
    }
 
  },
  update: function() {
    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
    this.game.physics.arcade.overlap(this.player, this.troll, this.enterCombat, null, this);
    this.velocity = 50;
    this.game.physics.arcade.collide(this.player, this.waterLayer, null, this.walkingInWater, this);
    
    this.game.physics.arcade.collide(this.troll, this.blockedLayer);

    //player movement
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    this.troll.body.velocity.y = 0;
    this.troll.body.velocity.x = 0;

    if((player_direction == 1 && 
         //!this.cursors.left.isDown && // not obvious but makes sense I ASSURE YOU
         (this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.right.isDown)) 
      || (player_direction != 1 && 
          this.cursors.left.isDown && 
        !this.cursors.up.isDown && !this.cursors.down.isDown && !this.cursors.right.isDown)) {

      // Invert scale.x to flip left/right
      this.player.scale.x *= -1;
      this.troll.scale.x *= -1;
      console.log('flip');
    }

    this.marker.x = this.math.snapToFloor(Math.floor(this.player.x), 16);
    this.marker.y = this.math.snapToFloor(Math.floor(this.player.y + 8), 16);
    var i = this.blockedLayer.index;
    var x = this.marker.x / 16;
    var y = this.marker.y / 16;

    console.log(i);
    console.log(x);
    console.log(y);

    this.directions[Phaser.LEFT] = this.map.getTileLeft(i, x, y);
    this.directions[Phaser.RIGHT] = this.map.getTileRight(i, x, y);
    this.directions[Phaser.UP] = this.map.getTileAbove(i, x, y);
    this.directions[Phaser.DOWN] = this.map.getTileBelow(i, x, y);

    this.marker.x += 8;
    this.marker.y;

    if(this.cursors.up.isDown) {
      if(Math.abs(this.player.y - this.marker.y) < 1 &&
        this.map.getTileAbove(i, x, y).index == -1 && 
        this.map.getTileAbove(i, x - 1, y).index != -1 &&
        this.map.getTileAbove(i, x + 1, y).index != -1) {

        if(this.player.x == this.marker.x) {
          this.player.body.velocity.y -= this.velocity;
        }
        else if(Math.abs(this.player.x - this.marker.x) < 1) {
          this.player.x = this.marker.x;
        }
        else if(this.player.x < this.marker.x) {
          this.player.x += 1;
        }
        else if(this.player.x > this.marker.x) {
         this.player.x -= 1;
        }
      }
      else {
        this.player.body.velocity.y -= this.velocity;
      }

      this.player.animations.play('walk_up', 10, false);
      player_direction = 2;
    }
    else if(this.cursors.down.isDown) {
      if(Math.abs(this.player.y - this.marker.y) < 1 &&
        this.map.getTileBelow(i, x, y).index == -1 && 
        this.map.getTileBelow(i, x - 1, y).index != -1 &&
        this.map.getTileBelow(i, x + 1, y).index != -1) {

        if(this.player.x == this.marker.x) {
          this.player.body.velocity.y += this.velocity;
        }
        else if(Math.abs(this.player.x - this.marker.x) < 1) {
          this.player.x = this.marker.x;
        }
        else if(this.player.x < this.marker.x) {
          this.player.x += 1;
        }
        else if(this.player.x > this.marker.x) {
          this.player.x -= 1;
        }
      }
      else { 
        this.player.body.velocity.y += this.velocity;
      }
      this.player.animations.play('walk_down', 10, false);
      player_direction = 0;
    }
    else if(this.cursors.right.isDown) {
      if(Math.abs(this.player.x - this.marker.x) < 1 &&
        this.map.getTileRight(i, x, y).index == -1 && 
        this.map.getTileRight(i, x, y - 1).index != -1 &&
        this.map.getTileRight(i, x, y + 1).index != -1) {
        if(this.player.y == this.marker.y) {
          this.player.body.velocity.x += this.velocity;
        }
        else if(Math.abs(this.player.y - this.marker.y) < 1) {
          this.player.y = this.marker.y;
        }
        else if(this.player.y < this.marker.y) {
          this.player.y += 1;
        }
        else if(this.player.y > this.marker.y) {
          this.player.y -= 1;
        }
      }
      else {
        this.player.body.velocity.x += this.velocity;
      }
      this.player.animations.play('walk_right', 10, false);

      player_direction = 3;
    }
    else if(this.cursors.left.isDown) {
      if(Math.abs(this.player.x - this.marker.x) < 1 &&
        this.map.getTileLeft(i, x, y).index == -1 && 
        this.map.getTileLeft(i, x, y - 1).index != -1 &&
        this.map.getTileLeft(i, x, y + 1).index != -1) {
        if(this.player.y == this.marker.y) {
          this.player.body.velocity.x -= this.velocity;
        }
        else if(Math.abs(this.player.y - this.marker.y) < 1) {
          this.player.y = this.marker.y;
        }
        else if(this.player.y < this.marker.y) {
          this.player.y += 1;
        }
        else if(this.player.y > this.marker.y) {
          this.player.y -= 1;
        }
      }
      else {
        this.player.body.velocity.x -= this.velocity;
      }
      this.player.animations.play('walk_left', 10, false);

      player_direction = 1;
    }
    else {
      // if facing down ...
      if(player_direction == 0) {
        this.player.frame = 0;
      }
      else if(player_direction == 1) {
        this.player.frame = 3;
      }
      else if(player_direction == 2) {
        this.player.frame = 6;
      }
      else if(player_direction == 3) {
        this.player.frame = 3;
      }
    }

    // TROLL      
    
    this.marker.x = this.math.snapToFloor(Math.floor(this.troll.x), 16);
    this.marker.y = this.math.snapToFloor(Math.floor(this.troll.y), 16);
    var i = this.blockedLayer.index;
    var x = this.marker.x / 16;
    var y = this.marker.y / 16;
    this.marker.x += 8;
    this.marker.y;

    if(this.cursors.up.isDown) {
      if(this.troll.x == this.marker.x) {
        this.troll.body.velocity.y -= this.velocity;
      }
      else if(Math.abs(this.troll.x - this.marker.x) < 1) {
        this.troll.x = this.marker.x;
      }
      else if(this.troll.x < this.marker.x) {
        this.troll.x += 1;
      }
      else if(this.troll.x > this.marker.x) {
        this.troll.x -= 1;
      }
      this.troll.animations.play('walk_up', 10, false);
      troll_direction = 2;
    }
    else if(this.cursors.down.isDown) {
      if(this.troll.x == this.marker.x) {
        this.troll.body.velocity.y += this.velocity;
      }
      else if(Math.abs(this.troll.x - this.marker.x) < 1) {
        this.troll.x = this.marker.x;
      }
      else if(this.troll.x < this.marker.x) {
        this.troll.x += 1;
      }
      else if(this.troll.x > this.marker.x) {
        this.troll.x -= 1;
      }
      this.troll.animations.play('walk_down', 10, false);
      troll_direction = 0;
    }
    else if(this.cursors.right.isDown) {
      if(this.troll.y == this.marker.y) {
        this.troll.body.velocity.x += this.velocity;
      }
      else if(Math.abs(this.troll.y - this.marker.y) < 1) {
        this.troll.y = this.marker.y;
      }
      else if(this.troll.y < this.marker.y) {
        this.troll.y += 1;
      }
      else if(this.troll.y > this.marker.y) {
        this.troll.y -= 1;
      }
      this.troll.animations.play('walk_right', 10, false);

      troll_direction = 3;
    }
    else if(this.cursors.left.isDown) {
      if(this.troll.y == this.marker.y) {
        this.troll.body.velocity.x -= this.velocity;
      }
      else if(Math.abs(this.troll.y - this.marker.y) < 1) {
        this.troll.y = this.marker.y;
      }
      else if(this.troll.y < this.marker.y) {
        this.troll.y += 1;
      }
      else if(this.troll.y > this.marker.y) {
        this.troll.y -= 1;
      }
      this.troll.animations.play('walk_left', 10, false);

      troll_direction = 1;
    }
    else {
      // if facing down ...
      if(troll_direction == 0) {
        this.troll.frame = 9;
      }
      else if(troll_direction == 1) {
        this.troll.frame = 12;
      }
      else if(troll_direction == 2) {
        this.troll.frame = 15;
      }
      else if(troll_direction == 3) {
        this.troll.frame = 12;
      }      
    }
  },
  collect: function(player, collectable) {
    console.log('yummy!');

    //remove sprite
    collectable.destroy();
  },
  enterDoor: function(player, door) {
    console.log('entering door that will take you to '+door.targetTilemap+' on x:'+door.targetX+' and y:'+door.targetY);
  },
  enterCombat: function(currentPlayer, troll) {
    this.remaining_people -= 1;
    if(Math.random() < 0.01) {
      this.winSequence();
    }
    else {
      this.respawnPlayer(currentPlayer);
    }
  },
  respawnPlayer: function(currentPlayer) {
    //player.destroy();
    this.player.x += 10;
    
  },
  winSequence: function() {
    console.log('you win');

  },
  walkingInWater: function(player, tile) {
    if(tile.index == 64) {
      this.velocity = 20;
      return true;
    }
    return false;
    
  },
};
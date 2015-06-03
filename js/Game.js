var Koriki = Koriki || {};

//title screen
Koriki.Game = function(){};

Koriki.Game.prototype = {
  create: function() {
    this.paused = false;
    this.dialogue = false;
    this.state = 0; 
    this.deaths = 0;
    this.flask = false;
    this.recentlyInCombat = false;
    this.tileSetNum = 2;

    this.player_direction = 0; // 0=down,1=left,2=up,3=right
    this.troll_direction = 0; // 0=down,1=left,2=up,3=right
    
    this.map = this.game.add.tilemap('level1');

    this.velocity = 50;
    this.watervelocity = 30;

    this.counter = 199;
    this.trollMove = 0;
    this.trollMoves = [0,0,3,0,6,3,2,3,6,2,1,2,1,0,6,6,2,1,0,3,6,2,1,2,3,0,6,2,1,6];

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.currentTileSet = this.map.addTilesetImage('example', 'gameTiles2');    
    //this.currentTileSet = this.map.addTilesetImage('objectLayer', 'gameTiles2');

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
    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.enterKey.onDown.add(this.pauseFunction, this);

    this.marker = new Phaser.Point();
    this.turnPoint = new Phaser.Point();

    this.directions = [ null, null, null, null, null ];
    this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

    this.current = Phaser.NONE;
    this.turning = Phaser.NONE;

    this.bigbackground = this.game.add.graphics(0, 0);
    this.bigbackground.visible = true;

    var backgroundColour = "0x000000";
    var backgroundOpacity = 0.5;

    this.bigbackground.beginFill(backgroundColour, backgroundOpacity);
    this.bigbackground.lineStyle(2, 0x000011, 1);
    this.bigbackground.drawRect(this.player.x - 300, this.player.y - 300, 3200, 3200);
    this.bigbackground.endFill();
    this.bigbackground.alpha = 0.0;

    this.background = this.game.add.graphics(0, 0);
    this.background.visible = false;

    this.background.beginFill(backgroundColour, backgroundOpacity);
    this.background.lineStyle(2, 0x000011, 1);
    this.background.drawRect(this.player.x - 150, this.player.y - 150, 300, 300);
    this.background.endFill();
    
    this.style = { font: "23px Lobster", fill: "#DDDDDD", align: "center" };
    this.styleSmall = { font: "10px Arial", fill: "#000000", align: "center" };

    this.pausedText = this.game.add.text(this.player.x, this.player.y, "Paused ", this.styleSmall);
    this.pausedText.visible = this.paused;


    this.textDialogues = [];
    this.textDialogues[0] = "You are Fenrik, the blacksmith's son. Your line of work has given you a sturdy constitution, and you know how to swing a hammer. You are not afraid - well, you are afraid, but you are pretty good at pretending not to be afraid. ";
    this.textDialogues[1] = "You look at Lloras and at your fellow villagers. You say: \n'I will take care of this. Let me slay this beast and bring us peace again!'\nYou can see your old father at the back, proudly nodding. You are already a hero. ";

    this.textDialogues[7] = "You see something shiny on the ground - it's a coin! ";
    this.textDialogues[8] = "You pick up a coin lying on the ground. ";
    this.textDialogues[9] = "You find an old flask with some smelly liquid in it. You think: 'it must be a Hero's Potion, right?' You hold your breath and close your nose: down it goes... ";

    this.textDialogues[10] = "You are Gunnar, Fenrik's friend. ";

    this.textDialogues[90] = "The creature kills you. ";
    this.textDialogues[91] = "The creature jumps forward and bites you in the head, immediately crushing your skull! ";
    this.textDialogues[92] = "You hit the creature, but it doesn't seem to care. It just strikes back, crushing you against the rock! ";
    this.textDialogues[93] = "You carefully approach the strange creature. Just as you are about to ambush it, it flails and a nasty set of claws severs your arm as you fall to the ground! ";
    this.textDialogues[94] = "The creature attacks with surprising speed and bites your head off before you can say 'hey'! ";
    this.textDialogues[95] = "You strike at the creature's head, but it's like hitting rock. Before you can retreat, it grabs you by the throat and starts eating your larynx... ";
    this.textDialogues[96] = "You have never seen a thing like it. In awe you observe its great claws and spiky teeth as they descend on your weak flesh. ";
    this.textDialogues[97] = "As soon as you see it, you realise this was a big mistake. You try to run away but alas; the creature grabs your leg and starts chewing... ";

    this.textDialogues[100] = "You have died! ";
    this.textDialogues[110] = "You yell at the creature: 'Prepare to die, foul thing'. It strikes at you but you dodge and bring your fists down behind its ears. To everyone's surprise it groans in pain and falls down, smashing its head into the wall. ";
    this.textDialogues[111] = "Your mouth still has a strange aftertaste of that smelly liquid you drank earlier. You wonder if it really could have been a Hero's Potion? ";
    this.textDialogues[112] = "You have done it! You have rid Koriki Island of the evil creature! You kick the thing and leave the mountain; you are a true hero now! Congratulations! ";
    
    this.text = this.game.add.text(this.player.x, this.player.y, this.textDialogues[0], this.style);
    this.text.visible = false;

    //this.game.world.centerX, this.game.world.centerY, directions, style);
    this.text.anchor.set(0.5);
    this.text.wordWrap = true;
    this.text.wordWrapWidth = 280; //window.innerWidth - 50;

    this.startingPlayerX = this.player.x;
    this.startingPlayerY = this.player.y;
    
    //this.background.anchor.set(0.5, 0.5);
    //this.background.alpha = 255;

  },
  showDialogue: function(num) {
    this.paused = true;
    this.dialogue = true;
    this.background.x = this.player.x - this.startingPlayerX;
    this.background.y = this.player.y - this.startingPlayerY;

    this.text.x =  this.player.x;
    this.text.y =  this.player.y;
    this.text.text = this.textDialogues[num];
    this.background.visible = true;
    this.text.visible = true;
    
  },
  hideDialogue: function() {
    this.text.visible = false;
    this.text.text = " ";
    this.background.visible = false;
    this.dialogue = false;
    this.paused = false;
  },
  fadeOut: function() {
    this.bigbackground.x = this.player.x - this.startingPlayerX;
    this.bigbackground.y = this.player.y - this.startingPlayerY;
    var tween = this.game.add.tween(this.bigbackground).to({alpha: 2}, 200, Phaser.Easing.Linear.None, false).to({alpha: 0}, 200, Phaser.Easing.Linear.None, false);
    tween.onComplete.add(this.respawnPlayer, this);
    tween.start();

  },
  fadeIn: function() {
    this.bigbackground.x = this.player.x - this.startingPlayerX;
    this.bigbackground.y = this.player.y - this.startingPlayerY;
    var tween = this.game.add.tween(this.bigbackground).to({alpha: 0}, 300, Phaser.Easing.Linear.None, false);
    
    tween.start();

  },
  pauseFunction: function() // "pressed enter function"
  {
    if(this.dialogue) {
      
      this.hideDialogue();
    }
    else {
      this.pausedText.x = this.player.x - 17 ;
      this.pausedText.y = this.player.y + 17; 
      this.paused = !this.paused;
      this.pausedText.visible = this.paused && this.isPlayerAlive(); 
    }
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
  createCharacters: function() {
    //create doors
    this.characters = this.game.add.group();
    this.characters.enableBody = true;
    result = this.findObjectsByType('npc', this.map, 'objectsLayer');
var ivn = 1;
    result.forEach(function(element){
      this.createFromTiledObject(element, this.characters);
      if( ivn < 2) {
      console.log("char:" +element.properties.pos); }
      ivn++;
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
  findObjectsByPos: function(pos, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.pos === pos) {
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
    var sprite = group.create(element.x, element.y, 'all_sprites');//element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });

    if(element.properties.sprite === "hidden_coin") {
      if(Math.random()*10 > 2) {
        sprite.alpha = 0;
      }
      sprite.frame = 29;
    }
    else if(element.properties.sprite === "coin") {
      sprite.frame = 29;
    }
    else if(element.properties.sprite === "potion") {
      sprite.frame = 31;
    }
    else if(element.properties.sprite === "npc") {
      sprite.frame = 0;
    }

  },
  update: function() {
    //player movement

    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    this.troll.body.velocity.y = 0;
    this.troll.body.velocity.x = 0;

    if(this.paused) {
      //console.log('scale' + this.player.scale.x);
      //console.log('x: ' + this.player.x);
      //console.log('y: ' + this.player.y);
      
    }
    else {
      this.text.text = " ";
      switch(this.state) {
        case 0: this.state++;
                this.showDialogue(0);
          break;
        case 1: this.state++;
                this.showDialogue(1);
          break;
              // heroes:
        case 10: this.state++;
                 this.showDialogue(10);
                 this.recentlyInCombat = false;
                 break;
        case 15: this.state++;
                 this.showDialogue(15);
                 this.recentlyInCombat = false;
                 break;
        case 20: this.state++;
                 this.showDialogue(20);
                 this.recentlyInCombat = false;
                 break;
        case 25: this.state++;
                 this.showDialogue(25);
                 this.recentlyInCombat = false;
                 break;
        case 30: this.state++;
                 this.showDialogue(30);
                 this.recentlyInCombat = false;
                 break;
        case 35: this.state++;
                 this.showDialogue(35);
                 this.recentlyInCombat = false;
                 break;
        case 40: this.state++;
                 this.showDialogue(40);
                 this.recentlyInCombat = false;
                 break;
        case 45: this.state++;
                 this.showDialogue(45);
                 this.recentlyInCombat = false;
                 break;
        case 50: this.state++;
                 this.showDialogue(50);
                 this.recentlyInCombat = false;
                 break;
        case 55: this.state++;
                 this.showDialogue(55);
                 this.recentlyInCombat = false;
                 break;
        case 60: this.state++;
                 this.showDialogue(60);
                 this.recentlyInCombat = false;
                 break;
        case 65: this.state++;
                 this.showDialogue(65);
                 this.recentlyInCombat = false;
                 break;

        case 91: this.state = 100; // 90-99 are random deaths
                 this.showDialogue(91);
          break;
        case 99: this.state = 100;
                 
          break;
        case 100: this.state++;
                  this.player.visible = false;
                  this.showDialogue(100); // You have died!
          break;
        case 101: this.state++;
                  this.text.text = " ";
                  this.fadeOut(); 
          break;
        case 102:      
          break;
        case 110: if(this.flask) {
                    this.showDialogue(111);
                  }
                  this.state++;                  
          break;
        case 111: this.state++;
                  this.showDialogue(112);
          break;
        case 112: this.game.state.start("MainMenu");
          break;

      }

    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
    this.game.physics.arcade.overlap(this.player, this.troll, this.enterCombat, this.isPlayerAliveAndKicking, this);
    this.velocity = 50;
    this.game.physics.arcade.collide(this.player, this.waterLayer, null, this.walkingInWater, this);
    
    this.game.physics.arcade.collide(this.troll, this.blockedLayer);

    if((this.player_direction == 1 && 
         //!this.cursors.left.isDown && // not obvious but makes sense I ASSURE YOU
         (this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.right.isDown)) 
      || (this.player_direction != 1 && 
          this.cursors.left.isDown && 
        !this.cursors.up.isDown && !this.cursors.down.isDown && !this.cursors.right.isDown)) {

      // Invert scale.x to flip left/right
      this.player.scale.x *= -1;
      
    }
    if((this.trollMoves[this.trollMove] == 1 && this.counter == 1) 
      || (this.trollMoves[this.trollMove] == 1 && this.counter == 149)) {
       // // 0=down,1=left,2=up,3=right
      // Invert scale.x to flip left/right
      this.troll.scale.x *= -1;
      
    }

    this.marker.x = this.math.snapToFloor(Math.floor(this.player.x), 16);
    this.marker.y = this.math.snapToFloor(Math.floor(this.player.y + 8), 16);
    var i = this.blockedLayer.index;
    var x = this.marker.x / 16;
    var y = this.marker.y / 16;

    this.directions[Phaser.LEFT] = this.map.getTileLeft(i, x, y);
    this.directions[Phaser.RIGHT] = this.map.getTileRight(i, x, y);
    this.directions[Phaser.UP] = this.map.getTileAbove(i, x, y);
    this.directions[Phaser.DOWN] = this.map.getTileBelow(i, x, y);

    this.marker.x += 8;
    this.marker.y;

    if(this.isPlayerAlive()) {
    
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
        this.player_direction = 2;
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
        this.player_direction = 0;
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

        this.player_direction = 3; /// // 0=down,1=left,2=up,3=right
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

        this.player_direction = 1;
      }
      else {
        // if facing down ...
        if(this.player_direction == 0) {
          this.player.frame = 0;
        }
        else if(this.player_direction == 1) {
          this.player.frame = 3;
        }
        else if(this.player_direction == 2) {
          this.player.frame = 6;
        }
        else if(this.player_direction == 3) {
          this.player.frame = 3;
        }
      }
    }
    // TROLL. Bottom tile is #20
    this.marker.x = this.math.snapToFloor(Math.floor(this.troll.x), 16);
    this.marker.y = this.math.snapToFloor(Math.floor(this.troll.y + 8), 16);
    var i = this.blockedLayer.index;
    var x = this.marker.x / 16;
    var y = this.marker.y / 16;
    this.marker.x += 8;
    this.marker.y;

    if(this.trollMove > 29) {
      this.trollMove = 1;
      //this.trollMove = this.game.rnd.integerInRange(1, 6);
    }
    this.counter += 1;
    if(this.counter > 150) {
      this.counter = 1;
      this.trollMove += 1;
    }
    else {
      switch(this.trollMoves[this.trollMove]) {
        case 2: 
          if(this.troll.x == this.marker.x) {
              if(this.map.getTileAbove(i, x, y).index == -1 || Math.abs(this.troll.y - this.marker.y) > 1) {
                this.troll.body.velocity.y -= this.velocity;
                this.troll.animations.play('walk_up', 10, false);
              }
              else {
                this.troll.frame = 15;
              }

          }
          else if(Math.abs(this.troll.x - this.marker.x) < 1) {
            this.troll.x = this.marker.x;
            this.troll.animations.play('walk_up', 10, false);
          }
          else if(this.troll.x < this.marker.x) {
            this.troll.x += 1;
            this.troll.animations.play('walk_up', 10, false);
          }
          else if(this.troll.x > this.marker.x) {
            this.troll.x -= 1;
            this.troll.animations.play('walk_up', 10, false);
          }
          
          this.troll_direction = 2;
          break;
        case 0: 
          if(this.troll.x == this.marker.x) {
            if(this.map.getTileBelow(i, x, y).index == -1 || Math.abs(this.troll.y - this.marker.y) > 1) {
              this.troll.body.velocity.y += this.velocity;
              this.troll.animations.play('walk_down', 10, false);
            }
            else {
              this.troll.frame = 9;
            }
          }
          else if(Math.abs(this.troll.x - this.marker.x) < 1) {
            this.troll.x = this.marker.x;
            this.troll.animations.play('walk_down', 10, false);
          }
          else if(this.troll.x < this.marker.x) {
            this.troll.x += 1;
            this.troll.animations.play('walk_down', 10, false);
          }
          else if(this.troll.x > this.marker.x) {
            this.troll.x -= 1;
            this.troll.animations.play('walk_down', 10, false);
          }
          
          this.troll_direction = 0;
          break;
        case 3: 
          if(this.troll.y == this.marker.y) {
              if(this.map.getTileRight(i, x, y).index == -1 || Math.abs(this.troll.x - this.marker.x) > 1) {
                this.troll.body.velocity.x += this.velocity;
                this.troll.animations.play('walk_right', 10, false);
              }
              else {
                this.troll.frame = 12;
                // // 0=down,1=left,2=up,3=right
              }
          }
          else if(Math.abs(this.troll.y - this.marker.y) < 1) {
            this.troll.y = this.marker.y;
            this.troll.animations.play('walk_right', 10, false);
          }
          else if(this.troll.y < this.marker.y) {
            this.troll.y += 1;
            this.troll.animations.play('walk_right', 10, false);
          }
          else if(this.troll.y > this.marker.y) {
            this.troll.y -= 1;
            this.troll.animations.play('walk_right', 10, false);
          }
          this.troll_direction = 3;
          break;
        case 1: 
          if(this.troll.y == this.marker.y) {
              if(this.map.getTileLeft(i, x, y).index == -1 || Math.abs(this.troll.x - this.marker.x) > 1) {
                this.troll.body.velocity.x -= this.velocity;
                this.troll.animations.play('walk_left', 10, false);
              }
              else {
                this.troll.frame = 12;
                // // 0=down,1=left,2=up,3=right
              }
          }
          else if(Math.abs(this.troll.y - this.marker.y) < 1) {
            this.troll.y = this.marker.y;
            this.troll.animations.play('walk_left', 10, false);
          }
          else if(this.troll.y < this.marker.y) {
            this.troll.y += 1;
            this.troll.animations.play('walk_left', 10, false);
          }
          else if(this.troll.y > this.marker.y) {
            this.troll.y -= 1;
            this.troll.animations.play('walk_left', 10, false);
          }
          this.troll_direction = 1;
          break;
        default:
              // if facing down ...
          if(this.troll_direction == 0) {
            this.troll.frame = 9;
          }
          else if(this.troll_direction == 1) {
            this.troll.frame = 12;
          }
          else if(this.troll_direction == 2) {
            this.troll.frame = 15;
          }
          else if(this.troll_direction == 3) {
            this.troll.frame = 12;
          }
        }
      }
    }
  },
  collect: function(player, collectable) {
    if(collectable.sprite === "hidden_coin") {
      this.showDialogue(7);
    }
    else if(collectable.sprite === "coin") {
      this.showDialogue(8);
    }
    else if(collectable.sprite === "potion") {
      this.showDialogue(9);
      this.flask = true;
    }
    //remove sprite
    collectable.destroy();
  },
  nextTileSet: function() {
    //this.map.addTilesetImage('example', 'gameTiles' + this.tileSetNum);
    this.currentTileSet.setImage('assets/images/example2.png');
  },
  enterCombat: function(currentPlayer, troll) {
    if(this.recentlyInCombat) {
      // nothing
    }
    else {
      this.recentlyInCombat = true;
      this.state = 100;
      var chance = 3;
      if(this.flask) {
        var chance = 5;
      }

      if(Phaser.Utils.chanceRoll(chance)) {
        this.winSequence();
      }
      else {
        this.showDialogue(Phaser.ArrayUtils.getRandomItem([90,91,92,93,94,95,96,97])); // random kill
        this.deaths++;
        this.flask = false;
      }
    }
  },
  respawnPlayer: function(currentPlayer) {
    this.text.text = " ";
    this.game.time.events.add(1000, function() {
      this.player.x = this.startingPlayerX;
      this.player.y = this.startingPlayerY;
      this.player.scale.x = 1;
      
      this.player.visible = true;

      if(this.deaths > 11) {
        this.gameOver();
      }
      else {
        var child = this.characters.getFirstAlive();
        if(child != null) {
          this.player.x = child.x;
          this.player.y = child.y;
          child.destroy();
        }
        this.text.visible = false;

      }
      this.state = 10;
      this.paused = false;    
    }, this);
  },
  winSequence: function() {
    this.state = 110; 
    this.showDialogue(110);
  },
  walkingInWater: function(player, tile) {
    if(tile.index == 64) {
      this.velocity = this.watervelocity;
      return true;
    }
    return false;
    
  },
  isPlayerAlive: function(player, collisionObj) {
    return (this.state < 90);
  },
  isPlayerAliveAndKicking: function(player, collisionObj) {
    if((this.state < 90) && !this.recentlyInCombat) {
      this.paused = true;
    }
    return (this.state < 90) && !this.recentlyInCombat;
  },
};
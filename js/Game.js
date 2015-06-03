var Koriki = Koriki || {};

Koriki.Game = function(){};

Koriki.Game.prototype = {
  create: function() {
    this.paused = false;
    this.dialogue = false;
    this.state = 0; 
    this.deaths = 0;
    this.flask = false;
    this.recentlyInCombat = false;
    this.recentlyTalked = false;
    this.tileSetNum = 2;
    this.playedCharacters = 1;

    this.player_direction = 0; // 0=down,1=left,2=up,3=right
    this.troll_direction = 0; // 0=down,1=left,2=up,3=right
    
    this.map = this.game.add.tilemap('level1');

    // YURGH. Apparently there's no sensible way to pass vars between states
    this.currentSpriteSheetName = this.game.state.states['MainMenu'].currentSpriteSheetName;

    this.map.addTilesetImage('example', this.currentSpriteSheetName);

    this.velocity = 50;
    this.watervelocity = 30;

    this.counter = 199;
    this.trollMove = 0;
    this.trollMoves = [0,0,3,0,6,3,2,3,6,2,1,2,1,0,6,6,2,1,0,3,6,2,1,2,3,0,6,2,1,6];

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
    this.player = this.game.add.sprite(result[0].x, result[0].y, this.currentSpriteSheetName);
    var result = this.findObjectsByType('trollStart', this.map, 'objectsLayer');
    this.troll = this.game.add.sprite(result[0].x, result[0].y, this.currentSpriteSheetName);

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
    this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.escKey.onDown.add(function() { this.game.state.start("MainMenu"); }, this);

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
    this.bigbackground.alpha = 2.0;

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

    this.textDialogues[10] = "Fenrik's best friend, Gargoyle, so nicknamed because of his massive body and jaw that had been broken several times in fistfights, was Fenrik's brother of heart and he couldn't let his death go unpunished. ";
    this.textDialogues[11] = "He was going to fight the creature, not for his people who always made fun of him - but for his brother who stood by him through it all. Gargoyle hugged his pet wolf and set out on his mission. ";

    this.textDialogues[15] = "Yet another person did not return. There was no need to check now, either the creature had taken this last victim too - or the person had run away to save their own hide. ";
    this.textDialogues[16] = "Mina was beautiful beyond measure. Stealthy and tall, she moved liked a lynx and had the bright eyes that like the animal could even see in the dark. ";
    this.textDialogues[17] = "Her dad Vidar had been the village's most ferocious forest warrior; he saved the village from many a predator and enemies. He became the village fight instructor until his untimely death. ";
    this.textDialogues[18] = "Mina was well trained, but her experience in the field was limited. She was young but wilful and spirited. Taking her bow, she pushed her way out of the panicking crowd. ";
    this.textDialogues[19] = "No one but Evert witnessed her bravery. Mina winked at him - she always had a soft spot for the big, gentle giant - and ran to her destiny. ";

    this.textDialogues[20] = "Evert was strong as an ox, some say even stronger than that. He always helped carry everything you need, be it rocks for the wall, tree trunks for the house or fish for the evening dinner. ";
    this.textDialogues[21] = "If you need a strong man, he is your guy. You need a warrior? He is definitely not your guy. He was a gentle soul with no aggression. ";
    this.textDialogues[22] = "He was more likely to collect a bunch of flowers for his mum and chop wood for the house than chase a bear away from the village. Even though he was the same size as the bear! ";
    this.textDialogues[23] = "It was decided that maybe the creature unknowing of his nature would be scared of his massive size and run away. Peaceful Evert was told that the best berries were found in the mountain - and eagerily he went to collect some! "; 

    this.textDialogues[25] = "Balder was an orphan. No one knew how he came to the island. It was a small village and no one had been expecting a child. Balder was also dark skinned, with dark eyes - in contrast to everyone else. ";
    this.textDialogues[26] = "His origin was unknown, but the village people were happy to adopt him. He lived with different families over the years, they brought him up and he was now the clan leader's apprentice. ";
    this.textDialogues[27] = "He was not a natural warrior, but with his words and arguments, he could bring anyone to his side. He was a politician at heart. Above all, he loved this village who took such great care of him that he rarely felt as an outsider. ";
    this.textDialogues[28] = "He was worried about his people and the creature who was killing them one by one. He decided to be next in line - with his chosen weapon: his words. He will either reason or bore the creature to death. ";
    this.textDialogues[29] = "(And, as a backup, he would bring his wooden bat - Balder is a very proficient bat player.) ";

    this.textDialogues[30] = "Mei was an ugly duckling who stayed an ugly duckling - and she had the personality to match! She would weep at any perceived injustice and fly away sulking at any provocation. ";
    this.textDialogues[31] = "Her parents had had enough of her and, at their age, they just wanted a peaceful retirement. They irresponsibly gauded her into fighting the creature. Mei ran off towards the mountain, sulking. ";

    this.textDialogues[35] = "Mei, of course, did not survive. ";
    this.textDialogues[36] = "Her dad, Henrik, felt so guilty that he took his only weapon, a frying pan, and marched in bitter revenge to slaughter the monster they he and his wife had sent their only daughter to. ";

    this.textDialogues[40] = "Next up was Sara, Henrik's husband. She had lost everything. She picked up a sweeping brush and went away, tears streaming down her face. ";

    this.textDialogues[45] = "Matteo was the island's librarian. He was one of the few who knew the real story of the creature. His knowledge came from his predecessors and the books they had gathered over the centuries. ";
    this.textDialogues[46] = "He had always feared that the creature would return in his time, and now that it had, a calmness overcame him. He was ready; he would fight - this was his duty! ";

    this.textDialogues[50] = "Pan was a beautiful but empty vessel. He trained a tremendous amount. He had big muscles and great strength - but only that. He worked the forest for necessary wood in the winter and he fought with bears for fun. ";
    this.textDialogues[51] = "His donkey followed him around all the time, but when Pan decided to go fight the creature, the donkey fled. Proving once again that it was more clever than Pan. ";
    this.textDialogues[52] = "Handsome Pan strutted off to the forest with his bare hands, confident that he would be the one to rid the village of this monster. ";

    this.textDialogues[55] = "Lloris had always been a joker. He kept people's spirits up by telling stories and doing card tricks. However, even Lloris's good humour had disappeared. One by one the villagers had trotted off to their death. ";
    this.textDialogues[56] = "And now there was only him and a couple of people left. He cursed the village's old saying: One hero shall save the day. \n\nWell, if he was to be the hero, he would need better luck than the others! ";
    this.textDialogues[57] = "With a wildly beating heart and fear in his eyes, he set off towards the mountain... ";

    this.textDialogues[60] = "Elysa was like a sea dragon, swift and agile - and a very strong swimmer. She was part of the fishers of the village. Every morning, very early, she went to set her net. ";
    this.textDialogues[61] = "She remembered the eerie quietness of the village when she was walking back home to her husband and child the first day the creature had attacked. ";
    this.textDialogues[62] = "Her husband Matteo had already gone to fight the monster and not been seen since. Her baby needed her, and she didn't want to go. ";
    this.textDialogues[63] = "But she had the skills to cast a net, and ultimately, capturing the creature would mean saving the village and her baby. She just hoped she would come back alive to little Mara. ";

    this.textDialogues[65] = "Tarald, Fenrik's old father looked at the empty village. Everyone who had any sort of courage had already gone. There was noone else. ";
    this.textDialogues[66] = "Reluctantly, he picked up his woodsman's axe and quietly said his prayers. Time to throw the final dice! ";

    // intro is here because bad planning
    this.textDialogues[70] = "For many generations, the people of Koriki island have lived in peace and happiness. \nThey surf and play dice games, and in the evening they watch the sunset after consuming a tasty, fried fish dinner. ";
    this.textDialogues[71] = "Alas, peace holds no more! ";
    this.textDialogues[72] = "A few days ago, Lloras, a young fisherman came running back from the north west mountain where he and his young girlfriend Liss had gone exploring. ";
    this.textDialogues[73] = "What he reported was both shocking and unreal: a massive creature, atleast twice as tall as a man, with claws for hands and sharp teeth had suddenly grabbed Liss. ";
    this.textDialogues[74] = "Before she could even see what was happening, the thing lifted her and bit - with its many sharp and nasty teeth - bit her leg straight off. ";
    this.textDialogues[75] = "Lloras said he threw rocks at the thing; it then dropped Liss in a heap and reached out to bite him too! Naturally, he ran for it, and immediately called for help when he returned, minutes ago. ";

    this.textDialogues[80] = "'Hi'. ";
    this.textDialogues[81] = "'Greetings' ";
    this.textDialogues[82] = "'Good day' ";
    this.textDialogues[83] = "'How do you do?' ";
    this.textDialogues[84] = "'Morning'";
    this.textDialogues[85] = "'Good luck!' ";
    this.textDialogues[86] = "'Will you be our hero?' ";
    this.textDialogues[87] = "'You can defeat the creature!' ";
    this.textDialogues[88] = "'I can't believe Liss is dead...' ";
    this.textDialogues[89] = "'Rest in peace, Fenrik...' ";

    this.textDialogues[90] = "The creature kills you. ";
    this.textDialogues[91] = "The creature jumps forward and bites you in the head, immediately crushing your skull! ";
    this.textDialogues[92] = "You hit the creature, but it doesn't seem to care. It just strikes back, crushing you against the rock! ";
    this.textDialogues[93] = "You carefully approach the strange creature. Just as you are about to ambush it, it flails and a nasty set of claws severs your arm as you fall to the ground! ";
    this.textDialogues[94] = "The creature attacks with surprising speed and bites your head off before you can say 'hey'! ";
    this.textDialogues[95] = "You strike at the creature's head, but it's like hitting rock. Before you can retreat, it grabs you by the throat and starts eating your larynx... ";
    this.textDialogues[96] = "You have never seen a thing like it. In awe you observe its great claws and spiky teeth as they descend on your weak flesh. ";
    this.textDialogues[97] = "As soon as you see it, you realise this was a big mistake. You try to run away but alas; the creature grabs your leg and starts chewing... ";

    this.textDialogues[100] = "You have died! ";

    this.textDialogues[103] = "Every single person on Koriki island plucked up their courage and went out to become a hero - but failed. ";
    this.textDialogues[104] = "In the mountain, the creature finished eating the last of the bones, and found a good resting place. ";
    this.textDialogues[105] = "He would patiently wait for more food to arrive, settle, and discover the legend of the one hero. This had happened many times before - and was bound to happen again. ";
    this.textDialogues[106] = "His skin slowly changed colour, and he became one with the mountain again. ";
    this.textDialogues[107] = "GAME OVER :( ";

    this.textDialogues[110] = "You yell at the creature: 'Prepare to die, foul thing'. It strikes at you but you dodge and bring your fists down behind its ears. To everyone's surprise it groans in pain and falls down, smashing its head into the wall. ";
    this.textDialogues[111] = "Your mouth still has a strange aftertaste of that smelly liquid you drank earlier. You wonder if it really could have been a Hero's Potion? ";
    this.textDialogues[112] = "You have done it! You have rid Koriki island of the evil creature! You kick the thing and leave the mountain; you are a true hero now! Congratulations! ";
    this.textDialogues[113] = "GAME OVER :) ";    

    this.text = this.game.add.text(this.player.x, this.player.y, this.textDialogues[0], this.style);
    this.text.visible = false;

    this.text.anchor.set(0.5);
    this.text.wordWrap = true;
    this.text.wordWrapWidth = 280; //window.innerWidth - 50;

    this.startingPlayerX = this.player.x;
    this.startingPlayerY = this.player.y;
    
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
  talkDialogue: function(num, name) {
    this.paused = true;
    this.dialogue = true;
    this.background.x = this.player.x - this.startingPlayerX;
    this.background.y = this.player.y - this.startingPlayerY;

    this.text.x =  this.player.x;
    this.text.y =  this.player.y;
    this.text.text = name + ":\n\n" + this.textDialogues[num];
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
    this.bigbackground.visible = true;
    this.bigbackground.x = this.player.x - this.startingPlayerX;
    this.bigbackground.y = this.player.y - this.startingPlayerY;
    var tween = this.game.add.tween(this.bigbackground).to({alpha: 2}, 2000, Phaser.Easing.Linear.None, false);//.to({alpha: 0}, 1000, Phaser.Easing.Linear.None, false);
    tween.onComplete.add(this.respawnPlayer, this);
    tween.start();

  },
  fadeIn: function() {
    this.bigbackground.x = this.player.x - this.startingPlayerX;
    this.bigbackground.y = this.player.y - this.startingPlayerY;
    var tween = this.game.add.tween(this.bigbackground).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, false);
    
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
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },
  createCharacters: function() {
    this.characters = this.game.add.group();
    this.characters.enableBody = true;
    result = this.findObjectsByType('npc', this.map, 'objectsLayer');
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
    var sprite = group.create(element.x, element.y, this.currentSpriteSheetName); //'all_sprites');//element.properties.sprite);

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
                this.showDialogue(70);
          break;
        case 1: this.state++;
                this.showDialogue(71);
          break;
        case 2: this.state++;
                this.showDialogue(72);
          break;
        case 3: this.state++;
                this.showDialogue(73);
          break;
        case 4: this.state++;
                this.showDialogue(74);
          break;
        case 5: this.state++;
                this.showDialogue(75);
          break;
        case 6: this.state++;
                this.fadeIn();
                this.showDialogue(0);
          break;
        case 7: this.state++;
                this.showDialogue(1);
                this.bigbackground.visible = false;
                this.bigbackground.alpha = 0.0;
          break;
              // heroes:
        case 10: this.state++;
                 this.fadeIn();
                 this.showDialogue(10);
                 this.recentlyInCombat = false;
                 break;
        case 11: this.state++;
                 this.showDialogue(11);
                 break;
        case 15: this.state++;
                 this.fadeIn();
                 this.showDialogue(15);
                 this.recentlyInCombat = false;
                 break;
        case 16: this.state++;
                 this.showDialogue(16);
                 break;
        case 17: this.state++;
                 this.showDialogue(17);
                 break;
        case 18: this.state++;
                 this.showDialogue(18);
                 break;
        case 19: this.state = 24;
                 this.showDialogue(19);
                 break;
        case 20: this.state++;
                 this.fadeIn();
                 this.showDialogue(20);
                 this.recentlyInCombat = false;
                 break;
        case 21: this.state++;
                 this.showDialogue(21);
                 break;
        case 22: this.state++;
                 this.showDialogue(22);
                 break;
        case 23: this.state++;
                 this.showDialogue(23);
                 break;
        case 24: break; // safe
        case 25: this.state++;
                 this.fadeIn();
                 this.showDialogue(25);
                 this.recentlyInCombat = false;
                 break;
        case 26: this.state++;
                 this.showDialogue(26);
                 break;
        case 27: this.state++;
                 this.showDialogue(27);
                 break;
        case 28: this.state++;
                 this.showDialogue(28);
                 break;
        case 29: this.state = 24;
                 this.showDialogue(29);
                 break;
        case 30: this.state++;
                 this.fadeIn();
                 this.showDialogue(30);
                 this.recentlyInCombat = false;
                 break;
        case 31: this.state++;
                 this.showDialogue(31);
                 break;
        case 35: this.state++;
                 this.fadeIn();
                 this.showDialogue(35);
                 this.recentlyInCombat = false;
                 break;
        case 36: this.state++;
                 this.showDialogue(36);
                 break;
        case 40: this.state++;
                 this.fadeIn();
                 this.showDialogue(40);
                 this.recentlyInCombat = false;
                 break;
        case 45: this.state++;
                 this.fadeIn();
                 this.showDialogue(45);
                 this.recentlyInCombat = false;
                 break;
        case 46: this.state++;
                 this.showDialogue(46);
                 break;
        case 50: this.state++;
                 this.fadeIn();
                 this.showDialogue(50);
                 this.recentlyInCombat = false;
                 break;
        case 51: this.state++;
                 this.showDialogue(51);
                 break;
        case 52: this.state++;
                 this.showDialogue(52);
                 break;
        case 55: this.state++;
                 this.fadeIn();
                 this.showDialogue(55);
                 this.recentlyInCombat = false;
                 break;
        case 56: this.state++;
                 this.showDialogue(56);
                 break;
        case 57: this.state++;
                 this.showDialogue(57);
                 break;
        case 60: this.state++;
                 this.fadeIn();
                 this.showDialogue(60);
                 this.recentlyInCombat = false;
                 break;
        case 61: this.state++;
                 this.showDialogue(61);
                 break;
        case 62: this.state++;
                 this.showDialogue(62);
                 break;
        case 63: this.state++;
                 this.showDialogue(63);
                 break;
        case 65: this.state++;
                 this.fadeIn();
                 this.showDialogue(65);
                 this.recentlyInCombat = false;
                 break;
        case 66: this.state++;
                 this.showDialogue(66);
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
        case 103: this.state++;
                  this.showDialogue(103); // Everybody died!
          break;
        case 104: this.state++;
                  this.showDialogue(104); // Everybody died!
          break;
        case 105: this.state++;
                  this.showDialogue(105); // Everybody died!
          break;
        case 106: this.state++;
                  this.showDialogue(106); // Everybody died!
          break;
        case 107: this.state++;
                  this.showDialogue(107); // Everybody died!
          break;
        case 108: this.state = 114;
          break;
        case 110: this.state++;                  
          break;
        case 111: if(this.flask) {
                    this.showDialogue(111);
                  }
                  this.state++;                  
          break;
        case 112: this.state++;
                  this.showDialogue(112);
          break;
        case 113: this.state++;
                  this.showDialogue(113);
          break;

        case 114: this.game.state.start("MainMenu");
          break;
      }

    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
    this.game.physics.arcade.overlap(this.player, this.troll, this.enterCombat, this.isPlayerAliveAndKicking, this);
    this.game.physics.arcade.overlap(this.player, this.characters, this.talk, this.readyToTalk, this);
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
  enterCombat: function(currentPlayer, troll) {
    if(this.recentlyInCombat || this.deaths === this.playedCharacters) {
      // nothing
    }
    else {
      this.paused = true;
      this.player.animations.stop();

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
        this.deaths++;
        this.flask = false;
        this.showDialogue(Phaser.ArrayUtils.getRandomItem([90,91,92,93,94,95,96,97])); // random kill
      }
    }
  },
  respawnPlayer: function(currentPlayer) {
    this.text.text = " ";
    
    this.player.x = this.startingPlayerX;
    this.player.y = this.startingPlayerY;

    if(!this.cursors.left.isDown) {
      this.player.scale.x = 1;
    }
    this.player.frame = 0;

    this.player.visible = true;

    this.state = 5 + this.deaths*5;
    this.playedCharacters++;
    if(this.deaths >= 13) {
      this.state = 103;

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
    return (this.state < 90) && this.player.visible;
  },
  isPlayerAliveAndKicking: function(player, collisionObj) {
    if((this.state < 90) && !this.recentlyInCombat) {
      this.paused = true;
    }
    return (this.state < 90) && !this.recentlyInCombat && this.player.visible;
  },
  readyToTalk: function(player, collisionObj) {
    return !this.recentlyTalked;
  },
  talk: function(player, npc) {
    // TODO: Add more interaction 
    this.recentlyTalked = true;
    this.game.time.events.add(3000, function() {
      this.recentlyTalked = false;
    }, this);
    if(npc.name === "Lloris") {
      this.talkDialogue(88, npc.name); // random chat
    }
    else if(npc.name === "Tarald") {
      if(this.deaths === 0) {
        this.talkDialogue(87, npc.name); // specific chat
      }
      else {
        this.talkDialogue(89, npc.name); // specific chat
      }
    }
      else {
      this.talkDialogue(Phaser.ArrayUtils.getRandomItem([80,81,82,83,84,85,86,87]), npc.name); // random chat
    }
  }
};
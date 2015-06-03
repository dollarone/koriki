
Koriki.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;


};

var enterkey;

Koriki.MainMenu.prototype = {

	create: function() {

		// this.music = this.add.audio('titleMusic');
		// this.music.play();

		this.tileset = new Phaser.Tileset('all_sprites', 0);

		
		//this.tileset.setImage('http://swapshop.pixelsyntax.com/api/randomImage');



		this.titleImage = this.add.sprite(0, 0, 'titlepage'); // background

		this.currentTiles = this.add.sprite(20, 100, 'gameTiles');
 
 		this.add.button(182, 87, 'all_sprites', this.startGame, this, 1, 0, 2, 1);
        this.add.button(183, 132, 'all_sprites', this.randomSpriteSheet, this, 10, 9, 11, 10);

		this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		this.enterKey.onDown.add(this.startGame, this);
		this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
		this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		this.nKey.onDown.add(this.randomSpriteSheet, this);
		this.escKey.onDown.add(this.randomSpriteSheet, this);
	},

	update: function() {
	},
	randomSpriteSheet: function() {

		
		this.currentTiles.loadTexture('gameTiles2');

		this.game.load.spritesheet('gametiles2');
		this.tileset.setImage('gametiles2');
		/*
		this.gametiles2 = this.load.image('gameTiles2', 'assets/images/example2.png'); 		
		//this.currentTiles.loadTexture('gameTiles2');
this.tiles.kill();
this.tiles = this.load.image('gameTiles', 'assets/images/example2.png');
		    //this.tiles.loadTexture('gameTiles2', 0, false);
    this.sprites.loadTexture('gameTiles2', 0, false);
this.currentTiles.kill();
this.currentTiles = this.add.image(20, 100, 'gameTiles');



		this.currentTiles.load.image= this.load.image('gameTiles2', 'assets/images/example2.png'); 		
 	    this.currentSprites = this.add.sprite(0, 0, 'all_sprites');
 	    this.currentTiles.key.loadTexture('gameTiles2');
 	    this.sprites = this.game.load.spritesheet('all_sprites', 'assets/images/example2.png', 16, 16);
 	    */
	},

	startGame: function() {

		// this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};

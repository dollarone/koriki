
Koriki.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;


};

Koriki.MainMenu.prototype = {

	create: function() {

		// this.music = this.add.audio('titleMusic');
		// this.music.play();
		this.add.sprite(0, 0, 'titlepage'); // background

		this.currentSpriteSheetName = 'spritesheet0';

	    this.bigbackground = this.game.add.graphics(0, 0);
	    this.bigbackground.beginFill(0xFFFFFF);
	    this.bigbackground.drawRect(20, 100, 128, 128);
	    this.bigbackground.endFill();

		for(i=0; i<8; i++) {
			for(j=0; j<8; j++) {
				this.add.sprite(20 + j*16, 100 + i*16, this.currentSpriteSheetName, j + i*8);
			}
		}

 
 		this.add.button(182, 87, this.currentSpriteSheetName, this.startGame, this, 1, 0, 2, 1);
        this.add.button(184, 132, this.currentSpriteSheetName, this.randomSpriteSheet, this, 10, 9, 11, 10);

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

		var allSheets = [];
		for(i=0; i<99; i++) {
			allSheets[i]= i;
		}
		this.currentSpriteSheetName = 'spritesheet' + Phaser.ArrayUtils.getRandomItem(allSheets);

	    this.bigbackground = this.game.add.graphics(0, 0);
	    this.bigbackground.beginFill(0xFFFFFF);
	    this.bigbackground.drawRect(20, 100, 128, 128);
	    this.bigbackground.endFill();
		for(i=0; i<8; i++) {
			for(j=0; j<8; j++) {
				this.add.sprite(20 + j*16, 100 + i*16, this.currentSpriteSheetName, j + i*8);
			}
		}
	},

	startGame: function() {

		// this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};

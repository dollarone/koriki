
Koriki.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;


};

var enterkey;

Koriki.MainMenu.prototype = {

	create: function() {

		// this.music = this.add.audio('titleMusic');
		// this.music.play();

		this.add.sprite(0, 51, 'titlepage');
 
        this.add.button(100, 200, 'all_sprites', this.startGame, this, 1, 0, 2);

	},

	update: function() {

	},

	startGame: function() {

		// this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};

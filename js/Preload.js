var Koriki = Koriki || {};

//loading the game assets
Koriki.Preload = function(){};

Koriki.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.tilemap('level1', 'assets/tilemaps/ogre3.json', null, Phaser.Tilemap.TILED_JSON);


    this.load.image('gameTiles', 'assets/images/example.png');
    this.load.image('gameTiles2', 'assets/images/example2.png');
    this.game.load.spritesheet('all_sprites', 'assets/images/example.png', 16, 16);
   
    this.load.image('titlepage', 'assets/images/koriki-title.png');

   
  },
  create: function() {
    this.state.start('MainMenu'); //, true, true);
  }
};
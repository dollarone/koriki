var Koriki = Koriki || {};

Koriki.game = new Phaser.Game(320, 320, Phaser.AUTO, '');

Koriki.game.state.add('Boot', Koriki.Boot);
Koriki.game.state.add('Preload', Koriki.Preload);
Koriki.game.state.add('MainMenu', Koriki.MainMenu);
Koriki.game.state.add('Game', Koriki.Game);

Koriki.game.state.start('Boot');
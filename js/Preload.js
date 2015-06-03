var Koriki = Koriki || {};

//loading the game assets
Koriki.Preload = function(){};

Koriki.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.currentSpriteSheetName = 'spritesheet0';
    this.load.setPreloadSprite(this.preloadBar);
    this.load.tilemap('level1', 'assets/tilemaps/ogre3.json', null, Phaser.Tilemap.TILED_JSON);   
    this.load.image('titlepage', 'assets/images/koriki-title.png');

    this.game.load.spritesheet('spritesheet0', 'assets/images/example.png', 16, 16);
    this.game.load.spritesheet('spritesheet1', 'assets/spritesheets/0270b2a45452255c4d69b4883854ff19.png', 16, 16);
    this.game.load.spritesheet('spritesheet2', 'assets/spritesheets/078d4316cfffb7e3d314fc2b967077bb.png', 16, 16);
    this.game.load.spritesheet('spritesheet3', 'assets/spritesheets/08d2b8e62824ea7b3b549eb919154097.png', 16, 16);
    this.game.load.spritesheet('spritesheet4', 'assets/spritesheets/0b19147c9d2f538dcc0c5acb136d88cc.png', 16, 16);
    this.game.load.spritesheet('spritesheet5', 'assets/spritesheets/1074122927c5b229a22b88b89b6321b0.png', 16, 16);
    this.game.load.spritesheet('spritesheet6', 'assets/spritesheets/11ed2fe88ce37224c889bc6c3185f889.png', 16, 16);
    this.game.load.spritesheet('spritesheet7', 'assets/spritesheets/13f5811b1802cd2176d99d5cf620fcbf.png', 16, 16);
    this.game.load.spritesheet('spritesheet8', 'assets/spritesheets/15e1eb5ce0cefcfc3ad4a44bc2a219da.png', 16, 16);
    this.game.load.spritesheet('spritesheet9', 'assets/spritesheets/18e9a3da5aec393bb565de645b16567e.png', 16, 16);
    this.game.load.spritesheet('spritesheet10', 'assets/spritesheets/191d4f51be67c29292ecd391b0ce4357.png', 16, 16);
    this.game.load.spritesheet('spritesheet11', 'assets/spritesheets/1b09d820844f36d51491821b082b6bce.png', 16, 16);
    this.game.load.spritesheet('spritesheet12', 'assets/spritesheets/1d8f2b1629ed0755b32a74683ba28ddc.png', 16, 16);
    this.game.load.spritesheet('spritesheet13', 'assets/spritesheets/205081db0a23e5bf49fe44bcd9b255ae.png', 16, 16);
    this.game.load.spritesheet('spritesheet14', 'assets/spritesheets/21d76c427762231c0e4daea0ce209223.png', 16, 16);
    this.game.load.spritesheet('spritesheet15', 'assets/spritesheets/22b585c78408df9e5a12a77d40c90551.png', 16, 16);
    this.game.load.spritesheet('spritesheet16', 'assets/spritesheets/234906eca3f648431e69b69af686935e.png', 16, 16);
    this.game.load.spritesheet('spritesheet17', 'assets/spritesheets/2374f9a02ae94802bf0c52e0ef6eafbc.png', 16, 16);
    this.game.load.spritesheet('spritesheet18', 'assets/spritesheets/25d7f2758a0468b9ece6ed5048e58610.png', 16, 16);
    this.game.load.spritesheet('spritesheet19', 'assets/spritesheets/27e0e929a6e1d52d06d2f39dae9df2e3.png', 16, 16);
    this.game.load.spritesheet('spritesheet20', 'assets/spritesheets/284e0f206043988c54383e00b6c454f2.png', 16, 16);
    this.game.load.spritesheet('spritesheet21', 'assets/spritesheets/296d2292b719b286118e37db628721e1.png', 16, 16);
    this.game.load.spritesheet('spritesheet22', 'assets/spritesheets/30d34e3d9f2a2e6a5f6e6ec6eda9a45a.png', 16, 16);
    this.game.load.spritesheet('spritesheet23', 'assets/spritesheets/33a7308453f708a1d94adaa039526239.png', 16, 16);
    this.game.load.spritesheet('spritesheet24', 'assets/spritesheets/34652b5e419ad37fd84365495a1b0a0e.png', 16, 16);
    this.game.load.spritesheet('spritesheet25', 'assets/spritesheets/36196941befc650a7426d401b8c1140f.png', 16, 16);
    this.game.load.spritesheet('spritesheet26', 'assets/spritesheets/3a8ceff46c998d9708d2bf8dff645373.png', 16, 16);
    this.game.load.spritesheet('spritesheet27', 'assets/spritesheets/3a983d407c530d58caf70727bc231209.png', 16, 16);
    this.game.load.spritesheet('spritesheet28', 'assets/spritesheets/3d7537349fab59f6f04455056446e870.png', 16, 16);
    this.game.load.spritesheet('spritesheet29', 'assets/spritesheets/409d602d23bd3dcd712b5d929fd30175.png', 16, 16);
    this.game.load.spritesheet('spritesheet30', 'assets/spritesheets/41e43eba6a1985b6378975a345c80322.png', 16, 16);
    this.game.load.spritesheet('spritesheet31', 'assets/spritesheets/4ab64737e0fd33233d37cc56b92b32e9.png', 16, 16);
    this.game.load.spritesheet('spritesheet32', 'assets/spritesheets/4b84fb95e41653ba3ddc4aa75b47c613.png', 16, 16);
    this.game.load.spritesheet('spritesheet33', 'assets/spritesheets/5ce681f8ad2593ea3e10b53f76f9ed85.png', 16, 16);
    this.game.load.spritesheet('spritesheet34', 'assets/spritesheets/5f8a2db3411e15641b697c54baa5e4c1.png', 16, 16);
    this.game.load.spritesheet('spritesheet35', 'assets/spritesheets/633b1a81e2374ea529367263aea0d50f.png', 16, 16);
    this.game.load.spritesheet('spritesheet36', 'assets/spritesheets/637b367335f094e1de21eb2f78931d0c.png', 16, 16);
    this.game.load.spritesheet('spritesheet37', 'assets/spritesheets/65f3bca9edf3afc6629aa6105fc3790d.png', 16, 16);
    this.game.load.spritesheet('spritesheet38', 'assets/spritesheets/6748845bf1f5b6ef27bfa2a0b3c1e2ea.png', 16, 16);
    this.game.load.spritesheet('spritesheet39', 'assets/spritesheets/6eecb477e5e81ab7bf97fa0ec679b53b.png', 16, 16);
    this.game.load.spritesheet('spritesheet40', 'assets/spritesheets/703a44979d375083e5af7426a65aed28.png', 16, 16);
    this.game.load.spritesheet('spritesheet41', 'assets/spritesheets/772c88928f89fa183c7ff2648c17af2c.png', 16, 16);
    this.game.load.spritesheet('spritesheet42', 'assets/spritesheets/777a71e2a697cd74ce6d031f9ac192b6.png', 16, 16);
    this.game.load.spritesheet('spritesheet43', 'assets/spritesheets/7aaa28d6b66bdf7b71b141cff2f94553.png', 16, 16);
    this.game.load.spritesheet('spritesheet44', 'assets/spritesheets/7e4385bad55944f46a29cf9b74931164.png', 16, 16);
    this.game.load.spritesheet('spritesheet45', 'assets/spritesheets/8028de637ceffc72e5169837cbbb6a8b.png', 16, 16);
    this.game.load.spritesheet('spritesheet46', 'assets/spritesheets/8422a981ca5880e81fe1effc3d23aab0.png', 16, 16);
    this.game.load.spritesheet('spritesheet47', 'assets/spritesheets/85934692de36031149892c0231081b79.png', 16, 16);
    this.game.load.spritesheet('spritesheet48', 'assets/spritesheets/88fb887143ef90ec580e373900777aef.png', 16, 16);
    this.game.load.spritesheet('spritesheet49', 'assets/spritesheets/89fe3775c3a0f4dd90982af58be72d89.png', 16, 16);
    this.game.load.spritesheet('spritesheet50', 'assets/spritesheets/89ffb24e77a053f27f2e5d460cf3fbd1.png', 16, 16);
    this.game.load.spritesheet('spritesheet51', 'assets/spritesheets/8fb0606078a1145742f3f69b5d1e7f38.png', 16, 16);
    this.game.load.spritesheet('spritesheet52', 'assets/spritesheets/91595164a134e3ce2cb37418ab690e73.png', 16, 16);
    this.game.load.spritesheet('spritesheet53', 'assets/spritesheets/91c83eedbe1fe6d9c23bd8c90f317b7f.png', 16, 16);
    this.game.load.spritesheet('spritesheet54', 'assets/spritesheets/977833c087656c3400ebc095a7a99bdb.png', 16, 16);
    this.game.load.spritesheet('spritesheet55', 'assets/spritesheets/9a5b92ec7d514fb9b125c856a4610f6f.png', 16, 16);
    this.game.load.spritesheet('spritesheet56', 'assets/spritesheets/9a7135cac68c7a987a5b964d7ebd88b9.png', 16, 16);
    this.game.load.spritesheet('spritesheet57', 'assets/spritesheets/9cbfa152c3a80c2ff398a95115f6637f.png', 16, 16);
    this.game.load.spritesheet('spritesheet58', 'assets/spritesheets/9e76b0fe465db954686e48dde1a7f700.png', 16, 16);
    this.game.load.spritesheet('spritesheet59', 'assets/spritesheets/9f94244037d916a8c1029452106b764f.png', 16, 16);
    this.game.load.spritesheet('spritesheet60', 'assets/spritesheets/a28fd2c473fd6cfb5eea05701346c143.png', 16, 16);
    this.game.load.spritesheet('spritesheet61', 'assets/spritesheets/a3353880e5e9b25c96d1128a27a88ccb.png', 16, 16);
    this.game.load.spritesheet('spritesheet62', 'assets/spritesheets/a50abb55b008d6ba8d05be8a801aad38.png', 16, 16);
    this.game.load.spritesheet('spritesheet63', 'assets/spritesheets/a5912ca4be35d921619994dc83ef85d0.png', 16, 16);
    this.game.load.spritesheet('spritesheet64', 'assets/spritesheets/a618d1f9a8ef6a51b9927a80b08e91b6.png', 16, 16);
    this.game.load.spritesheet('spritesheet65', 'assets/spritesheets/a6aa01b42467491e22474a4a17b0a8a3.png', 16, 16);
    this.game.load.spritesheet('spritesheet66', 'assets/spritesheets/a986a82b0677f4a0e14b600c66814586.png', 16, 16);
    this.game.load.spritesheet('spritesheet67', 'assets/spritesheets/adceaa1e6e8fac7676af3d718b451cd3.png', 16, 16);
    this.game.load.spritesheet('spritesheet68', 'assets/spritesheets/b0284b965b5673d42e7ac2227adcb52d.png', 16, 16);
    this.game.load.spritesheet('spritesheet69', 'assets/spritesheets/b1d1cbc7776cd111cf2e1dbceef09e56.png', 16, 16);
    this.game.load.spritesheet('spritesheet70', 'assets/spritesheets/b330c836b33bcdefeb28c5d89337be67.png', 16, 16);
    this.game.load.spritesheet('spritesheet71', 'assets/spritesheets/b7b580ab0ac4df1df5a617b55a2feff8.png', 16, 16);
    this.game.load.spritesheet('spritesheet72', 'assets/spritesheets/bc76972a306404cdb3f6aaa4dd1bfa7d.png', 16, 16);
    this.game.load.spritesheet('spritesheet73', 'assets/spritesheets/bda58f658b340b0e8d76627232874a22.png', 16, 16);
    this.game.load.spritesheet('spritesheet74', 'assets/spritesheets/bddbf084b70cb61067fcb45304d467b2.png', 16, 16);
    this.game.load.spritesheet('spritesheet75', 'assets/spritesheets/c32516fd3b77a9a67fc3a30b813cfdd9.png', 16, 16);
    this.game.load.spritesheet('spritesheet76', 'assets/spritesheets/c3cd0403e49185a248b690dd5c684759.png', 16, 16);
    this.game.load.spritesheet('spritesheet77', 'assets/spritesheets/c60b062ac76c498b6bc882eabdf3a109.png', 16, 16);
    this.game.load.spritesheet('spritesheet78', 'assets/spritesheets/cc1283e076fefcba8edfcd1494533257.png', 16, 16);
    this.game.load.spritesheet('spritesheet79', 'assets/spritesheets/cdd1b5013897c80edab687b2b1ef6b4d.png', 16, 16);
    this.game.load.spritesheet('spritesheet80', 'assets/spritesheets/d1d8adbf0a1658c2f7b9ea1f6f6a95a4.png', 16, 16);
    this.game.load.spritesheet('spritesheet81', 'assets/spritesheets/d20b9a43db5df58064566448e82693a9.png', 16, 16);
    this.game.load.spritesheet('spritesheet82', 'assets/spritesheets/db19bce9fe88150b5548d0dfed1b3496.png', 16, 16);
    this.game.load.spritesheet('spritesheet83', 'assets/spritesheets/dd23a38ff2bbc43dae60ff3f0eb2c4c4.png', 16, 16);
    this.game.load.spritesheet('spritesheet84', 'assets/spritesheets/dd7a2904d22d5a7b61db9757962e3ffe.png', 16, 16);
    this.game.load.spritesheet('spritesheet85', 'assets/spritesheets/de0268589991d94fca10a6cbe3ffc4ba.png', 16, 16);
    this.game.load.spritesheet('spritesheet86', 'assets/spritesheets/df552b5c63f94927300710d32a655832.png', 16, 16);
    this.game.load.spritesheet('spritesheet87', 'assets/spritesheets/e3a746ed5f6ab68480dad3eca6f02ee6.png', 16, 16);
    this.game.load.spritesheet('spritesheet88', 'assets/spritesheets/e40bcce7b2bdebdd24db845711480353.png', 16, 16);
    this.game.load.spritesheet('spritesheet89', 'assets/spritesheets/e8f801bbb899167370daf6e03dc39665.png', 16, 16);
    this.game.load.spritesheet('spritesheet90', 'assets/spritesheets/f1b072f61252a32e6e62575bec996ead.png', 16, 16);
    this.game.load.spritesheet('spritesheet91', 'assets/spritesheets/f1dd882f458f2b69499244f781b99472.png', 16, 16);
    this.game.load.spritesheet('spritesheet92', 'assets/spritesheets/f4950ebe61fad5d56ced0f45f9e2d945.png', 16, 16);
    this.game.load.spritesheet('spritesheet93', 'assets/spritesheets/f52925ceee6242fd421b3d6da0cfe360.png', 16, 16);
    this.game.load.spritesheet('spritesheet94', 'assets/spritesheets/f7b7d5e43236d0e8ce17140493da6c7b.png', 16, 16);
    this.game.load.spritesheet('spritesheet95', 'assets/spritesheets/f8ebf4c1604ffff615f11ab09d699abe.png', 16, 16);
    this.game.load.spritesheet('spritesheet96', 'assets/spritesheets/f9b08a74a651e5a39fcef2f5538c9bb2.png', 16, 16);
    this.game.load.spritesheet('spritesheet97', 'assets/spritesheets/fa3aced9730589ba7626b2c8bf51acca.png', 16, 16);
    this.game.load.spritesheet('spritesheet98', 'assets/spritesheets/fcb14086c472d8ebe554faade4a70a18.png', 16, 16);
    this.game.load.spritesheet('spritesheet99', 'assets/spritesheets/fdd86e9c6fddf6beb5a954c1681f6ad3.png', 16, 16);


  },
  create: function() {
    this.state.start('MainMenu'); //, true, true);
  }
};
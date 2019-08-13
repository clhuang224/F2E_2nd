const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    parent: 'game',
    scene: [
        gameStart,
        gamePlay,
        // gameEnd,
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 250
            },
            // debug: true,
        },
    },
    backgroundColor:0x7EBE8D,
}

const game = new Phaser.Game(config);
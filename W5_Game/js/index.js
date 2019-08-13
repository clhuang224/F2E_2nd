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
    backgroundColor:0x7EBE8D,
}

const game = new Phaser.Game(config);
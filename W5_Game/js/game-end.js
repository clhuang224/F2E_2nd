const gameEnd = {
    key: 'gameEnd',
    preload: function () {
        this.load.image('bg-back', './img/bg-back.png');
        this.load.image('bg-middle', './img/bg-middle.png');
        this.load.image('bg-front', './img/bg-front.png');
        this.load.image('bg-ground', './img/bg-ground.png');
        this.load.image('control', './img/control.png');
        this.load.image('time', './img/time.png');
        this.load.image('player-end', './img/player-end.png');
        this.load.image('play-again', './img/btn-play-again.png');
        this.load.image('congratulations', './img/txt-congratulations.png');
    },
    create: function () {
        this.bgColor = this.cameras.add(0, 0, gameWidth, gameHeight);
        this.bgColor.setBackgroundColor('#20552C');
        this.bgBack = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-back');
        this.bgMiddle = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-middle');
        this.bgFront = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-front');
        this.bgGround = this.add.tileSprite(gameWidth * 0.30625, gameHeight - groundHeight / 2, gameWidth * 1.3875, groundHeight, 'bg-ground');
        this.controlImg = this.add.sprite(gameWidth * .13515625, gameHeight * .0375, 'control');
        this.controlImg.x = gameWidth * .13398438;
        this.controlImg.y = gameHeight * .949375;
        this.timeImg = this.add.sprite(gameWidth * .01953125, gameHeight * .3125, 'time');
        this.timeImg.x = gameWidth * .8890625;
        this.timeImg.y = gameHeight * .94625;
        this.timeText = this.add.text(gameWidth * .90625, gameHeight * .9225,
            '00:00'
            , { fontSize: gameHeight * .04, lineSpacing: gameHeight * .0475, padding: 0, margin: 0, fontFamily: 'Roboto', });

        this.circle1 = this.add.circle(gameWidth / 2, gameHeight * .3671375, gameWidth * .118015625, 0xFFFFFF);
        this.circle1.alpha = 0.2;
        this.circle2 = this.add.circle(gameWidth / 2, gameHeight * .3671375, gameWidth * .134703125, 0xFFFFFF);
        this.circle2.alpha = 0.2;
        this.circle3 = this.add.circle(gameWidth / 2, gameHeight * .3671375, gameWidth * .14423828125, 0xFFFFFF);
        this.circle3.alpha = 0.2;
        this.player = this.add.sprite(gameWidth / 5, gameHeight * .24, 'player-end');
        this.player.x = gameWidth / 2;
        this.player.y = gameHeight * .3671375;

        this.congratulations = this.add.sprite(gameWidth * .3703125, gameHeight * .15125, 'congratulations');
        this.congratulations.x = gameWidth * .49973828125;
        this.congratulations.y = gameHeight * .04625;
        this.congratulations.alpha = 0;
        this.playAgain = this.add.sprite(buttonWidth, buttonHeight, 'play-again');
        this.playAgain.x = gameWidth * .5;
        this.playAgain.y = gameHeight * .3325;
        this.playAgain.alpha = 0;
        this.keyboard = this.input.keyboard.createCursorKeys();
    },
    update: function () {
        if (this.player.y < gameHeight * .65) {
            this.player.y += 3 * unit;
            this.circle1.y += 3 * unit;
            this.circle2.y += 3 * unit;
            this.circle3.y += 3 * unit;
        }
        else {
            this.congratulations.alpha += 0.01;
            this.playAgain.alpha += 0.01;
            if (this.keyboard.space.isDown) {
                this.scene.start('gameStart');
            }
        }
    }
}
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
        this.bgBack = this.add.image(gameWidth / 2, gameHeight / 2, 'bg-back');
        this.bgMiddle = this.add.image(gameWidth / 2, gameHeight / 2, 'bg-middle');
        this.bgFront = this.add.image(gameWidth / 2, gameHeight / 2, 'bg-front');
        this.bgGround = this.add.image(gameWidth - 888, gameHeight - 100, 'bg-ground');
        this.controlImg = this.add.image(171.5, 759.5, 'control');
        this.timeImg = this.add.image(1138, 757, 'time');
        this.timeText = this.add.text(1160, 738, '00:00',
            { fontSize: 32, lineSpacing: 38, padding: 0, margin: 0, fontFamily: 'Roboto', });
        this.circle1 = this.add.circle(488.94 + 151.06, 142.65 + 151.06, 151.06, 0xFFFFFF);
        this.circle1.alpha = 0.2;
        this.circle2 = this.add.circle(467.58 + 172.42, 121.29 + 172.42, 172.42, 0xFFFFFF);
        this.circle2.alpha = 0.2;
        this.circle3 = this.add.circle(455.37 + 184.625, 109.08 + 184.625, 184.625, 0xFFFFFF);
        this.circle3.alpha = 0.2;
        this.player = this.add.image(640, 293.71, 'player-end');
        this.congratulations = this.add.image(639.665, 148.4, 'congratulations');
        this.congratulations.alpha = 0;
        this.playAgain = this.add.image(640, 266, 'play-again');
        this.playAgain.alpha = 0;
        this.keyboard = this.input.keyboard.createCursorKeys();

    },
    update: function () {
        if (this.player.y < 520) {
            this.player.y += 3;
            this.circle1.y += 3;
            this.circle2.y += 3;
            this.circle3.y += 3;
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
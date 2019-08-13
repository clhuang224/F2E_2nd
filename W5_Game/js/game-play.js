const gamePlay = {
    key: 'gamePlay',
    preload: function () {
        this.load.image('bg-back', './img/bg-back.png');
        this.load.image('bg-middle', './img/bg-middle.png');
        this.load.image('bg-front', './img/bg-front.png');
        this.load.image('bg-ground', './img/bg-ground.png');
    },
    create: function () {
        this.camera = this.cameras.add(0, 0, gameWidth, gameHeight);
        this.camera.setBackgroundColor('#20552C');
        this.backgroundColor = 0xFF0000;
        this.bgBack = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-back');
        this.bgMiddle = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-middle');
        this.bgFront = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-front');
        this.bgGround = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-ground');
    },
    update: function () {
        this.bgBack.tilePositionX += 1;
        this.bgMiddle.tilePositionX += 3;
        this.bgFront.tilePositionX += 5;
        this.bgGround.tilePositionX += 6;
    }
}
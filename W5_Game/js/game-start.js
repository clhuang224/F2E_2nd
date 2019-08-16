const gameStart = {
    key: 'gameStart',
    preload: function () {
        this.load.image('img-title', './img/img-title.png');
        this.load.image('text-title', './img/txt-title.png');
        this.load.image('text-subtitle', './img/txt-subtitle.png');
        this.load.image('button', './img/btn-press-start.png');
    },
    create: function () {
        this.imgTitle = this.add.image(392.5, 38.75 + gameHeight / 2, 'img-title');
        this.graphic = this.add.graphics();
        this.graphic.fillStyle(0xffffff, 1);
        this.graphic.fillRoundedRect(gameWidth * 0.5859375, gameHeight * 0.04, gameWidth * 445 / 1280, gameHeight * 736 / 800, 8);
        this.textTitle = this.add.sprite(gameWidth * 0.28125, gameHeight * 0.29875, 'text-title');
        this.textTitle.x = gameWidth * 0.75864063;
        this.textTitle.y = gameHeight * 0.39684375;
        this.textTitle.alpha = 0;
        this.textSubtitle = this.add.sprite(gameWidth * 0.21328125, gameHeight * 0.03, 'text-subtitle');
        this.textSubtitle.x = gameWidth * 0.7675625;
        this.textSubtitle.y = gameHeight * 0.6159625;
        this.textSubtitle.alpha = 0;
        this.button = this.add.sprite(buttonWidth, buttonHeight, 'button');
        this.button.x = gameWidth * 0.76484375;
        this.button.y = gameHeight * 0.74;
        this.button.alpha = 0;
        this.keyboard = this.input.keyboard.createCursorKeys();
    },
    update: function () {
        this.textTitle.alpha += 0.03;
        this.textSubtitle.alpha += 0.03;
        this.button.alpha += 0.03;
        if (this.keyboard.space.isDown) {
            this.scene.start('gamePlay');
        }
    }
}
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
        this.graphic.fillRoundedRect(750, 32, 445, 736, 8);
        this.textTitle = this.add.image(791.52 + 359.08 / 2, 197.99 + 238.97 / 2, 'text-title');
        this.textTitle.alpha = 0;
        this.textSubtitle = this.add.image(846.41 + 272.14 / 2, 480.77 + 24 / 2, 'text-subtitle');
        this.textSubtitle.alpha = 0;
        this.button = this.add.image(979, 592, 'button');
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
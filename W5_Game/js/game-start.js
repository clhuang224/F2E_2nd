let graphic;

const gameStart = {
    key: 'gameStart',
    preload: function () {
        this.load.image('img-title', './img/img-title.png');
        this.load.image('text-title', './img/txt-title.png');
        this.load.image('text-subtitle', './img/txt-subtitle.png');
        this.load.image('button','./img/btn-press-start.png');
    },
    create: function () {
        this.imgTitle = this.add.image(392.5, 38.75 + gameHeight / 2, 'img-title');
        graphic = this.add.graphics();
        graphic.fillStyle(0xffffff, 1);
        graphic.fillRoundedRect(750, 32, 445, 736, 8);
        this.textTitle = this.add.image(791.52 + 359.08 / 2, 197.99 + 238.97 / 2, 'text-title');
        this.textSubtitle = this.add.image(846.41+272.14 / 2, 480.77 + 24 / 2, 'text-subtitle');
        this.button = this.add.image(979,592,'button');
    },
    update: function () {
        const keyboard = this.input.keyboard.createCursorKeys();
        if (keyboard.space.isDown) {
            this.scene.start('gamePlay');
        }
    }
}
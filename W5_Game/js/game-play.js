const gamePlay = {
    key: 'gamePlay',
    preload: function () {
        this.load.image('bg-back', '../img/bg-back.svg');
    },
    create: function () {
        this.bgBack = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-back');
    },
    update: function () {
    }
}
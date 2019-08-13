
const gamePlay = {
    key: 'gamePlay',
    preload: function () {
        this.load.image('bg-back', './img/bg-back.png');
        this.load.image('bg-middle', './img/bg-middle.png');
        this.load.image('bg-front', './img/bg-front.png');
        this.load.image('bg-ground', './img/bg-ground.png');
        this.load.image('control', './img/control.png');
        this.load.image('time', './img/time.png');
        this.load.spritesheet('skill', './img/skill.png', { frameWidth: 49, frameHeight: 64 });
        this.load.spritesheet('player', './img/player.png', { frameWidth: 144, frameHeight: 120 });

        this.time = 90;
        this.speed = 1;
    },
    create: function () {
        // 動畫
        this.anims.create({
            key: 'shine',
            frames: this.anims.generateFrameNumbers('skill', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({
            key: 'float',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1,
        });

        // 背景
        this.bgColor = this.cameras.add(0, 0, gameWidth, gameHeight);
        this.bgColor.setBackgroundColor('#20552C');
        this.bgBack = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-back');
        this.bgMiddle = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-middle');
        this.bgFront = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-front');
        this.bgGround = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-ground');

        // 資訊
        this.controlImg = this.add.image(171.5, 759.5, 'control');
        this.timeImg = this.add.image(1138, 757, 'time');
        this.timeText = this.add.text(1160, 738,
            `${String(Math.floor(this.time / 60)).padStart(2, '0')}:${String(this.time % 60).padStart(2, '0')}`
            , { fontSize: 32, lineSpacing: 38, padding: 0, margin: 0, fontFamily: 'Roboto', });

        // 主角
        this.player = this.physics.add.sprite(144, 120, 'player');
        this.player.anims.play('float', true);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(1);
        this.player.setSize(100, 100, 0);

        // 紅色
        this.red = this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0xFF0000, 0);

        this.timeId = setInterval(() => {
            this.time -= 1;
            this.timeText.setText(`${String(Math.floor(this.time / 60)).padStart(2, '0')}:${String(this.time % 60).padStart(2, '0')}`);
        }, 1000);
    },
    update: function () {
        this.bgBack.tilePositionX += 2 * this.speed;
        this.bgMiddle.tilePositionX += 3 * this.speed;
        this.bgFront.tilePositionX += 5 * this.speed;
        this.bgGround.tilePositionX += 6 * this.speed;

        // 控制主角
        let keyboard = this.input.keyboard.createCursorKeys();
        this.player.anims.play('float', true);
        if (keyboard.up.isDown) {
            // 需要再考慮是否為彈跳狀態
            this.player.setVelocityY(-200);
            this.player.anims.play('move', true);
            this.player.flipY = false;
        } else if (keyboard.down.isDown) {
            this.player.setVelocityY(200);
            this.player.anims.play('move', true);
            this.player.flipY = true;
        } else if (keyboard.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('move', true);
            this.player.flipX = true;
        } else if (keyboard.right.isDown) {
            this.player.setVelocityX(200);
            this.player.anims.play('move', true);
            this.player.flipX = false;
        }

        // 技能Bonus
        // this.skill = this.add.sprite(49, 49, 'skill');
        // this.skill.anims.play('shine', true);

        switch (this.time) {
            case 60:
                this.red.setFillStyle(0xFF0000, 0.15);
                this.speed = 1.5;
                break;
            case 30:
                this.red.setFillStyle(0xFF0000, 0.3);
                this.speed = 2;
                break;
            case 0:
                this.red.setFillStyle(0xFF0000, 0);
                this.speed = 0;
                clearInterval(this.timeId);
                break;
        }
    }
}
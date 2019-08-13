
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
        this.bgGround = this.add.tileSprite(gameWidth - 888, gameHeight - 100, 1776, 200, 'bg-ground');
        this.physics.add.existing(this.bgGround);
        this.bgGround.body.immovable = true;
        this.bgGround.body.moves = false;
        this.transparent = this.add.rectangle(gameWidth / 2, 100, gameWidth, 200, 0x000000, 0);
        this.physics.add.existing(this.transparent);
        this.transparent.body.immovable = true;
        this.transparent.body.moves = false;

        // 資訊
        this.controlImg = this.add.image(171.5, 759.5, 'control');
        this.timeImg = this.add.image(1138, 757, 'time');
        this.timeText = this.add.text(1160, 738,
            `${String(Math.floor(this.time / 60)).padStart(2, '0')}:${String(this.time % 60).padStart(2, '0')}`
            , { fontSize: 32, lineSpacing: 38, padding: 0, margin: 0, fontFamily: 'Roboto', });

        // 主角
        this.player = this.physics.add.sprite(144, 120, 'player');
        this.player.x = 100;
        this.player.y = 300;
        this.player.anims.play('float', true);
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true, 0, 0);
        this.player.setSize(90, 100, 0);
        this.physics.add.collider(this.player, this.bgGround);
        this.physics.add.collider(this.player, this.transparent);

        // 紅色
        this.red = this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0xFF0000, 0);

        this.timeId = setInterval(() => {
            this.time -= 1;
            this.timeText.setText(`${String(Math.floor(this.time / 60)).padStart(2, '0')}:${String(this.time % 60).padStart(2, '0')}`);
            if (this.time === 0) {
                clearInterval(this.timeId);
            }
        }, 1000);

        // 鍵盤
        this.input.keyboard.on('keyup', (event) => {
            let delay;
            if (event.keyCode === SPACE) {
                delay = 2000;
            }
            else {
                delay = 500;
            }
            setTimeout(() => {
                this.player.flipX = false;
                this.player.flipY = false;
                this.player.anims.play('float', true);
            }, delay);

        });
        this.input.keyboard.on('keydown', (event) => {
            switch (event.keyCode) {
                case UP:
                    this.player.setVelocityY(-100);
                    this.player.anims.play('move', true);
                    this.player.flipY = false;
                    break;
                case DOWN:
                    this.player.setVelocityY(100);
                    this.player.anims.play('move', true);
                    this.player.flipY = true;
                    break;
                case LEFT:
                    this.player.setVelocityX(-200);
                    this.player.anims.play('move', true);
                    this.player.flipX = true;
                    break;
                case RIGHT:
                    this.player.setVelocityX(200);
                    this.player.anims.play('move', true);
                    this.player.flipX = false;
                    break;
                case SPACE:
                    this.player.setVelocityY(-300);
                    this.player.anims.play('move', true);
                    this.player.flipY = false;
                    break;
            }
        })

    },
    update: function () {
        this.bgBack.tilePositionX += 2 * this.speed;
        this.bgMiddle.tilePositionX += 3 * this.speed;
        this.bgFront.tilePositionX += 5 * this.speed;
        this.bgGround.tilePositionX += 6 * this.speed;

        if (this.player.body.velocity.x > 0) {
            this.player.setVelocityX(this.player.body.velocity.x - 1);
        }
        else if (this.player.body.velocity.x < 0) {
            this.player.setVelocityX(this.player.body.velocity.x + 1);
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
                break;
        }
    }
}
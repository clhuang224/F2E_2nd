
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
        this.load.image('obstacle-1', './img/obstacle-1.png');
        this.load.image('obstacle-2', './img/obstacle-2.png');
        this.load.image('obstacle-3', './img/obstacle-3.png');
        this.load.image('obstacle-4', './img/obstacle-4.png');
        this.load.image('obstacle-5', './img/obstacle-5.png');
        this.load.image('obstacle-6', './img/obstacle-6.png');

        this.playing = true;
        this.time = 90;
        this.speed = 1;
        this.lastObstacleTime = 90;
        this.lastObstacleType = '';
        this.obstacleTypeAmount = 2;
        this.createObstacleInterval = 2;
        this.obstacleQueue = new Array();
        this.obstacleConfig = {
            'obstacle-1': {
                width: 248,
                height: 304,
                y: () => { return 152 - Math.random() * 20; },
            },
            'obstacle-2': {
                width: 368,
                height: 192,
                y: () => { return 504 + Math.random() * 100; },
            },
            'obstacle-3': {
                width: 368,
                height: 192,
                y: () => { return 336 + Math.random() * 214; },
            },
            'obstacle-4': {
                width: 288,
                height: 136,
                y: () => { return 150 + Math.random() * 182; },
            },
            'obstacle-5': {
                width: 192,
                height: 224,
                y: () => { return 150 + Math.random() * 300; },
            },
            'obstacle-6': {
                width: 136,
                height: 152,
                y: () => { return 150 + Math.random() * 300; },
            }
        }
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
        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 6 }),
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
        this.bgGround.body.setSize(1816, 190, 30, 30);
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
        this.player.body.setSize(105, 110, 0);
        this.physics.add.collider(this.player, this.bgGround);
        this.physics.add.collider(this.player, this.transparent);

        // 紅色
        this.red = this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0xFF0000, 0);

        // 計時
        this.timeId = setInterval(() => {
            this.time -= 1;
            this.timeText.setText(`${String(Math.floor(this.time / 60)).padStart(2, '0')}:${String(this.time % 60).padStart(2, '0')}`);
            if (this.playing === false) {
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
                if (this.playing) {
                    this.player.flipX = false;
                    this.player.flipY = false;
                    this.player.body.setSize(105, 110, 0);
                    this.player.anims.play('float', true);
                }
            }, delay);

        });
        this.input.keyboard.on('keydown', (event) => {
            if (this.playing) {
                switch (event.keyCode) {
                    case UP:
                        this.player.setVelocityY(-100);
                        this.player.anims.play('move', true);
                        this.player.flipY = false;
                        break;
                    case DOWN:
                        this.player.setVelocityY(200);
                        this.player.anims.play('move', true);
                        this.player.flipY = true;
                        break;
                    case LEFT:
                        this.player.setVelocityX(-200);
                        this.player.body.setSize(105, 110, 50);
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
            }
        })

    },
    update: function () {
        if (this.playing) {
            this.bgBack.tilePositionX += 2 * this.speed;
            this.bgMiddle.tilePositionX += 3 * this.speed;
            this.bgFront.tilePositionX += 5 * this.speed;
            this.bgGround.tilePositionX += 8 * this.speed;

            if (this.player.body.velocity.x > 0) {
                this.player.setVelocityX(this.player.body.velocity.x - 1);
            }
            else if (this.player.body.velocity.x < 0) {
                this.player.setVelocityX(this.player.body.velocity.x + 1);
            }

            // 障礙物
            //// 新增
            if (this.speed > 0 &&
                this.lastObstacleTime - this.time >= this.createObstacleInterval &&
                Math.floor(Math.random() * 100) % 5 == 0) {
                let obstacleType = `obstacle-${Math.floor(Math.random() * 10) % this.obstacleTypeAmount + 1}`;
                if (obstacleType == this.lastObstacleType) {
                    obstacleType = `obstacle-${Math.floor(Math.random() * 10) % this.obstacleTypeAmount + 1}`;
                }
                let currentObstacle = this.physics.add.sprite(
                    this.obstacleConfig[obstacleType].width,
                    this.obstacleConfig[obstacleType].height,
                    obstacleType);
                currentObstacle.body.immovable = true;
                currentObstacle.body.moves = false;
                currentObstacle.body.setSize(this.obstacleConfig[obstacleType].width - 50,
                    this.obstacleConfig[obstacleType].height - 50,
                    25, 25);
                currentObstacle.x = 2000;
                currentObstacle.y = this.obstacleConfig[obstacleType].y();
                let currentCollider = this.physics.add.collider(this.player, currentObstacle);
                this.obstacleQueue.push(
                    {
                        obstacle: currentObstacle,
                        collider: currentCollider,
                    });
                this.lastObstacleTime = this.time;
                this.lastObstacleType = obstacleType;
            }
            //// 刪除
            if (this.obstacleQueue.length > 0 && this.obstacleQueue[0].obstacle.x < -500) {
                delete this.obstacleQueue[0].collider;
                delete this.obstacleQueue[0].obstacle;
                this.obstacleQueue.shift();
            }
            //// 移動
            for (let i = 0; i < this.obstacleQueue.length; i++) {
                this.obstacleQueue[i].obstacle.x -= 8 * this.speed;
            }
            /// 撞到
            for (let i = 0; i < this.obstacleQueue.length; i++) {
                if (this.obstacleQueue[i].obstacle.body.touching.none == false) {
                    this.playing = false;
                    this.player.anims.play('dead', true);
                }
            }

            // 技能Bonus
            // this.skill = this.add.sprite(49, 49, 'skill');
            // this.skill.anims.play('shine', true);

            // 關卡改變
            switch (this.time) {
                case 60:
                    this.red.setFillStyle(0xFF0000, 0.15);
                    this.speed = 1.5;
                    this.obstacleTypeAmount = 4;
                    this.createObstacleInterval = 1;
                    break;
                case 30:
                    this.red.setFillStyle(0xFF0000, 0.3);
                    this.speed = 2;
                    this.obstacleTypeAmount = 6;
                    this.createObstacleInterval = 0.25;
                    break;
                case 0:
                    this.red.setFillStyle(0xFF0000, 0);
                    this.playing = false;
                    break;
            }
        }
        else {
            if (this.player.body.velocity.x != 0) {
                this.player.body.velocity.x = 0;
            }
        }
    }

}
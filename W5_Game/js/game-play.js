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
        this.load.image('black', './img/black.png');
        this.load.image('game-over', './img/txt-game-over.png');
        this.load.image('try-again', './img/btn-try-again.png');
        this.load.image('light', './img/light.png');

        this.obstacleConfig = {
            'obstacle-1': {
                width: gameWidth * .19375,
                height: gameHeight * .38,
                y: () => { return gameHeight * .19 * 1.025; },
            },
            'obstacle-2': {
                width: gameWidth * .2875,
                height: gameHeight * .24,
                y: () => { return gameHeight * .625 + Math.random() * gameHeight / 8; },
            },
            'obstacle-3': {
                width: gameWidth * .2875,
                height: gameHeight * .24,
                y: () => { return gameHeight * .42 + Math.random() * gameHeight * .2675; },
            },
            'obstacle-4': {
                width: gameWidth * .225,
                height: gameHeight * .17,
                y: () => { return gameHeight * .1875 + Math.random() * gameHeight * .2275; },
            },
            'obstacle-5': {
                width: gameWidth * .15,
                height: gameHeight * .28,
                y: () => { return groundHeight * .75 + Math.random() * gameHeight * .375; },
            },
            'obstacle-6': {
                width: gameWidth * .10625,
                height: gameHeight * .19,
                y: () => { return groundHeight * .75 + Math.random() * gameHeight * .375; },
            }
        }
    },
    create: function () {
        this.playing = true;
        this.lose = false;
        this.invincible = false;
        this.time = 90;
        this.speed = 1;
        this.lastObstacleTime = 95;
        this.lastObstacleType = '';
        this.obstacleTypeAmount = 2;
        this.createObstacleInterval = 2;
        this.obstacleQueue = new Array();
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
            key: 'invincible',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 6 }),
            frameRate: 1,
            repeat: -1,
        });
        this.anims.create({
            key: 'win',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1,
        });


        // 背景
        this.bgColor = this.cameras.add(0, 0, gameWidth, gameHeight);
        this.bgColor.setBackgroundColor('#20552C');
        this.bgBack = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-back');
        this.bgMiddle = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-middle');
        this.bgFront = this.add.tileSprite(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 'bg-front');
        this.bgGround = this.add.tileSprite(gameWidth * 0.30625, gameHeight - groundHeight / 2, gameWidth * 1.3875, groundHeight, 'bg-ground');
        this.physics.add.existing(this.bgGround);
        this.bgGround.body.immovable = true;
        this.bgGround.body.moves = false;
        this.bgGround.body.setSize(this.bgGround.width * 1.2, groundHeight * 0.9, this.bgGround.width, this.bgGround.height * 0.05);
        this.topBound = this.add.rectangle(gameWidth / 2, topBoundHeight / 2, gameWidth, gameHeight / 4, 0x000000, 0);
        this.physics.add.existing(this.topBound);
        this.topBound.body.immovable = true;
        this.topBound.body.moves = false;

        // 資訊
        this.controlImg = this.add.sprite(gameWidth * .13515625, gameHeight * .0375, 'control');
        this.controlImg.x = gameWidth * .13398438;
        this.controlImg.y = gameHeight * .949375;
        this.timeImg = this.add.sprite(gameWidth * .01953125, gameHeight * .3125, 'time');
        this.timeImg.x = gameWidth * .8890625;
        this.timeImg.y = gameHeight * .94625;
        this.timeText = this.add.text(gameWidth * .90625, gameHeight * .9225,
            `${String(Math.floor(this.time / 60)).padStart(2, '0')}:${String(this.time % 60).padStart(2, '0')}`
            , { fontSize: gameHeight * .04, lineSpacing: gameHeight * .0475, padding: 0, margin: 0, fontFamily: 'Roboto', });

        // 主角
        this.player = this.physics.add.sprite(playerWidth, playerHeight, 'player');
        this.player.x = gameWidth * .08;
        this.player.y = gameHeight * .375;
        this.player.depth = 5;
        this.player.anims.play('float', true);
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true, 0, 0);
        this.player.body.setSize(playerWidth * .75, playerHeight * .9, 0);
        this.physics.add.collider(this.player, this.bgGround);
        this.physics.add.collider(this.player, this.topBound);

        // UI
        this.cover = this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0xFF0000, 1);
        this.cover.alpha = 0;
        this.cover.depth = 10;
        this.black = this.add.image(gameWidth / 2, gameHeight / 2, 'black');
        this.black.depth = 15;
        this.black.alpha = 0;
        this.gameOver = this.add.sprite(gameWidth * .29296875, gameHeight * .45865625, 'game-over');
        this.gameOver.x = gameWidth * .79643359;
        this.gameOver.y = gameHeight * .45865625;
        this.gameOver.alpha = 0;
        this.gameOver.depth = 15;
        this.tryAgain = this.add.sprite(buttonWidth, buttonHeight, 'try-again');
        this.tryAgain.x = gameWidth * .796875;
        this.tryAgain.y = gameHeight * .60375;
        this.tryAgain.alpha = 0;
        this.tryAgain.depth = 15;

        // 計時
        this.timeId = setInterval(() => {
            this.time -= 0.5;
            this.timeText.setText(`${String(Math.floor(this.time / 60)).padStart(2, '0')}:${String(Math.floor(this.time % 60)).padStart(2, '0')}`);
            if (this.time === 0 || this.playing === false) {
                clearInterval(this.timeId);
            }
        }, 500);

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
                if (this.invincible === false) {
                    if (this.playing) {
                        this.player.flipX = false;
                        this.player.flipY = false;
                        this.player.body.setSize(playerWidth * .75, playerHeight * .9, 0);
                        this.player.anims.play('float', true);
                    }
                }
            }, delay);

        });
        this.input.keyboard.on('keydown', (event) => {
            if (this.playing) {
                switch (event.keyCode) {
                    case UP:
                        this.player.setVelocityY(-gameHeight / 8);
                        if (this.invincible === false) {
                            this.player.anims.play('move', true);
                            this.player.flipY = false;
                        }
                        break;
                    case DOWN:
                        this.player.setVelocityY(gameHeight / 4);
                        if (this.invincible === false) {
                            this.player.anims.play('move', true);
                            this.player.flipY = true;
                        }
                        break;
                    case LEFT:
                        this.player.setVelocityX(-gameHeight / 4);
                        if (this.invincible === false) {
                            this.player.body.setSize(playerWidth * .75, playerHeight * .9, playerWidth / 3);
                            this.player.anims.play('move', true);
                            this.player.flipX = true;
                        }
                        break;
                    case RIGHT:
                        this.player.setVelocityX(gameHeight / 4);
                        if (this.invincible === false) {
                            this.player.anims.play('move', true);
                            this.player.flipX = false;
                        }
                        break;
                    case SPACE:
                        this.player.setVelocityY(-gameHeight * .375);
                        if (this.invincible === false) {
                            this.player.anims.play('move', true);
                            this.player.flipY = false;
                        }
                        break;
                }
            }
            if (this.lose === true) {
                if (this.tryAgain.alpha >= 1 && event.keyCode === SPACE) {
                    this.scene.start('gameStart');
                }
            }
        })
    },
    update: function () {
        if (this.playing) {
            this.bgBack.tilePositionX += 2 * this.speed * unit;
            this.bgMiddle.tilePositionX += 3 * this.speed * unit;
            this.bgFront.tilePositionX += 5 * this.speed * unit;
            this.bgGround.tilePositionX += 8 * this.speed * unit;

            if (this.player.body.velocity.x > 0) {
                this.player.setVelocityX(this.player.body.velocity.x - unit);
            }
            else if (this.player.body.velocity.x < 0) {
                this.player.setVelocityX(this.player.body.velocity.x + unit);
            }

            // 障礙物
            //// 新增
            if (this.time > 2 &&
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
                currentObstacle.body.setSize(this.obstacleConfig[obstacleType].width * .85,
                    this.obstacleConfig[obstacleType].height * .85,
                    this.obstacleConfig[obstacleType].width * .1,
                    this.obstacleConfig[obstacleType].height * .1);
                currentObstacle.x = gameWidth + currentObstacle.width;
                currentObstacle.y = this.obstacleConfig[obstacleType].y();
                let currentOverlap = this.physics.add.overlap(this.player, currentObstacle);
                this.obstacleQueue.push(
                    {
                        obstacle: currentObstacle,
                        overlap: currentOverlap,
                    });
                this.lastObstacleTime = this.time;
                this.lastObstacleType = obstacleType;
            }
            //// 移動
            for (let i = 0; i < this.obstacleQueue.length; i++) {
                this.obstacleQueue[i].obstacle.x -= 8 * this.speed * unit;
            }
            /// 撞到
            for (let i = 0; i < this.obstacleQueue.length; i++) {
                if (this.obstacleQueue[i].obstacle.body.touching.none === false && this.invincible === false) {
                    this.playing = false;
                    this.lose = true;
                    this.player.anims.play('dead', true);
                    this.player.setVelocityX(0);
                    this.player.setVelocityY(0);
                }
            }
            //// 刪除
            if (this.obstacleQueue.length > 0 && this.obstacleQueue[0].obstacle.x < -this.obstacleQueue[0].obstacle.width) {
                this.obstacleQueue[0].overlap.destroy();
                delete this.obstacleQueue[0].overlap;
                this.obstacleQueue[0].obstacle.destroy();
                delete this.obstacleQueue[0].obstacle;
                this.obstacleQueue.shift();
            }

            // 技能Bonus
            if (this.skill === undefined && this.invincible === false) {
                //// 新增
                if (this.time % 20 < 5 && Math.floor(Math.random() * 200) % 50 === 0) {
                    this.skill = this.physics.add.sprite(skillWidth, skillHeight, 'skill');
                    this.skill.body.moves = false;
                    this.skill.body.immovable = true;
                    this.skill.x = gameWidth + skillWidth;
                    this.skill.y = topBoundHeight + Math.random() * gameHeight * 0.375;
                    for (let i = 0; i < this.obstacleQueue.length; i++) {
                        while (this.obstacleQueue[i].obstacle.y - this.obstacleQueue[i].obstacle.height / 2 <= this.skill.y &&
                            this.skill.y <= this.obstacleQueue[i].obstacle.y + this.obstacleQueue[i].obstacle.height / 2) {
                            this.skill.y = topBoundHeight + Math.random() * gameHeight * 0.375;
                        }
                    }
                    this.skill.anims.play('shine', true);
                    this.skillOverlap = this.physics.add.overlap(this.player, this.skill);
                }
            }
            //// 移動
            if (this.skill !== undefined) {
                this.skill.x -= 8 * this.speed * unit;
            }
            //// 吃到
            if (this.skill !== undefined) {
                if (this.skill.body.touching.none === false) {
                    this.invincible = true;
                    this.player.anims.play('invincible', true);
                    this.player.flipX = false;
                    this.player.flipY = false;
                    this.skill.destroy();
                    delete this.skill;
                    setTimeout(() => {
                        this.player.anims.play('float', true);
                    }, 4500);
                    setTimeout(() => {
                        this.invincible = false;
                    }, 5500);
                }
            }
            //// 刪除
            if (this.skill !== undefined) {
                if (this.skill.x < -skillWidth) {
                    this.skill.destroy();
                    delete this.skill;
                }
            }

            // 關卡改變
            switch (this.time) {
                case 60:
                    this.cover.alpha = .15;
                    this.speed = 1.5;
                    this.obstacleTypeAmount = 4;
                    this.createObstacleInterval = 1;
                    break;
                case 30:
                    this.cover.alpha = .3;
                    this.speed = 2;
                    this.obstacleTypeAmount = 6;
                    this.createObstacleInterval = 0.25;
                    break;
                case 0:
                    this.cover.alpha = 0;
                    this.playing = false;
                    clearInterval(this.timeId);
                    this.cover.setFillStyle(0xFFFFFF, 1);
                    this.player.setVelocityX(0);
                    this.player.setVelocityY(0);
                    break;
            }
        }
        else {
            if (Math.abs(this.player.x - gameWidth / 2) > 10 * unit) {
                if (Math.abs(this.player.x - gameWidth / 2) < 20 * unit) {
                    this.player.x = gameWidth / 2;
                }
                else {
                    let r = Math.log(Math.abs(this.player.x - gameWidth / 2));
                    if (this.player.x > gameWidth / 2) {
                        this.player.x -= r;
                        this.bgBack.tilePositionX += r;
                        this.bgMiddle.tilePositionX += r;
                        this.bgFront.tilePositionX += r;
                        this.bgGround.tilePositionX += r;
                        for (let i = 0; i < this.obstacleQueue.length; i++) {
                            this.obstacleQueue[i].obstacle.x -= r;
                        }
                        if (this.skill !== undefined) {
                            this.skill.x -= r;
                        }
                    }
                    else {
                        this.player.x += r;
                        this.bgBack.tilePositionX -= r;
                        this.bgMiddle.tilePositionX -= r;
                        this.bgFront.tilePositionX -= r;
                        this.bgGround.tilePositionX -= r;
                        for (let i = 0; i < this.obstacleQueue.length; i++) {
                            this.obstacleQueue[i].obstacle.x += r;
                        }
                        if (this.skill !== undefined) {
                            this.skill.x += r;
                        }
                    }

                }
            }
            else {
                if (this.lose === false) {
                    this.player.body.moves = false;
                    this.player.body.immovable = true;
                    for (let i = 0; i < this.obstacleQueue.length; i++) {
                        this.obstacleQueue[i].obstacle.alpha -= 0.01;
                    }
                    if (this.light === undefined) {
                        this.light = this.add.tileSprite(gameWidth / 2, gameHeight * .375, gameWidth * .2625, gameHeight * .75, 'light');
                    }
                    this.player.anims.play('win', true);
                    this.player.flipX = false;
                    this.player.flipY = false;
                    this.player.angle = -45;
                    this.light.tilePositionY += 3;
                    this.player.y -= 3;

                    if (this.player.y < gameHeight / 2) {
                        this.cover.alpha += 0.01;
                    }
                    if (this.player.y < gameHeight / 8) {
                        this.scene.start('gameEnd');
                    }
                }
                else {
                    this.black.alpha += 0.03;
                    this.gameOver.alpha += 0.03;
                    this.tryAgain.alpha += 0.03;
                }
            }
        }

    }

}
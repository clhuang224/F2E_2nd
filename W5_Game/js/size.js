// 遊戲尺寸
let gameWidth;
let gameHeight;

if ((window.innerWidth / window.innerHeight) > RATIO) {
    gameHeight = window.innerHeight;
    if (gameHeight > 800) {
        gameHeight = 800;
    }
    gameWidth = gameHeight * RATIO;
}
else {
    gameWidth = window.innerWidth;
    if (gameWidth > 1280) {
        gameWidth = 1280;
    }
    gameHeight = gameWidth / RATIO;
}
document.querySelector('body').style.height = window.innerHeight + 'px';

// 按鈕尺寸
let buttonWidth = gameWidth * 0.2734375;
let buttonHeight = gameHeight * 0.075;

// 上下界尺寸
let topBoundHeight = gameHeight / 4;
let groundHeight = gameHeight / 4;

// 角色尺寸
let playerWidth = gameWidth * .1125;
let playerHeight = gameHeight * .15;

// 最小移動單位
let unit = gameWidth / 1280;

// 技能球尺寸
let skillWidth = gameWidth * .03828125;
let skillHeight = gameHeight * .06125;
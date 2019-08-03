// 切換畫面相關
let gameDiv = document.querySelector('.game');
let alertsDiv = document.querySelector('.alerts');
let alerts = document.querySelectorAll('.alerts>div'),
    alertsLength = alerts.length;

//// 主選單的newGame
let newGameNavButton = document.querySelector('.navigation .navButton.newGame');

newGameNavButton.addEventListener('click', function (event) {
    gameDiv.style.display = 'none';
    alertsDiv.style.display = 'flex';
    for (let j = 0; j < alertsLength; j++) {
        if (alerts[j].className == 'newGame') {
            alerts[j].style.display = 'flex';
        }
        else {
            alerts[j].style.display = 'none';
        }
    }
}, false);

//// rule
let ruleButton = document.querySelector('.ruleButton');
ruleButton.addEventListener('click', function () {
    gameDiv.style.display = 'none';
    alertsDiv.style.display = 'flex';
    for (let j = 0; j < alertsLength; j++) {
        if (alerts[j].className == 'rule') {
            alerts[j].style.display = 'flex';
        }
        else {
            alerts[j].style.display = 'none';
        }
    }
}, false);

//// 關閉提示視窗
let closeButtons = document.querySelectorAll('.alerts .close'),
    closeButtonsLength = closeButtons.length;
let newGameWinButton = document.querySelector('.alerts .win .navButton.newGame');
let newGameLoseButton = document.querySelector('.alerts .lose .navButton.newGame');
let newGameNewGameButton = document.querySelector('.alerts .newGame .navButton.newGame');
let restartLoseButton = document.querySelector('.alerts .lose .restart');
let restartWinButton = document.querySelector('.alerts .win .restart');
let undoLoseButton = document.querySelector('.alerts .lose .undo');

for (let i = 0; i < closeButtonsLength; i++) {
    closeButtons[i].addEventListener('click', closeAlert, false);
}
newGameNewGameButton.addEventListener('click', closeAlert, false);
newGameWinButton.addEventListener('click', closeAlert, false);
newGameLoseButton.addEventListener('click', closeAlert, false);
restartLoseButton.addEventListener('click', closeAlert, false);
restartWinButton.addEventListener('click', closeAlert, false);

function closeAlert() {
    gameDiv.style.display = 'flex';
    alertsDiv.style.display = 'none';
}

// 計時相關
let timeValue = document.querySelector('.time .value');
let time = 0;
let timeId;
function timer() {
    clearInterval(timeId);
    time = 0;
    return setInterval(function () {
        let str = '';
        if (time / 60 < 10) { str += '0'; }
        str += Math.floor(time / 60) + ':';
        if (time % 60 < 10) { str += '0'; }
        str += Math.floor(time % 60);
        timeValue.textContent = str;
        time++;
    }, 1000);
}

// 計分相關
let score;

// 遊戲邏輯
//// 初始化
function initialize() {
    const suit = ['s', 'h', 'd', 'c'];
    let result = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j <= 13; j++) {
            let obj = {
                id: suit[i] + j,
                number: j,
                suit: suit[i],
                color: ((suit[i] == 's' || suit[i] == 'c') ? 'black' : 'red'),
            }
            result.push(obj);
        }
    }
    return result;
}

//// 發牌
let cardsList;
function shuffle() {
    let result = [[],
    [], [], [], [], [], [], [], [],
    [], [], [], []];
    // 0: cell, 1~8: row, 9~12: foundation
    let initial = initialize().concat();
    while (initial.length > 0) {
        for (let i = 1; i <= 8 && initial.length > 0; i++) {
            result[i].push(initial.splice(Math.floor(Math.random() * 1000) % initial.length, 1)[0]);
        }
    }
    return result;
}

let origin;

// 開新遊戲
let main = document.querySelector('.main');
let rows = document.querySelectorAll('.main .row');
let cells = document.querySelectorAll('.cell');
let foundations = document.querySelectorAll('.foundation');

function newGame() {
    timeId = timer();
    score = 0;
    cardsList = shuffle();
    origin = cardsList.concat();
    cellCount = 4;
    emptyRow = 0;
    // // 測試用
    // cardsList = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    // emptyRow = 7;
    // score = 255;
    // let t = initialize().concat();
    // for (let i = 9; i <= 12; i++) {
    //     for (let j = 0; j < 13; j++) {
    //         cardsList[i].push(t.shift());
    //     }
    // }
    // cardsList[1].push(cardsList[12].pop());
    // //

    scoreValue.textContent = score;

    for (let i = 0; i < 4; i++) {
        cells[i].innerHTML = '';
        foundations[i].innerHTML = '';
        if (i < cardsList[0].length) {
            cells[i].innerHTML = cardsList[0][i];
        }
        for (let j = 0; j < cardsList[i + 9].length; j++) {
            foundations[i].innerHTML += '<div id="'
                + cardsList[i + 9][j].id +
                '" class="card '
                + cardsList[i + 9][j].suit
                + ' '
                + cardsList[i + 9][j].color
                + '" draggable="true"></div>';
        }
        foundations[i].innerHTML += '</div>';
    }
    for (let i = 1; i <= 8; i++) {
        rows[i - 1].innerHTML = '<div class="rectangle"></div>';
        let rowLength = cardsList[i].length;
        for (let j = 0; j < rowLength; j++) {
            rows[i - 1].innerHTML += '<div id="'
                + cardsList[i][j].id +
                '" class="card '
                + cardsList[i][j].suit
                + ' '
                + cardsList[i][j].color
                + '" draggable="true"></div>';
        }
        rows[i - 1].innerHTML += '</div>';
    }
    // 拖曳相關 卡片
    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < 52; i++) {
        cards[i].addEventListener('dragstart', dragstart, false);
        cards[i].addEventListener('drag', drag, false);
    }
}
let dragTargetList = [];
function dragstart(event) {
    // 判斷是否可以被拖曳
    let dragable = true;
    let node = event.target;
    dragTargetList = [node];
    // 1. 後面的牌是否符合順序與紅黑相間
    while (node.nextElementSibling != null) {
        dragTargetList.push(node.nextElementSibling);
        if (parseInt(node.id.substr(1)) - 1 != parseInt(node.nextElementSibling.id.substr(1)) ||
            node.classList[2] == node.nextElementSibling.classList[2]) {
            dragable = false;
            break;
        }
        node = node.nextElementSibling;
    }
    // 2. 以被拖曳的牌後面的牌數 、 cellCount 和 emptyRow 判斷是否搬得動
    let emptyCell = 0;
    let emptyRow = 0;
    for (let i = 0; i < 4; i++) {
        if (cells[i].childElementCount == 0) {
            emptyCell++;
        }
    }
    for (let i = 0; i < 8; i++) {
        if (rows[i].childElementCount == 1) {
            emptyRow++;
        }
    }
    if (dragable && (dragTargetList.length <= emptyCell + emptyRow + 1)) {
        event.dataTransfer.setData('id', event.target.id);
        event.dataTransfer.setData('classList', event.target.classList);
        event.dataTransfer.setData('sourceParentId', event.target.parentElement.id);
    }
    else {
        dragTargetList = [];
    }
}

// 拖曳相關 容器
for (let i = 0; i < 4; i++) {
    cells[i].addEventListener('drop', cellDropped);
    cells[i].addEventListener('dragenter', cancelDefault);
    cells[i].addEventListener('dragover', cancelDefault);
    foundations[i].addEventListener('drop', foundationDropped);
    foundations[i].addEventListener('dragenter', cancelDefault);
    foundations[i].addEventListener('dragover', cancelDefault);
}
for (let i = 0; i < 8; i++) {
    rows[i].addEventListener('drop', rowDropped);
    rows[i].addEventListener('dragenter', cancelDefault);
    rows[i].addEventListener('dragover', cancelDefault);
}
function cellDropped(event) {
    cancelDefault(event);
    if (event.target.className.search('card') == -1 && dragTargetList.length == 1) {
        event.target.appendChild(document.querySelector('#' + dragTargetList[0].id));
        record.push({
            sourceParent: document.querySelector('#' + event.dataTransfer.getData('sourceParentId')),
            targetParent: event.target,
            targetList: dragTargetList.concat(),
        });
    }
}
function foundationDropped(event) {
    cancelDefault(event);
    if (dragTargetList.length == 1) {
        // 確認是否為空
        if (event.target.parentElement.className == 'foundations') {
            // 確認花色
            if (event.dataTransfer.getData('classList').search(event.target.classList[1]) != -1) {
                event.target.appendChild(document.querySelector('#' + dragTargetList[0].id));
                score += 5;
                scoreValue.textContent = score;
                record.push({
                    sourceParent: document.querySelector('#' + event.dataTransfer.getData('sourceParentId')),
                    targetParent: event.target,
                    targetList: dragTargetList.concat(),
                });
            }
            // 獲勝判斷
            if (score == 260) {
                gameDiv.style.display = 'none';
                alertsDiv.style.display = 'flex';
                for (let j = 0; j < alertsLength; j++) {
                    if (alerts[j].className == 'win') {
                        alerts[j].style.display = 'flex';
                    }
                    else {
                        alerts[j].style.display = 'none';
                    }
                }
            }
        }
        else {
            // 確認花色及順序
            if (event.dataTransfer.getData('classList').search(event.target.parentElement.classList[1]) != -1 &&
                parseInt(event.target.id.substr(event.target.classList[1].length)) + 1 == parseInt(event.dataTransfer.getData('id').substr(1))) {
                event.target.parentElement.appendChild(document.querySelector('#' + dragTargetList[0].id));
                score += 5;
                scoreValue.textContent = score;
                record.push({
                    sourceParent: document.querySelector('#' + event.dataTransfer.getData('sourceParentId')),
                    targetParent: event.target.parentElement,
                    targetList: dragTargetList.concat(),
                });
            }
            // 獲勝判斷
            if (score == 260) {
                gameDiv.style.display = 'none';
                alertsDiv.style.display = 'flex';
                for (let j = 0; j < alertsLength; j++) {
                    if (alerts[j].className == 'win') {
                        alerts[j].style.display = 'flex';
                    }
                    else {
                        alerts[j].style.display = 'none';
                    }
                }
            }
        }
    }

}
function rowDropped(event) {
    cancelDefault(event);
    // 確認碰到的是不是 .row
    if (event.target.className.search('row') > -1) {
        // 確認是否已有卡片
        if (event.target.childElementCount > 1) {
            // 確認前一張的顏色是否相間 編號是否差一
            if (event.dataTransfer.getData('classList').search(event.target.lastChild.classList[2]) == -1 &&
                parseInt(event.target.lastChild.id.substr(1)) - 1 == parseInt(event.dataTransfer.getData('id').substr(1))) {
                for (let i = 0; i < dragTargetList.length; i++) {
                    event.target.appendChild(document.querySelector('#' + dragTargetList[i].id));
                }
                record.push({
                    sourceParent: document.querySelector('#' + event.dataTransfer.getData('sourceParentId')),
                    targetParent: event.target,
                    targetList: dragTargetList.concat(),
                });
            }
        }
        else {
            event.target.appendChild(document.querySelector('#' + dragTargetList[0].id));
            record.push({
                sourceParent: document.querySelector('#' + event.dataTransfer.getData('sourceParentId')),
                targetParent: event.target.parentElement,
                targetList: dragTargetList.concat(),
            });
        }
    }
    else if (event.target.className.search('rectangle') > -1) {
        event.target.parentElement.appendChild(document.querySelector('#' + dragTargetList[0].id));
        record.push({
            sourceParent: document.querySelector('#' + event.dataTransfer.getData('sourceParentId')),
            targetParent: event.target.parentElement,
            targetList: dragTargetList.concat(),
        });
    }
    else {
        // 確認前一張的顏色是否相間 編號是否差一
        if (event.dataTransfer.getData('classList').search(event.target.classList[2]) == -1 &&
            parseInt(event.target.id.substr(1)) - 1 == parseInt(event.dataTransfer.getData('id').substr(1))) {
            for (let i = 0; i < dragTargetList.length; i++) {
                event.target.parentElement.appendChild(document.querySelector('#' + dragTargetList[i].id));
            }
            record.push({
                sourceParent: document.querySelector('#' + event.dataTransfer.getData('sourceParentId')),
                targetParent: event.target.parentElement,
                targetList: dragTargetList.concat(),
            });
        }
    }
}

function hint(event){

}

function drag(event) {
//     cancelDefault(event);
//     let originPosition = { x: event.target.x, y: event.target.y };
//     let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
//     let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
//     event.target.x = scrollX + event.clientX || event.pageX;
//     event.target.y = scrollY + event.clientY || event.pageY;
//     console.log(event.clientX, event.clientY);
//     console.log(event.target.getBoundingClientRect());
}

function cancelDefault(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

// 分數相關
let scoreValue = document.querySelector('.score .value');

// UNDO 相關
let record = [];
let undoNavButton = document.querySelector('.navigation .undo');

undoNavButton.addEventListener('click', undo, false);
undoLoseButton.addEventListener('click', undo, false);

function undo() {
    let currentUndo = record.pop();
    let cardAmount = currentUndo.targetList.length;
    for (let i = 0; i < cardAmount; i++) {
        currentUndo.sourceParent.appendChild(currentUndo.targetParent.removeChild(currentUndo.targetList[i]));
    }
}

// restart
let restartNavButton = document.querySelector('.navigation .restart');
restartNavButton.addEventListener('click', restart, false);
restartLoseButton.addEventListener('click', restart, false);
restartWinButton.addEventListener('click', restart, false);
function restart() {
    timeId = timer();
    score = 0;
    cardsList = origin.concat();
    scoreValue.textContent = score;
    for (let i = 0; i < 4; i++) {
        cells[i].innerHTML = '';
        foundations[i].innerHTML = '';
    }
    for (let i = 1; i <= 8; i++) {
        rows[i - 1].innerHTML = '<div class="rectangle"></div>';
        let rowLength = cardsList[i].length;
        for (let j = 0; j < rowLength; j++) {
            rows[i - 1].innerHTML += '<div id="'
                + cardsList[i][j].id +
                '" class="card '
                + cardsList[i][j].suit
                + '" draggable="true"></div>';
        }
        rows[i - 1].innerHTML += '</div>';
    }

    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < 52; i++) {
        cards[i].addEventListener('drag', drag, false);
        cards[i].addEventListener('dragstart', dragstart);
    }
}

// newGame
newGameNavButton.addEventListener('click', newGame, false);
newGameWinButton.addEventListener('click', newGame, false);
newGameLoseButton.addEventListener('click', newGame, false);



// 
newGame();

let todolist = [
    {
        content: 'THE FIRST THING TO DO TODAY',
        working: false,
        time: 3,
        tomato: 2,
    },
    {
        content: 'THE SECOND THING TO DO TODAY',
        working: true,
        time: 5,
        tomato: 0,
    },
];

let doneList = [];
let tomatoRecord =
{
    YYYY: {
        MM:
        {
            DD: Number(),
        },
    },
};
let temp;

let wrap = document.querySelector('.wrap');

// .timer
let addButtons = document.querySelectorAll('.addButton'),
    addButtonsLength = addButtons.length;
let addInputs = document.querySelectorAll('.addInput'),
    addInputsLength = addInputs.length;
let finish = document.querySelector('.timer .finish');
let timerCurrentMission = document.querySelector('.currentMission h2');
let timerCurrentTomato = document.querySelector('.timer .currentMission .tomato');
let timerTodolist = document.querySelector('.timer ul');
let timerTimeDiv = document.querySelector('.timer .time');


// 新增待辦事項
for (let i = 0; i < addButtonsLength; i++) {
    addButtons[i].addEventListener('click', addMission, false);
}
function addMission(event) {
    event.preventDefault();
    let input = event.target.parentElement.querySelector('.addInput');
    if (input.value != '') {
        todolist.push(
            {
                content: input.value,
                working: true,
                time: 1500,
                tomato: 0,
            });
        input.value = '';
        updateList();
    }
    else {
        alert('請輸入文字。');
    }
}

// 完成待辦事項
finish.addEventListener('click', finishMission, false);
function finishMission() {
    pause();
    if (todolist.length != 0) {
        doneList.push(todolist.shift());
        updateList();
        todayTomatoSpan.textContent = doneList.length;
    }
}

// 更新畫面
function updateList() {
    if (todolist.length == 0) {
        wrap.classList.remove('break');
        document.querySelector('.empty').style.display = 'block';
        document.querySelector('.notEmpty').style.display = 'none';
    }
    else {
        document.querySelector('.empty').style.display = 'none';
        document.querySelector('.notEmpty').style.display = 'block';

        if (todolist[0].working == true) {
            wrap.classList.remove('break');
        }
        else {
            wrap.classList.add('break');
        }

        // 顯示當下事項
        timerCurrentMission.textContent = todolist[0].content;
        updateTomato();

        // 顯示待辦事項
        timerTodolist.innerHTML = '';
        for (let i = 1; i < todolist.length && i < 4; i++) {
            let newLi = document.createElement('li');
            newLi.innerHTML = '<div class="listCircle"></div><p>'
                + todolist[i].content
                + '</p><button class="button"></button>';
            timerTodolist.appendChild(newLi);
        }
        if (todolist.length > 1) {
            more.setAttribute('style', '');
        }
        else {
            more.setAttribute('style', 'display:none');
        }

        // .timer .todolist .button
        let buttons = document.querySelectorAll('.timer .todolist .button'),
            buttonsLength = buttons.length;
        for (let i = 0; i < buttonsLength; i++) {
            buttons[i].addEventListener('click', function () {
                pause();
                doneList.push(todolist.shift());
                todayTomatoSpan.textContent = doneList.length;
                todolist.unshift(todolist.splice(i, 1)[0]);
                updateList();
            }, false);
        }


        //顯示時間
        updateTime();
    }
}

function updateTime() {
    if (todolist.length >= 0) {
        timerTimeDiv.textContent = (todolist[0].time / 60 < 10 ? '0' : '') + Math.floor(todolist[0].time / 60) + ':' + (todolist[0].time % 60 < 10 ? '0' : '') + todolist[0].time % 60;
    }
    else {
        timerTimeDiv.textContent = '00:00';
    }
    windowTimeDiv.textContent = timerTimeDiv.textContent;
}

function updateTomato() {
    timerCurrentTomato.innerHTML = '';
    for (let i = 0; i < todolist[0].tomato; i++) {
        timerCurrentTomato.innerHTML += '<div class="circle"></div>';
    }
    windowCurrentMission.textContent = todolist[0].content;
}

// .timer>.content .more
let more = document.querySelector('.timer .content .container .more');
document.querySelector('.timer>.content .more').addEventListener('click',
    function (event) {
        event.preventDefault();
        for (let i = 0; i < headerButtonsLength - 1; i++) {
            headerButtons[i].style.display = 'none';
        }
        closeButton.style.display = 'initial';
        timerPage.style.display = 'none';
        windowPage.style.display = 'flex';
        document.querySelector('.window>.todolist').style.display = 'initial';
        windowButtons[0].classList.add('active');
    }, false);

// .timer>.play
let workAudio = document.querySelector('audio.work');
let breakAudio = document.querySelector('audio.break');

let timerPlayButton = document.querySelector('.timer .play .playButton');
let timerPauseButton = document.querySelector('.timer .play .pauseButton');
let timerPlay = document.querySelector('.timer .play');

let playingId;

timerPlayButton.addEventListener('click', play, false);
function play() {
    if (todolist.length != 0) {
        if (todolist[0].time > 0) {
            timerPlayButton.style.display = 'none';
            timerPauseButton.style.display = 'initial';
            timerPlay.classList.add('playing');
            windowPlayButton.style.display = 'none';
            windowPauseButton.style.display = 'initial';
            playingId = window.setInterval(function () {
                todolist[0].time--;
                updateTime();
                // 如果時間到了
                if (todolist[0].time == 0) {
                    // 如果是work完
                    if (todolist[0].working == true) {
                        todolist[0].tomato++;
                        updateTomato();
                        workAudio.play();
                        todolist[0].working = false;
                        todolist[0].time = 300;
                        wrap.classList.add('break');
                    }
                    // 如果是break完
                    else {
                        breakAudio.play();
                        todolist[0].working = true;
                        todolist[0].time = 1500;
                        wrap.classList.remove('break');
                    }
                    updateList();
                }
            }, 1000);
        }

    }
}

timerPauseButton.addEventListener('click', pause, false);
function pause() {
    playing = false;
    timerPlayButton.style.display = 'initial';
    timerPauseButton.style.display = 'none';
    timerPlay.classList.remove('playing');
    windowPlayButton.style.display = 'initial';
    windowPauseButton.style.display = 'none';
    window.clearInterval(playingId);
}

// .window>.left
let windowButtons = document.querySelectorAll('.window .left .menu button'),
    windowButtonsLength = windowButtons.length;
let windowSubpages = [
    document.querySelector('.window>.todolist'),
    document.querySelector('.window>.analytics'),
    document.querySelector('.window>.ringtones')],
    windowSubpagesLength = windowSubpages.length;
let windowPlayButton = document.querySelector('.window .playButton');
let windowPauseButton = document.querySelector('.window .pauseButton');
let windowCurrentMission = document.querySelector('.window .currentMission');
let windowTimeDiv = document.querySelector('.window .bottom .time');

for (let i = 0; i < windowButtonsLength; i++) {
    windowButtons[i].addEventListener('click', function (event) {
        for (let j = 0; j < windowButtonsLength; j++) {
            windowButtons[j].classList.remove('active');
        }
        windowButtons[i].classList.add('active');
        for (let j = 0; j < windowSubpagesLength; j++) {
            windowSubpages[j].style.display = 'none';
        }
        windowSubpages[i].style.display = 'initial';
    }, false);
}

windowPlayButton.addEventListener('click', play, false);
windowPauseButton.addEventListener('click', pause, false);

// window>analytics
let todayTomatoSpan = document.querySelector('.window .analytics .today .number');
todayTomatoSpan.textContent = doneList.length;

// window>ringtone
let ringtoneList =
    [
        'alarm', 'alert', 'alien', 'beep', 'bug',
        'call', 'duck', 'dog', 'horn', 'message',
        'ring', 'smartphone', 'spring', 'telephone', 'warning',
    ];
let workRing = 'default', breakRing = 'default';
let ringtonesWorkUl = document.querySelector('.ringtones>.work');
let ringtonesBreakUl = document.querySelector('.ringtones>.break');
temp = '<li class="radio"><button class="none"><div class="radioCircle"></div><div class="radioText">none</div></button></li><li class="radio"><button class="default"><div class="radioCircle"></div><div class="radioText">default</div></button></li>';
for (let i = 0; i < ringtoneList.length; i++) {
    temp += '<li class="radio"><button class="'
        + ringtoneList[i]
        + '"><div class="radioCircle"></div><div class="radioText">'
        + ringtoneList[i]
        + '</div></button></li>';
}
ringtonesWorkUl.innerHTML = temp;
ringtonesBreakUl.innerHTML = temp;

let ringtonesWorkRadios = document.querySelectorAll('.ringtones .work .radio button');
let ringtonesBreakRadios = document.querySelectorAll('.ringtones .break .radio button');

// 選項音效
for (let i = 0; i < ringtonesWorkRadios.length; i++) {
    if (ringtonesWorkRadios[i].className == workRing) {
        ringtonesWorkRadios[i].classList.add('checked');
    }
    ringtonesWorkRadios[i].addEventListener('click', function () {
        for (let j = 0; j < ringtonesWorkRadios.length; j++) {
            ringtonesWorkRadios[j].classList.remove('checked');
        }
        workRing = ringtonesWorkRadios[i].className;
        ringtonesWorkRadios[i].classList.add('checked');
        switch (workRing) {
            case 'none':
                workAudio.src = '';
                break;
            case 'default':
                workAudio.src = 'music/alarm.mp3';
                workAudio.play();
                break;
            default:
                workAudio.src = 'music/' + workRing + '.mp3';
                workAudio.play();
        }

    }, false);
}
for (let i = 0; i < ringtonesBreakRadios.length; i++) {
    if (ringtonesBreakRadios[i].className == breakRing) {
        ringtonesBreakRadios[i].classList.add('checked');
    }
    ringtonesBreakRadios[i].addEventListener('click', function () {
        for (let j = 0; j < ringtonesBreakRadios.length; j++) {
            ringtonesBreakRadios[j].classList.remove('checked');
        }
        breakRing = ringtonesBreakRadios[i].className;
        ringtonesBreakRadios[i].classList.add('checked');
        switch (breakRing) {
            case 'none':
                breakAudio.src = '';
                break;
            case 'default':
                breakAudio.src = 'music/alarm.mp3';
                breakAudio.play();
                break;
            default:
                breakAudio.src = 'music/' + breakRing + '.mp3';
                breakAudio.play();
        }
    }, false);
}

// header
let headerButtons = document.querySelectorAll('header button'),
    headerButtonsLength = headerButtons.length;
let closeButton = headerButtons[headerButtonsLength - 1];
let windowPage = document.querySelector('.wrap>.window');
let leftPage = document.querySelector('.wrap>.window>.left');
let timerPage = document.querySelector('.wrap>.timer');

for (let i = 0; i < headerButtonsLength - 1; i++) {
    headerButtons[i].addEventListener('click',
        function (event) {
            for (let j = 0; j < headerButtonsLength - 1; j++) {
                headerButtons[j].style.display = 'none';
            }
            closeButton.style.display = 'initial';
            timerPage.style.display = 'none';
            windowPage.style.display = 'flex';
            document.querySelector('.window>.' + event.target.className).style.display = 'initial';
            windowButtons[i].classList.add('active');
        }
        , false);
}

closeButton.addEventListener('click',
    function () {
        for (let i = 0; i < headerButtonsLength - 1; i++) {
            headerButtons[i].style.display = 'initial';
        }
        closeButton.style.display = 'none';
        windowPage.style.display = 'none';
        timerPage.style.display = 'flex';
        for (let i = 0; i < windowButtonsLength; i++) {
            windowButtons[i].classList.remove('active');
        }
        for (let i = 0; i < headerButtonsLength - 1; i++) {
            document.querySelector('.window>.' + headerButtons[i].className).style.display = 'none';
        }
    }, false);

// 
updateList();
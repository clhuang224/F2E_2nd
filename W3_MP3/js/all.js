$(document).ready(function () {
    // 各按鈕作用
    $('.aside-switch').click(function () {
        $('.main').toggleClass('hide-aside');
    });
    $('.player .play-button').click(function () {
        $('.player').toggleClass('pause');
        $('.player').toggleClass('playing');
    });
    $('.player .random-button').click(function () {
        $('.player').toggleClass('random');
    });
    $('.player .mute-button').click(function () {
        $('.player').toggleClass('mute');
    });
    $('.aside .menu .menu-button').click(function () {
        $(this).parent().toggleClass('active');
    });
    $('.aside .submenu .submenu-button').click(function () {
        $(this).parent().parent().parent().parent().find('.submenu-li').removeClass('active');
        $(this).parent().addClass('active');
    });
});

let menuList = document.querySelector('.menu .list .submenu');
let menuSinger = document.querySelector('.menu .singer .submenu');
let menuFavorite = document.querySelector('.menu .favorite .submenu');
function updateMenu() {
    // 播放清單
    $('.menu .submenu').html('');
    let songListsLength = songLists.length;
    for (let i = 0; i < songListsLength; i++) {
        menuList.innerHTML += '<li class="submenu-li"><button class="submenu-button">'
            + songLists[i].name
            + '</button></li>';
    }
    menuList.querySelector('.submenu-li').classList.add('active');
    // 歌手
    let singerListLength = singerList.length;
    for (let i = 0; i < singerListLength; i++) {
        menuSinger.innerHTML += '<li class="submenu-li" data-number="'
            + i
            + '"><button class="submenu-button">'
            + singerList[i].name
            + '</button></li>';
    }
}

let favoriteList = {
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
};

let songs = {
    0: {
        id: 0,
        title: 'Bongo Madness',
        singer: 'Quincas Moreira',
        album: {
            title: 'YouTube Audio Library',
            order: null,
        },
        time: 183,
        path: '../music/Bongo_Madness.mp3',
        favorite: true,
    },
    1: {
        id: 1,
        title: 'Beach Disco',
        singer: 'Dougie Wood',
        album: {
            title: 'YouTube Audio Library',
            order: null,
        },
        time: 183,
        path: '../music/Beach_Disco.mp3',
        favorite: false,
    },
    2: {
        id: 2,
        title: 'Central Park',
        singer: 'Quincas Moreira',
        album: {
            title: 'YouTube Audio Library',
            order: null,
        },
        time: 183,
        path: '../music/Central_Park.mp3',
        favorite: false,
    },
    3: {
        id: 3,
        title: 'How it Began',
        singer: 'Silent Partner',
        album: {
            title: 'YouTube Audio Library',
            order: null,
        },
        time: 183,
        path: '../music/BHow_it_Began.mp3',
        favorite: false,
    },
    4: {
        id: 4,
        title: 'Your Suggestions',
        singer: 'Unicorn Heads',
        album: {
            title: 'YouTube Audio Library',
            order: null,
        },
        time: 183,
        path: '../music/Your_Suggestions.mp3',
        favorite: false,
    },
};

let singerList = localStorage.getItem('singerList') ||
    [
        {
            name: 'Quincas Moreira',
            album: [
                {
                    title: 'YouTube Audio Library',
                    songs: [0, 2],
                },
            ],
        }
        ,
        {
            name: 'Dougie Wood',
            album: [
                {
                    titile: 'YouTube Audio Library',
                    songs: [1,]
                }
            ]
        },
        {
            name: 'Silent Partner',
            album: [
                {
                    titile: 'YouTube Audio Library',
                    songs: [3,]
                }
            ]
        },
        {
            name: 'Unicorn Heads',
            album: [
                {
                    titile: 'YouTube Audio Library',
                    songs: [4,]
                }
            ]
        },
    ];

let songLists = localStorage.getItem('sonLists') || [
    {
        name: '工作歌單',
        songs: [0, 1,]
    },
    {
        name: '好聽的歌',
        songs: [2, 3, 4]
    }

];

updateMenu();
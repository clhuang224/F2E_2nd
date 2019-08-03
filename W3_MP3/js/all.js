$(document).ready(function(){
    // 各按鈕作用
    $('.aside-switch').click(function(){
        $('.main').toggleClass('hide-aside');
    });
    $('.player .play-button').click(function(){
        $('.player').toggleClass('pause');
    });
    $('.player .random-button').click(function(){
        $('.player').toggleClass('random');
    });
    $('.player .mute-button').click(function(){
        $('.player').toggleClass('mute');
    });
    $('.aside .menu .menu-button').click(function(){
        $(this).parent().toggleClass('active');
    });
    $('.aside .submenu .submenu-button').click(function(){
        $(this).parent().addClass('active').siblings().removeClass('active');
    });
});
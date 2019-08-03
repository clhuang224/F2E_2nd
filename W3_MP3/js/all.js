$(document).ready(function(){
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
});
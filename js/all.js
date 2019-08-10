$('#list-tab>li>a').click(function (event) {
    event.preventDefault();
    $(this).tab('show');
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
});

let href = window.location.href;
if (href.search('#') !== -1){
    href = href.slice(href.search('#')+1);
}
else{
    href = 'w1';
}
document.querySelector(`.main #list-tab a[href="#${href.toLowerCase()}"]`).parentElement.classList.add('active');
document.querySelector(`.main .tab-content .tab-pane[id="${href.toLowerCase()}"]`).classList.add('active');

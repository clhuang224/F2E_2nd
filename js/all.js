$('#list-tab>li>a').click(function(event){
    event.preventDefault();
    $(this).tab('show');
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
});
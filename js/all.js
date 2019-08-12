let data = [
    {
        week: 1,
        tab: 'W1 Pomodoro',
        title: '第一關：番茄鐘',
        introURL: 'https://challenge.thef2e.com/news/12',
        articleURL: 'https://clhuang224.github.io/TechBlog/2019/07/08/20190708-f2e-2-w1-Pomodoro/',
        workURL: './W1_Pomodoro/',
        codeURL: 'https://github.com/clhuang224/F2E_2nd/tree/master/W1_Pomodoro',
        imageURL: 'img/w1.png',
    },
    {
        week: 2,
        tab: 'W2 FreeCell',
        title: '第二關：新接龍',
        introURL: 'https://challenge.thef2e.com/news/13',
        articleURL: 'https://clhuang224.github.io/TechBlog/2019/07/22/20190722-f2e-2-w2-FreeCell/',
        workURL: './W2_FreeCell/',
        codeURL: 'https://github.com/clhuang224/F2E_2nd/tree/master/W2_FreeCell',
        imageURL: 'img/w2.png',
    },
    {
        week: 3,
        tab: 'W3 MP3 Player',
        title: '第三關：MP3 Player',
        introURL: 'https://challenge.thef2e.com/news/14',
        articleURL: 'https://clhuang224.github.io/TechBlog/2019/08/10/20190810-f2e-2-w3-MP3/',
        workURL: './W3_MP3/',
        codeURL: 'https://github.com/clhuang224/F2E_2nd/tree/master/W3_MP3',
        imageURL: 'img/w3.png',
    },
    {
        week: 4,
        tab: 'W4 Payment',
        title: '第四關：線上支付',
        introURL: 'https://challenge.thef2e.com/news/15',
        articleURL: 'https://clhuang224.github.io/TechBlog/2019/08/12/20190812-f2e-2-w4-Payment/',
        workURL: './W4_Payment/',
        codeURL: 'https://github.com/clhuang224/F2E_2nd/tree/master/W4_Payment',
        imageURL: 'img/w4.png',
    }
];

let listTab = document.querySelector('#list-tab');
for (let i = 0; i < data.length; i++) {
    listTab.innerHTML += `
        <li>
            <a href="#w${data[i].week}" data-toggle="tab">${data[i].tab}</a>
        </li>`;
}

let tabContent = document.querySelector('.tab-content');
for (let i = 0; i < data.length; i++) {
    tabContent.innerHTML += `
        <div class="tab-pane" id="w${data[i].week}">
            <div class="content">
                <h2 class="title">${data[i].title}</h2>
                <ul class="links">
                    <li><a href="${data[i].introURL}" target="_blank">題目說明</a></li>
                    <li><a href="${data[i].articleURL}" target="_blank">挑戰紀錄</a></li>
                    <li><a href="${data[i].workURL}" target="_blank">作品網址</a></li>
                    <li><a href="${data[i].codeURL}" target="_blank">原始碼</a></li>
                </ul>
                <img class="img" src="${data[i].imageURL}">
            </div>
        </div>`;
}

$('#list-tab>li>a').click(function (event) {
    event.preventDefault();
    $(this).tab('show');
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
});

let href = window.location.href;
if (href.search('#') !== -1) {
    href = href.slice(href.search('#') + 1);
}
else {
    href = 'w1';
}
document.querySelector(`.main #list-tab a[href="#${href.toLowerCase()}"]`).parentElement.classList.add('active');
document.querySelector(`.main .tab-content .tab-pane[id="${href.toLowerCase()}"]`).classList.add('active');

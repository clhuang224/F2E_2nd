let main = document.querySelector('.main');
document.querySelector('.payment').addEventListener('click', function (event) {
    switch (event.target.className) {
        case 'button':
            main.dataset.router = event.target.dataset.a;
            break;
        case 'image':
        case 'text':
            main.dataset.router = event.target.parentElement.dataset.a;
            break;
    }
}, false);
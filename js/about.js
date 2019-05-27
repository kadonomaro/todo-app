export default function aboutBlockAction() {
    var aboutToggle = document.querySelector('.js-about-button');
    var aboutBlock = document.querySelector('.js-about');

    aboutToggle.addEventListener('change', function () {
        aboutBlock.classList.toggle('todo__about--active');
        if (!aboutBlock.classList.contains('todo__about--active')) {
            setTimeout(function () {
                aboutBlock.style.visibility = 'hidden';
            }, 500);
        } else {
            aboutBlock.style.visibility = 'visible';
        }
    });
}
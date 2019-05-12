var optionProgressBar = document.querySelector('[name=option-progress-bar]');
var optionDate = document.querySelector('[name=option-date]');
var optionCount = document.querySelector('[name=option-count]');
var optionPrice = document.querySelector('[name=option-price]');

var settings = {
    settingsToggle: document.querySelector('.js-settings-toggle'),
    settingsBlock: document.querySelector('.js-settings'),
    settingsOption: document.querySelectorAll('.js-settings-option'),

    init: function () {
        var _this = this;
        this.settingsBlock.style.visibility = 'hidden';
        this.settingsToggle.addEventListener('click', function (evt) {
            evt.preventDefault();
            this.classList.toggle('settings-toggle--active');
            _this.settingsBlock.classList.toggle('todo__settings--active');
            if (_this.settingsBlock.style.visibility === 'hidden') {
                _this.settingsBlock.style.visibility = 'visible';
            } else {
                setTimeout(function () {
                    _this.settingsBlock.style.visibility = 'hidden';
                }, 300);
            }
        });
    },
    setSettingsOptions: function (eventElement, option, element) {
        eventElement.addEventListener('input', function () {
            if (option.checked) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        });
    }
};

export default settings;

export {
    optionProgressBar as optionProgressBar,
    optionDate as optionDate,
    optionCount as optionCount,
    optionPrice as optionPrice
};




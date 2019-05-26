var optionProgressBar = document.querySelector('[name=option-progress-bar]');
var optionDate = document.querySelector('[name=option-date]');
var optionCount = document.querySelector('[name=option-count]');
var optionPrice = document.querySelector('[name=option-price]');

var settings = {
    settingsToggle: document.querySelector('.js-settings-toggle'),
    settingsBlock: document.querySelector('.js-settings'),
    // settingsOption: document.querySelectorAll('.js-settings-option'),




    init: function (otherHTMLElement) {
        var _this = this;
        this.settingsBlock.style.visibility = 'hidden';
        this.settingsToggle.addEventListener('click', function (evt) {
            evt.preventDefault();
            if (!otherHTMLElement.hasAttribute('tabindex')) {
                otherHTMLElement.setAttribute('tabindex', '-1');
            } else {
                otherHTMLElement.removeAttribute('tabindex');
            }
            
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

    setSettingsOption: function (
        eventElement,
        option,
        element,
        className,
        isArray) {
        eventElement.addEventListener('change', function () {

            switch (isArray) {
                case true:
                    if (option.checked) {
                        element.forEach(function (elem) {
                            elem.classList.remove(className);
                        });
                    } else {
                        element.forEach(function (elem) {
                            elem.classList.add(className);
                        });
                    }
                    break;
                case false:
                    if (option.checked) {
                        element.classList.remove(className);
                    } else {
                        element.classList.add(className);
                    }
                    break;
            }
            
        });
        
    },
    load: function (actionElement, actionElementClassName, option, isArray) {
        switch (isArray) {
            case true:
                if (option) {
                    actionElement.forEach(function (elem) {
                        elem.classList.remove(actionElementClassName);
                    });
                } else {
                    actionElement.forEach(function (elem) {
                        elem.classList.add(actionElementClassName);
                    });
                }
                break;
            case false:
                if (option) {
                    actionElement.classList.remove(actionElementClassName);
                } else {
                    actionElement.classList.add(actionElementClassName);
                }
                break;
        } 
    }
};

export default settings;

export {
    optionProgressBar as optionProgressBar,
    optionDate as optionDate,
    optionCount as optionCount,
    optionPrice as optionPrice
};




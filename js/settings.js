var settings = {
    settingsToggle: document.querySelector('.js-settings-toggle'),
    settingsBlock: document.querySelector('.js-settings'),
    init: function () {
        var _this = this;
        this.settingsToggle.addEventListener('click', function (evt) {
            evt.preventDefault();
            this.classList.toggle('settings-toggle--active');
            _this.settingsBlock.classList.toggle('todo__settings--active');
        });
    }
};

export default settings;
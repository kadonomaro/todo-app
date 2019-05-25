


var modal = {
    modalOpened: false,
    clearAllModal:              document.querySelector('.js-modal'),
    clearAllModalCallButton:    document.querySelector('.js-settings-clear'),
    clearAllOkButton:           document.querySelector('.js-modal-ok'),
    clearAllCancelButton:       document.querySelector('.js-modal-cancel'),
    
    init: function () {
        var _this = this;

        this.clearAllModalCallButton.addEventListener('click', function () {
            this.classList.toggle('settings-clear--active');

            if (_this.modalOpened) {
                _this.close(_this.clearAllModal);
            } else {
                _this.open(_this.clearAllModal);
            }
        });

        this.clearAllOkButton.addEventListener('click', function () {
            _this.close(_this.clearAllModal);
            // clearAll();
        });

        this.clearAllCancelButton.addEventListener('click', function () {
            _this.close(_this.clearAllModal); 
        });

        document.addEventListener('keydown', function (evt) {
            if (evt.keyCode === 27 && _this.modalOpened) {
                _this.close(_this.clearAllModal);
            } 
        });
    },
    
    open: function (modal) {
        if (!modal.classList.contains('modal--active')) {
            modal.classList.remove('modal--hidden');
            modal.classList.add('modal--active');
            modal.classList.remove('modal--blur');
            this.modalOpened = true;
            this.clearAllCancelButton.focus();
        }
    },
    close: function (modal, focus = true) {
        if (modal.classList.contains('modal--active')) {
            modal.classList.remove('modal--active');
            modal.classList.add('modal--blur');
            setTimeout(function(){
            modal.classList.add('modal--hidden');
            }, 300);
            this.modalOpened = false;
        }
        if (focus) {
            this.clearAllModalCallButton.focus();
        }
    }
    
    
};

export default modal;
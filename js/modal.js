import checkUserAgent from "./checkUserAgent.js";


var modal = {
    modalOpened: false,

    init: function (modal, callButton, okButton, cancelButton, clearFunction) {
        var _this = this;

        callButton.addEventListener(checkUserAgent(), function () {
            this.classList.toggle('settings-clear--active');

            if (_this.modalOpened) {
                _this.close(modal, callButton);
            } else {
                _this.open(modal, cancelButton);
            }
        });

        okButton.addEventListener(checkUserAgent(), function () {
            _this.close(modal, callButton);
            clearFunction();
        });

        cancelButton.addEventListener(checkUserAgent(), function () {
            _this.close(modal, callButton); 
        });

        document.addEventListener('keydown', function (evt) {
            if (evt.keyCode === 27 && _this.modalOpened) {
                _this.close(modal, callButton);
            } 
        });
    },
    
    open: function (modal, focusButton) {
        if (!modal.classList.contains('modal--active')) {
            modal.classList.remove('modal--hidden');
            modal.classList.add('modal--active');
            modal.classList.remove('modal--blur');
            this.modalOpened = true;
            focusButton.focus();
        }
    },
    close: function (modal, focusButton, focus = true) {
        if (modal.classList.contains('modal--active')) {
            modal.classList.remove('modal--active');
            modal.classList.add('modal--blur');
            setTimeout(function(){
            modal.classList.add('modal--hidden');
            }, 300);
            this.modalOpened = false;
        }
        if (focus) {
            focusButton.focus();
        }
    }
    
    
};

export default modal;
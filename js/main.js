import settings, { optionProgressBar, optionDate, optionCount, optionPrice } from "./settings.js";
import getDate from "./date.js";
import modal from "./modal.js";


document.addEventListener('DOMContentLoaded', function () {

    var taskList = document.querySelector('.js-task-list');
    var addTask = document.querySelector('.js-add-task');
    var addTaskButton = taskList.querySelector('.js-task-button');
    var taskName = taskList.querySelector('.js-task-name');
    var taskPrice = taskList.querySelector('.js-task-price');
    var taskSumm = document.querySelector('.js-price-summ');
    var task = document.querySelector('.js-task');
    var progressBar = document.querySelector('.js-progress');
    

	var clearAllModal = document.querySelector('.js-modal');
	var clearAllModalCallButton = document.querySelector('.js-settings-clear');
	var clearAllOkButton = document.querySelector('.js-modal-ok');
    var clearAllCancelButton = document.querySelector('.js-modal-cancel');
    
    var validNumber = /^[0-9]*$/;
	

    var taskInfo = {};
    var settingsInfo = {
        taskCounter: 0,
		checkedtaskCounter: 0,
		isProgressBarActive: optionProgressBar.checked,
		isPriceActive: optionPrice.checked,
		isDateActive: optionDate.checked
	};

	


/* Arrays of prices and dates HTMLElements for push to them on create it */
    var taskArr = [];
    var pricesArr = [];
    var datesArr = [];
    var taskDate = task.querySelector('.js-date');
    var taskPriceInput = task.querySelector('.js-price');
    taskArr.push(task);
    pricesArr.push(taskPriceInput);
    pricesArr.push(taskSumm);
    datesArr.push(taskDate);

    loadSettings();
	loadTasks();

	modal.init(
		clearAllModal,
		clearAllModalCallButton,
		clearAllOkButton,
		clearAllCancelButton,
		clearAll
	);

    
	settings.init(clearAllModalCallButton);

	settings.setSettingsOption(optionProgressBar, optionProgressBar, progressBar, 'todo__progress--hidden', false);
	optionProgressBar.addEventListener('change', function () {
		settingsInfo.isProgressBarActive = this.checked;
		saveObjToLocalStorage('settings_info', settingsInfo);
	});

    settings.setSettingsOption(optionPrice, optionPrice, taskPrice, 'task__input--price-hidden', false);
    settings.setSettingsOption(optionPrice, optionPrice, taskSumm, 'task__input--summ-hidden', false);
	settings.setSettingsOption(optionPrice, optionPrice, pricesArr, 'task__input--price-hidden', true);
	optionPrice.addEventListener('change', function () {
		settingsInfo.isPriceActive = this.checked;
		saveObjToLocalStorage('settings_info', settingsInfo);
	});

    settings.setSettingsOption(optionDate, optionDate, datesArr, 'task__date--hidden', true);
	optionDate.addEventListener('change', function () {
		settingsInfo.isDateActive = this.checked;
		saveObjToLocalStorage('settings_info', settingsInfo);

        if (optionDate.checked) {
            taskArr.forEach(function (task) {
                task.classList.add('task--date-active');
            });
        } else {
            taskArr.forEach(function (task) {
                task.classList.remove('task--date-active');
            });
        }
	});


    function loadSettings() {
		settingsInfo = loadObjFromLocalStorage('settings_info', settingsInfo);
		if (settingsInfo === null) {
			settingsInfo = {
				taskCounter: 0,
				checkedtaskCounter: 0,
				isProgressBarActive: optionProgressBar.checked,
				isPriceActive: optionPrice.checked,
				isDateActive: optionDate.checked
			};
        }
		optionProgressBar.checked = settingsInfo.isProgressBarActive;
		optionPrice.checked = settingsInfo.isPriceActive;
        optionDate.checked = settingsInfo.isDateActive;
        
        settings.load(progressBar, 'todo__progress--hidden', settingsInfo.isProgressBarActive, false);
        settings.load(datesArr, 'task__date--hidden', settingsInfo.isDateActive, true);
        settings.load(taskArr, 'task--date-active', !settingsInfo.isDateActive, true);
        settings.load(taskPrice, 'task__input--price-hidden', settingsInfo.isPriceActive, false);
        settings.load(taskSumm, 'task__input--summ-hidden', settingsInfo.isPriceActive, false);
        settings.load(pricesArr, 'task__input--price-hidden', settingsInfo.isPriceActive, true);
        
	}
	
	

    /*Creating new task*/
    addTaskButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        var newTask = task.cloneNode(true);
        newTask.classList.remove('task--hidden');
        
        if (taskName.value !== '' && taskPrice.value.match(validNumber)) {
            settingsInfo.taskCounter++;
            
            var newTaskInputPrice = newTask.querySelector('.js-price');
            var newTaskDate = newTask.querySelector('.js-date');

            taskArr.push(newTask);
            pricesArr.push(newTaskInputPrice);
            datesArr.push(newTaskDate);

            newTask.querySelector('[name=task-title]').value = taskName.value;
			newTask.dataset.taskID = settingsInfo.taskCounter;
            newTask.querySelector('.js-price').value = taskPrice.value;
            newTaskDate.textContent = getDate();
            newTaskDate.setAttribute('datetime', getDate(true));
            

            taskInfo['ID_' + newTask.dataset.taskID] = {
                id: newTask.dataset.taskID,
                title: newTask.querySelector('[name=task-title]').value,
                price: newTask.querySelector('.js-price').value,
                date: newTaskDate.textContent,
                dateTime: newTaskDate.getAttribute('datetime'),
                checked: newTask.querySelector('.js-complete-button').checked
            };
            saveObjToLocalStorage('settings_info', settingsInfo);
            saveObjToLocalStorage('task_info', taskInfo);
            progressBar.max = Object.keys(taskInfo).length;

            taskName.value = '';
            taskPrice.value = '';
            taskSumm.value = calculatePrice(pricesArr);
            taskName.focus();
            taskList.appendChild(newTask);
        } else if (!taskPrice.value.match(validNumber)) {
            taskPrice.classList.add('task__input--price-invalid');
            taskPrice.addEventListener('animationend', function () {
                taskPrice.classList.remove('task__input--price-invalid');
                taskPrice.value = '';
                taskPrice.focus();
            });
        } else {
            addTask.classList.add('task--invalid');
            addTask.addEventListener('animationend', function () {
                addTask.classList.remove('task--invalid');
                taskName.focus();
            });
        }
        
        newTask.addEventListener('click', function (evt) {
            /* Closing task*/
            if (evt.target.classList.contains('js-close-button')) {
                closeTask(taskList, this);
            }
            /* Completion task*/
            if (evt.target.classList.contains('js-complete-button')) {
                completeTask(evt.target, this, 'task--completed');
            }
        });
    });


    function loadTasks() {
		taskInfo = loadObjFromLocalStorage('task_info', taskInfo);
		settingsInfo = loadObjFromLocalStorage('settings_info', settingsInfo);
		
        if (taskInfo === null) {
            taskInfo = {};
		}
		if (settingsInfo === null) {
            settingsInfo = {
                taskCounter: 0,
                checkedtaskCounter: 0,
                isProgressBarActive: optionProgressBar.checked,
                isPriceActive: optionPrice.checked,
                isDateActive: optionDate.checked
            };
		}
        progressBar.max = Object.keys(taskInfo).length;
		progressBar.value = settingsInfo.checkedtaskCounter;

        for (var key in taskInfo) {

            if (taskInfo.hasOwnProperty(key)) {

                var newTask = task.cloneNode(true);
                var newTaskInputPrice = newTask.querySelector('.js-price');
                var newTaskDate = newTask.querySelector('.js-date');

                newTask.classList.remove('task--hidden');
                newTask.dataset.taskID = taskInfo[key].id;
                newTask.querySelector('[name=task-title]').value = taskInfo[key].title;
                newTask.querySelector('.js-price').value = taskInfo[key].price;
                newTaskDate.textContent = taskInfo[key].date;
                newTaskDate.setAttribute('datetime', taskInfo[key].dateTime);

                if (taskInfo[key].checked) {

                    newTask.classList.add('task--completed');
                    newTask.querySelector('.js-complete-button').checked = true;

                }
                taskList.appendChild(newTask);

                taskArr.push(newTask);
                pricesArr.push(newTaskInputPrice);
                datesArr.push(newTaskDate);
                
                taskSumm.value = calculatePrice(pricesArr);
                
                newTask.addEventListener('click', function (evt) {
                    /* CLOSING TASK*/
                    if (evt.target.classList.contains('js-close-button')) {

                        closeTask(taskList, this);

                    }
                    /* COMPLETION TASK*/
                    if (evt.target.classList.contains('js-complete-button')) {

                        completeTask(evt.target, this, 'task--completed');

                    }
                });
            }
        }
    }


    function closeTask(taskList, task) {
        var checkedButton = task.querySelector('.js-complete-button');

        taskList.removeChild(task);
        // console.log('price before: ',pricesArr);
        // console.log('tasks before: ',taskArr);
        pricesArr = pricesArr.filter(function (item) {
            if (item.parentElement !== task) {
                return item;
            }
        });
        taskArr = taskArr.filter(function (item) {
            if (item !== task) {
                return item;
            } 
        });
        // console.log('price after: ',pricesArr);
        // console.log('tasks after: ',taskArr);

        delete taskInfo['ID_' + task.dataset.taskID];
        saveObjToLocalStorage('task_info', taskInfo);
        progressBar.max = Object.keys(taskInfo).length;
        taskSumm.value = calculatePrice(pricesArr);

        if (checkedButton.checked) {
            settingsInfo.checkedtaskCounter--;
			progressBar.value = settingsInfo.checkedtaskCounter;
            saveObjToLocalStorage('settings_info', settingsInfo);
        }

        if (localStorage.getItem('task_info') === '{}') {
            settingsInfo.taskCounter = 0;
            saveObjToLocalStorage('settings_info', settingsInfo);
        }
        
    }


    function completeTask(completeButton, task, className) {
        var taskTitle = task.querySelector('[name=task-title]');
        var taskPrice = task.querySelector('.js-price');
        var taskDate = task.querySelector('.js-date');

        if (completeButton.checked) {
            task.classList.add(className);
            settingsInfo.checkedtaskCounter++;
        } else {
            task.classList.remove(className);
            settingsInfo.checkedtaskCounter--;
        }

		progressBar.value = settingsInfo.checkedtaskCounter;

        taskInfo['ID_' + task.dataset.taskID] = {
            id: task.dataset.taskID,
            title: taskTitle.value,
            price: taskPrice.value,
            date: taskDate.textContent,
            dateTime: taskDate.getAttribute('datetime'),
            checked: completeButton.checked
        };

        saveObjToLocalStorage('task_info', taskInfo);
        saveObjToLocalStorage('settings_info', settingsInfo);

	}


	/* Save selected object to local storage */
	function saveObjToLocalStorage(key, obj) {
		var value = JSON.stringify(obj);
		localStorage.setItem(key, value);
	}
	/* Load selected object from local storage*/
	function loadObjFromLocalStorage(key, obj) {
		obj = localStorage.getItem(key);
		obj = JSON.parse(obj);

		return obj;
	}
	
	/* Clear all items form local storage and remove tasks */
	function clearAll() {
		localStorage.clear();
		taskInfo = {};
		settingsInfo.taskCounter = 0;
		settingsInfo.checkedtaskCounter = 0;
        saveObjToLocalStorage('settings_info', settingsInfo);
        taskSumm.value = '';
		for (let i = 1; i < taskArr.length; i++) {
			taskList.removeChild(taskArr[i]);
		}
		progressBar.value = 0;
        taskArr.length = 1;
        pricesArr.length = 2;
    }

    
    function calculatePrice(array) {
        var summ = 0;
        for (var i = 2; i < array.length; i++) {
            summ += +pricesArr[i].value;
        }
        return summ;
    }

});



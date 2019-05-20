import settings, { optionProgressBar, optionDate, optionCount, optionPrice } from "./settings.js";
import getDate from "./date.js";

document.addEventListener('DOMContentLoaded', function () {

    var taskList = document.querySelector('.js-task-list');
    var addTask = document.querySelector('.js-add-task');
    var addTaskButton = taskList.querySelector('.js-task-button');
    var taskName = taskList.querySelector('.js-task-name');
    var taskPrice = taskList.querySelector('.js-task-price');
    var task = document.querySelector('.js-task');
    var progressBar = document.querySelector('.js-progress');


    /* Clear all modal window */
    var clearModal = document.querySelector('.js-modal');
    var clearAllModalCallButton = document.querySelector('.js-settings-clear');
    var clearAllOkButton = clearModal.querySelector('.js-modal-ok');
    var clearAllCancelButton = clearModal.querySelector('.js-modal-cancel');

    clearAllModalCallButton.addEventListener('click', function () {
        this.classList.toggle('settings-clear--active');
        
        if (clearModal.classList.contains('modal--active')) {
            clearModal.classList.remove('modal--active');
            clearModal.classList.add('modal--blur');
            setTimeout(function(){
                clearModal.classList.add('modal--hidden');
            }, 300);
        } else {
            clearModal.classList.remove('modal--hidden');
            clearModal.classList.add('modal--active');
            clearModal.classList.remove('modal--blur');
            clearAllCancelButton.focus();
        }
    });

    clearAllOkButton.addEventListener('click', function () {
        if (clearModal.classList.contains('modal--active')) {
            clearModal.classList.remove('modal--active');
            clearModal.classList.add('modal--blur');
            setTimeout(function(){
                clearModal.classList.add('modal--hidden');
            }, 300);
            taskName.focus();
        } else {
            clearModal.classList.remove('modal--hidden');
            clearModal.classList.add('modal--active');
            clearModal.classList.remove('modal--blur');
            
        }
        clearAll();
    });

    clearAllCancelButton.addEventListener('click', function () {
        if (clearModal.classList.contains('modal--active')) {
            clearModal.classList.remove('modal--active');
            clearModal.classList.add('modal--blur');
            setTimeout(function(){
                clearModal.classList.add('modal--hidden');
            }, 300);
            taskName.focus();
        } else {
            clearModal.classList.remove('modal--hidden');
            clearModal.classList.add('modal--active');
            clearModal.classList.remove('modal--blur');
            
        }
    });

    document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === 27 && clearModal.classList.contains('modal--active')) {
            evt.preventDefault();
            clearModal.classList.remove('modal--active');
            clearModal.classList.add('modal--blur');
            setTimeout(function(){
                clearModal.classList.add('modal--hidden');
            }, 300);
            taskName.focus();
        }
    });

    // function showClearAllModal(focus = false) {
        
    // }


    var taskCount = 0;
    var checkedTaskCount = 0;
    var taskInfo = {};
    var settingsInfo = {
        taskCount: 0,
        checkedTaskCount: 0
    };


/* Arrays of price and date HTMLElements for push to them on create it */
    var taskArr = [];
    var pricesArr = [];
    var datesArr = [];
    var taskDate = task.querySelector('.js-date');
    var taskPriceInput = task.querySelector('.js-price');
    taskArr.push(task);
    pricesArr.push(taskPriceInput);
    datesArr.push(taskDate);

    loadTasks();
    settings.init(clearAllModalCallButton);
    settings.setSettingsOptions(optionProgressBar, optionProgressBar, progressBar, 'height');
    settings.setSettingsOptions(optionPrice, optionPrice, taskPrice, 'display');
    settings.setSettingsOptions(optionPrice, optionPrice, pricesArr, 'display', true);

    settings.setSettingsOptions(optionDate, optionDate, datesArr, 'display', true);
    optionDate.addEventListener('change', function () {
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




    
    /*Creating new task*/
    addTaskButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        var newTask = task.cloneNode(true);
        newTask.classList.remove('task--hidden');
        if (taskName.value !== '') {
            taskCount++;
            localStorage.setItem('task_count', taskCount);
            settingsInfo.taskCount++;
            
            var newTaskInputPrice = newTask.querySelector('.js-price');
            var newTaskDate = newTask.querySelector('.js-date');
            taskArr.push(newTask);
            pricesArr.push(newTaskInputPrice);
            datesArr.push(newTaskDate);


            newTask.querySelector('[name=task-title]').value = taskName.value;
            newTask.dataset.taskID = taskCount;
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
            taskName.focus();
            taskList.appendChild(newTask);
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

    /* Saved selected object to local storage */
    function saveObjToLocalStorage(key, obj) {
        var value = JSON.stringify(obj);
        localStorage.setItem(key, value);
    }

    /* Delete all tasks from app and local storage */
    function clearAll() {
        localStorage.clear();
        taskInfo = {};
        for (let i = 1; i < taskArr.length; i++) {
            taskList.removeChild(taskArr[i]);
        }
        progressBar.value = 0;
        taskArr.length = 1;
    }


    function loadTasks() {
        taskInfo = localStorage.getItem('task_info');
        taskInfo = JSON.parse(taskInfo);
        taskCount = localStorage.getItem('task_count');
        if (taskInfo === null) {
            taskInfo = {};
        }
        progressBar.max = Object.keys(taskInfo).length;
        checkedTaskCount = localStorage.getItem('checked_task_count');
        progressBar.value = checkedTaskCount;

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
        delete taskInfo['ID_' + task.dataset.taskID];
        saveObjToLocalStorage('task_info', taskInfo);
        progressBar.max = Object.keys(taskInfo).length;

        if (checkedButton.checked) {
            checkedTaskCount--;
            settingsInfo.checkedTaskCount--;
            progressBar.value = checkedTaskCount;
            localStorage.setItem('checked_task_count', checkedTaskCount);
            saveObjToLocalStorage('settings_info', settingsInfo);
        }

        if (localStorage.getItem('task_info') === '{}') {
            taskCount = 0;
            settingsInfo.taskCount = 0;
            localStorage.setItem('task_count', taskCount);
            saveObjToLocalStorage('settings_info', settingsInfo);
        }
        
    }


    function completeTask(completeButton, task, className) {
        var taskTitle = task.querySelector('[name=task-title]');
        var taskPrice = task.querySelector('.js-price');
        var taskDate = task.querySelector('.js-date');

        if (completeButton.checked) {
            task.classList.add(className);
            checkedTaskCount++;
            settingsInfo.checkedTaskCount++;
        } else {
            task.classList.remove(className);
            checkedTaskCount--;
            settingsInfo.checkedTaskCount--;
        }

        progressBar.value = checkedTaskCount;

        localStorage.setItem('checked_task_count', checkedTaskCount);

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

});


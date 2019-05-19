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

    var taskCount = 0;
    var checkedTaskCount = 0;
    var taskInfo = {};
    var settingsInfo = {
        taskCount: 0,
        checkedTaskCount: 0
    };


    /* Arrays of price and date HTMLElements for push to them on create it */
    var pricesArr = [];
    var datesArr = [];
    var taskDate = task.querySelector('.js-date');
    var taskPriceInput = task.querySelector('.js-price');
    pricesArr.push(taskPriceInput);
    datesArr.push(taskDate);

    
    loadTasks();
    settings.init();
    settings.setSettingsOptions(optionProgressBar, optionProgressBar, progressBar, 'height');
    settings.setSettingsOptions(optionPrice, optionPrice, taskPrice, 'display');
    settings.setSettingsOptions(optionPrice, optionPrice, pricesArr, 'display', true);
    settings.setSettingsOptions(optionDate, optionDate, datesArr, 'display', true);

    
    /*CREATING NEW TASK*/
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
            pricesArr.push(newTaskInputPrice);
            datesArr.push(newTaskDate);


            newTask.querySelector('[name=task-title]').value = taskName.value;
            newTask.dataset.taskID = taskCount;
            newTask.querySelector('.js-price').value = taskPrice.value;
            newTaskDate.textContent = getDate();

            taskInfo['ID_' + newTask.dataset.taskID] = {
                id: newTask.dataset.taskID,
                title: newTask.querySelector('[name=task-title]').value,
                price: newTask.querySelector('.js-price').value,
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
            /* CLOSING TASK*/
            if (evt.target.classList.contains('js-close-button')) {

                closeTask(taskList, this);
                
            }
            /* COMPLETION TASK*/
            if (evt.target.classList.contains('js-complete-button')) {

                completeTask(evt.target, this, 'task--completed');

            }
        });
    });


    function removeTask(task, taskList) {
        taskList.removeChild(task);
    }


    function saveObjToLocalStorage(key, obj) {
        var value = JSON.stringify(obj);
        localStorage.setItem(key, value);
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
                newTask.classList.remove('task--hidden');
                newTask.dataset.taskID = taskInfo[key].id;
                newTask.querySelector('[name=task-title]').value = taskInfo[key].title;
                newTask.querySelector('.js-price').value = taskInfo[key].price;

                if (taskInfo[key].checked) {

                    newTask.classList.add('task--completed');
                    newTask.querySelector('.js-complete-button').checked = true;

                }
                taskList.appendChild(newTask);
                var newTaskInputPrice = newTask.querySelector('.js-price');
                var newTaskDate = newTask.querySelector('.js-date');
                
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

        removeTask(task, taskList);
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
            checked: completeButton.checked
        };

        saveObjToLocalStorage('task_info', taskInfo);
        saveObjToLocalStorage('settings_info', settingsInfo);

    }

});


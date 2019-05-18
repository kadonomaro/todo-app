import settings, { optionProgressBar, optionDate, optionCount, optionPrice } from "./settings.js";

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
    var pricesArr = [];

    var taskPriceInput = task.querySelector('.js-price');
    pricesArr.push(taskPriceInput);

    
    loadTasks();
    settings.init();
    
    settings.setSettingsOptions(optionProgressBar, optionProgressBar, progressBar, 'height');
    settings.setSettingsOptions(optionPrice, optionPrice, taskPrice, 'display');
    settings.setSettingsOptions(optionPrice, optionPrice, pricesArr, 'display', true);
    
    /*CREATING NEW TASK*/
    addTaskButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        var newTask = task.cloneNode(true);
        newTask.classList.remove('task--hidden');
        if (taskName.value !== '') {
            taskCount++;
            localStorage.setItem('task_count', taskCount);
            newTask.children[1].value = taskName.value;
            newTask.dataset.taskID = taskCount;

            taskInfo['ID_' + newTask.dataset.taskID] = {
                id: newTask.dataset.taskID,
                title: newTask.children[1].value,
                checked: newTask.children[0].children[0].checked
            };
            saveToLocalStorage('task_info', taskInfo);

            progressBar.max = Object.keys(taskInfo).length;

            taskName.value = '';
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


    function saveToLocalStorage(key, obj) {
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
                newTask.children[1].value = taskInfo[key].title;

                if (taskInfo[key].checked) {

                    newTask.classList.add('task--completed');
                    newTask.children[0].children[0].checked = true;

                }
                taskList.appendChild(newTask);
                var newTaskInputPrice = newTask.querySelector('.js-price');
                
                pricesArr.push(newTaskInputPrice);
                
                
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

    /**
     * 
     * @param {HTMLElement} taskList 
     * @param {HTMLElement} task 
     * @param {HTMLElement} checkedButton
     */
    function closeTask(taskList, task) {
        var checkedButton = task.querySelector('.js-complete-button');

        removeTask(task, taskList);
        delete taskInfo['ID_' + task.dataset.taskID];
        saveToLocalStorage('task_info', taskInfo);
        progressBar.max = Object.keys(taskInfo).length;

        if (checkedButton.checked) {
            checkedTaskCount--;
            progressBar.value = checkedTaskCount;
            localStorage.setItem('checked_task_count', checkedTaskCount);
        }

        if (localStorage.getItem('task_info') === '{}') {
            taskCount = 0;
            localStorage.setItem('task_count', taskCount);
        }
        
    }


    /**
     * 
     * @param {HTMLElement} completeButton 
     * @param {HTMLElement} task 
     * @param {string} className 
     */
    function completeTask(completeButton, task, className) {
        var taskTitle = task.querySelector('[name=task-title]');

        if (completeButton.checked) {
            task.classList.add(className);
            checkedTaskCount++;
        } else {
            task.classList.remove(className);
            checkedTaskCount--;
        }

        progressBar.value = checkedTaskCount;

        localStorage.setItem('checked_task_count', checkedTaskCount);

        taskInfo['ID_' + task.dataset.taskID] = {
            id: task.dataset.taskID,
            title: taskTitle.value,
            checked: completeButton.checked
        };

        saveToLocalStorage('task_info', taskInfo);

    }

});


document.addEventListener('DOMContentLoaded', function () {

    var taskList = document.querySelector('.js-task-list');
    var addTask = document.querySelector('.js-add-task');
    var taskButton = taskList.querySelector('.js-task-button');
    var taskName = taskList.querySelector('.js-task-name');
    var task = document.querySelector('.js-task');
    var taskCount = 0;
    var taskInfo = {};
    


    /*CREATING NEW TASK*/
    taskButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        var newTask = task.cloneNode(true);
        newTask.classList.remove('task--hidden');
        if (taskName.value !== '') {
            taskCount++;
            newTask.children[1].value = taskName.value;
            newTask.dataset.taskID = taskCount;

            taskInfo['ID_' + newTask.dataset.taskID] = {
                id: newTask.dataset.taskID,
                title: newTask.children[1].value,
                checked: newTask.children[0].children[0].checked
            };
            toLocalStorage('task_info', taskInfo);

            taskName.value = '';
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
                removeTask(this, taskList);
                delete taskInfo['ID_' + this.dataset.taskID];
                toLocalStorage('task_info', taskInfo);

            }
            /* COMPLETION TASK*/
            if (evt.target.classList.contains('js-complete-button')) {
                completeTask(this, 'task--completed', evt.target);

                taskInfo['ID_' + this.dataset.taskID] = {
                    id: this.dataset.taskID,
                    title: this.children[1].value,
                    checked: this.children[0].children[0].checked
                };
                toLocalStorage('task_info', taskInfo);
            }
        });
    });

    loadTasks();

    /* LOADING TASKS FROM LOCALSTORAGE*/
    function loadTasks() {
        var localTaskInfo = localStorage.getItem('task_info');
        localTaskInfo = JSON.parse(localTaskInfo);

        for (var key in localTaskInfo) {
            if (localTaskInfo.hasOwnProperty(key)) {
                var newTask = task.cloneNode(true);
                newTask.classList.remove('task--hidden');
                newTask.dataset.taskID = localTaskInfo[key].id;
                newTask.children[1].value = localTaskInfo[key].title;
                if (localTaskInfo[key].checked) {
                    newTask.classList.add('task--completed');
                    newTask.children[0].children[0].checked = true;
                }
                taskList.appendChild(newTask);
                
                newTask.addEventListener('click', function (evt) {
                    /* CLOSING TASK*/
                    if (evt.target.classList.contains('js-close-button')) {
                        removeTask(this, taskList);
                        delete localTaskInfo['ID_' + this.dataset.taskID];
                        toLocalStorage('task_info', localTaskInfo);
        
                    }
                    /* COMPLETION TASK*/
                    if (evt.target.classList.contains('js-complete-button')) {
                        completeTask(this, 'task--completed', evt.target);
        
                        localTaskInfo['ID_' + this.dataset.taskID] = {
                            id: this.dataset.taskID,
                            title: this.children[1].value,
                            checked: this.children[0].children[0].checked
                        };
                        toLocalStorage('task_info', localTaskInfo);
                    }
                });
            }
        }


    }


    function removeTask(task, taskList) {
        taskList.removeChild(task);
    }


    function completeTask(task, className, completeButton) {
        if (completeButton.checked) {
            task.classList.add(className);
        } else {
            task.classList.remove(className);
        }
    }

    function toLocalStorage(key, obj) {
        var value = JSON.stringify(obj);
        localStorage.setItem(key, value);
    }

    


});
document.addEventListener('DOMContentLoaded', function () {

    var taskList = document.querySelector('.js-task-list');
    var addTask = document.querySelector('.js-add-task');
    var taskButton = taskList.querySelector('.js-task-button');
    var taskName = taskList.querySelector('.js-task-name');
    var task = document.querySelector('.js-task');
    var taskCount = 0;
    var taskMaxCount = 0;


    loadTasks();


    taskButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        var newTask = task.cloneNode(true);
        newTask.classList.remove('task--hidden');
        if (taskName.value !== '') {
            taskCount++;
            taskMaxCount++;
            localStorage.setItem('task_count', taskCount);
            localStorage.setItem('task_max_count', taskMaxCount);
            localStorage.setItem('task_id_' + taskCount, taskName.value);
            newTask.children[1].value = taskName.value;
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
            if (evt.target.classList.contains('js-close-button')) {
                removeTask(newTask, taskList);
            }
            if (evt.target.classList.contains('js-complete-button')) {
                completeTask(this, 'task--completed', evt.target);
            }
        });
    });


    function loadTasks() {
        taskCount += localStorage.getItem('task_count');
        taskMaxCount = localStorage.getItem('task_max_count');
        for (var i = 1; i <= taskMaxCount; i++) {
            if (localStorage.getItem('task_id_' + i) !== null) {
                var newTask = task.cloneNode(true);
                newTask.classList.remove('task--hidden');
                newTask.children[1].value = localStorage.getItem('task_id_' + i);
                newTask.dataset.taskID = i;
                taskList.appendChild(newTask);

                newTask.addEventListener('click', function (evt) {
                    if (evt.target.classList.contains('js-close-button')) {
                        removeTask(this, taskList);
                        taskCount--;
                        if (taskCount <= 0) {
                            taskMaxCount = 0;
                            localStorage.setItem('task_max_count', taskMaxCount);
                        }
                        localStorage.setItem('task_count', taskCount);
                        localStorage.removeItem('task_id_' + this.dataset.taskID);
                    }
                    if (evt.target.classList.contains('js-complete-button')) {
                        completeTask(this, 'task--completed', evt.target);
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
    

});
document.addEventListener('DOMContentLoaded', function () {

    var taskList = document.querySelector('.js-task-list');
    var addTask = document.querySelector('.js-add-task');
    var taskButton = taskList.querySelector('.js-task-button');
    var taskName = taskList.querySelector('.js-task-name');
    var task = document.querySelector('.js-task');
    var taskCount = 0;


    loadTasks();


    taskButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        var newTask = task.cloneNode(true);
        if (taskName.value !== '') {
            taskCount++;
            localStorage.setItem('task_count', taskCount);
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
        for (let i = 1; i <= taskCount; i++) {
            var newTask = task.cloneNode(true);
            newTask.children[1].value = localStorage.getItem('task_id_' + i);
            newTask.dataset.taskID = i;
            taskList.appendChild(newTask);

            newTask.addEventListener('click', function (evt) {
                if (evt.target.classList.contains('js-close-button')) {
                    removeTask(this, taskList);
                    taskCount--;
                    localStorage.setItem('task_count', taskCount);
                    localStorage.removeItem('task_id_' + this.dataset.taskID);
                }
                if (evt.target.classList.contains('js-complete-button')) {
                    completeTask(this, 'task--completed', evt.target);
                }
            });
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
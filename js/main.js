document.addEventListener('DOMContentLoaded', function () {

    var taskList = document.querySelector('.js-task-list');
    var addTask = document.querySelector('.js-add-task');
    var taskButton = taskList.querySelector('.js-task-button');
    var taskName = taskList.querySelector('.js-task-name');
    var task = document.querySelector('.js-task');


    taskButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        var newTask = task.cloneNode(true);
        if (taskName.value !== '') {
            newTask.children[1].value = taskName.value;
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
        });
    });


    function removeTask(task, taskList) {
        taskList.removeChild(task);
    }
    

});
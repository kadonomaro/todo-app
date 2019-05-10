document.addEventListener('DOMContentLoaded', function () {

    var taskList = document.querySelector('.js-task-list');
    var taskButton = taskList.querySelector('.js-task-button');
    var taskName = taskList.querySelector('.js-task-name');
    var task = document.querySelector('.js-task');


    taskButton.addEventListener('click', function () {
        var newTask = task.cloneNode(true);
        newTask.children[1].value = taskName.value;
        taskList.appendChild(newTask);
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
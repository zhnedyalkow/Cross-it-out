/* eslint-disable */

var database = (function () {

    var _categories = [
        []
    ];
    var done = [];
    var incompleted = [];
    var tasks;

    // is zero because it will be increased after the ajax populates the database with json tasks.
    var tasksLength = 0;
    var doneLength = 0;
    var incompletedLength = 0;

    function addCategory(id) {
        _categories[id] = [];
    }

    function getAllCategories() {
        return _categories;
    }

    function addTask(catId, task) {
        this.tasksLength += 1;
        _categories[catId].push(task);
    }

    function getAllTasksInCategory(id) {
        return _categories[id];
    }
    /**
     * @description Get all tasks and returns them
     * @returns {Object[]}
     */
    function getAllTasks() {
        var tasks = [];
        for (let i = 0; i < _categories.length; i += 1) {
            if (typeof _categories[i] === 'undefined') {
                continue;
            }
            var currentCat = _categories[i];

            for (let j = 0; j < currentCat.length; j += 1) {
                tasks.push(currentCat[j]);
            }
        }

        return tasks;
    }
    /**
     * @description Finds a task by given id and deletes it out.
     * @param {number} id
     * @returns {Object[]}
     */
    function deleteTask(id) {
        for (let i = 0; i < _categories.length; i += 1) {
            var currentCat = _categories[i];
            for (let j = 0; j < currentCat.length; j += 1) {
                if (_categories[i][j].taskId == id) {
                    var spliced = _categories[i].splice(j, 1);
                    return spliced;
                }
            }
        }
    }

    /**
     * @description Adds a task to the incompleted array.
     * @description  If an id is provided, the task is deleted and pushed to the array
     * @description If a task is provided, it is pushed to the array and deleted.
     * @description All active tasks' length is decremented. All incopmleted tasks' length is incremented
     * @param {number} id 
     * @param {Object} incomingTask 
     * @returns {void}
     */
    function addtoIncompleted(id, incomingTask) {
        if (incomingTask) {
            incompleted.push(incomingTask);
            deleteTask(incomingTask.taskId)
        } else {
            var task = deleteTask(id);
            incompleted.push(task[0]);
        }
        this.tasksLength -= 1;
        this.incompletedLength += 1;
    }
    /**
     * @description Deletes a task by given id and adds it to the done array. 
     * @description All active tasks' length is decremented. All done tasks' length is incremented
     * @param {number} id 
     * @returns {void}
     */
    function addToDone(id) {
        var task = deleteTask(id);
        done.push(task[0]);
        this.tasksLength -= 1;
        this.doneLength += 1;
    }

    /*
        Used by getSortedByDateAndTime() and getDone()
    */
    var _compareFuncByDateAndTime = function (a, b) {

        var aDate = a.taskDueDate.slice(0, 2);
        var aMonth = a.taskDueDate.slice(3, 5);
        var aYear = a.taskDueDate.slice(6);
        var aTime = a.taskDueTime;

        var bDate = b.taskDueDate.slice(0, 2);
        var bMonth = b.taskDueDate.slice(3, 5);
        var bYear = b.taskDueDate.slice(6);
        var bTime = b.taskDueTime;

        if (aYear < bYear) {
            return -1;
        }
        if (aYear > bYear) {
            return 1;
        }
        if (aYear === bYear) {
            if (aMonth < bMonth) {
                return -1;
            }
            if (aMonth > bMonth) {
                return 1;
            }
            if (aMonth === bMonth) {
                if (aDate < bDate) {
                    return -1;
                }
                if (aDate > bDate) {
                    return 1;
                }
                if (aDate === bDate) {

                    if (aTime < bTime) {
                        return -1;
                    }
                    if (aTime > bTime) {
                        return 1;
                    }
                    return 0;
                }
                return 0;
            }
            return 0;
        }
    }

    function getDone() {
        return done.sort(_compareFuncByDateAndTime);
    }

    function getIncompleted() {
        return incompleted.sort(_compareFuncByDateAndTime);
    }

    /**
     * @description Finds a task by given name and returns and array of tasks and the given name
     * @param {string} name 
     * @returns {Object}
     */
    function findTask(name) {
        var tasks = [];
        var allTasks = getAllTasks();
        for (let i = 0; i < allTasks.length; i += 1) {
            var task = allTasks[i].taskName.toLowerCase();
            if (task.includes(name)) {
                tasks.push(allTasks[i]);
            }
        }
        return {
            tasks,
            name
        };
    }
    /**
     * @description Sorts all tasks alphabetically and returns an array of objects
     * @param {boolean} isAscending 
     * @returns {Object[]}
     */
    var getSortedAlphabetically = function (isAscending) {
        var compareIncr = function (a, b) {
            if (a.taskName < b.taskName) {
                return -1;
            }
            if (a.taskName > b.taskName) {
                return 1;
            }

            return 0;
        }
        var compareDecr = function (b, a) {
            if (a.taskName < b.taskName) {
                return -1;
            }
            if (a.taskName > b.taskName) {
                return 1;
            }

            return 0;
        }
        if (isAscending) {
            return getAllTasks().sort(compareIncr);
        } else {
            return getAllTasks().sort(compareDecr);
        }
    };
    /**
     * @description Sorts taks in a category alphabetically and returns an array of objects
     * @param {number} id
     * @param {boolean} isAscending 
     * @returns {Object[]}
     */
    var getSortedAlphabeticallyInCategory = function (id, isAscending) {
        var compareIncr = function (a, b) {
            if (a.taskName < b.taskName) {
                return -1;
            }
            if (a.taskName > b.taskName) {
                return 1;
            }

            return 0;
        }
        var compareDecr = function (b, a) {
            if (a.taskName < b.taskName) {
                return -1;
            }
            if (a.taskName > b.taskName) {
                return 1;
            }

            return 0;
        }
        if (isAscending) {
            return getAllTasksInCategory(id).sort(compareIncr);
        } else {
            return getAllTasksInCategory(id).sort(compareDecr);
        }
    }
    /**
     * @description Sorts tasks in a category both by date and time and return an array of objects
     * @param {number} catId 
     * @returns {Object[]}
     */
    var getSortedByDateAndTime = function (catId) {
        var tasks;
        if (catId) {
            tasks = getAllTasksInCategory(catId);
        } else {
            tasks = getAllTasks();
        }
        var compareDecr = function (a, b) {
            if (a.taskDueDate > b.taskDueDate)
                return -1

            if (a.taskDueDate < b.taskDueDate)
                return 1

            if (a.taskDueDate === b.taskDueDate) {
                if (a.taskDueTime > b.taskDueTime)
                    return -1

                if (a.taskDueTime < b.taskDueTime)
                    return 1

                return 0
            }
        }
        return tasks.sort(_compareFuncByDateAndTime);
    }
    /**
     * @description Searches tasks by given date and returns an array of objects
     * @param {string} date 
     * @returns {Object[]}
     */
    var findTaskByDate = function (date) {
        var tasks = [];
        var allTasks = getAllTasks();
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].taskDueDate == date) {
                tasks.push(allTasks[i]);
            }
        }
        return tasks;
    }
    /**
     * @description Gets current date and time, compares all tasks with the current date. If a task is due, it is pushed to an array of objects.
     * @returns {Object[]}
     */
    var checkDueTasks = function () {
        var allTasks = getAllTasks();
        var date = new Date();
        var day = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        var year = date.getFullYear().toString();
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        var tasks = [];
        if (day.length === 1) {
            day = '0' + day;
        }
        if (month.length === 1) {
            month = '0' + month;
        }
        if (hours.length === 1) {
            hours = '0' + hours;
        }
        if (minutes.length === 1) {
            minutes = '0' + minutes;
        }

        var currentDate = day + '/' + month + '/' + year;
        var currentTime = hours + ':' + minutes;
        
        for (var i = 0; i < allTasks.length; i += 1) {
            var taskDay = allTasks[i].taskDueDate.slice(0, 2);
            var taskMonth = allTasks[i].taskDueDate.slice(3, 5);
            var taskYear = allTasks[i].taskDueDate.slice(6);
            var taskHours = allTasks[i].taskDueTime.slice(0, 2);
            var taskMinutes = allTasks[i].taskDueTime.slice(3);

            if (taskYear < year) {
                tasks.push(allTasks[i]);
            } else if (taskYear === year) {
                if (taskMonth < month) {
                    tasks.push(allTasks[i]);
                } else if (taskMonth === month) {
                    if (taskDay < day) {
                        tasks.push(allTasks[i]);
                    } else if (taskDay === day) {
                        if (taskHours < hours) {
                            tasks.push(allTasks[i]);
                        } else if (taskHours === hours) {
                            if (taskMinutes <= minutes) {
                                tasks.push(allTasks[i]);
                            }
                        }
                    }
                }
            }
        }
        return tasks;
    }

    return {
        tasksLength,
        addCategory,
        addTask,
        addToDone,
        addtoIncompleted,
        getDone,
        doneLength,
        deleteTask,
        getIncompleted,
        incompletedLength,
        findTaskByDate,
        findTask,
        getAllTasks,
        getAllCategories,
        getAllTasksInCategory,
        getSortedAlphabetically,
        getSortedByDateAndTime,
        getSortedAlphabeticallyInCategory,
        checkDueTasks
    }
})();
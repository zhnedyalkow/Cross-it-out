/* eslint-disable */
/**
 * @description Global function for the points.
 * @returns {function} calculatePoints
 */
var pointsLogic = (function () {

    /**
     * @description Get completed and incompleted tasks and calculate their sum based on their priorities.
     * @returns {Object} doneSum, incompletedSum
     */
    var calculatePoints = function () {
        var done = database.getDone();
        var incompleted = database.getIncompleted();
        var doneSum = 0;
        var incompletedSum = 0;
        var low = 2;
        var medium = 5;
        var high = 10;

        for (var i = 0; i < done.length; i += 1) {
            var priority = done[i].taskPriority;
            if (priority === 'low') {
                doneSum += low;
            } else if (priority === 'medium') {
                doneSum += medium;
            } else if (priority === 'high') {
                doneSum += high;
            }
        }

        for (var i = 0; i < incompleted.length; i += 1) {
            var priority = incompleted[i].taskPriority;
            if (priority === 'low') {
                incompletedSum -= low;
            } else if (priority === 'medium') {
                incompletedSum -= medium;
            } else if (priority === 'high') {
                incompletedSum -= high;
            }
        }

        return {
            doneSum,
            incompletedSum
        }
    };

    var ONE_MINUTE = 60 * 1000;
    var counter = 0;
    var dueTasks;

    function showTime() {
        dueTasks = database.checkDueTasks();
        if (dueTasks.length > 0) {
            for (var i = 0; i < dueTasks.length; i += 1) {
                var id = dueTasks[i].taskId;
                database.addtoIncompleted(id, dueTasks[i]);
                // update current element only if it is visualized
                if ($('#del-' + id)[0]) {
                    $('#del-' + id)[0].style.display = 'block';
                    $('#done-' + id)[0].style.display = 'none';
                    $('#del-' + id).hover(function () {
                        $('#del-' + id)[0].style.color = '#F00';
                        $('#del-' + id)[0].style.backgroundColor = '#FFF'
                        $('#del-' + id)[0].style.cursor = 'default'
                    });
                }
            }

            updateBadges();

            var incompletedSum = calculatePoints().incompletedSum;
            var doneSum = calculatePoints().doneSum;
            var pointsResult = doneSum + incompletedSum;
            $('#calculated-points').text(pointsResult);
        }
    }

    function repeatEvery(func, interval) {
        var now = new Date();
        var delay = interval - now % interval;

        function start() {
            func();
            repeatEvery(func, interval);
        }
        setTimeout(start, delay)
    }
    repeatEvery(showTime, ONE_MINUTE);

    return {
        calculatePoints
    }
})();
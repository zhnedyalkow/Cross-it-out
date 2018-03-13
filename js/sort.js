/* eslint-disable */

/**
 * @desc By clicking $('.sort-alphabeth-all') execute sorting in increasing or decreasing order. 
 * By so class 'ascending' in sort button is changed with 'descending'.
 */

(function () {
    $('.sort-alphabeth-all').on('click', function () {
        var result;
        var leftSortButton = $('#allCategories .sort-alphabeth-all');
        var rightSortButton = $('#parent-dropdown .sort-alphabeth-all');
        if (leftSortButton.hasClass('ascending') && rightSortButton.hasClass('ascending')) {
            result = database.getSortedAlphabetically(true);
            rightSortButton.removeClass('ascending');
            rightSortButton.addClass('descending');
            leftSortButton.removeClass('ascending');
            leftSortButton.addClass('descending');
        } else {
            result = database.getSortedAlphabetically(false);
            leftSortButton.addClass('ascending');
            leftSortButton.removeClass('descending');
            rightSortButton.addClass('ascending');
            rightSortButton.removeClass('descending');
        }
        visualize.customTasks(result);
    });

    $('#sort-alphabeth-in-cat').on('click', function () {
        var catId = sharedState.categoryId;

        if (!catId) {
            visualize.noTasks();
            return;
        }

        var result;
        if ($(this).hasClass('ascending')) {
            result = database.getSortedAlphabeticallyInCategory(catId, true);
            $(this).removeClass('ascending');
            $(this).addClass('descending');
        } else {
            result = database.getSortedAlphabeticallyInCategory(catId, false);
            $(this).removeClass('descending');
            $(this).addClass('ascending');

        }
        visualize.customTasks(result);
    });

    /*
        Sorting by dateTime and visualize
    */

    $('#sort-due-date').on('click', function () {
        var result = database.getSortedByDateAndTime();
        visualize.customTasks(result);
    });

    $('#sort-due-date-in-cat').on('click', function () {
        var catId = sharedState.categoryId;
        if (!catId) {
            visualize.noTasks();
            return;
        }
        var result = database.getSortedByDateAndTime(catId);
        visualize.customTasks(result);
    });
})();
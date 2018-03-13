/* eslint-disable */
// --- gets the info from the JSON file and appends it to the UI ---
(function() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'json/resources.json',
        success: function (result) {
            userCategories = result.clients[0].categories;
            processJSON(userCategories);
        },
        error: function (result, err, errorThrown) {
            console.log(result);
            console.log(err);
            console.log(errorThrown);
        },
        beforeSend: function () {
            $('#preloader').show();
            $('.container').hide();
            // Set timeout during loading html content
            setTimeout(function () {
                $('.logo').show();
                $('#preloader').hide();
                $('#loginModal').modal('show');
            }, 500);
        }
    });
    
    // events for the delete and done buttons
    $('.main').on('click', '.done-icon, .delete-icon', function (doneElement) {
        var el = sharedState.categoryElement;
        var isAll = sharedState.isAll;
        var catId = sharedState.categoryId;
        var buttonId = $(this).attr('id');
        
        // checking for class name because we've attached the functionallity for two buttons
        if ($(this).hasClass('delete-icon')) {
            var taskId = buttonId.slice(4);
            database.addtoIncompleted(taskId);
        } else {
            var taskId = buttonId.slice(5);
            database.addToDone(taskId);
        }
    
        // remove element from the DOM cuz it is marked done/deleted
        $(this).parent().parent().parent().remove();
    
        updateBadges();
        
        var calculation = pointsLogic.calculatePoints();
        var incompletedSum = calculation.incompletedSum;
        var doneSum = calculation.doneSum;
        var pointsResult = doneSum + incompletedSum;
        $('#calculated-points').text(pointsResult);
    });
    
    // event for the show more button on the task visualization
    $('.main').on('click', '.show-more', function() {
        $(this).popover('toggle');
        var self = this;
        $(document).mouseup(function (e) {
            var container = $('.taskNameWrapper .popover');
            if (!container.is(e.target) && container.has(e.target).length === 0 &&
                !$(self).is(e.target) && $(self).has(e.target).length === 0) {
                $(self).popover('hide');
            }
        });
    })
    
})();

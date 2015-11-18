/**
 * Created by camel on 2015-10-14.
 */
'use strict';
/*global window */
var app = app || {};
app.mainView = (function () {
    return {
        init: function
            () {
            var calendar = new app.Calendar(this.calendarSettings.$calendarContainer, this.calendarSettings.monthName, this.calendarSettings.dayName, this.calendarSettings.counter);
            calendar.createArrows();
            calendar.createCalendars(this.calendarSettings.rows, this.calendarSettings.columns
                ,this.calendarSettings.dayName, this.calendarSettings.counter
            );

        },
        calendarSettings: {
            $calendarContainer: $('.calendar-container'),
            rows: 5,
            columns: 7,
            dayName: ['pon','wt','sr', 'czw','pt', 'sob', 'nd'],
            monthName: ['Styczen', 'Luty', 'Marzec', 'Kwiecien', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpien','Wrzesien', 'Pazdziernik', 'Listopad','Grudzien'],
            counter: 0

        }
    };
}());
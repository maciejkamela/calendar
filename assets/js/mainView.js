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
            var calendar = new app.Calendar(function (choseDay) {
                console.log(choseDay)
            },function (failedPeriod) {
                console.log('wyjebawszy',failedPeriod)
            },this.calendarSettings.$calendarContainer, this.calendarSettings.monthName, this.calendarSettings.dayName);
            calendar.createCalendars(this.calendarSettings.rows, this.calendarSettings.columns
                ,this.calendarSettings.dayName
            );

        },
        calendarSettings: {
            $calendarContainer: $('.calendar-container'),
            rows: 5,
            columns: 7,
            dayName: ['pon','wt','sr', 'czw','pt', 'sob', 'nd'],
            monthName: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień','Wrzesień', 'Październik', 'Listopad','Grudzień']
        }
    };
}());
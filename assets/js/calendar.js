'use strict';
var app = app || {};
app.Calendar = function ($calendarContainer, monthNames, dayNames) {
    this.$calendarContainer = $calendarContainer;
    this.$calendarWrapper = $('<section>').addClass('calendar-wrapper');
    this.$calendarContainer.append(this.$calendarWrapper);
    this.monthName = monthNames;
    this.monthAmount = monthNames.length;
    this.dayNames = dayNames;
    this.daysAmount = dayNames.length;
};

app.Calendar.prototype.createCalendars = function (row, column) {

    for (var i = 0; i < this.monthAmount; i++) {
        var li = $('<div>').addClass('row col-xs-12 col-sm-6 col-md-3 calendar-item');
        for (var j = 0; j < this.daysAmount; j++) {
            var $table = this.createTable(row, column, this.dayNames[j], this.monthName[i]);
        }
        //var $table = this.createTable(row, column, this.dayNames, this.monthName[i]);
        li.append($table);
        this.$calendarWrapper.append(li);
    }
};
Number.prototype.times = function (fn) {
    for (var r = [], i = 0; i < this; i++)
        r.push(fn(i));
    return r;
};

app.Calendar.prototype.createTable = function (numRows, numCols, dayName, monthName) {
    var $tableHead = $("<thead>"),
        $calendarHeader = $("<tr>").addClass('pn-calendar-header'),
        $headerMonth = $("<th>").addClass('pn-calendar-header-month').attr('colspan', 7).text(monthName),
        $subHeader = $("<tr>").addClass('pn-calendar-subheader');
    //console.log(dayName, dayName.length, numCols, numRows, monthName);
    var $day = numCols.times(function () {
            return $("<td/>").addClass('pn-calendar-header-day').text(dayName);
        }
    );
    //var $day = $("<td/>").addClass('pn-calendar-header-day').text(dayName);
    var row = function () {
        return $("<tr/>").append(numCols.times(function (c) {
            return $("<td/>").addClass('pn-calendar-day').text([c+1].join(""));
        }));
    };
    $subHeader.append($day);
    $calendarHeader.append($headerMonth);
    $tableHead.append($calendarHeader, $subHeader);
    return $("<table/>").addClass('pn-calendar')
        .append($tableHead)
        .append(numRows.times(row));
};

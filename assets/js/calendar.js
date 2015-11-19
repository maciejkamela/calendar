'use strict';
var app = app || {};
app.Calendar = function ($calendarContainer, monthNames, dayNames, counter) {
    this.$calendarContainer = $calendarContainer;
    this.$calendarWrapper = $('<section>').addClass('calendar-wrapper');
    this.$calendarContainer.append(this.$calendarWrapper);
    this.monthName = monthNames;
    this.dayNames = dayNames;
    this.daysAmount = dayNames.length;
    this.DAYS = 7;
    this.MONTHS = 12;
    this.ROWS = 5;
    this.currentYear = new Date().getFullYear();

    this.getDaysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    }
};

app.Calendar.prototype.createCalendars = function () {
    for (var i = 0; i < this.MONTHS; i++) {
        var li = $('<div>').addClass('row col-xs-12 col-sm-6 col-md-3 calendar-item');
        var $table = this.createTable(i);
        //var $table = this.createTable(row, column, this.dayNames, this.monthName[i]);
        li.append($table);
        this.$calendarWrapper.append(li);
    }
};

app.Calendar.prototype.appendDaysHeaders = function ($container) {
    var $td;
    for (var i = 0; i < this.DAYS; i++) {
        $td = $("<td/>").addClass('pn-calendar-header-day');
        $td.text(this.dayNames[i]);
        $container.append($td);
    }
};

app.Calendar.prototype.setDates = function () {

    /*
     TODO metoda ta moze przyjac date lub tablice dat w formacie yyyy-mm-dd i na podstawie tego kalendarz powinien mi zaznaczyc ta date/daty
     */

};

app.Calendar.prototype.getSelectedDates = function () {

    /**
     TODO metoda niech zwraca tablice zaznaczonych dat w formacie yyyy-mm-dd
     */
};


app.Calendar.prototype.appendDays = function ($container, monthIndex) {

    var daysInMonth = this.getDaysInMonth(monthIndex + 1, this.currentYear);
    console.log((monthIndex + 1) + 'miesiac zaczyna sie od ', this.firstDayInMonth(monthIndex));

    for (var i = 0; i < this.ROWS; i++) {
        var $row = $("<tr/>");
        //TODO dodaj dni, musisz znalezc index dnia dla 1 dnia kazdego miesiaca, w parametrze ta metoda przyjmuje monthIndex 0 - styczen, 1- luty itd..
        this.createDays($row, monthIndex);
        //for (var j = 0; j < this.DAYS; j++) {
        //    var $cell = $('<td/>').addClass('pn-calendar-day');
        //    $row.append($cell.text(j));
        //}
        $container.append($row);
    }
};
app.Calendar.prototype.firstDayInMonth = function (monthIndex) {
    var newDate = new Date(this.currentYear, monthIndex, 1);
    return newDate.getDay();
};

app.Calendar.prototype.createDays = function ($container, monthIndex) {
    var daysInMonth = this.getDaysInMonth(monthIndex + 1, this.currentYear);
    for (var i = 0; i < this.DAYS; i++) {
        var $cell = $('<td/>').addClass('pn-calendar-day').text(i + 1);
        $container.append($cell);
    }
};

app.Calendar.prototype.addText = function (monthIndex) {
    var daysInMonth = this.getDaysInMonth(monthIndex + 1, this.currentYear);
    for(var i = 0; i < monthIndex; i++){
        for(var j = 0 ; j < daysInMonth; j++) {
            $('.pn-calendar-day').text(j);
        }
    }

};
app.Calendar.prototype.createTable = function (monthIndex) {
    var $tableHead = $("<thead>"),
        $calendarHeader = $("<tr>").addClass('pn-calendar-header'),
        $headerMonth = $("<th>").addClass('pn-calendar-header-month').attr('colspan', 7).text(this.monthName[monthIndex] + ' ' + this.currentYear),
        $subHeader = $("<tr>").addClass('pn-calendar-subheader'),
        $table = $("<table/>").addClass('pn-calendar');

    $calendarHeader.append($headerMonth);
    this.appendDaysHeaders($subHeader);
    $tableHead.append($calendarHeader, $subHeader);
    $table.append($tableHead);
    this.appendDays($table, monthIndex);

    return $table;
};

app.Calendar.prototype.createArrows = function () {
    var arrowContainer = $('<div>').addClass('calendar-nav-arrow'),
        self = this,
        leftArrow = $('<div>').addClass('glyphicon glyphicon-chevron-left calendar-nav-left-arrow'),
        rightArrow = $('<div>').addClass('glyphicon glyphicon-chevron-right calendar-nav-right-arrow');
    this.$calendarContainer.append(arrowContainer);

    arrowContainer.append(leftArrow, rightArrow);
    leftArrow.on('click', function () {

        self.currentYear++;
        console.log(self.currentYear);
    });
    rightArrow.on('click', function () {
        self.currentYear--;
        console.log(self.currentYear);
    });
};
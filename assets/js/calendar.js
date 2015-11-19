'use strict';
var app = app || {};
app.Calendar = function ($calendarContainer, monthNames, dayNames, counter) {
    this.$calendarContainer = $calendarContainer;

    this.monthName = monthNames;
    this.dayNames = dayNames;
    this.DAYS = 7;
    this.MONTHS = 12;
    this.ROWS = 5;
    this.currentYear = new Date().getFullYear();
    this.dayInit = 1;

    this.getDaysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    }
};

app.Calendar.prototype.createCalendars = function () {
    var $clear = $('<div>').addClass('clear');
    this.$calendarWrapper = $('<div>').addClass('calendar-wrapper');

    for (var i = 0; i < this.MONTHS; i++) {
        var li = $('<div>').addClass('row col-xs-12 col-sm-6 col-md-3 calendar-item');
        var $table = this.createTable(i);
        //var $table = this.createTable(row, column, this.dayNames, this.monthName[i]);
        li.append($table);
        this.$calendarWrapper.append(li);
    }
    this.$calendarContainer.append(this.createCurrentYearHeader(),$clear, this.$calendarWrapper);
    //this.createArrows();
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

    for (var i = 0; i < this.ROWS; i++) {
        var $row = $("<tr/>"),
        //TODO dodaj dni, musisz znalezc index dnia dla 1 dnia kazdego miesiaca, w parametrze ta metoda przyjmuje monthIndex 0 - styczen, 1- luty itd..
            firstDay = this.firstDayInMonth(monthIndex);
        this.createDays($row, monthIndex, firstDay, i);
        $container.append($row);
    }
    this.dayInit = 1;
};
app.Calendar.prototype.firstDayInMonth = function (monthIndex) {
    var newDate = new Date(this.currentYear, monthIndex, 1),
        firstDay = newDate.getDay();
    if (firstDay === 0) {
        firstDay = 6;
    } else {
        firstDay -= 1;
    }
    return firstDay;
};

app.Calendar.prototype.createDays = function ($container, monthIndex, firstDay, rowIndex) {
    var daysInMonth = this.getDaysInMonth(monthIndex + 1, this.currentYear),
        $cell = '';
    var currentDate = this.getCurrentDate();
    for (var i = 0; i < this.DAYS; i++) {
        if (rowIndex === 0 && i < firstDay) {
            $cell = $('<td/>').addClass('pn-calendar-day').html('&nbsp;');
        } else {
            if (this.dayInit <= daysInMonth) {
                if (this.currentYear === currentDate.currentYear && monthIndex === currentDate.currentMonth && this.dayInit === currentDate.currentDay) {
                    $cell = $('<td/>').addClass('pn-calendar-day current-date').text(this.dayInit++);
                } else {
                    $cell = $('<td/>').addClass('pn-calendar-day').text(this.dayInit++);
                }
            } else {
                $cell = $('<td/>').addClass('pn-calendar-day').html('&nbsp;');
            }
        }
        $container.append($cell);
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

app.Calendar.prototype.createArrows = function ($container) {
    var self = this,
        leftArrow = $('<div>').addClass('glyphicon glyphicon-chevron-left calendar-nav-left-arrow'),
        rightArrow = $('<div>').addClass('glyphicon glyphicon-chevron-right calendar-nav-right-arrow');
    $container.append(leftArrow,rightArrow);

    leftArrow.on('click', function () {
        var currentDate = self.getCurrentDate();
        var year = currentDate.currentYear;
        if(year === self.currentYear){
            console.log('I am current, stop me', year, self.currentYear, this);
            $(this).attr('title', 'Cannot chose past year');
        } else {
        self.currentYear--;
        self.$calendarContainer.empty();
        self.createCalendars();
        }
    });
    rightArrow.on('click', function () {
        self.currentYear++;
        self.$calendarContainer.empty();
        self.createCalendars();
    });
};

app.Calendar.prototype.createCurrentYearHeader = function () {
    var $calendarHeader = $('<div>').addClass('calendar-controls col-xs-12 col-sm-6 col-md-12');
    var currentYear = $('<div>').addClass('current-year-header').text(this.currentYear);
    this.createArrows($calendarHeader);
    $calendarHeader.append(currentYear);
    return $calendarHeader;
};
app.Calendar.prototype.getCurrentDate = function () {
    var currentDate = new Date(),
        currentYear = currentDate.getFullYear(),
        currentMonth = currentDate.getMonth(),
        currentDay = currentDate.getDate();
    return {
        currentYear: currentYear,
        currentMonth: currentMonth,
        currentDay: currentDay
    }
};

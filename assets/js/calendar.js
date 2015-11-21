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
    this.timeDuration = [];
    this.getDaysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    }
};

app.Calendar.prototype.createCalendars = function () {
    var $clear = $('<div>').addClass('clear'),
        $calendarWrapper = $('<div>').addClass('calendar-wrapper row');

    for (var i = 0; i < this.MONTHS; i++) {
        var li = $('<div>').addClass('col-xs-12 col-sm-6 col-md-3 calendar-item');
        var $table = this.createTable(i);
        li.append($table);
        $calendarWrapper.append(li);
    }
    this.$calendarContainer.append(this.createCurrentYearHeader(), $clear, $calendarWrapper);
    this.markPastDays($calendarWrapper);
    this.getSelectedDates($calendarWrapper);
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
                    this.setDataDateAttribute($cell, currentDate.currentYear, (currentDate.currentMonth + 1), currentDate.currentDay);
                } else {
                    $cell = $('<td/>').addClass('pn-calendar-day');
                    this.setDataDateAttribute($cell, this.currentYear, (monthIndex + 1), this.dayInit);
                    $cell.text(this.dayInit++);
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
    $container.append(leftArrow, rightArrow);
    var currentDate = self.getCurrentDate();
    var year = currentDate.currentYear;
    if (year === self.currentYear) {
        leftArrow.addClass('blocked-arrow');
    }

    leftArrow.on('click', function () {
        if (year === self.currentYear) {
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
    var $calendarHeader = $('<div>').addClass('calendar-controls');
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

app.Calendar.prototype.setDataDateAttribute = function (element, year, month, day) {
    if (day < 10 && month >= 10) {
        day = '0' + day;
    }
    else if (day < 10 && month < 10) {
        day = '0' + day;
        month = '0' + month;
    }
    else if (day >= 10 && month < 10) {
        month = '0' + month;
    }
    return element.attr('data-date', year + '-' + month + '-' + day);
};

app.Calendar.prototype.markPastDays = function (element) {
    var $days = element.find('.pn-calendar-day'),
        currentDate = this.getCurrentDate(),
        formattedDate = currentDate.currentYear + '-' + (currentDate.currentMonth + 1) + '-' + currentDate.currentDay;
    $days.each(function () {
        if ($(this).attr('data-date')) {
            if ($(this).attr('data-date') < formattedDate) {
                console.log(formattedDate);
                $(this).addClass('past-date').attr('disabled', true);
            }
        }
    })
};

app.Calendar.prototype.getSelectedDates = function (element) {
    var self = this;


  element.find('.pn-calendar-day').on("contextmenu", function(evt) {evt.preventDefault();});

  element.find('.pn-calendar-day').mousedown(function (e) {
        var chosenDay = $(this).attr('data-date');
        if (e.which === 3 && self.timeDuration.length < 2) {
            self.timeDuration.push(chosenDay);
            self.timeDuration.sort();
            self.markSelectedDates(element);
        }
        else if (e.which === 3 && self.timeDuration.length === 2) {
            self.timeDuration = [];
            self.clearSelectedDates(element);
            self.timeDuration.push(chosenDay);
            self.markSelectedDates(element);
        }
    });
};
app.Calendar.prototype.markSelectedDates = function (element) {
    var selectedDates = this.timeDuration;
    var $days = element.find('.pn-calendar-day');
    $days.each(function () {
        if ($(this).attr('data-date')) {
            $(this).filter(function () {
                if ($(this).attr('data-date') >= selectedDates[0] && $(this).attr('data-date') <= selectedDates[1]) {
                    $(this).addClass('pn-calendar-selected');
                }
                else if ($(this).attr('data-date') === selectedDates[0]) {
                  $(this).addClass('pn-calendar-selected');
                }
            });
        }
    })
};

app.Calendar.prototype.clearSelectedDates = function (element) {
    var $days = element.find('.pn-calendar-day');
    $days.removeClass('pn-calendar-selected');
};

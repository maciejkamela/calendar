'use strict';
var app = app || {};
app.Calendar = function (onDateSelect, onError, $calendarContainer, monthNames, dayNames) {

    var self = this;
    this.$calendarContainer = $calendarContainer;
    this.monthName = monthNames;
    this.dayNames = dayNames;
    this.onDateSelect = onDateSelect;
    this.onError = onError;
    this.DAYS = 7;
    this.MONTHS = 12;
    this.ROWS = 6;
    this.currentYear = new Date().getFullYear();
    this.dayInit = 1;
    this.timeDuration = [];
    this.selectedDates = [];
    this.dateSpanCollection = [];
    this.lastlyChosenDataPickerOption = [];
    this.getDaysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    };

    $(document).click(function (e) {
        if (!$(e.target).hasClass('pn-calendar-day') && e.target !== self.$datePicker[0] && !$(e.target).parents('.data-picker').length) {
            self.$datePicker.hide();
        }
    });
};
/**
 *  Creating whole calendar
 */
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
    this.pickDate($calendarWrapper);
    this.createDataPicker();
    this.dataPickerDayClick();
    this.dataPickerPeriodClick();
};
/**
 * Creating the weeks
 */
app.Calendar.prototype.appendDaysHeaders = function ($container) {
    var $td;
    for (var i = 0; i < this.DAYS; i++) {
        $td = $("<td/>").addClass('pn-calendar-header-day');
        $td.text(this.dayNames[i]);
        $container.append($td);
    }
};
/**
 * Appending days to the calendar
 * @param $container
 * @param monthIndex
 */
app.Calendar.prototype.appendDays = function ($container, monthIndex) {
    for (var i = 0; i < this.ROWS; i++) {
        var $row = $("<tr/>"),
            firstDay = this.firstDayInMonth(monthIndex);
        this.createDays($row, monthIndex, firstDay, i);
        $container.append($row);
    }
    this.dayInit = 1;
};
/**
 * Calculating first day of the month
 * @param monthIndex
 * @returns {number}
 */
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
/**
 * Filling in calendars with proper days
 * @param $container
 * @param monthIndex
 * @param firstDay
 * @param rowIndex
 */
app.Calendar.prototype.createDays = function ($container, monthIndex, firstDay, rowIndex) {
    var daysInMonth = this.getDaysInMonth(monthIndex + 1, this.currentYear),
        $cell = '',
        currentDate = this.getCurrentDate();
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
/**
 * Creating table for storing calendar
 * @param monthIndex
 * @returns {*|jQuery}
 */
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

/**
 * Creating switch-year arrows and appending navigation actions
 * @param $container
 */
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
        var refreshedDates = self.collectSelectedDates();
        self.currentYear--;
        self.$calendarContainer.empty();
        self.createCalendars();
        for (var i = 0; i < refreshedDates.length; i++) {
            $('.calendar-wrapper').find("[data-date ='" + refreshedDates[i] + "']").addClass('pn-calendar-selected');
        }
        self.markSelectedDates();
    });
    rightArrow.on('click', function () {
        var refreshedDates = self.collectSelectedDates();
        self.currentYear++;
        self.$calendarContainer.empty();
        self.createCalendars();
        for (var i = 0; i < refreshedDates.length; i++) {
            $('.calendar-wrapper').find("[data-date ='" + refreshedDates[i] + "']").addClass('pn-calendar-selected');
        }
        self.markSelectedDates();
    });
};
/**
 * Creating year header which indicates displayed year
 * @returns {*|jQuery}
 */
app.Calendar.prototype.createCurrentYearHeader = function () {
    var $calendarHeader = $('<div>').addClass('calendar-controls'),
        currentYear = $('<div>').addClass('current-year-header').text(this.currentYear);
    this.createArrows($calendarHeader);
    $calendarHeader.append(currentYear);
    return $calendarHeader;
};
/**
 * Calculate current date
 * @returns {{currentYear: number, currentMonth: number, currentDay: number}}
 */
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
/**
 * Setting data-date attribute
 * @param element
 * @param year
 * @param month
 * @param day
 * @returns {*}
 */
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
/**
 * Mark days older than current date
 * @param element
 */
app.Calendar.prototype.markPastDays = function (element) {
    var $days = element.find('.pn-calendar-day'),
        currentDate = this.getCurrentDate(),
        formattedDate = currentDate.currentYear + '-' + this.addLeadingZero(currentDate.currentMonth + 1) + '-' + this.addLeadingZero(currentDate.currentDay);
    $days.each(function () {
        if ($(this).attr('data-date')) {
            if ($(this).attr('data-date') < formattedDate) {
                $(this).addClass('past-date').attr('disabled', true);
            }
        }
    })
};

/**
 * Adding leading zero to days lower than 10
 * @param i
 * @returns {*}
 */
app.Calendar.prototype.addLeadingZero = function (i) {
    return (i < 10) ? '0' + i : i;
};
/**
 * Marking selected dates
 */
app.Calendar.prototype.markSelectedDates = function () {
    var selectedDates = this.timeDuration;
    var $days = $('.calendar-wrapper').find('.pn-calendar-day');
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
    });
};
/**
 * Storing all selected periods
 */
app.Calendar.prototype.addItemToDateSpanCollection = function () {
    var timeDuration = this.timeDuration;
    this.dateSpanCollection.push({'minDate': timeDuration[0], 'maxDate': timeDuration[1]});

};
/**
 * Collecting selected dates - needed for switching among years and updating view
 * @returns {Array|*}
 */
app.Calendar.prototype.collectSelectedDates = function () {
    var $days = $('.calendar-wrapper').find('.pn-calendar-selected'),
        self = this;
    $days.each(function () {
        self.selectedDates.push($(this).attr('data-date'));
    });
    this.selectedDates = this.eliminateDuplicates(this.selectedDates);
    return this.selectedDates;
};
/**
 * Eliminate chosen dates duplicates
 * @param arr
 * @returns {Array}
 */
app.Calendar.prototype.eliminateDuplicates = function (arr) {
    var i,
        itemsAmount = arr.length,
        uniqueItems = [];
    for (i = 0; i < itemsAmount; i++) {
        if (uniqueItems.indexOf(arr[i]) === -1)
            uniqueItems.push(arr[i]);
    }
    return uniqueItems;
};
/**
 * Pick and mark selected day|period and display date-picker
 * @param element
 */
app.Calendar.prototype.pickDate = function (element) {
    var self = this;
    element.find('.pn-calendar-day').on('click', function (e) {
        var scrollLeft = (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft,
            scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop,
            margin = 5;

        var chosenDay = $(this).attr('data-date');
        self.timeDuration.unshift(chosenDay);
        if (self.lastlyChosenDataPickerOption.length === 0) {
            self.$datePicker.css({left: e.clientX + scrollLeft + margin, top: e.clientY + scrollTop + margin}).show();
        }
        else if (self.lastlyChosenDataPickerOption[0] === 'Period') {
            if (self.timeDuration.length >= 2) {
                var selectedDay = self.timeDuration.splice(2);
                self.addItemToDateSpanCollection();
                self.timeDuration.sort();
                self.markSelectedDates();
                self.lastlyChosenDataPickerOption = [];
                self.timeDuration = [];
                if (typeof self.onDateSelect === 'function') {
                    return self.onDateSelect(selectedDay);
                }
            }
        }
    })
};
/**
 * Validate which option was chosen from date-picker and store this information
 * @param event
 */
app.Calendar.prototype.handler = function (event) {
    var target = $(event.currentTarget);
    if (target.is('div.data-picker-option.day-option')) {
        this.lastlyChosenDataPickerOption.push('Day');
    }
    else if (target.is('div.data-picker-option.period-option')) {
        this.lastlyChosenDataPickerOption.push('Period');
    }
};
/**
 * Mark selected day after choosing day from date-picker
 * @return callback with selected day
 */
app.Calendar.prototype.dataPickerDayClick = function () {
    var self = this;
    $('.day-option').on('click', function () {
        var selectedDay = self.timeDuration[0];
        $('.calendar-wrapper').find("[data-date ='" + selectedDay + "']").addClass('pn-calendar-selected');
        $('.data-picker').fadeOut('fast');
        self.timeDuration = [];
        self.lastlyChosenDataPickerOption = [];
        if (typeof self.onDateSelect === 'function') {
            return self.onDateSelect(selectedDay);
        }
    })
};
/**
 * Mark selected day after choosing period from date-picker and store this information in timeDuration
 */
app.Calendar.prototype.dataPickerPeriodClick = function () {
    var self = this;
    $('.period-option').on('click', function (event) {
        var selectedDay = self.timeDuration[0];
        $('.calendar-wrapper').find("[data-date ='" + selectedDay + "']").addClass('pn-calendar-selected');
        self.handler(event);
        $('.data-picker').fadeOut('fast');
    })
};
/**
 * Create date-picker
 */
app.Calendar.prototype.createDataPicker = function () {
    var $dataPicker = $('<div>').addClass('data-picker'),
        $dataPickerDayOption = $('<div>').addClass('data-picker-option day-option').text('Dzień'),
        $dataPickerDay = $('<i>').addClass('fa fa-calendar-check-o data-picker-day'),
        $dataPickerPeriodOption = $('<div>').addClass('data-picker-option period-option').text('Przedział'),
        $dataPickerPeriod = $('<i>').addClass('fa fa-calendar-times-o data-picker-period');
    $dataPickerDayOption.prepend($dataPickerDay);
    $dataPickerPeriodOption.prepend($dataPickerPeriod);
    $dataPicker.append($dataPickerDayOption, $dataPickerPeriodOption);
    this.$calendarContainer.append($dataPicker);
    this.$datePicker = $dataPicker;
};

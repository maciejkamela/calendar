'use strict';
var app = app || {};
app.Calendar = function (onDateSelect, $calendarContainer, monthNames, dayNames, counter) {
    this.$calendarContainer = $calendarContainer;

    this.monthName = monthNames;
    this.dayNames = dayNames;
    this.onDateSelect = onDateSelect;
    this.DAYS = 7;
    this.MONTHS = 12;
    this.ROWS = 5;
    this.currentYear = new Date().getFullYear();
    this.dayInit = 1;
    this.timeDuration = [];
    this.selectedDates = [];
    this.dateSpanCollection = [];
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
    //this.removeSelectedDate($calendarWrapper);
    this.pickOneDay($calendarWrapper);
    this.eraseSelectedDates('2015-12-06', '2015-12-10');
};

app.Calendar.prototype.appendDaysHeaders = function ($container) {
    var $td;
    for (var i = 0; i < this.DAYS; i++) {
        $td = $("<td/>").addClass('pn-calendar-header-day');
        $td.text(this.dayNames[i]);
        $container.append($td);
    }
};


app.Calendar.prototype.appendDays = function ($container, monthIndex) {

    var daysInMonth = this.getDaysInMonth(monthIndex + 1, this.currentYear);

    for (var i = 0; i < this.ROWS; i++) {
        var $row = $("<tr/>"),
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
            var refreshedDates = self.collectSelectedDates();
            self.currentYear--;
            self.$calendarContainer.empty();
            self.createCalendars();
            for (var i = 0; i < refreshedDates.length; i++) {
                $('.calendar-wrapper').find("[data-date ='" + refreshedDates[i] + "']").addClass('pn-calendar-selected');
            }
            self.markSelectedDates();
        }
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
                $(this).addClass('past-date').attr('disabled', true);
            }
        }
    })
};

app.Calendar.prototype.getSelectedDates = function (element) {
    var self = this;
    element.find('.pn-calendar-day').on("contextmenu", function (evt) {
        evt.preventDefault();
    });

    element.find('.pn-calendar-day').mousedown(function (e) {
        var chosenDay = $(this).attr('data-date');
        if (e.which === 3 && self.timeDuration.length < 2) {
            self.timeDuration.push(chosenDay);
            self.timeDuration.sort();
            self.markSelectedDates();
        }
        else if (e.which === 3) {
            self.addItemToDateSpanCollection();
            console.log('duration', self.dateSpanCollection);
            self.timeDuration = [];
            //self.clearAllSelectedDates(element);
            self.timeDuration.push(chosenDay);
            self.timeDuration.sort();
            self.markSelectedDates();
        }
    });
};
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
app.Calendar.prototype.addItemToDateSpanCollection = function () {
    var timeDuration = this.timeDuration;
    this.dateSpanCollection.push({'minDate':timeDuration[0], 'maxDate':timeDuration[1]});

};

app.Calendar.prototype.clearAllSelectedDates = function (element) {
    var $days = element.find('.pn-calendar-day');
    $days.removeClass('pn-calendar-selected');
};

app.Calendar.prototype.collectSelectedDates = function () {
    var $days = $('.calendar-wrapper').find('.pn-calendar-selected'),
        self = this;
    $days.each(function () {
        self.selectedDates.push($(this).attr('data-date'));
    });
    this.selectedDates = this.eliminateDuplicates(this.selectedDates);
    return this.selectedDates;
};

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

//app.Calendar.prototype.removeSelectedDate = function (element) {
//    element.find('.pn-calendar-day').on('click', function() {
//        if($(this).hasClass('pn-calendar-selected')){
//            $(this).removeClass('pn-calendar-selected')
//        }
//        console.log('aaaaaaaa');
//    })
//};

app.Calendar.prototype.pickOneDay = function (element) {
    var self = this;
    element.find('.pn-calendar-day').on('click', function () {
        $(this).addClass('pn-calendar-selected');
        if (typeof self.onDateSelect === 'function') {
            //console.log(self.timeDuration, self.selectedDates, $(this).attr('data-date'), self.onDateSelect($(this).attr('data-date')));
            return self.onDateSelect($(this).attr('data-date'));
        }
    })
};

app.Calendar.prototype.eraseSelectedDates = function (minDate, maxDate) {
    var argumentsAmount = arguments.length,
        self = this;
    $('.test').on('click', function () {
        var $wrapper = $('.calendar-wrapper'),
            $days = $wrapper.find('.pn-calendar-day'),
            min = $wrapper.find("[data-date ='" + minDate + "']");
        if (min.hasClass('pn-calendar-selected') && argumentsAmount === 1) {
            min.removeClass('pn-calendar-selected')
        } else {
            $days.each(function () {
                if ($(this).attr('data-date')) {
                    $(this).filter(function () {
                        if ($(this).attr('data-date') >= minDate && $(this).attr('data-date') <= maxDate) {
                            $(this).removeClass('pn-calendar-selected');
                        }
                    });
                    //self.selectedDates.splice($.inArray($(this).attr('data-date'), self.selectedDates), 1)
                }
            })
        }
        self.collectSelectedDates();
    })
};

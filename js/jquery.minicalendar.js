/*
 * jQuery Mini Calendar
 * https://github.com/k-ishiwata/jQuery.MiniCalendar
 *
 * Copyright 2016, k.ishiwata
 * http://www.webopixel.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

;
(function ($) {
    $.wop = $.wop || {};
    $.wop.miniCalendar = function (targets, option) {
        this.opts = $.extend({}, $.wop.miniCalendar.defaults, option);
        this.ele = targets;

        // jsonファイルから読み込んだデータを入れる変数
        this.events = {};
        this.date = new Date();
        this.month = "";
        this.year = "";
        this.holiday = "";

        // jsonファイルから読み込む
        this.loadData();

        //表示する年月
        this.year = this.year || new Date().getFullYear();
        this.month = this.month || new Date().getMonth() + 1;

        this.createFrame();
        this.printType(this.year, this.month);
        // 取得したイベントを表示
        this.setEvent();
        this.setEventSummary();
    };
    $.wop.miniCalendar.prototype = {

        /**
         * 枠を作成
         */
        createFrame: function () {
            this.ele.append('<div class="calendar-head"><p class="calendar-year-month"></p></div>');

            var outText = '<table><thead><tr>';
            for (var i = 0; i < this.opts.weekType.length; i++) {
                if (i === 0) {
                    outText += '<th class="calendar-sun">';
                } else if (i === this.opts.weekType.length - 1) {
                    outText += '<th class="calendar-sat">';
                } else {
                    outText += '<th>';
                }

                outText += this.opts.weekType[i] + '</th>';
            }
            outText += '</thead><tbody></tbody></table>';
            this.ele.find('.calendar-head').after(outText);
        },

        /**
         * 日付・曜日の配置
         */
        printType: function (thisYear, thisMonth) {

            $(this.ele).find('.calendar-year-month').html(thisYear + '年' + thisMonth　 + '月の<br class="hidden spBlock">イベントカレンダー');
            $("#thisMonth").text(thisYear + '年' + thisMonth　 + '月')

            var thisDate = new Date(thisYear, thisMonth - 1, 1);

            // 開始の曜日
            var startWeek = thisDate.getDay();

            var lastday = new Date(thisYear, thisMonth, 0).getDate();
            // 縦の数
            //var rowMax = Math.ceil((lastday + (startWeek+1)) / 7);
            var rowMax = Math.ceil((lastday + startWeek) / 7);

            var outText = '<tr>';
            var countDate = 1;
            // 最初の空白を出力
            for (var i = 0; i < startWeek; i++) {
                outText += '<td class="calendar-none">&nbsp;</td>';
            }
            for (var row = 0; row < rowMax; row++) {
                // 最初の行は曜日の最初から
                if (row == 0) {
                    for (var col = startWeek; col < 7; col++) {
                        outText += printTD(countDate, col);
                        countDate++;
                    }
                } else {
                    // 2行目から
                    outText += '<tr>';
                    for (var col = 0; col < 7; col++) {
                        if (lastday >= countDate) {
                            outText += printTD(countDate, col);
                        } else {
                            outText += '<td class="calendar-none">&nbsp;</td>';
                        }
                        countDate++;
                    }
                }
                outText += '</tr>';
            }
            $(this.ele).find('tbody').html(outText);

            function printTD(count, col) {
                var dayText = "";
                var tmpId = ' id="calender-id' + count + '"';
                // 曜日classを割り当てる
                if (col === 0)
                    tmpId += ' class="calendar-sun"';
                if (col === 6)
                    tmpId += ' class="calendar-sat"';
                return '<td' + tmpId + '><i class="calendar-day-number">' + count + '</i><div class="calendar-labels">' + dayText + '</div></td>';
            }

            //今日の日付をマーク
            var toDay = new Date();
            if (thisYear === toDay.getFullYear()) {
                if (thisMonth === (toDay.getMonth() + 1)) {
                    var dateID = 'calender-id' + toDay.getDate();
                    $(this.ele).find('#' + dateID).addClass('calendar-today');
                }
            }
        },
        /**
         * イベントの表示
         */
        setEvent: function () {
            for (var i = 0; i < this.events.length; i++) {
                var date = this.events[i].day;
                var startDate = this.events[i].startDay;
                var endDate = this.events[i].endDay;
                if (startDate === undefined) {
                    startDate = date;
                    endDate = date;
                }
                // typeがある場合classを付与
                var type = "";
                if (this.events[i].type) {
                    type = '-' + this.events[i].type;
                }
                for (var j = Number(startDate); j <= Number(endDate); j++) {
                    var prefix = "", suffix = "";
                    if (j === Number(startDate)) {
                        prefix = (this.events[i].startPrefix !== undefined) ? this.events[i].startPrefix : "";
                        suffix = (this.events[i].startSuffix !== undefined) ? this.events[i].startSuffix : "";
                    } else if (j === Number(endDate)) {
                        prefix = (this.events[i].endPrefix !== undefined) ? this.events[i].endPrefix : "";
                        suffix = (this.events[i].endSuffix !== undefined) ? this.events[i].endSuffix : "";
                    }
                    if (j === Number(startDate) || j === Number(endDate)) {
                        $(this.ele).find('#calender-id' + j + ' .calendar-labels')
                                .append('<span class="calender-label' + type + '">' + prefix + this.events[i].title + suffix + '</span>');
                    }
                }
            }

            // 休日
            for (var i = 0; i < this.holiday.length; i++) {
                $(this.ele).find('#calender-id' + this.holiday[i]).addClass('calendar-holiday');
            }
        },
        setEventSummary: function () {
            var toDay = new Date();
            var today = Number(toDay.getDate());
            var startList = [];
            var nowList = [];
            var endList = []
            var tmpEvent = [];
            for (var i = 0; i < this.events.length; i++) {
                tmpEvent.push(this.events[i]);
            }
            tmpEvent.sort((a, b) => {
                if (a.endDay > b.endDay) {
                    // 基本は使用BP降順
                    return 1;
                } else if (a.startDay > b.startDay) {
                    return -1;
                } else if (a.title > b.title) {
                    return -1;
                }
                return 1;
            });

            for (var i = 0; i < tmpEvent.length; i++) {
                var date = tmpEvent[i].day;
                var startDate = tmpEvent[i].startDay;
                var endDate = tmpEvent[i].endDay;
                if (startDate === undefined) {
                    startDate = date;
                    endDate = date;
                }
                let text = tmpEvent[i].title.replace(/<br.*>/, "");
                text = text.replace("[", "<span class='hidden pcBlock'>[").replace("]", "]</span> ");
                let pre = `<div class='d-flex justify-content-between'><div>${text}</div>`;
                if (today < startDate) {
                    // 開映前kaieimae
                    startList.push(`${pre}<div>開始まであと${(startDate - today)}日<span class='hidden pcBlock'> (${startDate}日開始)</span></div></div>`);
                } else if (today <= endDate) {
                    // 開催中前
                    nowList.push(`${pre}<div><span class='hidden pcBlock'> 終了まで</span>あと${(endDate - today)}日<span class='hidden pcBlock'> (${endDate}日終了)</span></div></div>`);
                } else {
                    // 終了前
                    endList.push(`${pre}<div><span class='hidden pcBlock'>${endDate}日に終了しました</span></div></div>`);
                }
            }
            if (nowList.length > 0) {
                $("#event_summary").append("<p class='calendar-year-month' style='font-size:14px;'>開催中のイベント</p>");
                $("#event_summary").append(nowList.join(""));
            }
            if (startList.length > 0) {
                $("#event_summary").append("<p class='calendar-year-month' style='font-size:14px;'>開催前のイベント</p>");
                $("#event_summary").append(startList.join(""));
            }
            if (endList.length > 0) {
                $("#event_summary").append("<p class='calendar-year-month' style='font-size:14px;'>終了したイベント</p>");
                $("#event_summary").append(endList.join("<br>"));
            }

        },

        /**
         * jsonファイルからデータを読み込む
         */
        loadData: function () {
            var self = this;
            $.ajax({
                type: "GET",
                url: self.opts.jsonData,
                dataType: "json",
                async: false,
                success: function (data) {
                    self.events = data.event;
                    self.year = data.year;
                    self.month = data.month;
                    self.date = new Date(data.date);
                    self.holiday = data.holiday;
                }
            });
        }
    };

    $.wop.miniCalendar.defaults = {
        weekType: ["日", "月", "火", "水", "木", "金", "土"],
        jsonData: './js/event.json'
    };
    $.fn.miniCalendar = function (option) {
        option = option || {};
        var api = new $.wop.miniCalendar(this, option);
        return option.api ? api : this;
    };
})(jQuery);
define(['plugins/dialog', '../../services/connector'],
    function (dialog, connector) {
        var alarmDetails = function (settings, alarm, onlineAlarmsMode) {
            var self = this;
            self.connector = new connector();
            self.alarm = ko.observable(alarm);
            self.alarmId = ko.unwrap(self.alarm().AlarmID);
            self.pollTimer = setTimeout(_.bind(self.pollAlarm, self), 500);
            // Determines if the dialog was called for an online alarms
            self.onlineAlarmsMode = onlineAlarmsMode;
            self.settings = settings;
            self.commentAckAlarm = ko.observable();
            self.dateTimeFormat = self.settings.dateTimeFormat || "";
        };

        alarmDetails.prototype = {

            pollAlarm: function () {                    
                var self = this;
                clearTimeout(self.pollTimer);

                if (self.onlineAlarmsMode === false) return;

                self.connector.getAlarms([self.alarmId], self.connector.currentLanguageId())
                    .then(function(data) {
                        var alarms = self.appendAlarmFunctionality(data.Alarms);
                        self.alarm(alarms[0]);
                        self.pollTimer = setTimeout(_.bind(self.pollAlarm, self), 500);
                    });
            },

            close: function () {
                var self = this;
                clearTimeout(this.pollTimer);
                dialog.close(self, '');
            },

            appendAlarmFunctionality: function (alarms) {
                var self = this;

                return _.map(alarms, function (alarm) {

                    alarm.background = ko.pureComputed(function () {
                        if (alarm.DateOff && alarm.DateAck) {
                            return self.settings.acknowledgedAndGoneAlarmBackground;
                        }
                        else if (alarm.DateOff) {
                            return self.settings.inactiveAlarmBackground;
                        }
                        else if (alarm.DateAck) {
                            return self.settings.acknowledgedAlarmBackground;
                        }

                        return self.settings.activeAlarmBackground;
                    });

                    alarm.foreground = ko.pureComputed(function () {
                        if (alarm.DateOff && alarm.DateAck) {
                            return self.settings.acknowledgedAndGoneAlarmForeground;
                        }
                        else if (alarm.DateOff) {
                            return self.settings.inactiveAlarmForeground;
                        }
                        else if (alarm.DateAck) {
                            return self.settings.acknowledgedAlarmForeground;
                        }

                        return self.settings.activeAlarmForeground;
                    });

                    return alarm;
                });
            }
        };

        return alarmDetails;
    });
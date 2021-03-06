var sunAngleUtils = {
    firstSunAngles: { 'predawn': -1 , 'morningStart': 5, 'morningStop': 25, 'highStart': 40},
    lastSunAngles: { 'sunset': -1, 'eveningStop': 5, 'eveningStart': 25, 'highStop': 40 },

    getShortTimeString: function(theDate) {
        return theDate.toString("HH:mm");
    },

    getShortDateString: function(theDate) {
        return theDate.toString("MMM dd, yyyy");
    },

    getJulianDate: function(y, m, d, u) {
        return (367 * y) - Math.floor((7/4) * (Math.floor((m + 9) / 12) + y)) + Math.floor(275 * m / 9) + d - 730531.5 + (u / 24);
    },

    // get the sun position (altitude and azimuth) in degrees for the given latitude, longitude, and date
    getSunPositionInDegrees: function(lg, la, theDate) {
        // TODO: don't use with (Math)

        var uu = theDate.getUTCHours() + theDate.getUTCMinutes() / 60.0;
        var jj = this.getJulianDate(theDate.getFullYear(), theDate.getMonth() + 1, theDate.getDate(), uu);

        var T = jj / 36525;
        var k = Math.PI / 180.0;
        var M=357.5291 + 35999.0503 * T - 0.0001559 * T*T - 0.00000045 * T*T*T

        M = M % 360
        
        var Lo = 280.46645 + 36000.76983 * T + 0.0003032 * T*T
        
        Lo = Lo % 360
        
        var DL = (1.9146 - 0.004817 * T - 0.000014 * T*T) * Math.sin(k * M) + (0.019993 - 0.000101 * T) * Math.sin(k * 2 * M) + 0.00029 * Math.sin(k * 3 * M)
        var L = Lo + DL
        var eps = 23.43999 - 0.013 * T
        var delta = (1 / k) * Math.asin(Math.sin(L * k) * Math.sin(eps * k))
        var RA = (1 / k) * Math.atan2(Math.cos(eps * k) * Math.sin(L* k ),Math.cos(L * k))
        
        RA = (RA + 360) % 360
        
        // compute sidearal time
        var GMST=280.46061837 + 360.98564736629 * jj + 0.000387933 * T*T - T*T*T / 38710000
        
        GMST=(GMST+360) % 360
        
        var LMST=GMST+lg
        var H=LMST-RA
        var eqt=(Lo-RA)*4

        var azm = (1 / k) * Math.atan2(-Math.sin(H * k), Math.cos(la * k) * Math.tan(delta * k)- Math.sin(la*k)* Math.cos(H*k))            
        azm = (azm + 360) % 360

        var alt = (1 / k) * Math.asin(Math.sin(la * k) * Math.sin(delta*k) + Math.cos(la*k) * Math.cos(delta*k) * Math.cos(H*k))

        return {'altitude': alt, 'azimuth': azm}        
    },

    // returns the first time when the sun goes above the given angle
    // NEED ONLY be called when location changes or once per day -- does not need to be called as time changes within a day
    getLightTimes: function(longitude, latitude, theDate) {
        var listOfTimes = {};
        var firstAngles = new Array();
        var firstNames = new Array();
        var lowestAltitude = 90;
        var highestAltitude = -90;
        var highestAzimuth = 0;

        for (key in this.firstSunAngles) {
            firstAngles.push(this.firstSunAngles[key]);
            firstNames.push(key);
        }   

        for (var hours = 0; hours < 24; hours++) {
            for (var minutes = 0; minutes < 60; minutes++) {
                var tempDate = new Date(theDate);
                tempDate.setHours(hours);
                tempDate.setMinutes(minutes);

                var tempSunPosition = this.getSunPositionInDegrees(longitude, latitude, tempDate);

                if (tempSunPosition.altitude > highestAltitude) {
                    highestAltitude = tempSunPosition.altitude;
                    highestAzimuth = tempSunPosition.azimuth;
                }

                if (tempSunPosition.altitude < lowestAltitude) {
                    lowestAltitude = tempSunPosition.altitude;
                }

                if (tempSunPosition.altitude >= firstAngles[0]) {
                    listOfTimes[firstNames[0]] = tempDate;
                    firstAngles.shift();
                    firstNames.shift();
                }

                if (firstAngles.length == 0) {
                    break;
                }
            }
        }

        var lastAngles = new Array();
        var lastNames = new Array();

        for (key in this.lastSunAngles) {
            lastAngles.push(this.lastSunAngles[key]);
            lastNames.push(key);
        }   

        for (var hours = 23; hours >= 0; hours--) {
            for (var minutes = 59; minutes >= 0; minutes--) {
                var tempDate = new Date(theDate);
                tempDate.setHours(hours);
                tempDate.setMinutes(minutes);

                var tempAltitude = this.getSunPositionInDegrees(longitude, latitude, tempDate).altitude;

                if (tempAltitude > highestAltitude) {
                    highestAltitude = tempAltitude;
                }

                if (tempAltitude < lowestAltitude) {
                    lowestAltitude = tempAltitude;
                }

                if (tempAltitude >= lastAngles[0]) {
                    listOfTimes[lastNames[0]] = tempDate;
                    lastAngles.shift();
                    lastNames.shift();
                }

                if (lastAngles.length == 0) {
                    break;
                }
            }
        }

        listOfTimes['highest'] = highestAltitude;
        listOfTimes['highestAzimuth'] = highestAzimuth;
        listOfTimes['lowest'] = lowestAltitude;

        // privateShowTimesInConsole(listOfTimes);
        return listOfTimes;
    },

    // returns my notion of how to break up the sun altitude over the course of the day
    // into either NIGHT, MEH, BEST, or HARSH.
    getLightRanges: function(highest) {
        ranges = {
            'Predawn' : ['predawn', 'morningStart', 'light-meh', 'Get Ready'],
            'Morning': ['morningStart', 'morningStop', 'light-best', 'Shoot!'],
            'Evening': ['eveningStart', 'eveningStop', 'light-best', 'Shoot!'],
            'Twilight': ['eveningStop', 'sunset', 'light-meh', 'Shoot?'],
        };

        // TODO :NIGHT!!
        // TODO: fix Midday as both meh and harsh!

        if (highest >= 40.0) { // some of the day is harsh, the rest is meh
            ranges['LateMorning'] = ['morningStop', 'highStart', 'light-meh', 'Shoot?'];
            ranges['Midday'] = ['highStart', 'highStop', 'light-harsh', 'Nap'];
            ranges['Afternoon'] = ['highStop', 'eveningStart', 'light-meh', 'Shoot?'];
        } else if (highest >= 25.0) { // all of midday is meh
            ranges['Midday'] = ['morningStop', 'eveningStart', 'light-meh', 'Nap'];
        } else { // draw these if the sun is good all day
            ranges['AllDay'] = ['morningStart', 'eveningStop', 'light-best', 'All Day Shoot!'];
        }

        return ranges;    
    },

    // returns an list of entries like [name of range, start time, stop time, CSS style / light description]
    // sorted by start time
    getSortedLightRangesAndTimes: function(lightTimes, lightRanges) {
        var sortable = [];

        for (key in lightRanges) {
            var rangeBounds = lightRanges[key];

            if (lightTimes[rangeBounds[0]] & lightTimes[rangeBounds[1]]) {
                var newEntry = [key, lightTimes[rangeBounds[0]], lightTimes[rangeBounds[1]], rangeBounds[2], rangeBounds[3]];
                sortable.push(newEntry);
            }
            else
            {
                console.log("can't find " + rangeBounds[0] + " and/or " + rangeBounds[1] + " in lighTtimes");
            }
        };

        sortable.sort(function(a, b) {
            return (a[1] > (b[1]));
        });

        return sortable;
    }
}


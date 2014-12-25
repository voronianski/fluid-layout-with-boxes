(function (global, undefined) {
    'use strict';

    global.VDUtils = VDUtils;

    /**
     * Helper methods
     */
    function VDUtils () {
        var publicMethods = {};
        var privateMethods = {};

        privateMethods.rgbToHex = function (color) {
            if (color.substr(0, 1) === '#') {
                return color;
            }

            var nums = color.match(/(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
            var numToHex = function (num) {
                var hex = parseInt(num, 10).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            var hex = [
                '#',
                numToHex(nums[2]),
                numToHex(nums[3]),
                numToHex(nums[4])
            ].join('');

            return hex;
        };

        privateMethods.changeColor = function (color, darker) {
            var ratio = 0.01; // ratio is between 0 and 1
            var diff = Math.round(ratio * 256) * (darker ? -1 : 1);
            var mathFunc = Math[darker ? 'max' : 'min'];
            var minMax = (darker ? 0 : 255);

            var nums = privateMethods.rgbToHex(color).match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
            var numToHex = function (num) {
                var decimal = parseInt(num, 16);
                return mathFunc(parseInt(decimal, 10) + diff, minMax).toString(16);
            };

            var hex = [
                '#',
                numToHex(nums[1]),
                numToHex(nums[2]),
                numToHex(nums[3])
            ].join('');

            return hex;
        };

        // progressive color changes
        publicMethods.darkerColor = function (color) {
            return privateMethods.changeColor(color, true);
        };
        publicMethods.lighterColor = function (color) {
            return privateMethods.changeColor(color);
        };

        publicMethods.objHasProp = function (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        };

        return publicMethods;
    }

})(this);

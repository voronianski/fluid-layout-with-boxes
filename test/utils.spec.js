/*global VDUtils*/
describe('utils', function () {
    var utils;

    describe('when creating new instance', function () {
        var colorResult;

        before(function () {
            utils = new VDUtils();
        });

        it('should be ok', function () {
            expect(utils).to.be.ok;
        });

        describe('when setting hex color to lighter', function () {
            before(function () {
                colorResult = utils.lighterColor('#efefef');
            });

            it('should make it lighter', function () {
                expect(colorResult).to.equal('#f2f2f2');
            });
        });

        describe('when setting hex color to darker', function () {
            before(function () {
                colorResult = utils.darkerColor('#efefef');
            });

            it('should make it darker', function () {
                expect(colorResult).to.equal('#ececec');
            });
        });

        describe('when setting rgb color to lighter', function () {
            before(function () {
                colorResult = utils.lighterColor('rgb(63, 63, 63)');
            });

            it('should make it lighter', function () {
                expect(colorResult).to.equal('#424242');
            });
        });

        describe('when setting rgb color to darker', function () {
            before(function () {
                colorResult = utils.darkerColor('rgb(63, 63, 63)');
            });

            it('should make it darker', function () {
                expect(colorResult).to.equal('#3c3c3c');
            });
        });
    });
});

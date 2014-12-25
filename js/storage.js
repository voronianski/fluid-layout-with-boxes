(function (global, undefined) {
    'use strict';

    /**
     * Box Rows Collection
     */

    global.VDRowsStore = VDRowsStore;

    function VDRowsStore () {
        this.storage = global.localStorage;

        // check and use state or defaults if it fails
        this.list = this.getState() || {views: [], idsCount: 0};

        // generate initial box if empty
        if (!this.list.views.length) {
            this.addBox();
        }
    }

    VDRowsStore.prototype.addBox = function (id) {
        var box = {id: ++this.list.idsCount};
        var afterBox;

        if (id) {
            var findBox = function (boxView, index, list) {
                if (boxView.id === id) {
                    afterBox = boxView;
                    afterBox.nextId = box.id;
                    box.prevId = afterBox.id;

                    var atIndex = index+1;
                    var beforeBox = list[atIndex];
                    if (beforeBox) {
                        beforeBox.prevId = box.id;
                        box.nextId = beforeBox.id;
                    }

                    list.splice(atIndex, 0, box);
                    return true;
                }
            };
            this.forEach(findBox);
        } else {
            afterBox = this.list.views[this.list.views.length-1];
            if (afterBox) {
                afterBox.nextId = box.id;
                box.prevId = afterBox.id;
            }
            this.list.views.push(box);
        }

        this.saveState();

        return box;
    };

    VDRowsStore.prototype.size = function () {
        return this.list.views.length;
    };

    VDRowsStore.prototype.forEach = function (callback) {
        var boxViews = this.list.views;
        for (var i = 0, len = boxViews.length; i < len; i++) {
            var boxView = boxViews[i];
            if (boxView && callback(boxView, i, boxViews)) {
                break;
            }
        }
    };

    VDRowsStore.prototype.removeBox = function (id) {
        var box;

        var findBox = function (boxView, index, list) {
            if (boxView.id === id) {
                var prevBox = list[index-1];
                var nextBox = list[index+1];

                box = boxView;

                if (nextBox && prevBox) {
                    prevBox.nextId = nextBox.id;
                    nextBox.prevId = prevBox.id;
                } else if (prevBox) {
                    prevBox.nextId = null;
                }

                list.splice(index, 1);
                return true;
            }
        };

        this.forEach(findBox);
        this.saveState();

        return box;
    };

    VDRowsStore.prototype.saveState = function () {
        var boxesData = JSON.stringify(this.list);
        this.storage && this.storage.setItem('VDLayoutBoxes', boxesData);
    };

    VDRowsStore.prototype.getState = function () {
        var boxesData;
        try {
            boxesData = JSON.parse(this.storage.getItem('VDLayoutBoxes'));
        } catch (err) {}
        return boxesData;
    };

    VDRowsStore.prototype.clear = function () {
        this.storage && this.storage.removeItem('VDLayoutBoxes');
        this.list = {views: [], idsCount: 0};
    };

})(this);

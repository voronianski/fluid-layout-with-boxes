(function (global, VDRowsStore, VDUtils, undefined) {
    'use strict';

    global.VDLayout = VDLayout;

    /**
     * Fluid layout widget for Klarna
     */
    function VDLayout (options) {
        options = options || {};

        if (!options.el) {
            throw new Error('Element selector string `el` option is required');
        }

        var $el = document.querySelectorAll(options.el)[0];
        if (!$el) {
            throw new Error('There is no DOM element with selector `' + $el + '`');
        }

        var publicMethods = {};
        var privateMethods = {};

        // session statistics
        var createdBoxesCount;
        var removedBoxesCount;
        var $createdBoxesView;
        var $removedBoxesView;

        // share views
        var $containerView;
        var $notifiersView;

        var utils = new VDUtils();

        // shared storage
        var storage = new VDRowsStore();

        privateMethods.renderBoxes = function () {
            var domFragment = document.createDocumentFragment();

            privateMethods.cleanBoxes();

            storage.forEach(function (viewData, index) {
                var $boxView = new BoxView(viewData, index, storage.size());
                domFragment.appendChild($boxView.render());
            });

            $el.appendChild(domFragment);
        };

        privateMethods.cleanBoxes = function () {
            while ($el.firstChild) {
                $el.removeChild($el.firstChild);
            }
        };

        privateMethods.delegateEvents = function () {
            if ($el.addEventListener) {
                $el.addEventListener('click', privateMethods.onBoxClick);
                $el.addEventListener('mouseover', privateMethods.onBoxHover);
                $el.addEventListener('mouseout', privateMethods.onBoxHoverOut);
            } else {
                $el.attachEvent('onclick', privateMethods.onBoxClick);
                $el.attachEvent('onmouseover', privateMethods.onBoxHover);
                $el.attachEvent('onmouseout', privateMethods.onBoxHoverOut);
            }
        };

        privateMethods.onBoxClick = function (e) {
            var el = e.target || e.srcElement;
            var elClassName = el.className;
            if (!elClassName.match('vd-box')) {
                return;
            }

            var id = el.getAttribute('data-id');
            while (el && !id) {
                el = el.parentNode;
                id = el.getAttribute('data-id');
            }

            id = parseInt(id, 10);
            if (elClassName.match('vd-box-close')) {
                storage.removeBox(id);
                removedBoxesCount++;
                privateMethods.darkerContainerBg();
                privateMethods.renderNotification(id);
            } else {
                storage.addBox(id);
                createdBoxesCount++;
                privateMethods.lighterContainerBg();
            }
            privateMethods.renderBoxes();
            privateMethods.updateStats();
        };

        privateMethods.onBoxHover = function (e) {
            var elClassName = (e.target || e.srcElement).className;
            var bodyClassName = document.body.className;
            if (bodyClassName.match('vd-box-hover') || !elClassName.match('vd-box')) {
                return;
            }
            document.body.className += 'vd-box-hover';
        };

        privateMethods.onBoxHoverOut = function (e) {
            var elClassName = (e.target || e.srcElement).className;
            var bodyClassName = document.body.className;
            if (bodyClassName.match('vd-box-hover') && elClassName.match('vd-box')) {
                document.body.className = '';
            }
        };

        privateMethods.renderStats = function () {
            var $statsView = document.createElement('div');
            var $resetButton = document.createElement('span');
            var onResetClick = function () {
                storage.clear();
                storage.addBox();
                privateMethods.resetContainer();
                privateMethods.resetCounters();
                privateMethods.updateStats();
                privateMethods.renderBoxes();
            };

            $createdBoxesView = document.createElement('span');
            $removedBoxesView = document.createElement('span');

            $resetButton.className = 'vd-reset-btn';
            if (utils.objHasProp($resetButton, 'textContent')) {
                $resetButton.textContent = 'Reset';
            } else {
                $resetButton.innerText = 'Reset';
            }

            if ($resetButton.addEventListener) {
                $resetButton.addEventListener('click', onResetClick);
            } else {
                $resetButton.attachEvent('onclick', onResetClick);
            }

            $statsView.className = 'vd-stats';
            $statsView.appendChild($createdBoxesView);
            $statsView.appendChild($removedBoxesView);
            $statsView.appendChild($resetButton);
            document.body.appendChild($statsView);
        };

        privateMethods.updateStats = function () {
            var createdText = 'Boxes created: '+createdBoxesCount+' / ';
            var removedText = 'Boxes removed: '+removedBoxesCount+' ';

            if (utils.objHasProp($createdBoxesView, 'textContent')) {
                $createdBoxesView.textContent = createdText;
                $removedBoxesView.textContent = removedText;
            } else {
                $createdBoxesView.innerText = createdText;
                $removedBoxesView.innerText = removedText;
            }
        };

        privateMethods.resetCounters = function () {
            createdBoxesCount = 0;
            removedBoxesCount = 0;
        };

        privateMethods.resetContainer = function () {
            $containerView = $el.parentNode;
            $containerView.style.backgroundColor = options.bgColor || '#A5A5A5';
        };

        privateMethods.darkerContainerBg = function () {
            $containerView.style.backgroundColor = utils.darkerColor($containerView.style.backgroundColor);
        };

        privateMethods.lighterContainerBg = function () {
            $containerView.style.backgroundColor = utils.lighterColor($containerView.style.backgroundColor);
        };

        privateMethods.renderNotification = function (boxId) {
            if (!$notifiersView) {
                $notifiersView = document.createElement('div');
                $notifiersView.className = 'vd-notify-wrap';
                document.body.appendChild($notifiersView);
            }

            var $notify = document.createElement('div');
            var text = 'Removed box with id: '+boxId;
            $notify.className = 'vd-notify-box';
            if (utils.objHasProp($notify, 'textContent')) {
                $notify.textContent = text;
            } else {
                $notify.innerText = text;
            }
            $notifiersView.appendChild($notify);

            setTimeout(function () {
                $notifiersView.removeChild($notify);
            }, 3000);
        };

        publicMethods.render = function () {
            privateMethods.resetContainer();
            privateMethods.resetCounters();
            privateMethods.renderStats();
            privateMethods.renderBoxes();
            privateMethods.updateStats();
            privateMethods.delegateEvents();
        };

        return publicMethods;
    }

    /**
     * Box Item View
     */
    function BoxView (data, index, listSize) {
        this.data = data;
        this.index = index;
        this.listSize = listSize;
    }

    // generate layout and box colorings
    BoxView.prototype.generateClasses = function () {
        var modulo6 = this.index % 6;
        var modulo4 = this.index % 4;
        var classes = 'vd-grid-box';

        if (modulo6 < 3) {
            classes += ' vd-grid-6in'+(modulo6+1);
        } else if (modulo6 < 5) {
            classes += ' vd-grid-6in'+(modulo6+1);
        } else {
            classes += ' vd-grid-6in6';
        }

        if (modulo4 === 1) {
            classes += ' vd-grid-red-bg';
        }
        if (modulo4 === 2) {
            classes += ' vd-grid-green-bg';
        }
        if (modulo4 === 3) {
            classes += ' vd-grid-blue-bg';
        }

        if (this.index === this.listSize-1) {
            classes += ' vd-grid-highlighted';
        }

        return classes;
    };

    BoxView.prototype.render = function () {
        var $boxWrap = document.createElement('div');
        $boxWrap.className = this.generateClasses();
        $boxWrap.setAttribute('data-id', this.data.id);

        $boxWrap.innerHTML += '\
            <div class="vd-box">\
                <div class="vd-box-inner vd-box-header">\
                    <span class="vd-box-cell-left">['+this.data.id+']</span>\
                    <span class="vd-box-cell-right vd-box-close">&times;</span>\
                </div>\
                <div class="vd-box-inner vd-box-content">\
                    <span class="vd-box-cell-left">'+(this.data.prevId && this.data.prevId||'')+'</span>\
                    <span class="vd-box-cell-right">'+(this.data.nextId && this.data.nextId||'')+'</span>\
                </div>\
            </div>';

        return $boxWrap;
    };

})(this, this.VDRowsStore, this.VDUtils);

define(function (require, exports, module){
    var config = require('../config'),
        $ = window.jQuery,
        target = $('body')[0];

    function init(){
        var observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length === 1 &&
                   $(mutation.addedNodes[0]).hasClass('modal-wrapper')){
                    console.log(mutation.addedNodes);
                    process(mutation);
                }
            });
        }),
            observerConfig = config.observer;
        observer.observe(target, observerConfig);
    }

    function process(mutation){
        var node = $(mutation.addedNodes[0]),
            modalHeader = node.find('.modal-header'),
            modal = node.find('div.modal'),
            position = {x: 0, y: 0},
            $document;

        if (!modalHeader){
            return;
        }

        $document = $(document);

        modal.css('position', 'absolute');
        modal.css('top', ($document.height() - modal.height()) / 2 + 'px');
        modal.css('left', ($document.width() - modal.width()) / 2 + 'px');

        modalHeader.on('mousedown', function(){
            position.x = 0;
            position.y = 0;

            node.on('mousemove', function(event){
                var offsetX, offsetY;

                if (position.x === 0 && position.y === 0){
                    position.x = -event.clientX;
                    position.y = -event.clientY;
                } else {
                    offsetX = -(position.x - event.clientX);
                    offsetY = -(position.y - event.clientY);

                    modal.css('left', parseInt(modal.css('left').replace('px', '')) + offsetX + 'px');
                    modal.css('top', parseInt(modal.css('top').replace('px', '')) + offsetY + 'px');
                }

                position.x = event.clientX;
                position.y = event.clientY;
            });
        });

        node.on('mouseup', function(){
            node.off('mousemove');
        });
    }

    module.exports = {
        init: init
    };
});

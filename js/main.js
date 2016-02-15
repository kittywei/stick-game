var stopFun = false,
    beltObj = $('#belt'),
    stickObj = $('#stick-group').children().last(),
    charObj = $('#character'),
    countObj = $('#count'),
    gameWrap = $('#game'),
    stickTimer = null,
    stickHeight = 0,
    stickStart = 0,
    charLeft = 0, //character left
    stickLeftO = 20, //stick origenal left
    stickWidth = 3,
    charWidth = charObj.width(),
    biWidth,
    blockContent = '<div class="block-item"></div>',
    stickContent = '<div class="stick"></div>',
    countContent = {
        'f': 'Failed...',
        't': 'Congratulations!'
    },
    count = 0,
    bwx = 100, //block width random number top
    bwy = 23 //block width random number bottom

    function getStickObj() {
        return $('#stick-group').children().last();
    }

    /*stick start to rise*/
    function stickRiseStart() {
        stickTimer = setInterval(function () {
            getStickObj().height(stickStart += 3)
        }, 20);
    }

    /*stick rising stop*/
    function stickRiseEnd() {
        stopFun = true;
        if (stickTimer) {
            clearInterval(stickTimer);
            stickTimer = null;
        }
        getStickObj().addClass('transition').addClass('lie');
        stickHeight = getStickObj().height();
        charMoving();
    }

    /*character move*/
    function charMoving() {
        var last = beltObj.children().last();
        var blockDist = last.position().left - last.prev().position().left - last.prev().width(); //两个平台之间的距离
        var aa = stickHeight + getStickObj().position().left; //棍子倒下时棍子顶端到左边框距离
        var bb = last.width() + last.position().left; //第二个台的最右边到左边框距离
        if (stickHeight >= blockDist && aa <= bb) { //棍子长度超过间距并且在第二个柱子以内
            charObj.animate({
                'left': last.width() + last.position().left - charObj.width() - 3 //成功后角色运动
            }, 800, function () {
                count += 1;
                countObj.html(count);
                blockItem();
                //场景移动
                last = beltObj.children().last();
                gameWrap.animate({
                    'left': -(last.prev().position().left - 20)
                }, 200, function(){
                    stopFun = false;
                });
            });
        } else {
            var last = beltObj.children().last();
            charObj.animate({
                'left': getStickObj().height() + getStickObj().position().left - charWidth + 5 //失败后的角色运动
            }, 800, function () {
                getStickObj().removeClass('lie').addClass('down');
                $(this).animate({
                    'bottom': '-20px'
                }, 200, function () {
                    countObj.html(countContent.f);
                    init();
                });
            });
        }
    }

    /*first time append*/
    function appendItem() {
        beltObj.append(blockContent);
        var bwRand = parseInt(Math.random() * (bwx - bwy + 1) + bwy);
        var first = beltObj.children().first();
        first.css({
            'left': stickLeftO,
            'width': bwRand
        });
        getStickObj().css({
            'left': first.width() + first.position().left - stickWidth
        });
        charObj.css({
            'left': (first.width() - charWidth) / 2 + first.position().left
        });
    }

    /*belt append*/
    function blockItem() {
        beltObj.append(blockContent);
        last = beltObj.children().last();
        var lt = 480 - last.width() + last.prev().position().left; //上限
        var lb = last.prev().position().left + last.prev().width() + 10; //下限
        last.css({
            'left': parseInt(Math.random() * (lt - lb + 1) + lb), //left值： 最大为left+宽度不超过右外框，最小为前一个平台的left+宽度
            'width': parseInt(Math.random() * (bwx - bwy + 1) + bwy)
        });
        $('#stick-group').append(stickContent);
        stickStart = 0;
        $('.stick:last-child').css({
            'left': last.prev().position().left + last.prev().width() - stickWidth,
            'height': 0
        });
    }

    /*Initialization*/
    function init() {
        stopFun = false;
        stickStart = 0;
        count = 0;
        charObj.css({
            'bottom': '200px'
        });
        gameWrap.css({
            'left': 0
        })
        $('.stick').height(0).removeClass('transition');
        $('#stick-group').empty();
        countObj.empty();
        beltObj.empty();
        countObj.html();
        appendItem();
        blockItem();
    }

function scaleFun(){
    var canvas1 = $('#canvas1');
    var canvasWrap = $('.canvas-wrap');
    var dw = document.documentElement.clientWidth;
    var ratio = canvas1.width() / canvas1.height();
    var newHeight = dw/ratio;
    var scale = dw / canvas1.width();
    if(dw < canvas1.width()){
        canvasWrap.width(dw).height(newHeight);
        canvas1.css({'transform': 'scale('+scale+')','-webkit-transform': 'scale('+scale+')','-moz-transform': 'scale('+scale+')'});
    }
}

$(function () {
    init();
        $('#btn-press').mousedown(function () {
            if (stickTimer) {
                clearInterval(stickTimer);
                stickTimer = null;
            }
            if(stopFun === false){
                stickRiseStart();
                stopFun = true;
            }
        }).mouseup(function () {
            if(stopFun === true){
                stickRiseEnd();
            }
        });
    scaleFun();
    $(window).resize(function(){
        scaleFun();
    });
})
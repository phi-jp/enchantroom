
;(function() {
    $q = function(q) { return document.querySelector(q); };
    var socket = null;
    var canvas = null;
    var context= null;
    
    var initSocketIO = function() {
        var host = "http://" + ( location.host );
        socket  = io.connect(host);
    };

    var initRoom = function() {
        var infoElm = $("#roominfo");
        var listElm = $("#roomlist");

        var createElement = function(room) {
            var elm = $("<div>").attr({
                class:'item',
                count: room.count,title:room.title,author:room.author
            });
            var img = $("<img>").attr({
                src:room.sumbnail,
                alt:room.title
            });
            elm.append(img);

            elm.click(function() {
                infoElm.empty();
                infoElm.append()
                $cont = $("<div>").hide();
                infoElm.append($cont.append($("<a>").attr({
                    href:'/room?number='+room.number
                    }).append($("<h2>").text(room.count +"人"+ "ー" +room.title + "ー" +room.author+"さん")))
                    .append($("<div>").text(room.summary)));
                $cont.show('slide');
            });

            return elm;
        };

        $.get('/roomlist', function(data) {
            JSON.parse(data).forEach(function(room){
                var elm = createElement(room);
                listElm.append(elm);
            });

            // jquery plugin
            listElm.imagesLoaded(function() {
                listElm.isotope({
                    itemSelector: '.item',
                    getSortData : {
                        count: function($elem) {
                            return $elem.attr('count')-0;
                        }
                        ,title: function($elem) {
                            return $elem.attr('title');
                        }
                        ,author: function($elem) {
                            return $elem.attr('author');
                        }
                    }
                });
            });
        });
    };
    
    var initCanvas = function() {
        canvas = $q("#world");
        canvas.width = 640;
        canvas.height = 480;
        
        context = canvas.getContext('2d');
        context.lineWidth = 8;
        context.lineCap = "round";
        context.lineJoin = "round";
    };

    var initUI = function() {
        var fileBtn = $q("#file-btn");
        var dummyFileButton = document.getElementById("dummy-file-button");

        fileBtn.onclick = function() {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            dummyFileButton.dispatchEvent( evt );
        };
    };

    var initSocial = function() {
        var x, y;
        var touch = false;
        var color = "hsl(" + ((Math.random()*360)|0) + ", 75%, 50%)";
        
        canvas.onmousedown = function(e) {
            touch = true;
            x = e.clientX - e.target.getBoundingClientRect().left;
            y = e.clientY - e.target.getBoundingClientRect().top;;
            
            send("start");
        };

        canvas.onmousemove = function(e) {
            if (!touch) { return ; }
            
            var nowX = e.clientX - e.target.getBoundingClientRect().left;
            var nowY = e.clientY - e.target.getBoundingClientRect().top;;

            send("move", x, y, nowX, nowY, color);
            x = nowX; y = nowY;
            
            return false;
        };

        canvas.onmouseup = function(e) {
            touch = false;
            send("end");
        };
        
        socket.on('connect', function() {
            console.log('Cliant-connect');
        });
        
        socket.on('start', function(data) {
        });
        
        socket.on('move', function(e) {
            var d = e.data;
            
            context.strokeStyle = e.data.color;
            context.beginPath();
            context.moveTo(d.startX, d.startY);
            context.lineTo(d.endX, d.endY);
            context.closePath();
            context.stroke();
        });

    };
    
    
    var send = function(act, startX, startY, endX, endY, color) {
        socket.emit(act, {
            startX:startX,
            startY:startY,
            endX:endX,
            endY:endY,
            color:color
        });
    };
    
    var init = function() {
        initSocketIO();
        initCanvas();
        initUI();
        initSocial();
        initRoom();
    };

    window.onload = function() {
        init();
    };
})();

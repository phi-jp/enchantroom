
;(function() {
    $q = function(q) { return document.querySelector(q); };
    var socket = null;
    var canvas = null;
    var context= null;
    
    var initSocketIO = function() {
        var host = "http://" + ( location.host );
        socket  = io.connect(host);
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
        initSocial();
    };

    window.onload = function() {
        init();
    };
})();

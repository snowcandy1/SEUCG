"use strict";

var canvas, gl;
var PI = Math.acos(-1.0);
var ts = (new Date()).getTime();
var startTime = (new Date()).getTime();
var hits = 0;

var rate = 2.0;
var dis = 0.00;
var speed = 1;

var x0, y0, z0, Tx, Ty;
var vert = [];
var colors = [];
var ptn = [];
var ur, sr, fallSpeed = 0.0;

var isMoving = "no", isJumping = false, isChosen = false, needFallDown = false;

function addvert(k1, k2) { vert.push(k1, k2); }
function addcolors(k1, k2, k3, k4) { colors.push(k1, k2, k3, k4); }
function addpaintings(k1, k2, k3) { ptn.push(k1, k2, k3); }

/**画圆*/
function addCircle(Cx, Cy, Rx, Ry, v, tr, tg, tb, ta) {
    Cx /= rate; Cy /= rate; Rx /= rate; Ry /= rate;
    var lth = vert.length / 2;
    for (var i = 0; i < v; i++) {
        var ax = Cx + Rx * Math.cos(i * 2 * PI/ v);
        var ay = Cy + Ry * Math.sin(i * 2 * PI/ v);
        addvert(ax, ay);
        addcolors(tr, tg, tb, ta);
    }
    for (var i = 1; i < v - 1; i++) {
        addpaintings(lth, lth + i, lth + i + 1);
    }
    return;
}

function paint() {
    // 熊本熊的头
    addCircle(0.0, 0.0, 0.22, 0.19, 25, 0.0, 0.0, 0.0, 1.0);
    addCircle(0.0, -0.45, 0.31, 0.36, 35, 0.0, 0.0, 0.0, 1.0);
    addCircle(-0.28, -0.25, 0.07, 0.07, 17, 0.0, 0.0, 0.0, 1.0);
    addCircle(0.28, -0.25, 0.07, 0.07, 17, 0.0, 0.0, 0.0, 1.0);
    // 熊本熊的眼睛
    addCircle(-0.1, 0.05, 0.045, 0.045, 15, 1.0, 1.0, 1.0, 1.0);
    addCircle(-0.1, 0.05, 0.008, 0.02, 10, 0.0, 0.0, 0.0, 1.0);
    addCircle(0.1, 0.05, 0.045, 0.045, 15, 1.0, 1.0, 1.0, 1.0);
    addCircle(0.1, 0.05, 0.008, 0.02, 10, 0.0, 0.0, 0.0, 1.0);
    // 嘴巴
    addCircle(0.0, -0.076, 0.11, 0.09, 25, 1.0, 1.0, 1.0, 1.0);
    addCircle(0.15, -0.07, 0.04, 0.04, 15, 1.0, 0.0, 0.0, 1.0);
    addCircle(-0.15, -0.07, 0.04, 0.04, 15, 1.0, 0.0, 0.0, 1.0);
    addCircle(0.0, -0.02, 0.02, 0.015, 11, 0.0, 0.0, 0.0, 1.0);
    addCircle(0.0, -0.08, 0.10, 0.015, 4, 0.0, 0.0, 0.0, 1.0);
    addCircle(0.15, 0.17, 0.04, 0.04, 15, 0.0, 0.0, 0.0, 1.0);
    addCircle(-0.15, 0.17, 0.04, 0.04, 15, 0.0, 0.0, 0.0, 1.0);
    addCircle(0.15, -0.74, 0.07, 0.07, 4, 0.0, 0.0, 0.08, 1.0);
    addCircle(-0.15, -0.74, 0.07, 0.07, 4, 0.0, 0.0, 0.08, 1.0);


}

function options() {
    document.getElementById("slider").onchange = function (event) {
        speed =event.target.value;
    };
	window.onkeydown = function (ev) {
	    var ev = ev || window.event;
        switch (ev.keyCode) {
            case 37:
				isMoving = "left";
                break;
            case 39:
                isMoving = "right";
                break;
            case 38: 
                if (isJumping !== true) {
                    isJumping = true; ts = (new Date()).getTime();
                }
                break;
            case 82:
                startTime = (new Date()).getTime();
                x0 = 0.0; y0 = -0.50; hits = 0;
                $("#results").html("");
                break;
            case 67:
                isChosen = true;
                break;
        }
    };
	window.onkeyup = function (ev) {
        var ev = ev || window.event;
        switch (ev.keyCode) {
            case 37:
                if (isMoving === "left") isMoving = "no";
                break;
            case 39:
                if (isMoving === "right") isMoving = "no";
                break;
            case 38: 
                isJumping = false;
                break;
        }
    };
    document.getElementById("Controls").onclick = function (event) {
        switch (event.target.index) {
            case 0:
                dis = 0.00; hits = 0;
                $("#dialogs").html("已切换正常模式");
                $("#results").html("");
                break;
            case 1:
                dis = 0.03; hits = 0;
                startTime = (new Date()).getTime();
                $("#dialogs").html("已切换混乱模式");
                $("#results").html("");
                break;
            case 2:
                dis = -0.35; hits = 0;
                startTime = (new Date()).getTime();
                $("#dialogs").html("已切换卢本伟模式");
                $("#results").html("");
                break;
        }
    };
    canvas.addEventListener("mousedown", function (event) {
        if (Tx > x0 - 0.22 && Tx < x0 + 0.22 && Ty > y0 - 0.19 && Ty < y0 + 0.19) {
            $("#dialogs").html("熊本熊：啊♂我的头！"); isChosen = true;
        } else if (Tx > x0 - 0.31 && Tx < x0 + 0.31 && Ty > y0 - 0.81 && Ty < y0 + 0.19) {
            $("#dialogs").html("熊本熊：啊♂我的身子！"); isChosen = true;
        } else {
            $("#dialogs").html("熊本熊：嘿嘿，没打着=。="); isChosen = false;
        }


    });//*/


    canvas.addEventListener("mouseup", function (e) {
        isChosen = false;
    });

    canvas.addEventListener("mousemove", function (event) {
        Tx = 2 * event.clientX / canvas.width - 1;
        Ty = 1 - 2 * event.clientY / canvas.height;
    })
}

function init() {
	canvas = document.getElementById("myCanvas");
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
	paint();
	
	var prog = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(prog);

    var vbuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert), gl.STATIC_DRAW);

    //关联
    var vPosition = gl.getAttribLocation(prog, "pos");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cbuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( prog, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint8Array(ptn),gl.STATIC_DRAW);
	
	x0 = z0 = 0.0; y0 = -0.50;
	det = gl.getUniformLocation(prog, 'det');
	
	gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.99, 0.99, 0.99, 0.5 );
	
	options(); render();
}

function jumpUp() {
    var A = 0.004; fallSpeed -= A; y0 += fallSpeed;
    x0 += dis * speed;
    if (x0 < -1.0 || x0 > 1.0) { dis = -dis; hits++; $("#dialogs").html("熊本熊：啊♂好疼"); }
    if (fallSpeed <= 0.0) { clearInterval(sr); ur = setInterval("FallDown()", 20); }
}

function FallDown() {
    var A = 0.004; fallSpeed += A; y0 -= fallSpeed;
    x0 += dis * speed;
    if (x0 < -1.0 || x0 > 1.0) { dis = -dis; hits++; $("#dialogs").html("熊本熊：啊♂好疼"); }
    if (y0 < -0.5) { fallSpeed = 0.0; clearInterval(sr); clearInterval(ur); }
}

function fly() {
    fallSpeed = 0.15;
    $("#dialogs").html("熊本熊：啊啊啊啊啊啊啊！");
    clearInterval(ur);
    clearInterval(sr);
    sr = setInterval("jumpUp()", 20);
}

function characterMoving() {
    if (hits % 50 === 0 && hits > 0) {
        var ps = (new Date()).getTime();
        hits++;
        $("#results").html("<h2>撞击 " + hits + " 次</h2><h1>用时：" + Math.floor(ps - startTime) / 1000 + " s</h1><h2>Press R To Retry.</h2>");
        return;
    }
    if (isChosen === true) {
        x0 = Tx; y0 = Ty + 0.12; needFallDown = true;
    } else if (needFallDown === true) {
        clearInterval(ur);
        clearInterval(sr);
        ur = setInterval("FallDown()", 20);
        needFallDown = false;
    }
	if (isJumping === true && (new Date()).getTime() - ts < 55 && y0 < -0.49) {
        fallSpeed = 0.08;
        clearInterval(ur);
        clearInterval(sr);
        sr = setInterval("jumpUp()", 20);
	    /*clearTimeout(ur);
	    var spd = 0.08, A = spd / 20;
        for (var i = 0; i < 40; i++) {
            (function (i) {
                ur = setTimeout(function () {
                    if (i < 20) { y0 += spd; spd -= A; x0 += dis * speed; }
                    if (i >= 20) { spd += A; y0 -= spd; x0 += dis * speed; }
                    if (x0 < -1.0 || x0 > 1.0) { dis = -dis; hits++; $("#dialogs").html("熊本熊：啊♂好疼"); }
                    if (y0 > 1.0) { y0 = 1.0; A = -A; spd = -spd; hits++; $("#dialogs").html("熊本熊：啊♂好疼"); }
                    if (y0 < -0.5) { y0 = -0.5; A = -A; spd = -spd; hits++; $("#dialogs").html("熊本熊：啊♂好疼"); }
                }, 20 * i);
            })(i);
        }*/
    }
    if (isMoving == "left" && x0 > -1.0) {
        x0 -= 0.03 * speed;
    }
    if (isMoving == "right" && x0 < 1.0) {
        x0 += 0.03 * speed;
    }

}

function render() {
    $("#yohane").html("x: " + Math.floor(x0 * 10000) / 100 + "   y: " + Math.floor(y0 * 10000) / 100 + "  " +
        "HITS: " + hits + "   Tx: " + Tx + "   Ty: " + Ty);
	gl.clear( gl.COLOR_BUFFER_BIT );
	characterMoving();
	gl.uniform4f(det, x0, y0, z0, 0.0);
	
	gl.drawElements(gl.TRIANGLES, ptn.length, gl.UNSIGNED_BYTE,0);

    requestAnimFrame(render);
}
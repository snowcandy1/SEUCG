"use strict";

var canvas, gl, program;

var jumpAble = true;

var a1 = 0.0;//喵喵喵
var a1Loc;//喵喵喵

var a2 = 0.0;//喵喵喵
var a2Loc;//喵喵喵
var speed = 1;
var dis = 0.0;
var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


function init()
{
    canvas = document.getElementById( "myCanvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [
        vec2(0, 0.1),
        vec2(-0.07, 0.07),
        vec2(-0.1, 0),
        vec2(-0.07, -0.07),
        vec2(0, -0.1),
        vec2(0.07, -0.07),
        vec2(0.1, 0),
        vec2(0.07, 0.07)
    ];


    // Load the data into the GPU

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    var t = vec4(colors[0]);
    gl.bufferSubData(gl.ARRAY_BUFFER, flatten(vertices), flatten(t));

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    setOptions();
    render();
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    //   theta += 0.1;
    gl.uniform1f(a1Loc, a1);
    gl.uniform1f(a2Loc, a2);
    //  gl.uniform1f(thetaLoc, a2);

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 8 );

    // window.requestAnimFrame(render);
}


function setOptions() {
    a1Loc = gl.getUniformLocation(program, "a1");//喵喵喵
    a2Loc = gl.getUniformLocation(program, "a2");//喵喵喵
    document.getElementById("slider").onchange = function (event) {
        speed =event.target.value;
    };
    window.onkeydown = function (ev) {//喵喵喵
        var ev = ev || window.event;
        switch (ev.keyCode) {
            case 37:
                a1 = a1 - 0.02 * speed; render();
                break;
            case 39:
                a1 = a1 + speed*0.02; render();
                break;
            case 38:
                var spd = 0.07, A = spd / 20;
                if (jumpAble === false) break;
                jumpAble = false;
                for (let i = 0; i < 40; i++) {
                    setTimeout(function () {

                        if (i < 20) { a2 = a2 + spd; a1 = a1 + dis; spd -= A; render(); }

                        if (i >= 20) { spd += A; a2 = a2 - spd; a1 = a1 + dis; render(); }
                    }, 20 * i);
                }
                setTimeout(jumpAble = true, 800);
                break;
        }
    };
    document.getElementById("Controls").onclick = function (event) {
        switch (event.target.index) {
            case 0:
                dis = 0;
                break;

            case 1:
                dis = 0.015;
                break;

            case 2:
                dis = -0.015;
                break;
        }
    };
}



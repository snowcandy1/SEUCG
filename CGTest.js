"use strict";

var canvas;
var gl;

var a1 = 0.0;//喵喵喵
var a1Loc;//喵喵喵

var a2 = 0.0;//喵喵喵
var a2Loc;//喵喵喵
var speed = 1;
var dis = 0.0
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
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
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    a1Loc = gl.getUniformLocation(program, "a1");//喵喵喵
    a2Loc = gl.getUniformLocation(program, "a2");//喵喵喵
    document.getElementById("slider").onchange = function (event) {
        speed =event.target.value;
    };
    window.onkeydown = function (event) {//喵喵喵
        var key = String.fromCharCode(event.keyCode);
        switch (key) {
            case 'A':
                a1 = a1 - 0.02 * speed; render();
                break;
            case 'D':
                a1 = a1 + speed*0.02; render();
                break;
            case 'W':
                for (let i = 0; i < 39; i++) {
                    setTimeout(function () {
                        if (i < 19) { a2 = a2 + 0.02; a1 = a1 + dis; render(); }
                       
                        if (i>19) { a2 = a2 - 0.02; a1 = a1 +dis; render(); }
                    }, 20 * i);
                }
                break;
        }
    };
    document.getElementById("Controls").onclick = function (event) {
        switch (event.target.index) {
            case 0:
                dis = 0
                break;

            case 1:
                dis = 0.015
                break;

            case 2:
                dis = -0.015;
                break;
        }
    };
    render();
};





function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

 //   theta += 0.1;
    gl.uniform1f(a1Loc, a1);//喵喵喵
    gl.uniform1f(a2Loc, a2);//喵喵喵
    //  gl.uniform1f(thetaLoc, a2);

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 8 );

   // window.requestAnimFrame(render);
}


"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/drawDotHub").build();

connection.on("updateDot", function (sender) {        //CamNote, take user arg, pass to drawDot to persist color?
    let outsideUser = JSON.parse(sender)
    if(outsideUser.id != user.id){
        drawDot(outsideUser);
    }
    
});

// connection.on("clearCanvas", function () {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// });

connection.start().then(function () {
    // nothing here
}).catch(function (err) {
    return console.error(err.toString());
});

function tellServerToClear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // connection.invoke("ClearCanvas").catch(function (err) {
    //     return console.error(err.toString());
    // });
}

var user = {
        id: Date.now() + "" + Math.random(),
        r: Math.floor(Math.random() * (255 + 1) ),
        g: Math.floor(Math.random() * (255 + 1) ),
        b: Math.floor(Math.random() * (255 + 1) ),
        size: 8, x: 0, y: 0
};
const userJSON = JSON.stringify(user);

//////////////////////////////////////////////////////
// Variables for referencing the canvas and 2dcanvas context
var canvas, ctx;
// Variables to keep track of the mouse position and left-button status
var mouseX, mouseY, mouseDown = 0;
// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(drawer) {
    // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
    var r = drawer.r;    //0;
    var g = drawer.g;
    var b = drawer.b;
    var a = 255;
    // Select a fill style
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
    // Draw a filled circle
    ctx.beginPath();
    ctx.arc(drawer.x, drawer.y, drawer.size, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
    mouseDown = 1;
    callUpdateCanvas();
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown = 0;
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) {
    // Update the mouse co-ordinates when moved
    getMousePos(e);
    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown == 1) {
        callUpdateCanvas();
    }
}

function callUpdateCanvas(){
    user.x = mouseX
    user.y = mouseY
    drawDot(user)
    connection.invoke("UpdateCanvas", JSON.stringify(user)).catch(function (err) {
        return console.error(err.toString());
    });
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    if (!e)
        var e = event;
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}

// Set-up the canvas and add our event handlers after the page has loaded
// Get the specific canvas element from the HTML document
canvas = document.getElementById('sketchpad');
// If the browser supports the canvas tag, get the 2d drawing context for this canvas
if (canvas.getContext)
    ctx = canvas.getContext('2d');

// Check that we have a valid context to draw on/with before adding event handlers
if (ctx) {
    // React to mouse events on the canvas, and mouseup on the entire document
    canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
    canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
    window.addEventListener('mouseup', sketchpad_mouseUp, false);
}
else {
    document.write("Browser not supported!!");
}

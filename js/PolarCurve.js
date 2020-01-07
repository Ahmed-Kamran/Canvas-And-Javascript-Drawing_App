////////////////////////////// Drawing App  //////////////////////////////////////////////////

var canvas,
    context,
    dragging = false,
    painting = false,
    dragStartLocation,
    lastXX = 0,
    lastYY = 0,
    snapshot,
    lastPoint,
    points = [],
    radius = 15;


function getCanvas(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;
    return {
        x: x,
        y: y
    };
}

function takesnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoresnapshot() {
    context.putImageData(snapshot, 0, 0);
}

//FOr getting Random Value
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Draw Star brush
function drawStar(options) {
    var length = 15;
    context.save();
    context.translate(options.x, options.y);
    context.beginPath();
    context.globalAlpha = options.opacity;
    context.rotate(Math.PI / 180 * options.angle);
    context.scale(options.scale, options.scale);
    context.strokeStyle = options.color;
    context.lineWidth = options.width;
    for (var i = 5; i--;) {
        context.lineTo(0, length);
        context.translate(0, length);
        context.rotate((Math.PI * 2 / 10));
        context.lineTo(0, -length);
        context.translate(0, -length);
        context.rotate(-(Math.PI * 6 / 10));
    }
    context.lineTo(0, length);
    context.closePath();
    context.stroke();
    context.restore();
}

function addRandomPoint(event) {
    points.push({
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top,
        angle: getRandomInt(0, 180),
        width: getRandomInt(1, 10),
        opacity: Math.random(),
        scale: getRandomInt(1, 20) / 10,
        color: ('rgb(' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ')')
    });
}

//draw line here
function drawLine(position) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();
    context.closePath();
}
//Draw circle here
function drawCircle(position) {
    var radius = Math.sqrt(
        Math.pow(dragStartLocation.x - position.x, 2) +
        Math.pow(dragStartLocation.y - position.y, 2)
    );
    context.beginPath();
    // context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
    context.arc(
        dragStartLocation.x,
        dragStartLocation.y,
        radius,
        0,
        2 * Math.PI,
        false
    );
    // context.fill();
}
//Polar Curve here
function polarCurve(position, sides) {
    var radius = Math.sqrt(
            Math.pow(dragStartLocation.x - position.x, 2) +
            Math.pow(dragStartLocation.y - position.y, 2)
        ),
        index = 0;

    context.beginPath();
    context.moveTo(position.x, position.y);
    for (index = 0; index <= 2 * Math.PI; index += 0.01) {
        var x =
            dragStartLocation.x + radius * Math.cos(sides * index) * Math.cos(index);
        var y =
            dragStartLocation.y - radius * Math.cos(sides * index) * Math.sin(index);
        context.lineTo(x, y);
    }
    context.closePath();
}
//Polygon design here
function drawPolygon(position, sides, angle) {
    var coordinate = [];
    var radius = Math.sqrt(
            Math.pow(dragStartLocation.x - position.x, 2) +
            Math.pow(dragStartLocation.y - position.y, 2)
        ),
        index = 0;
    for (index = 0; index < sides; index++) {
        coordinate.push({
            x: dragStartLocation.x + radius * Math.cos(angle),
            y: dragStartLocation.y - radius * Math.sin(angle)
        });
        angle += (2 * Math.PI) / sides;
    }
    context.beginPath();
    context.moveTo(coordinate[0].x, coordinate[0].y);
    for (index = 1; index < sides; index++) {
        context.lineTo(coordinate[index].x, coordinate[index].y);
    }
    context.closePath();
    // context.fill();
}

// Pen tool design here
function drawNewLinePath(event) {

    if (!dragging) return;
    points.push({
        a: event.clientX - canvas.getBoundingClientRect().left,
        b: event.clientY - canvas.getBoundingClientRect().top
    });

    context.beginPath();
    context.moveTo(points[0].a, points[0].b);
    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i].a, points[i].b);
    }
    context.stroke();
    // context.closePath();
}

// function midPointBtw(p1, p2) {
//     return {
//         x: p1.x + (p2.x - p1.x) / 2,
//         y: p1.y + (p2.y - p1.y) / 2
//     };
// }

///Brush star
function drawNewLineStar(event) {
    if (!dragging) return;

    addRandomPoint(event);

    // context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (var i = 0; i < points.length; i++) {
        drawStar(points[i]);
    }
}
//Brush Circle
function drawNewBrushCircle(event) {
    if (!dragging) return;

    points.push({
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top,
        radius: getRandomInt(5, 20),
        opacity: Math.random()
    });

    // context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (var i = 0; i < points.length; i++) {
        context.beginPath();
        context.globalAlpha = points[i].opacity;
        context.arc(
            points[i].x, points[i].y, points[i].radius,
            false, Math.PI * 2, false);
        context.fill();

    }
}
//start by shape name

function newDrawCircle(position) {
    var fillBox = document.getElementById("fillBox"),
        // shadow = document.getElementById('shadow'),
        shape = document.querySelector('input[type="radio"][name="shape"]:checked').value,
        // penClick = document.getElementById('pent').value,
        PolygonAngle = document.getElementById("PolygonAngle").value,
        polygonSize = document.getElementById("PolygonSize").value,

        lineCap = document.querySelector('input[type="radio"][name="lineCap"]:checked').value,
        composition = document.querySelector('input[type="radio"][name="brush"]:checked').value;
    context.lineCap = lineCap;
    context.globalCompositeOperation = composition;

    if (shape === "star") {
        drawNewLineStar(event);
    }

    if (shape === "bubble") {
        drawNewBrushCircle(event);
    }

    if (shape === "stroke") {
        drawNewLinePath(event);
    }
    if (shape === "circle") {
        drawCircle(position);
    }

    if (shape === "line") {
        drawLine(position);
    }

    if (shape === "polygon") {
        // drawPolygon(position, polygonSize, Math.PI / 4);
        drawPolygon(position, polygonSize, (PolygonAngle * Math.PI) / 180);
    }

    if (shape === "polarCurve") {
        polarCurve(position, polygonSize);
    }
    if (shape !== "line") {
        if (fillBox.checked) {
            context.fill();
        } else {
            context.stroke();
        }
    }
}
///////////-------------mouse event start from here--------------//////////////
function dragStart(event) {
    dragging = true;
    addRandomPoint(event);
    // lastPoint = { x: event.clientX, y: event.clientY };


    points.push({
        a: event.clientX - canvas.getBoundingClientRect().left,
        b: event.clientY - canvas.getBoundingClientRect().top,
        radius: getRandomInt(10, 30),
        opacity: Math.random()
    });
    dragStartLocation = getCanvas(event);

    takesnapshot();

    // drag(event);
}

function drag(event) {
    //   console.log(getCanvas(event));
    var position;
    if (dragging === true) {

        restoresnapshot();
        position = getCanvas(event);
        newDrawCircle(position);
        // newDrawCircle(event);
    }
}

function dragStop(event) {
    dragging = false;

    restoresnapshot();
    var position = getCanvas(event);

    newDrawCircle(position);
    points.length = 0;
}

//Drawing app extinsion for customize the style

function changeLineWidth() {
    context.lineWidth = this.value;
    event.stopPropagation();
}

function changeColorStyle() {
    context.fillStyle = this.value;
    event.stopPropagation();
}

function changeLineColorStyle() {
    context.strokeStyle = this.value;
    event.stopPropagation();
}

function changeBackgroundColor() {
    context.save();
    context.fillStyle = document.getElementById("backgroundColor").value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function shadowColorPick() {
    context.shadowColor = this.value;
    event.stopPropagation();
}

function shadowBlurSize() {
    context.shadowBlur = this.value;
    event.stopPropagation();
}

function eraseCanvas() {
    // context.clearRe();
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
    canvas = document.getElementById("draw");
    context = canvas.getContext("2d");

    // Call by id from Html
    var lineWidth = document.getElementById("LineWidth"),
        changeColor = document.getElementById("changeColor"),
        changeLineColor = document.getElementById("changeLineColor"),
        canvasColor = document.getElementById("backgroundColor"),
        clearCanvas = document.getElementById("clearCanvas"),
        shadowBlur = document.getElementById('shadow'),
        shadowColor = document.getElementById('shadowColor');
    // var ImgElement = document.getElementById("newImage");
    // context.fillStyle = context.createPattern(ImgElement, "repeat");

    //For random value such as color pick
    context.strokeStyle = changeLineColor.value;
    context.fillStyle = changeColor.value;
    context.lineWidth = lineWidth.value;
    context.shadowBlur = shadowBlur.value;
    context.shadowColor = shadowColor.value;


    //All the Eventlistener are here
    canvas.addEventListener("mousedown", dragStart, false);
    canvas.addEventListener("mousemove", drag, false);
    // canvas.addEventListener("mousemove", drawNewLine, false);
    canvas.addEventListener("mouseup", dragStop, false);
    lineWidth.addEventListener("input", changeLineWidth, false);
    changeColor.addEventListener("input", changeColorStyle, false);
    changeLineColor.addEventListener("input", changeLineColorStyle, false);
    canvasColor.addEventListener("input", changeBackgroundColor, false);
    clearCanvas.addEventListener("click", eraseCanvas, false);
    shadowColor.addEventListener('input', shadowColorPick, false);
    shadowBlur.addEventListener('input', shadowBlurSize, false);
}
window.addEventListener("load", init, false);
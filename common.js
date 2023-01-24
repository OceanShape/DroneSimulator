function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

function changeMode() {
    if (GLOBAL.isAllPOISet == false) {
        return;
    }
    if (GLOBAL.currentMode == Mode.SELECT) {
        setDrivingMode();
        includeHTML();
    } else {
        setSelectMode();
        includeHTML();
        clearIndicator();
    }
}

function keyReleaseCallback(event) {
    GLOBAL.keys[event.key] = false;
    for (key in GLOBAL.keys) {
        GLOBAL.keys[key] ? true : delete GLOBAL.keys[key];
    }
}

function keyPressCallback(event) {
    GLOBAL.keys[event.key] = true;

    let camera = GLOBAL.camera;
    let del = GLOBAL.droneDelta;

    if (GLOBAL.keys["w"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ front: del });
    }
    if (GLOBAL.keys["x"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ back: del });
    }

    if (GLOBAL.keys["d"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ right: del });
    }
    if (GLOBAL.keys["a"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ left: del });
    }

    if (GLOBAL.keys["c"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ up: del });
    }
    if (GLOBAL.keys["z"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ down: del });
    }

    if (GLOBAL.keys["s"]) {
        GLOBAL.droneDelta = 10 / del;
    }

    GLOBAL.droneToTargetDirection = getTargetDirection();

    drawLines();
    detectObjectAllDegree();

    printDrivingStatus();

    Module.XDRenderData();
    // printDroneStatus();
    // printDroneCamera();
}

function drawLines() {
    drawVerticalLine(getDronePosition(), "VERTICAL_LINE");
    // for (let degree = -180; degree < 180; degree += 45) {
    //     let str = "CHECK_" + degree;
    //     drawDroneLine(getDronePosition(), getCheckPosition(degree), str);
    // }
}

function mouseMoveCallback(event) {
    if (GLOBAL.MOUSE_BUTTON_PRESS && event.buttons == 1) {
        GLOBAL.TRACE_TARGET.direction += event.movementX * 0.5;
        GLOBAL.TRACE_TARGET.tilt += event.movementY * 0.5;

        drawLines();
        detectObjectAllDegree();
        printDrivingStatus();
    }
}

function setDetectedObjectColor() {
    let obj = GLOBAL.detectedObjectColor;
    let layer = Module.getTileLayerList().nameAtLayer("facility_build");
    layer.ClearDefineTileObjectStyle();
    for (var key in obj) {
        let color;
        if (obj[key] == 1) color = new Module.JSColor(255, 0, 0);
        else if (obj[key] == 2) color = new Module.JSColor(255, 255, 0);
        else color = new Module.JSColor(0, 255, 0);
        layer.SetDefineMeshColorByObjectKey(key, 2, color, false);
    }
    //new Module.JSColor(255, 0, 0)
}

function detectObjectAllDegree() {
    GLOBAL.detectedObjectColor = {};
    for (let degree = -180; degree < 180; degree += 45) {
        detectObject(degree);
    }
    setDetectedObjectColor();
}

// 1: 0~10, 2: 11~50, 3: 51~100
function detectObject(degree) {
    let layer = Module.getTileLayerList().nameAtLayer("facility_build");
    for (let i = 1; i < 4; ++i) {
        let pick = layer.getPickInfoAtView(
            getDronePosition(),
            getCheckPosition(degree, i)
        );

        if (pick != null) {
            let detectNum = 100;
            if (GLOBAL.detectedObjectColor[pick.objectKey] != null) {
                detectNum = Math.min(
                    GLOBAL.detectedObjectColor[pick.objectKey],
                    i
                );
            } else {
                detectNum = i;
            }
            GLOBAL.detectedObjectColor[pick.objectKey] = detectNum;
            return;
        }
    }
}

// 검증 완료
function getCheckPosition(degree, distanceNum) {
    let dronePos = getDronePosition();
    let rotatedPos = new Module.JSVector3D(
        dronePos.Longitude,
        dronePos.Latitude,
        dronePos.Altitude
    );
    let direct = getRadians(GLOBAL.camera.getDirect() + degree);
    let del = 0.001;
    if (distanceNum == 1) del = 0.0001;
    else if (distanceNum == 2) del = 0.0005;
    else if (distanceNum == 3) del = 0.001;

    rotatedPos.Longitude += del * Math.sin(direct);
    rotatedPos.Latitude += del * Math.cos(direct);

    return rotatedPos;
}

function mouseWheelCallback(event) {
    let deltaFOV = 1;
    let camera = GLOBAL.camera;
    let fov = camera.getFov();

    event.deltaY > 0 ? (fov += deltaFOV) : (fov -= deltaFOV);
    fov = clamp(fov, 10, 90);

    camera.setFov(fov);
    printDroneCamera();
}

function drawDroneLine(startPos, endPos, id) {
    let layer = GLOBAL.layerList.nameAtLayer("LINE_LAYER");
    if (layer == null) {
        layer = GLOBAL.layerList.createLayer("LINE_LAYER", Module.ELT_3DLINE);
    } else {
        layer.removeAtKey(id);
    }

    let line = Module.createLineString(id);

    let vertices = new Module.JSVec3Array();
    vertices.push(startPos);
    vertices.push(endPos);

    let part = new Module.Collection();
    part.add(2);

    line.setPartCoordinates(vertices, part);
    line.setUnionMode(false);

    let lineStyle = new Module.JSPolyLineStyle();
    lineStyle.setColor(new Module.JSColor(100, 0, 0, 255));
    lineStyle.setWidth(2.0);
    line.setStyle(lineStyle);

    layer.addObject(line, 0);
}

function drawVerticalLine(startPos, id) {
    let layer = GLOBAL.layerList.nameAtLayer("LINE_LAYER");
    if (layer == null) {
        layer = GLOBAL.layerList.createLayer("LINE_LAYER", Module.ELT_3DLINE);
    } else {
        layer.removeAtKey(id);
    }

    let line = Module.createLineString(id);

    let vertices = new Module.JSVec3Array();
    vertices.push(startPos);
    startPos.Altitude = 0.0;
    vertices.push(startPos);

    let part = new Module.Collection();
    part.add(2);

    line.setPartCoordinates(vertices, part);
    line.setUnionMode(false);

    let lineStyle = new Module.JSPolyLineStyle();
    lineStyle.setColor(new Module.JSColor(100, 0, 0, 255));
    lineStyle.setWidth(2.0);
    line.setStyle(lineStyle);

    layer.addObject(line, 0);
}

function mouseUpCallback() {
    GLOBAL.MOUSE_BUTTON_PRESS = false;
}

function mouseDownCallback() {
    GLOBAL.MOUSE_BUTTON_PRESS = true;
}

/* 마우스 & 키보드 이벤트 설정 */
function addSelectModeEvent() {
    Module.canvas.addEventListener("click", mouseClickCallback);
}

function removeSelectModeEvent() {
    Module.canvas.removeEventListener("click", mouseClickCallback);
}

function addDrivingModeEvent() {
    window.addEventListener("keypress", keyPressCallback);
    window.addEventListener("keyup", keyReleaseCallback);
    Module.canvas.addEventListener("mousemove", mouseMoveCallback);
    Module.canvas.addEventListener("mousewheel", mouseWheelCallback);
    Module.canvas.addEventListener("mouseup", mouseUpCallback);
    Module.canvas.addEventListener("mousedown", mouseDownCallback);
}

function removeDrivingModeEvent() {
    window.removeEventListener("keypress", keyPressCallback);
    Module.canvas.removeEventListener("mousemove", mouseMoveCallback);
    Module.canvas.removeEventListener("mousewheel", mouseWheelCallback);
}

function setItemValue(_div, _value) {
    let value =
        typeof _value == "number" ? "" + parseFloat(_value).toFixed(6) : _value;
    document.getElementById(_div).value = value;
}

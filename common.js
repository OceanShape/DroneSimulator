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

function updateTargetDirection() {
    let dronePos = GLOBAL.TRACE_TARGET.getObject().position;
    let targetPos = GLOBAL.POIPosition[1];
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

    if (GLOBAL.keys["w"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ front: 1.5 });
    }
    if (GLOBAL.keys["x"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ back: 1.5 });
    }

    if (GLOBAL.keys["d"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ right: 1.5 });
    }
    if (GLOBAL.keys["a"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ left: 1.5 });
    }

    if (GLOBAL.keys["c"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ up: 1.5 });
    }
    if (GLOBAL.keys["z"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ down: 1.5 });
    }

    // console.log(
    //     camera.getLocation().Longitude,
    //     camera.getLocation().Latitude,
    //     camera.getLocation().Altitude
    // );
    updateTargetDirection();

    camera.setLocation(camera.getLocation());

    Module.XDRenderData();
    // printDroneStatus();
    // printDroneCamera();
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

function mouseMoveCallback(event) {
    if (GLOBAL.MOUSE_BUTTON_PRESS && event.buttons == 1) {
        GLOBAL.TRACE_TARGET.direction += event.movementX * 0.5;
        GLOBAL.TRACE_TARGET.tilt += event.movementY * 0.5;
    }

    printDroneCamera();
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

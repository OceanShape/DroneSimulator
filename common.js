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

function setDroneDirection(activate) {
    if (activate == false) {
        clearInterval(GLOBAL.droneDirectionIntervalID);
    } else {
        GLOBAL.droneDirectionIntervalID = setInterval(function () {
            let direction = GLOBAL.camera.getDirect();
            if (Math.abs(direction - GLOBAL.preCameraDirection) < 0.000001) {
                clearInterval(GLOBAL.droneDirectionIntervalID);
                GLOBAL.droneDirection = direction;
            }
            GLOBAL.preCameraDirection = direction;
        }, 300);
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

    const deltaLonLat = 0.00005;
    const deltaAlt = 1;
    let camera = GLOBAL.camera;
    let direction = camera.getDirect();
    let pos = camera.getLocation();
    let radians = getRadians(GLOBAL.droneDirection);

    let delRight = 0.0;
    let delFront = 0.0;
    let delUp = 0.0;

    if (GLOBAL.keys["w"]) {
        delFront = deltaLonLat;
    }
    if (GLOBAL.keys["x"]) {
        delFront = -deltaLonLat;
    }

    if (GLOBAL.keys["d"]) {
        delRight = deltaLonLat;
    }
    if (GLOBAL.keys["a"]) {
        delRight = -deltaLonLat;
    }

    if (GLOBAL.keys["c"]) {
        delUp = deltaAlt;
    }
    if (GLOBAL.keys["z"]) {
        delUp = -deltaAlt;
    }

    // if (GLOBAL.keys["q"]) {
    //     GLOBAL.droneDirection -= deltaAlt;
    //     direction -= deltaAlt;
    // } else if (GLOBAL.keys["e"]) {
    //     GLOBAL.droneDirection += deltaAlt;
    //     direction += deltaAlt;
    // }

    // if (GLOBAL.keys["s"]) {
    //     direction = GLOBAL.droneDirection;
    //     camera.setTilt(10);
    // }

    GLOBAL.TRACE_TARGET.moveTarget({
        left: delRight,
        front: delFront,
        up: delUp,
    });

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

function mouseMoveCallback() {
    printDroneCamera();
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

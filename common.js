var GLOBAL = {
    engineDirectory: "./engine/",
    currentPath: null,
    drivingModePath: "./menu-driving-mode.html",
    selectModePath: "./menu-select-mode.html",
    startPOIImagePath: "./data/start.png",
    endPOIImagePath: "./data/end.png",
    POICount: 0,
    layer: null,
    images: null,
    POIPosition: null,
    isAllPOISet: false,
    droneDirection: 0.0,
    keys: [],
};

function getRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

function changeMode() {
    if (GLOBAL.isAllPOISet == false) {
        return;
    }
    if (GLOBAL.currentPath == GLOBAL.selectModePath) {
        setDrivingMode();
        includeHTML();
    } else {
        setSelectMode();
        includeHTML();
        clearPOI();
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
    let camera = Module.getViewCamera();
    let direction = camera.getDirect();
    let pos = camera.getLocation();
    let radians = getRadians(GLOBAL.droneDirection);
    let deltaSin = deltaLonLat * Math.sin(radians);
    let deltaCos = deltaLonLat * Math.cos(radians);

    if (GLOBAL.keys["w"]) {
        pos.Longitude += deltaSin;
        pos.Latitude += deltaCos;
    } else if (GLOBAL.keys["x"]) {
        pos.Longitude -= deltaSin;
        pos.Latitude -= deltaCos;
    }

    if (GLOBAL.keys["a"]) {
        pos.Longitude -= deltaCos;
        pos.Latitude += deltaSin;
    } else if (GLOBAL.keys["d"]) {
        pos.Longitude += deltaCos;
        pos.Latitude -= deltaSin;
    }

    if (GLOBAL.keys["q"]) {
        GLOBAL.droneDirection -= deltaAlt;
        direction -= deltaAlt;
    } else if (GLOBAL.keys["e"]) {
        GLOBAL.droneDirection += deltaAlt;
        direction += deltaAlt;
    }

    if (GLOBAL.keys["c"]) {
        pos.Altitude += deltaAlt;
    } else if (GLOBAL.keys["z"]) {
        pos.Altitude -= deltaAlt;
    }

    if (GLOBAL.keys["s"]) {
        direction = GLOBAL.droneDirection;
        camera.setTilt(10);
    }

    Module.getViewCamera().moveLonLatAlt(
        pos.Longitude,
        pos.Latitude,
        pos.Altitude,
        true
    );
    Module.XDRenderData();
    camera.setDirect(direction);
    printDroneStatus();
    printDroneCamera();
}

function mouseWheelCallback(event) {
    let deltaFOV = 1;
    let camera = Module.getViewCamera();
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

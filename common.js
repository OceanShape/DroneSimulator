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
};

function getRadians(degrees) {
    return (degrees * Math.PI) / 180;
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

function keyPressCallback(event) {
    const deltaLonLat = 0.00005;
    const deltaAlt = 1;
    let camera = Module.getViewCamera();
    let direction = camera.getDirect();
    let pos = camera.getLocation();
    let radians = getRadians(GLOBAL.droneDirection);
    let deltaSin = deltaLonLat * Math.sin(radians);
    let deltaCos = deltaLonLat * Math.cos(radians);

    if (event.key === "w" || event.key === "W") {
        pos.Longitude += deltaSin;
        pos.Latitude += deltaCos;
    } else if (event.key === "x" || event.key === "X") {
        pos.Longitude -= deltaSin;
        pos.Latitude -= deltaCos;
    }

    if (event.key === "a" || event.key === "A") {
        pos.Longitude -= deltaCos;
        pos.Latitude += deltaSin;
    } else if (event.key === "d" || event.key === "D") {
        pos.Longitude += deltaCos;
        pos.Latitude -= deltaSin;
    }

    if (event.key === "q" || event.key === "Q") {
        GLOBAL.droneDirection -= deltaAlt;
        direction -= deltaAlt;
    } else if (event.key === "e" || event.key === "E") {
        GLOBAL.droneDirection += deltaAlt;
        direction += deltaAlt;
    }

    if (event.key === "c" || event.key === "C") {
        pos.Altitude += deltaAlt;
    } else if (event.key === "z" || event.key === "Z") {
        pos.Altitude -= deltaAlt;
    }

    if (event.key === "s" || event.key === "S") {
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

    if (fov < 10) fov = 10;
    else if (fov > 90) fov = 90;

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

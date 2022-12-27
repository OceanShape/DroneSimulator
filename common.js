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
};

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
    const deltaLonLat = 0.0001;
    const deltaAlt = 1;
    let camera = Module.getViewCamera();
    let direction = camera.getDirect();
    let pos = camera.getLocation();

    if (event.key === "w" || event.key === "W") {
        pos.Longitude += deltaLonLat;
    } else if (event.key === "x" || event.key === "X") {
        pos.Longitude -= deltaLonLat;
    }

    if (event.key === "a" || event.key === "A") {
        pos.Latitude += deltaLonLat;
    } else if (event.key === "d" || event.key === "D") {
        pos.Latitude -= deltaLonLat;
    }

    if (event.key === "c" || event.key === "C") {
        pos.Altitude += deltaAlt;
    } else if (event.key === "z" || event.key === "Z") {
        pos.Altitude -= deltaAlt;
    }

    Module.getViewCamera().moveLonLatAlt(
        pos.Longitude,
        pos.Latitude,
        pos.Altitude,
        true
    );
    camera.setDirect(direction);
    printDronePosition(pos);
}

function wheelCallback() {
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

    Module.canvas.addEventListener("wheel", wheelCallback);
}

function removeDrivingModeEvent() {
    window.removeEventListener("keypress", keyPressCallback);

    Module.canvas.removeEventListener("mousemove", mouseMoveCallback);

    Module.canvas.removeEventListener("wheel", wheelCallback);
}

function setItemValue(_div, _value) {
    let value =
        typeof _value == "number" ? "" + parseFloat(_value).toFixed(6) : _value;
    document.getElementById(_div).value = value;
}

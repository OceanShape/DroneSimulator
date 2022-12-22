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
};

function changeMode() {
    // check POICOUNT
    GLOBAL.currentPath == GLOBAL.selectModePath
        ? setDrivingMode()
        : setSelectMode();
    includeHTML();
    // if (GLOBAL.POIPosition[0] != null) {
    //     let pos = GLOBAL.POIPosition[0];
    //     console.log(pos);
    //     setItemValue("select_start_longitude", pos.Longitude);
    //     setItemValue("select_start_latitude", pos.Latitude);
    //     setItemValue("select_start_altitude", pos.Altitude);
    //     pos = GLOBAL.POIPosition[1];
    //     setItemValue("select_end_longitude", pos.Longitude);
    //     setItemValue("select_end_latitude", pos.Latitude);
    //     setItemValue("select_end_altitude", pos.Altitude);
    // }
}

function keyPressCallback(event) {
    const delta = 0.0001;
    pos = Module.getViewCamera().getLocation();

    if (event.key === "w" || event.key === "W") {
        pos.Longitude += delta;
    } else if (event.key === "x" || event.key === "X") {
        pos.Longitude -= delta;
    }

    if (event.key === "a" || event.key === "A") {
        pos.Latitude += delta;
    } else if (event.key === "d" || event.key === "D") {
        pos.Latitude -= delta;
    }

    if (event.key === "c" || event.key === "C") {
        pos.Altitude += 10;
    } else if (event.key === "z" || event.key === "Z") {
        pos.Altitude -= 10;
    }

    Module.getViewCamera().moveLonLatAlt(
        pos.Longitude,
        pos.Latitude,
        pos.Altitude,
        true
    );
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
        typeof _value == Number ? "" + parseFloat(_value).toFixed(6) : _value;
    document.getElementById(_div).value = value;
}

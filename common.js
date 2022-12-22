var GLOBAL = {
    engineDirectory: "./engine/",
    currentPath: null,
    drivingModePath: "./menu-driving-mode.html",
    selectModePath: "./menu-select-mode.html",
    startPOIImagePath: "./data/start.png",
    endPOIImagePath: "./data/end.png",
    POICount: 0,
};

function changeMode() {
    GLOBAL.currentPath == GLOBAL.selectModePath
        ? setDrivingMode()
        : setSelectMode();
    includeHTML();
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

function mouseClickCallback(event) {
    // 화면->지도 좌표 변환
    var screenPosition = new Module.JSVector2D(event.x, event.y);
    printPOIPosition(Module.getMap().ScreenToMapPointEX(screenPosition));

    console.log(GLOBAL.POICount);

    GLOBAL.POICount =
        GLOBAL.POICount < 2 ? GLOBAL.POICount + 1 : GLOBAL.POICount;
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
    let div = document.getElementById(_div);
    div.value = "" + parseFloat(_value).toFixed(6);
}

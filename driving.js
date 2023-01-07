function setDrivingMode() {
    let camera = GLOBAL.camera;
    let control = Module.getControl();
    let startPos = GLOBAL.POIPosition[0];
    let endPos = GLOBAL.POIPosition[1];
    startPos.Altitude += 10;

    GLOBAL.camera.setMoveMode(true);
    GLOBAL.camera.moveLonLatAlt(
        startPos.Longitude,
        startPos.Latitude,
        startPos.Altitude,
        true
    );
    GLOBAL.camera.look(startPos, endPos);
    // set drone direction code is in common.js

    control.setKeyControlEnable(false);
    control.setMouseZoomMode(false);
    removeSelectModeEvent();
    addDrivingModeEvent();

    setDroneDirection(true);

    GLOBAL.currentMode = Mode.DRIVING;

    document.getElementById("model-loader").style.visibility = "visible";
}

function printDroneStatus() {
    let pos = GLOBAL.camera.getLocation();
    setItemValue("driving_longitude", pos.Longitude);
    setItemValue("driving_latitude", pos.Latitude);
    setItemValue("driving_altitude", pos.Altitude);
    setItemValue("driving_drone_direct", GLOBAL.droneDirection);
}

function printDroneCamera() {
    let camera = GLOBAL.camera;
    setItemValue("driving_tilt", camera.getTilt());
    setItemValue("driving_direct", camera.getDirect());
    setItemValue("driving_fov", camera.getFov());
}

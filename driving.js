// POI 가시 거리 늘리는 법 찾아서 추가하기
function setDrivingMode() {
    let camera = Module.getViewCamera();
    let control = Module.getControl();
    let startPos = GLOBAL.POIPosition[0];
    let endPos = GLOBAL.POIPosition[1];
    startPos.Altitude += 10;

    camera.setMoveMode(true);
    camera.moveLonLatAlt(
        startPos.Longitude,
        startPos.Latitude,
        startPos.Altitude,
        true
    );
    camera.look(startPos, endPos);

    control.setKeyControlEnable(false);
    control.setMouseZoomMode(false);
    removeSelectModeEvent();
    addDrivingModeEvent();

    GLOBAL.currentPath = GLOBAL.drivingModePath;
}

function printDroneStatus() {
    let camera = Module.getViewCamera();
    let pos = camera.getLocation();
    setItemValue("driving_longitude", pos.Longitude);
    setItemValue("driving_latitude", pos.Latitude);
    setItemValue("driving_altitude", pos.Altitude);
    setItemValue("driving_drone_direct", camera.getDirect());
}

function printDroneCamera() {
    let camera = Module.getViewCamera();
    setItemValue("driving_tilt", Math.floor(camera.getTilt()));
    setItemValue("driving_direct", Math.floor(camera.getDirect()));
    setItemValue("driving_fov", Math.floor(camera.getFov()));
}

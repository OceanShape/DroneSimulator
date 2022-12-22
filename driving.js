function setDrivingMode() {
    let camera = Module.getViewCamera();
    let control = Module.getControl();

    lon = 127.0235631310443;
    lat = 37.53784745806899;
    alt = 800.193708020262;

    camera.setMoveMode(true);
    camera.moveLonLatAlt(lon, lat, alt, true);
    camera.setTilt(20.0);

    control.setKeyControlEnable(false);
    control.setMouseZoomMode(false);
    removeSelectModeEvent();
    addDrivingModeEvent();

    GLOBAL.currentPath = GLOBAL.drivingModePath;
}

function printDronePosition(pos) {
    setItemValue("driving_longitude", pos.Longitude);
    setItemValue("driving_latitude", pos.Latitude);
    setItemValue("driving_altitude", pos.Altitude);
}

function printDroneCamera() {
    let camera = Module.getViewCamera();
    setItemValue("driving_tilt", Math.floor(camera.getTilt()));
    setItemValue("driving_direct", Math.floor(camera.getDirect()));
    setItemValue("driving_fov", Math.floor(camera.getFov()));
}

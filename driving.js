function setDrivingMode() {
    let control = Module.getControl();
    let startPos = GLOBAL.POIPosition[0];
    let endPos = GLOBAL.POIPosition[1];
    startPos.Altitude += 10;

    let camera = GLOBAL.camera;
    camera.setMoveMode(true);
    camera.moveLonLatAlt(
        startPos.Longitude,
        startPos.Latitude,
        startPos.Altitude,
        true
    );
    camera.look(startPos, endPos);
    // set drone direction code is in common.js

    if (GLOBAL.isGhostSymbolLoaded == false) {
        loadModel(startPos);
        GLOBAL.isGhostSymbolLoaded = true;
    } else {
        setTraceTarget(startPos);
    }

    drawArrow(endPos);

    control.setKeyControlEnable(false);
    control.setMouseZoomMode(false);
    removeSelectModeEvent();
    addDrivingModeEvent();

    GLOBAL.currentMode = Mode.DRIVING;

    document.getElementById("model-loader").style.visibility = "visible";
}

function clearGhostSymbol() {
    GLOBAL.layerList
        .nameAtLayer("GHOST_SYMBOL_LAYER")
        .removeAtKey("DRONE_DRIVING");
}

function loadModel(startPos) {
    Module.getGhostSymbolMap().insert({
        id: "DRONE",
        url: "./data/drone/drone_simulator.3ds",
        callback: function (e) {
            setTraceTarget(startPos);
        },
    });
}

function setTraceTarget(startPos) {
    let model = Module.createGhostSymbol("DRONE_DRIVING");
    model.setBasePoint(0.0, 0.0, 0.0);
    model.setScale(new Module.JSSize3D(0.2, 0.2, 0.2));
    model.setGhostSymbol("DRONE");
    model.setPosition(startPos);
    GLOBAL.layerList.nameAtLayer("GHOST_SYMBOL_LAYER").addObject(model, 0);

    GLOBAL.droneToTargetDirection = getTargetDirection();

    let traceTarget = Module.createTraceTarget(model.getId());
    traceTarget.set({
        object: model,
        tilt: 10.0,
        direction: GLOBAL.droneToTargetDirection,
        distance: 200.0,
    });

    GLOBAL.TRACE_TARGET = traceTarget;

    let camera = Module.getViewCamera();
    camera.setTraceTarget(GLOBAL.TRACE_TARGET);
    camera.setTraceActive(true);

    drawVerticalLine(getDronePosition(), "VERTICAL_LINE");
}

function drawArrow(target) {
    target.Altitude += 30;

    let arrow = Module.CreateArrow("ARROW");
    arrow.Create(
        target,
        0.0,
        90.0,
        10,
        1,
        0.2,
        2.0,
        new Module.JSColor(255, 255, 0, 0)
    );

    GLOBAL.layerList.nameAtLayer("POI_LAYER").addObject(arrow, 0);
}

function printDrivingStatus() {
    printDroneStatus();
    printDroneCamera();
    printTargetPosition();
}

function printDroneStatus() {
    let pos = getDronePosition();
    setItemValue("driving_longitude", pos.Longitude);
    setItemValue("driving_latitude", pos.Latitude);
    setItemValue(
        "driving_altitude",
        pos.Altitude -
            Module.getMap().getTerrHeightFast(pos.Longitude, pos.Latitude)
    );
}

function printDroneCamera() {
    let camera = GLOBAL.camera;
    let direct = camera.getDirect();
    direct %= 360;
    if (direct >= 360) direct -= 360;
    else if (direct < 0) direct += 360;
    setItemValue("driving_tilt", camera.getTilt());
    setItemValue("driving_direct", direct);
    setItemValue("driving_fov", camera.getFov());
}

function printTargetPosition() {
    let pos = GLOBAL.POIPosition[1];
    setItemValue("driving_end_longitude", pos.Longitude);
    setItemValue("driving_end_latitude", pos.Latitude);
    setItemValue("driving_end_altitude", pos.Altitude);
}

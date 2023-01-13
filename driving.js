function setDrivingMode() {
    let control = Module.getControl();
    let startPos = GLOBAL.POIPosition[0];
    let endPos = GLOBAL.POIPosition[1];
    //startPos.Altitude += 10;

    GLOBAL.camera.setMoveMode(true);
    GLOBAL.camera.moveLonLatAlt(
        startPos.Longitude,
        startPos.Latitude,
        startPos.Altitude,
        true
    );
    GLOBAL.camera.look(startPos, endPos);
    // set drone direction code is in common.js

    loadModel(startPos);

    drawArrow(endPos);

    control.setKeyControlEnable(false);
    control.setMouseZoomMode(false);
    removeSelectModeEvent();
    addDrivingModeEvent();

    setDroneDirection(true);

    GLOBAL.currentMode = Mode.DRIVING;

    document.getElementById("model-loader").style.visibility = "visible";
}

// 위치 추적 모델 생성
function loadModel(startPos) {
    loadTargetModel(function (model) {
        var traceTarget = Module.createTraceTarget(model.getId());
        traceTarget.set({
            object: model,
            tilt: 10.0,
            direction: 0.0,
            distance: 200.0,
        });

        GLOBAL.TRACE_TARGET = traceTarget;

        var camera = Module.getViewCamera();
        camera.setTraceTarget(GLOBAL.TRACE_TARGET);
        camera.setTraceActive(GLOBAL.isTraceActive);
    }, startPos);
}

/* 모델 객체 생성 */
function loadTargetModel(_callback, startPos) {
    Module.getGhostSymbolMap().insert({
        id: "drone",
        url: "./data/drone/drone_simulator.3ds",
        callback: function (e) {
            var model = Module.createGhostSymbol("drone");

            // base point 설정
            model.setBasePoint(0.0, 0.0, 0.0);
            model.setScale(new Module.JSSize3D(0.2, 0.2, 0.2));
            model.setGhostSymbol("drone");
            model.setPosition(startPos);

            _callback(model);
        },
    });
}

function drawArrow(target) {
    target.Altitude += 30;

    let arrow = Module.CreateArrow("ARROW");
    arrow.Create(
        target,
        0.0,
        90.0,
        10,
        5,
        0.1,
        3.0,
        new Module.JSColor(255, 255, 0, 0)
    );

    GLOBAL.layer.addObject(arrow, 0);
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

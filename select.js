function setSelectMode() {
    let camera = Module.getViewCamera();
    let control = Module.getControl();

    lon = 126.91534283205316;
    lat = 37.53060216016567;
    alt = 836.298700842075;

    camera.setMoveMode(false);
    camera.moveLonLatAlt(lon, lat, alt, true);
    camera.setTilt(90.0);

    control.setKeyControlEnable(true);
    control.setMouseZoomMode(true);
    removeDrivingModeEvent();
    addSelectModeEvent();

    GLOBAL.currentPath = GLOBAL.selectModePath;
}

function mouseClickCallback(event) {
    // 화면->지도 좌표 변환
    let mapPosition = Module.getMap().ScreenToMapPointEX(
        new Module.JSVector2D(event.x, event.y)
    );

    if (GLOBAL.POICount < 2) {
        createPOI(mapPosition);
        printPOIPosition(mapPosition);
        GLOBAL.POICount += 1;
        if (GLOBAL.POICount == 2) {
            GLOBAL.isAllPOISet = true;
        }
    }
}

function printPOIPosition(pos) {
    switch (GLOBAL.POICount) {
        case 0:
            setItemValue("select_start_longitude", pos.Longitude);
            setItemValue("select_start_latitude", pos.Latitude);
            setItemValue("select_start_altitude", pos.Altitude);
            break;
        case 1:
            setItemValue("select_end_longitude", pos.Longitude);
            setItemValue("select_end_latitude", pos.Latitude);
            setItemValue("select_end_altitude", pos.Altitude);
            break;
        default:
    }
}

function createPOI(pos) {
    var imagePath = [GLOBAL.startPOIImagePath, GLOBAL.endPOIImagePath];
    var imageText = ["START", "END"];
    var idx = GLOBAL.POICount;
    var img = GLOBAL.images;

    GLOBAL.POIPosition.push(pos);

    img.push(new Image());

    img[idx].onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img[idx].width;
        canvas.height = img[idx].height;
        ctx.drawImage(img[idx], 0, 0);

        var poi = Module.createPoint("POI" + idx);
        poi.setPosition(
            new Module.JSVector3D(pos.Longitude, pos.Latitude, pos.Altitude)
        );
        poi.setImage(
            ctx.getImageData(0, 0, this.width, this.height).data,
            this.width,
            this.height
        );
        poi.setText(imageText[idx]);

        GLOBAL.layer.addObject(poi, 0);
    };

    img[idx].src = imagePath[idx];
}

function clearPOI() {
    setItemValue("select_start_longitude", "-");
    setItemValue("select_start_latitude", "-");
    setItemValue("select_start_altitude", "-");
    setItemValue("select_end_longitude", "-");
    setItemValue("select_end_latitude", "-");
    setItemValue("select_end_altitude", "-");
    GLOBAL.isAllPOISet = false;
    GLOBAL.POICount = 0;
    GLOBAL.POIPosition = [];
    GLOBAL.images = [];
    var layer = GLOBAL.layer;
    for (let i = 0; i < 2; i++) {
        layer.removeAtKey("POI" + i);
    }
}

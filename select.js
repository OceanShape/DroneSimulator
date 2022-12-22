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

    GLOBAL.POICount = 0;
    GLOBAL.currentPath = GLOBAL.selectModePath;
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

function loadPOIImage() {}

function createPOI() {
    var layerList = new Module.JSLayerList(true);
    var layer = layerList.createLayer("POI_LAYER", Module.ELT_3DPOINT);

    var imagePath = [GLOBAL.startPOIImagePath, GLOBAL.endPOIImagePath];
    var imageText = ["START", "END"];
    var img = [];
    for (let i = 0; i < 2; i++) {
        img.push(new Image());
        img[i].onload = function () {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = img[i].width;
            canvas.height = img[i].height;
            ctx.drawImage(img[i], 0, 0);

            var poi = Module.createPoint("MY_POI");
            poi.setPosition(
                new Module.JSVector3D(
                    126.91534283205316 + 0.001 * i,
                    37.53060216016567,
                    13.315417
                )
            );
            poi.setImage(
                ctx.getImageData(0, 0, this.width, this.height).data,
                this.width,
                this.height
            );
            poi.setText(imageText[i]);

            layer.addObject(poi, 0);
        };
        img[i].src = imagePath[i];
    }
}

function clearPOI() {}

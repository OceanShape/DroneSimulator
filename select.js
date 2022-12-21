function setSelectMode() {
    removeEvent()
	Module.getViewCamera().setMoveMode(false)
	
	let control = Module.getControl()
	control.setKeyControlEnable(true)
	control.setMouseZoomMode(true)

	//createPOI()
}

function loadPOIImage() {

}

function createPOI() {
  var layerList = new Module.JSLayerList(true);
  var layer = layerList.createLayer("POI_LAYER", Module.ELT_3DPOINT);

  var imagePath = [GLOBAL.startPOIImagePath, GLOBAL.endPOIImagePath];
	var imageText = ['START', 'END']
  var img = []
	for (let i = 0; i < 2; i++) {
		img.push(new Image())
		img[i].onload = function() {
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = img[i].width;
			canvas.height = img[i].height;
			ctx.drawImage(img[i], 0, 0);
			
			var poi = Module.createPoint("MY_POI");
			poi.setPosition(new Module.JSVector3D(126.91534283205316 + 0.001 * i, 37.53060216016567, 13.315417));
			poi.setImage(ctx.getImageData(0, 0, this.width, this.height).data, this.width, this.height);
			poi.setText(imageText[i]);
	
			layer.addObject(poi, 0);
		};
		img[i].src = imagePath[i];
	}
}

function clearPOI() {}

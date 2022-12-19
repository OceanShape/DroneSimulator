var GLOBAL = {
	engineDirectory : "./engine/",
	currentFilePath : null,
	FPFilePath : "./menu-driving-mode.html",
	TPFilePath : "./menu-select-mode.html"
}

function setMove() {
	let camera = Module.getViewCamera();
	let lon, lat, alt;

	lon = getItemValue("u_txt_lon");
	lat = getItemValue("u_txt_lat");
	alt = getItemValue("u_txt_alt");

	lon *= 1;
	lat *= 1;
	alt *= 1;

	let pos = new Module.JSVector3D(lon, lat, alt);
	camera.setLocation(pos);
	camera.setTilt()
}

function changeMode() {
	let camera = Module.getViewCamera()
	var lon, lat, alt, tilt
	if (GLOBAL.currentFilePath == GLOBAL.FPFilePath) {
		GLOBAL.currentFilePath = GLOBAL.TPFilePath
		lon = 126.91534283205316
		lat = 37.53060216016567
		alt = 836.298700842075
		setSelectMode()
	} else {
		GLOBAL.currentFilePath = GLOBAL.FPFilePath
		lon = 127.0235631310443
		lat = 37.53784745806899
		alt = 8017.193708020262
		setDrivingMode()
	}
	camera.setLocation(new Module.JSVector3D(lon, lat, alt));
	camera.setTilt(90.0)
	includeHTML()
}

/* 마우스 & 키보드 이벤트 설정 */
function initEvent(_canvas) {
	window.addEventListener("keydown", function(e) {
		console.log(e);
	});

	_canvas.addEventListener('mousemove', function(e) {
		console.log("MOUSE event");
	});
}

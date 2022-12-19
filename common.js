var GLOBAL = {
	engineDirectory : "./engine/",
	currentFilePath : null,
	FPFilePath : "./menu-driving-mode.html",
	TPFilePath : "./menu-select-mode.html"
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
function initEvent() {
	window.addEventListener("keypress", function(e) {
		printPosition()
	});

	Module.canvas.addEventListener('mousemove', function(e) {
		printCamera()
	});

	Module.canvas.addEventListener('wheel', function(e) {
		printCamera()
	});
}

function setItemValue(_div, _value) {
	let div = document.getElementById(_div);
	div.value = "" + _value;
}

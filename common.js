var GLOBAL = {
	engineDirectory : "./engine/",
	currentPath : null,
	drivingModePath : "./menu-driving-mode.html",
	selectModePath : "./menu-select-mode.html",
	startPOIImagePath : "./data/start.png",
	endPOIImagePath : "./data/end.png"
}

function changeMode() {
	let camera = Module.getViewCamera()
	var lon, lat, alt
	if (GLOBAL.currentPath == GLOBAL.drivingModePath) {
		GLOBAL.currentPath = GLOBAL.selectModePath
		lon = 126.91534283205316
		lat = 37.53060216016567
		alt = 836.298700842075
		setSelectMode()
		camera.setTilt(90.0)
	} else {
		GLOBAL.currentPath = GLOBAL.drivingModePath
		lon = 127.0235631310443
		lat = 37.53784745806899
		alt = 800.193708020262
		setDrivingMode()
		camera.setTilt(20.0)
	}
	Module.getViewCamera().moveLonLatAlt(lon, lat, alt, true)
	includeHTML()
}

/* 마우스 & 키보드 이벤트 설정 */
function addEvent() {
	window.addEventListener("keypress", function(e) {
		const delta = 0.0001
		pos = Module.getViewCamera().getLocation()

		if (e.key === 'w' || e.key === 'W') {
			pos.Longitude += delta
		} else if (e.key === 'x' || e.key === 'X') {
			pos.Longitude -= delta
		}

		if (e.key === 'a' || e.key === 'A') {
			pos.Latitude += delta
		} else if (e.key === 'd' || e.key === 'D') {
			pos.Latitude -= delta
		}

		if (e.key === 'c' || e.key === 'C') {
			pos.Altitude += 10
		} else if (e.key === 'z' || e.key === 'Z') {
			pos.Altitude -= 10
		}

		Module.getViewCamera().moveLonLatAlt(pos.Longitude, pos.Latitude, pos.Altitude, true)
		printPosition(pos)
	});

	Module.canvas.addEventListener('mousemove', function(e) {
		let camera = Module.getViewCamera()
		printCamera(camera)
	});

	Module.canvas.addEventListener('wheel', function(e) {
		printCamera()
	});
}

function removeEvent() {
	window.addEventListener("keypress", function(e) {
		const delta = 0.0001
		pos = Module.getViewCamera().getLocation()

		if (e.key === 'w' || e.key === 'W') {
			pos.Longitude += delta
		} else if (e.key === 'x' || e.key === 'X') {
			pos.Longitude -= delta
		}

		if (e.key === 'a' || e.key === 'A') {
			pos.Latitude += delta
		} else if (e.key === 'd' || e.key === 'D') {
			pos.Latitude -= delta
		}

		if (e.key === 'c' || e.key === 'C') {
			pos.Altitude += 10
		} else if (e.key === 'z' || e.key === 'Z') {
			pos.Altitude -= 10
		}

		Module.getViewCamera().moveLonLatAlt(pos.Longitude, pos.Latitude, pos.Altitude, true)
		printPosition(pos)
	});

	Module.canvas.addEventListener('mousemove', function(e) {
		let camera = Module.getViewCamera()
		printCamera(camera)
	});

	Module.canvas.addEventListener('wheel', function(e) {
		printCamera()
	});
}

function setItemValue(_div, _value) {
	let div = document.getElementById(_div);
	div.value = "" + _value;
}

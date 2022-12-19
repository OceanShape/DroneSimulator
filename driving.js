function setDrivingMode() {
	initEvent()
	Module.getViewCamera().setMoveMode(true)
}

function printPosition() {
	console.log("position")
	let pos = Module.getViewCamera().getLocation()

	setItemValue("driving_longitude", pos.Longitude)
	setItemValue("driving_latitude", pos.Latitude)
	setItemValue("driving_altitude", pos.Altitude)
}

function printCamera() {
	let cam = Module.getViewCamera()
	let tilt = Math.floor(cam.getTilt())
	let direct = Math.floor(cam.getDirect())
	let fov = Math.floor(cam.getFov())

	setItemValue("driving_tilt", tilt)
	setItemValue("driving_direct", direct)
	setItemValue("driving_fov", fov)
}

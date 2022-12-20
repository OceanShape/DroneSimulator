function setDrivingMode() {
	addEvent()
	Module.getViewCamera().setMoveMode(true)
	
	let control = Module.getControl()
	control.setKeyControlEnable(false)
	control.setMouseZoomMode(false)
}

function printPosition(pos) {
	setItemValue("driving_longitude", pos.Longitude)
	setItemValue("driving_latitude", pos.Latitude)
	setItemValue("driving_altitude", pos.Altitude)
}

function printCamera(camera) {
	setItemValue("driving_tilt", Math.floor(camera.getTilt()))
	setItemValue("driving_direct", Math.floor(camera.getDirect()))
	setItemValue("driving_fov", Math.floor(camera.getFov()))
}

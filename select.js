function setSelectMode() {
    removeEvent()
	Module.getViewCamera().setMoveMode(false)
	
	let control = Module.getControl()
	control.setKeyControlEnable(true)
	control.setMouseZoomMode(true)
}

function clearPOI() {}

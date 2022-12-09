var GLOBAL = {
	engineDirectory : "./engine/",

	TRACE_TARGET : null,
	
	MOUSE_BUTTON_PRESS : false,
	KEY_PRESS_w : false,
	KEY_PRESS_s : false,
	KEY_PRESS_a : false,
	KEY_PRESS_d : false,
	KEY_PRESS_e : false,
	KEY_PRESS_q : false
}

// 엔진 로드 후 실행할 초기화 함수(Module.postRun)
function init() {

	// 엔진 초기화 API 호출(필수)
	Module.Start(window.innerWidth, window.innerHeight);

	// 카메라 설정
	var camera = Module.getViewCamera();
	camera.setLocation(new Module.JSVector3D(129.1454803323809, 35.15384277119935, 300.0));
	camera.setLimitTilt(-88.0);

	// 위치 추적 모델 생성
	loadTargetModel(function(model) {

		var traceTarget = Module.createTraceTarget(model.getId());
		traceTarget.set({
			object : model,
			tilt : 45.0,
			direction : 180.0,
			distance : 1.0
		});
		
		GLOBAL.TRACE_TARGET = traceTarget;
		
		var camera = Module.getViewCamera();
		camera.setTraceTarget(GLOBAL.TRACE_TARGET);
		camera.setTraceActive(true);
	});

	// 건물 레이어 추가
	Module.XDEMapCreateLayer("facility_build", "https://xdworld.vworld.kr", 0, true, true, false, 9, 0, 15);

	initEvent(Module.canvas)
	setInterval(renewObjectMoving, 50);
}

/* 모델 객체 생성 */
function loadTargetModel(_callback) {

	Module.getGhostSymbolMap().insert({
		
		id: "car",	
		url : "./data/car.3ds",
		callback: function(e) {

			var model = Module.createGhostSymbol("car");
		
			// base point 설정
			model.setBasePoint(0.0, -0.2, 0.0);
			model.setScale(new Module.JSSize3D(1.0, 1.0, 1.0));
			model.setGhostSymbol("car");
			model.setPosition(new Module.JSVector3D(129.1454803323809, 35.15384277119935, 3.161871349439025));	
			
			_callback(model);
		}
	});
}

/* 키 조작에 따른 오브젝트 위치 이동 */
function renewObjectMoving() {

	if (GLOBAL.TRACE_TARGET == null) {
		return;
	}

	var move_front = 0.0;
	var move_right = 0.0;
	var move_up = 0.0;

	if (GLOBAL["KEY_PRESS_w"]) {
		move_front = 1.0;
        console.log("front")
	} else if (GLOBAL["KEY_PRESS_s"]) {
		move_front = -1.0;
        console.log("back")
	} else;

	if (GLOBAL["KEY_PRESS_a"]) {
		move_right = -1.0;
        console.log("left")
	} else if (GLOBAL["KEY_PRESS_d"]) {
		move_right = 1.0;
        console.log("right")
	} else;

	if (GLOBAL["KEY_PRESS_e"]) {
		move_up = 1.0;
		console.log("up")
	} else if (GLOBAL["KEY_PRESS_q"]) {
		move_up = -1.0;
        console.log("down")
	} else;

	GLOBAL.TRACE_TARGET.move(move_front, move_right, true);
	Module.XDRenderData();
}

/* 마우스 & 키보드 이벤트 설정 */
function initEvent(_canvas) {

	// 키보드 이벤트 설정
	window.addEventListener('keydown', function(e) {
		GLOBAL["KEY_PRESS_"+e.key] = true;
	});
	window.addEventListener('keyup', function(e) {
		GLOBAL["KEY_PRESS_"+e.key] = false;
	});

	// 마우스 이벤트 설정
	_canvas.addEventListener('mousedown', function(e) {
		GLOBAL.MOUSE_BUTTON_PRESS = true;
	});

	_canvas.addEventListener('mouseup', function(e) {
		GLOBAL.MOUSE_BUTTON_PRESS = false;
	});

	_canvas.addEventListener('mousemove', function(e) {
		
		if (GLOBAL.MOUSE_BUTTON_PRESS) {

			// Mouse left button
			if (e.buttons == 2) {
				
				GLOBAL.TRACE_TARGET.direction += (e.movementX*0.5);
				GLOBAL.TRACE_TARGET.tilt += (e.movementY*0.5);
			}
		}
	});

	_canvas.addEventListener('wheel', function(e) {

		if (e.wheelDelta < 0) {
			GLOBAL.TRACE_TARGET.distance *= 1.10;
		} else {
			GLOBAL.TRACE_TARGET.distance *= 0.90;
		}
	});
}

// 엔진 파일 로드
;(function(){   	

	// 1. XDWorldEM.asm.js 파일 로드
	var file = GLOBAL.engineDirectory + "XDWorldEM.asm.js";
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', file, true);
	xhr.onload = function() {
	
		var script = document.createElement('script');
		script.innerHTML = xhr.responseText;
		document.body.appendChild(script);
		
		// 2. XDWorldEM.html.mem 파일 로드
		setTimeout(function() {
			(function() {
				var memoryInitializer = GLOBAL.engineDirectory + "XDWorldEM.html.mem";
				var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
        		xhr.open('GET', memoryInitializer, true);
					xhr.responseType = 'arraybuffer';
					xhr.onload =  function(){
						
						// 3. XDWorldEM.js 파일 로드
						var url = GLOBAL.engineDirectory + "XDWorldEM.js";
						var xhr = new XMLHttpRequest();
						xhr.open('GET',url , true);
						xhr.onload = function(){
							var script = document.createElement('script');
							script.innerHTML = xhr.responseText;
							document.body.appendChild(script);
						};
						xhr.send(null);
					}
					xhr.send(null);
				})();
			}, 1);
		};
		xhr.send(null);
	}
)();

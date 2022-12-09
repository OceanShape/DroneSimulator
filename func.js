var GLOBAL = {
	engineDirectory : "./engine/",

	MOUSE_BUTTON_PRESS : false,
	KEY_PRESS_w : false,
	KEY_PRESS_s : false,
	KEY_PRESS_a : false,
	KEY_PRESS_d : false,
	KEY_PRESS_e : false,
	KEY_PRESS_q : false,

	CAMERA_LONGITUDE : 126.927885,
	CAMERA_LATITUDE : 37.518085,
	CAMERA_ALTITUDE : 50.0,
	CAMERA_DIRECT : 0.0
}

// 엔진 로드 후 실행할 초기화 함수(Module.postRun)
function init() {

	// 엔진 초기화 API 호출(필수)
	Module.Start(window.innerWidth, window.innerHeight);

	// 카메라 설정
	var camera = Module.getViewCamera();
	camera.setLocation(new Module.JSVector3D(GLOBAL.CAMERA_LONGITUDE, GLOBAL.CAMERA_LATITUDE, GLOBAL.CAMERA_ALTITUDE));
	//camera.setMoveMode(true); // 1인칭 : 카메라가 제자리에서 회전
	camera.setTilt(10);

	// 건물 레이어 추가
	Module.XDEMapCreateLayer("facility_build", "https://xdworld.vworld.kr", 0, true, true, false, 9, 0, 15);

	initEvent(Module.canvas)
}

// move 정의
// 입력 좌표로 카메라 뷰를 이동
// 카메라 위치 좌표 반환은 canvas.onmouseup 참조
function setMove() {

	console.log(GLOBAL.CAMERA_LONGITUDE, GLOBAL.CAMERA_LATITUDE, GLOBAL.CAMERA_ALTITUDE);
	let camera = Module.getViewCamera();	// 카메라 클래스 불러오기
	let pos = new Module.JSVector3D(GLOBAL.CAMERA_LONGITUDE, GLOBAL.CAMERA_LATITUDE, GLOBAL.CAMERA_ALTITUDE);		// 경위도를  JSVector3D 형태로 변경
	camera.setAltitude(GLOBAL.CAMERA_ALTITUDE);	
	camera.setLocation(pos);							// 카메라 이동 ( getLocation 통해 현재값 반환)
}

/* 키 조작에 따른 오브젝트 위치 이동: 수정 필요 */
function renewObjectMoving() {

	var move_delta = 0.00001;

	if (GLOBAL["KEY_PRESS_w"]) {
		GLOBAL.CAMERA_LONGITUDE += move_delta;
	} else if (GLOBAL["KEY_PRESS_s"]) {
		GLOBAL.CAMERA_LONGITUDE -= move_delta;
	} else;

	if (GLOBAL["KEY_PRESS_a"]) {
		GLOBAL.CAMERA_LATITUDE += move_delta;
	} else if (GLOBAL["KEY_PRESS_d"]) {
		GLOBAL.CAMERA_LATITUDE -= move_delta;
	} else;

	if (GLOBAL["KEY_PRESS_e"]) {
		GLOBAL.CAMERA_ALTITUDE += 1;
	} else if (GLOBAL["KEY_PRESS_q"]) {
		GLOBAL.CAMERA_ALTITUDE -= 1;
		setMove();
	} else;

	//setMove();
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

	// _canvas.addEventListener('mousemove', function(e) {

	// 	if (GLOBAL.MOUSE_BUTTON_PRESS) {
	// 		console.log("MOUSE button")

	// 		// Mouse left button
	// 		if (e.buttons == 2) {
	// 			GLOBAL.TRACE_TARGET.direction += (e.movementX*0.5);
	// 			GLOBAL.TRACE_TARGET.tilt += (e.movementY*0.5);
	// 		}
	// 	}
	// });

	// _canvas.addEventListener('wheel', function(e) {
	// 	console.log("wheel")
	// 	if (e.wheelDelta < 0) {
	// 		GLOBAL.TRACE_TARGET.distance *= 1.10;
	// 	} else {
	// 		GLOBAL.TRACE_TARGET.distance *= 0.90;
	// 	}
	// });
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

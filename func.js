var GLOBAL = {
	engineDirectory : "./engine/",
}

// 엔진 로드 후 실행할 초기화 함수(Module.postRun)
function init() {

	document.getElementById('content').innerHTML = "./fp.html"

	Module.Start(window.innerWidth, window.innerHeight);

	var camera = Module.getViewCamera();

	Module.XDEMapCreateLayer("facility_build", "https://xdworld.vworld.kr", 0, true, true, false, 9, 0, 15);

	//initEvent(Module.canvas)
}

function changeTest() {
	var host = document.getElementById("site");
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

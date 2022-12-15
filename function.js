var GLOBAL = {
	engineDirectory : "./engine/",
	currentFilePath : null,
	FPFilePath : "./menu-driving-mode.html",
	TPFilePath : "./menu-select-mode.html"
}

// 엔진 로드 후 실행할 초기화 함수(Module.postRun)
function init() {

	//document.getElementById("data").innerHTML="./fp.html";

	Module.Start(window.innerWidth, window.innerHeight);

	var camera = Module.getViewCamera();

	Module.XDEMapCreateLayer("facility_build", "https://xdworld.vworld.kr", 0, true, true, false, 9, 0, 15);

	GLOBAL.canvas = Module.canvas

	GLOBAL.currentFilePath = GLOBAL.TPFilePath

	camera.setLocation(new Module.JSVector3D(126.91534283205316, 37.53060216016567, 836.298700842075));

	includeHTML()
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

function clearPOI() {
	
}

function changeMode() {
	let camera = Module.getViewCamera()
	var lon, lat, alt, tilt
	if (GLOBAL.currentFilePath == GLOBAL.FPFilePath) {
		GLOBAL.currentFilePath = GLOBAL.TPFilePath
		lon = 126.91534283205316
		lat = 37.53060216016567
		alt = 836.298700842075
	} else {
		GLOBAL.currentFilePath = GLOBAL.FPFilePath
		lon = 127.0235631310443
		lat = 37.53784745806899
		alt = 8017.193708020262
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

// HTML 인클루드
function includeHTML() {
	var includeElements = document.getElementsByClassName("include-html")
	for (var element of includeElements) {
		var xhttp;
		var file = GLOBAL.currentFilePath
		if (file) {
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					if (this.status == 200) {element.innerHTML = this.responseText;}
					if (this.status == 404) {element.innerHTML = "Page not found.";}
				}
			}
			xhttp.open("GET", file, true);
			xhttp.send();
			return;
		}
	}
}

// 엔진 파일 로드
(function(){

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

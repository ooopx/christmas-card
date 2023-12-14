

var trees = 4;
var baubles = 13;
var misc = 3;

function loadStickers() {
	for (var i = 0; i < trees; i++) {
		temp='<button><img src="assets/tree/tree'+(i+1)+'.png"></button>';
		$( ".trees" ).append( temp );
	}
	for (var i = 0; i < baubles; i++) {
		temp='<button><img src="assets/baubles/bauble'+(i+1)+'.png"></button>';
		$( ".baubles" ).append( temp );
	}
	for (var i = 0; i < misc; i++) {
		temp='<button><img src="assets/misc/misc'+(i+1)+'.png"></button>';
		$( ".misc" ).append( temp );
	}
}




var canvas, stage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;

function init() {
	// create stage and point it to the canvas:
	canvas = document.getElementById("cardCanvas");
	stage = new createjs.Stage(canvas);

	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);

	// enabled mouse over / out events
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

	// load the source image:

numStickers = 0;

$( ".stickersGrid" ).on( "click","button", function (event) {
	numStickers += 1;
	var imgsrc = event.target.attributes["src"].nodeValue.toString();
	console.log(event.target.attributes["src"].nodeValue.toString());
	handleImageClick(imgsrc, numStickers);
});
}

function stop() {
	createjs.Ticker.removeEventListener("tick", tick);
}

function handleImageClick(imgsrc, temp) {
	var image = new Image();
	console.log(imgsrc);
	image.src = imgsrc;
	var bitmap;
	var container = new createjs.Container();
	stage.addChild(container);

	// create a shape that represents the center of the daisy image:
		var hitArea = new createjs.Shape();
		hitArea.graphics.beginFill("#FFF").drawRect(-image.width/2,-image.height/2, image.width, image.height);
		// position hitArea relative to the internal coordinate system of the target bitmap instances:
		hitArea.x = image.width / 2;
		hitArea.y = image.height / 2;

	// create and populate the screen with random daisies:
	
		bitmap = new createjs.Bitmap(image);
		container.addChild(bitmap);
		bitmap.x = canvas.width * Math.random() | 0;
		bitmap.y = canvas.height * Math.random() | 0;
		bitmap.regX = bitmap.image.width /2 | 0;
		bitmap.regY = bitmap.image.height /2 | 0;
        bitmap.scale = bitmap.originalScale = Math.random() * 0.2;
        bitmap.name = "bmp_" + temp;
		bitmap.cursor = "pointer";

		// assign the hit area:
			bitmap.hitArea = hitArea;

		bitmap.addEventListener("mousedown", function (evt) {
				// bump the target in front of its siblings:
				var o = evt.target;
				o.parent.addChild(o);
				o.offset = {x: o.x - evt.stageX, y: o.y - evt.stageY};
			});

			// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
			bitmap.addEventListener("pressmove", function (evt) {
				var o = evt.target;
				o.x = evt.stageX + o.offset.x;
				o.y = evt.stageY + o.offset.y;
				// indicate that the stage should be updated on the next tick:
				update = true;
			});

			bitmap.addEventListener("rollover", function (evt) {
				var o = evt.target;
				o.scale = o.originalScale * 1.2;
				update = true;
			});

			bitmap.addEventListener("rollout", function (evt) {
				var o = evt.target;
				o.scale = o.originalScale;
				update = true;
			});


	createjs.Ticker.addEventListener("tick", tick);
} 

function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}
}

$( document ).ready(function() {
	init();
	loadStickers();
	
});


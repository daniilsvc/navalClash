var userid;
var gameid;
var gameStatus = 1;

var cnv1, ctx1;
var cnv2, ctx2;
var cellSize, offsetWidth, offsetHeight;
var connection;

var lastHitedx = -1;
var lastHitedy = -1;
var lastHitedType = -1;

var yourField, opponentField;

$(document).ready(function() {
	userid = $("#userid").val();
	gameid = $("#gameid").val();

	yourField = [];
	opponentField = [];

	for (var i = 0; i < 10; ++i) {
		yourField[i] = [];
		opponentField[i] = [];

		for (var j = 0; j < 10; ++j) {
			yourField[i][j] = 0;
			opponentField[i][j] = 0;
		}
	}

	$(window).resize(onInitAndResize);
	$("#modalButton").bind("click", function() {
		$("#modalDiv").hide();
		$("#modalWindow").hide();
	});

	onInitAndResize();

	// WebSocket connection part
	connection = new WebSocket("ws://localhost:5030");

	connection.onmessage = onMessage;

	connection.onopen = function(e) {
		connection.send("open " + gameid + " " + userid);
	};

	$("#backDiv").bind("click", function() {
		connection.send("close " + gameid + " " + userid);
		document.location.href = "main.php";
	});

});

function onInitAndResize() {
	var body = $("body");
	var headerDiv = $("#headerDiv");
	var cnvDiv = $("#cnvDiv");
	var user1Div = $("#user1Div");
	var user1Header = $("#user1Header");
	cnv1 = $("#cnv1");
	var user2Div = $("#user2Div");
	var user2Header = $("#user2Header");
	cnv2 = $("#cnv2");

	var menuDiv = $("#menuDiv");
	var infoDiv = $("#infoDiv");
	var backDiv = $("#backDiv");

	body.width($(window).width());
	body.height($(window).height());

	headerDiv.width(body.width());
	$("#headerDiv span:first-child").css("letter-spacing", body.width() * 0.03 + "px");

	if (body.width() >= body.height()) {

		cnvDiv.width(body.width() * 0.9);
		cnvDiv.height(body.height() - headerDiv.height() - 10 - 18);

		user1Div.width(cnvDiv.width() / 2);
		user1Div.height(cnvDiv.height());

		user2Div.width(cnvDiv.width() / 2);
		user2Div.height(cnvDiv.height());

		user1Div.css({
			"top" : "0px",
			"left" : "0px"
		});

		user2Div.css({
			"top" : "0px",
			"left" : user1Div.width() + "px"
		});

		menuDiv.width(body.width() * 0.1);
		menuDiv.height(cnvDiv.height());

		menuDiv.css({
			"top" : (body.height() - cnvDiv.height()) + "px",
			"left" : cnvDiv.width() + "px"
		});

		infoDiv.width(menuDiv.width() * 0.7);
		backDiv.width(infoDiv.width());

		infoDiv.height(Math.floor((menuDiv.height() - 10) / 2));
		backDiv.height(infoDiv.height());

		infoDiv.css({
			"top" : "0px",
			"left" : "0px"
		});

		backDiv.css({
			"top" : (infoDiv.height() + 4) + "px",
			"left" : "0px"
		});

		$("#backDiv span").css({
			"top" : (backDiv.height() - $("#backDiv span").height()) / 2 + "px",
			"left" : "0px"
		});

	} else {

		cnvDiv.width(body.width());
		cnvDiv.height(body.height() * 0.9 - headerDiv.height() - 10 - 18);

		user1Div.width(cnvDiv.width());
		user1Div.height(cnvDiv.height() / 2);

		user2Div.width(cnvDiv.width());
		user2Div.height(cnvDiv.height() / 2);

		user1Div.css({
			"top" : "0px",
			"left" : "0px"
		});

		user2Div.css({
			"top" : user1Div.height() + "px",
			"left" : "0px"
		});

		menuDiv.width(cnvDiv.width());
		menuDiv.height(body.height() * 0.1);

		menuDiv.css({
			"top" : (body.height() * 0.9) + "px",
			"left" : "0px"
		});

		infoDiv.width(Math.floor((menuDiv.width() - 10) / 2));
		backDiv.width(infoDiv.width());

		infoDiv.height(menuDiv.height() * 0.7);
		backDiv.height(infoDiv.height());

		infoDiv.css({
			"top" : "0px",
			"left" : "0px"
		});

		backDiv.css({
			"top" : "0px",
			"left" : (infoDiv.width() + 4) + "px"
		});

		$("#backDiv span").css({
			"top" : (backDiv.height() - $("#backDiv span").height()) / 2 + "px",
			"left" : "0px"
		});
	}


	// modal Window (active on game ends)

	var modalDiv = $("#modalDiv");
	var modalWindow = $("#modalWindow");
	var modalText = $("#modalText");
	var modalTextSpan = $("#modalText div");
	var modalButton = $("#modalButton");
	var modalButtonSpan = $("#modalButton div");

	modalWindow.width(modalDiv.width() * 0.4);
	modalWindow.height(modalDiv.height() * 0.4);

	modalButtonSpan.css("font-size", modalWindow.height() * 0.2);
	modalTextSpan.css({
		"font-size" : modalWindow.height() * 0.18,
		"letter-spacing" : modalWindow.width() * 0.03
	});

	modalText.height(modalWindow.height() - modalButton.height());

	modalTextSpan.css({
		"top" : (modalText.height() - modalTextSpan.height()) / 2 + "px"
	});

	modalButtonSpan.css({
		"top" : (modalButton.height() - modalButtonSpan.height()) / 2 + "px"
	});

	modalWindow.css({
		"top" : (modalDiv.height() - modalWindow.height()) / 2 + "px",
		"left" : (modalDiv.width() - modalWindow.width()) / 2 + "px"
	});

	// canvas prepare and redraw
	cnv1.width(user1Div.width());
	cnv1.height(user1Div.height() - user1Header.height());

	cnv2.width(user2Div.width());
	cnv2.height(user2Div.height() - user2Header.height());

	ctx1 = cnv1[0].getContext("2d");
	ctx2 = cnv2[0].getContext("2d");

	cellSize = Math.min(cnv1.width(), cnv1.height()) * 0.085;
	offsetHeight = (cnv1.height() - cellSize * 10) / 2;
	offsetWidth = (cnv1.width() - cellSize * 10) / 2;

	drawFields();
}

function drawFields() {

	cnv1[0].width = cnv1.width();
	cnv1[0].height = cnv1.height();

	cnv2[0].width = cnv2.width();
	cnv2[0].height = cnv2.height();

	ctx1.beginPath();

	for (var i = 0; i <= 10; ++i) {
		ctx1.moveTo(offsetWidth + i * cellSize, offsetHeight);
		ctx1.lineTo(offsetWidth + i * cellSize, offsetHeight + 10 * cellSize);
		ctx1.moveTo(offsetWidth, offsetHeight + i * cellSize);
		ctx1.lineTo(offsetWidth + 10 * cellSize, offsetHeight + i * cellSize);
	}

	ctx1.stroke();
	ctx1.closePath();

	if (gameStatus != 0) {
	   
		for (var i = 0; i <= 10; ++i) {
			ctx2.beginPath();

			ctx2.moveTo(offsetWidth + i * cellSize, offsetHeight);
			ctx2.lineTo(offsetWidth + i * cellSize, offsetHeight + 10 * cellSize);
			ctx2.moveTo(offsetWidth, offsetHeight + i * cellSize);
			ctx2.lineTo(offsetWidth + 10 * cellSize, offsetHeight + i * cellSize);

			ctx2.stroke();
			ctx2.closePath();
		}

		var letterWidth = cellSize  / 2;
	
		ctx2.beginPath(); 	
		ctx2.font = letterWidth + "px Cursive";
		ctx2.textAlighn = "center";
		ctx2.fillStyle = "#000000";

		for (var i = 0; i < 10; ++i) {
			ctx2.fillText((i + 1) + "", offsetWidth - letterWidth * 1.5, offsetHeight + cellSize * i + cellSize * 0.7);
			ctx2.fillText(String.fromCharCode(97 + i), offsetWidth + cellSize * i + cellSize * 0.4, offsetHeight - letterWidth * 0.5);
		}

		ctx2.closePath();

	} else {
		cnv2[0].width = cnv2.width();
		cnv2[0].height = cnv2.height();

		ctx2.beginPath();
		ctx2.textAlign = "center";
		ctx2.font = (Math.min(cnv2[0].width, cnv2[0].height) * 0.1) + "px cursive";
		ctx2.fillText("Not Ready", cnv2[0].width / 2, cnv2[0].height / 2);
		ctx2.closePath();
	}


	var letterWidth = cellSize / 2;
	ctx1.beginPath();
	ctx1.font = letterWidth + "px Cursive";
	ctx1.textAlign = "center";
	ctx1.fillStyle = "#000000";

	for (var i = 0; i < 10; ++i) {
		ctx1.fillText((i + 1) + "", offsetWidth - letterWidth, offsetHeight + cellSize * i + cellSize * 0.7);
		ctx1.fillText(String.fromCharCode(97 + i), offsetWidth + cellSize * i + cellSize * 0.4, offsetHeight - letterWidth * 0.5);
	}
	
	ctx1.closePath();

	for (var i = 0; i < 10; ++i) {
		for (var j = 0; j < 10; ++j) {
			drawYourCell(i, j);

			if (gameStatus != 0)
				drawOpponentCell(i, j);
		}
	}
}

function drawYourCell(i, j) {

	ctx1.beginPath();

	if (yourField[i][j] == 0) {

		ctx1.fillStyle = "#ffffff";
		ctx1.fillRect(offsetWidth + j * cellSize + 1, offsetHeight + i * cellSize + 1, cellSize - 2, cellSize - 2);
		     
	} else if (yourField[i][j] == 1) {

		ctx1.fillStyle = "#33CC99";
		ctx1.fillRect(offsetWidth + j * cellSize + 2, offsetHeight + i * cellSize + 2, cellSize - 4, cellSize - 4);

	} else if (yourField[i][j] == 2) {

		if (lastHitedType != -1 && lastHitedy == i && lastHitedx == j) {
			ctx1.fillStyle = "yellow";
			ctx1.fillRect(offsetWidth + j * cellSize + 2, offsetHeight + i * cellSize + 2, cellSize - 4, cellSize - 4);
		}

		ctx1.fillStyle = "#000000";

		var blackCellSize = cellSize * 0.3;
		var boffset = (cellSize - blackCellSize) / 2;
		ctx1.fillRect(offsetWidth + j * cellSize + boffset, offsetHeight + i * cellSize + boffset, blackCellSize, blackCellSize);

	} else if (yourField[i][j] == 3) {

		if (lastHitedType == -1 || (lastHitedy != i || lastHitedx != j)) {
			ctx1.fillStyle = "#33CC99";
		} else {
			ctx1.fillStyle = "yellow";
		}

		ctx1.fillRect(offsetWidth + j * cellSize + 2, offsetHeight + i * cellSize + 2, cellSize - 4, cellSize - 4);

		ctx1.strokeStyle = "#CC3300";
		ctx1.lineWidth = 3;
		ctx1.moveTo(offsetWidth + j * cellSize + 4, offsetHeight + i * cellSize + 4);
		ctx1.lineTo(offsetWidth + (j + 1) * cellSize - 4, offsetHeight + (i + 1) * cellSize - 4);
		ctx1.moveTo(offsetWidth + j * cellSize + 4, offsetHeight + (i + 1) * cellSize - 4);
		ctx1.lineTo(offsetWidth + (j + 1) * cellSize - 4, offsetHeight + i * cellSize + 4);

		ctx1.stroke();
	}

	ctx1.closePath();
}

function drawOpponentCell(i, j) {
	ctx2.beginPath();

	if (opponentField[i][j] == 0) {

		ctx2.fillStyle = "#ffffff";
		ctx2.fillRect(offsetWidth + j * cellSize + 1, offsetHeight + i * cellSize + 1, cellSize - 2, cellSize - 2);

	} else if (opponentField[i][j] == 1) {

		ctx2.fillStyle = "#009933";
		ctx2.fillRect(offsetWidth + j * cellSize + 2, offsetHeight + i * cellSize + 2, cellSize - 4, cellSize - 4);

	} else if (opponentField[i][j] == 2) {

		ctx2.fillStyle = "#000000";

		var blackCellSize = cellSize * 0.3;
		var boffset = (cellSize - blackCellSize) / 2;

		ctx2.fillRect(offsetWidth + j * cellSize + boffset, offsetHeight + i * cellSize + boffset, blackCellSize, blackCellSize);

	} else if (opponentField[i][j] == 3) {

		ctx2.strokeStyle = "#CC3300";
		ctx2.lineWidth = 3;
		ctx2.moveTo(offsetWidth + j * cellSize + 4, offsetHeight + i * cellSize + 4);
		ctx2.lineTo(offsetWidth + (j + 1) * cellSize - 4, offsetHeight + (i + 1) * cellSize - 4);
		ctx2.moveTo(offsetWidth + j * cellSize + 4, offsetHeight + (i + 1) * cellSize - 4);
		ctx2.lineTo(offsetWidth + (j + 1) * cellSize - 4, offsetHeight + i * cellSize + 4);

		ctx2.stroke();
	}

	ctx2.closePath();
}

function onMessage(e) {
	var msg = e.data.split(" ");

	lastHitedType = -1;

	if (msg[0] == "getFields") {
		var status = msg[1];
		var field1 = msg[2];
		var field2 = msg[3];

		for (var i = 0; i < 100; ++i) {

			var x = (i % 10);
			var y = Math.floor(i / 10);

			yourField[x][y] = field1[i];
			opponentField[x][y] = field2[i];
		}

		if (status == 1) {

			$("#infoDiv").css("background-color", "#66FF66");
			$("#cnv2").bind("click", onOpponentFieldClick);

		} else if (status == 2) {

			$("#infoDiv").css("background-color", "#FF6666");
			$("#cnv2").unbind("click", onOpponentFieldClick);

		} else if (status == 0) {
			$("#infoDiv").css("background-color", "#FFFF66");
			$("#cnv2").unbind("click", onOpponentFieldClick);
		} 

		gameStatus = status;
		drawFields();

	} else if (msg[0] == "getStatus") {

		var status = msg[1];
		var value = msg[2];
		var x = parseInt(msg[3]);
		var y = parseInt(msg[4]);
		var fieldType = msg[5];

		gameStatus = status;

		if (fieldType == 1) {
			yourField[y][x] = value;

			lastHitedy = y;
			lastHitedx = x;

			if (yourField[y][x] == 2) {
				lastHitedType = 0;
			} else if (yourField[y][x] == 3) {
				lastHitedType = 1;
			} else
				lastHitedType = -1;

		} else {
			opponentField[y][x] = value;
		}

		if (status == 0) {

			$("#infoDiv").css("background-color", "#FFFF66");
			$("#cnv2").unbind("click", onOpponentFieldClick);

		} else if (status == 1) {

			$("#infoDiv").css("background-color", "#66FF66");
			$("#cnv2").bind("click", onOpponentFieldClick);

		} else if (status == 2) {

			$("#infoDiv").css("background-color", "#FF6666");
			$("#cnv2").unbind("click", onOpponentFieldClick);

		} else if (status == 3) {

			$("#cnv2").unbind("click", onOpponentFieldClick);

			var modalDiv = $("#modalDiv");
			var modalWindow = $("#modalWindow");
			var modalText = $("#modalText");
			var modalTextSpan = $("#modalText div");
			var modalButton = $("#modalButton");
			var modalButtonSpan = $("#modalButton div");

			modalDiv.show();
			modalWindow.show();

			modalTextSpan.html("You Win!");

			modalWindow.width(modalDiv.width() * 0.4);
			modalWindow.height(modalDiv.height() * 0.4);

			modalButtonSpan.css("font-size", modalWindow.height() * 0.2);
			modalTextSpan.css({
				"font-size" : modalWindow.height() * 0.18,
				"letter-spacing" : modalWindow.width() * 0.03
			});

			modalText.height(modalWindow.height() - modalButton.height());

			modalTextSpan.css({
				"top" : (modalText.height() - modalTextSpan.height()) / 2 + "px"
			});

			modalButtonSpan.css({
				"top" : (modalButton.height() - modalButtonSpan.height()) / 2 + "px"
			});

			modalWindow.css({
				"top" : (modalDiv.height() - modalWindow.height()) / 2 + "px",
				"left" : (modalDiv.width() - modalWindow.width()) / 2 + "px"
			});

			$("#infoDiv").css("background-color", "#66FF66");

		} else if (status == 4) {

			$("#cnv2").unbind("click", onOpponentFieldClick);

			var modalDiv = $("#modalDiv");
			var modalWindow = $("#modalWindow");
			var modalText = $("#modalText");
			var modalTextSpan = $("#modalText div");
			var modalButton = $("#modalButton");
			var modalButtonSpan = $("#modalButton div");

			modalDiv.show();
			modalWindow.show();

			modalTextSpan.html("You Lose!");

			modalWindow.width(modalDiv.width() * 0.4);
			modalWindow.height(modalDiv.height() * 0.4);

			modalButtonSpan.css("font-size", modalWindow.height() * 0.2);
			modalTextSpan.css({
				"font-size" : modalWindow.height() * 0.18,
				"letter-spacing" : modalWindow.width() * 0.03
			});

			modalText.height(modalWindow.height() - modalButton.height());

			modalTextSpan.css({
				"top" : (modalText.height() - modalTextSpan.height()) / 2 + "px"
			});

			modalButtonSpan.css({
				"top" : (modalButton.height() - modalButtonSpan.height()) / 2 + "px"
			});

			modalWindow.css({
				"top" : (modalDiv.height() - modalWindow.height()) / 2 + "px",
				"left" : (modalDiv.width() - modalWindow.width()) / 2 + "px"
			});

			$("#infoDiv").css("background-color", "#66FF66");
		}

		drawFields();
	}

	return;
}
 	
function onOpponentFieldClick(e) {
	var x = Math.floor((e.offsetX - offsetWidth) / cellSize);
	var y = Math.floor((e.offsetY - offsetHeight) / cellSize);

	if (x < 0 || x > 9 || y < 0 || y > 9)
		return;

	if (opponentField[y][x] != 0)
		return;

	$("#infoDiv").css("background-color", "#FFFF66");
	$("#cnv2").unbind("click", onOpponentFieldClick);

	connection.send("move " + gameid + " " + userid + " " + x + " " + y);
}
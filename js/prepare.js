var cellWidth, offsetWidth, offsetHeight, letterWidth;
var cnv, ctx;

var markColor = "#FF9933";
var valField = [];
var deckers = [];
var copyField = [];

$(window).load(function() {

	$(window).resize(onInitAndResize);
	$("#navyField").click(onFieldClick);
	$("#rBtn").click(onReadyBtnClick);
	$("#backBtn").click(function() {
		document.location.href = "main.php"
	});

	for (var i = 0; i < 10; ++i) {
		valField[i] = [];
		copyField[i] = [];
		for (var j = 0; j < 10; ++j) {
			valField[i][j] = 0;
			copyField[i][j] = 0;
		}
	}

	onInitAndResize();
});

function onInitAndResize() {
	var body = $("body");
	var headerDiv = $("#headerDiv");
	var mainDiv = $("#mainDiv");
	var navyField = $("#navyField");
	var readyBtn = $("#readyBtn");
	var rBtn = $("#rBtn");
	var backBtn = $("#backBtn");

	body.width($(window).width());
	body.height($(window).height());

	headerDiv.width(body.width());
	$("#headerDiv span:first-child").css("letter-spacing", body.width() * 0.03 + "px");

	mainDiv.width(body.width());
	mainDiv.height(body.height() - headerDiv.height() - 18 - 10);

	mainDiv.css({
		"left" : "0px",
		"top" : (headerDiv.height() + 28) + "px"
	});

	// layout variant
	if (body.width() >= body.height()) {

		navyField.width(mainDiv.width() * 0.75);
		navyField.height(mainDiv.height());

		readyBtn.width(mainDiv.width() * 0.25);
		readyBtn.height(mainDiv.height());
		readyBtn.css({
			"left" : navyField.width() + "px",
			"top" : "0px"
		});

		rBtn.width(readyBtn.width());
		rBtn.height(readyBtn.height() / 2);
		rBtn.css({
			"top" : "0px",
			"left" : "0px"
		});

		backBtn.width(readyBtn.width());
		backBtn.height(readyBtn.height() / 2);
		backBtn.css({
			"top" : rBtn.height() + "px",
			"left" : "0px"
		});

	} else {

		navyField.width(mainDiv.width());
		navyField.height(mainDiv.height() * 0.75);

		readyBtn.width(mainDiv.width());
		readyBtn.height(mainDiv.height() * 0.25);
		readyBtn.css({
			"top" : navyField.height() + "px",
			"left" : "0px"
		});

		rBtn.width(readyBtn.width() / 2);
		rBtn.height(readyBtn.height());
		rBtn.css({
			"top" : "0px",
			"left" : "0px"
		});

		backBtn.width(readyBtn.width() / 2);
		backBtn.height(readyBtn.height());
		backBtn.css({
			"top" : "0px",
			"left" : rBtn.width() + "px"
		});
	}

	console.log(body.width());
	console.log(body.height());

	var rBtnSpan = $("#rBtn div");
	var backBtnSpan = $("#backBtn div");

	rBtnSpan.css("font-size", (0.15 * Math.min(rBtn.height(), rBtn.width())) + "px");
	backBtnSpan.css("font-size", (0.15 * Math.min(rBtn.height(), rBtn.width())) + "px");

	rBtnSpan.css({
		"top" : (rBtn.height() - rBtnSpan.height()) / 2 + "px",
		"left" : (rBtn.width() - rBtnSpan.width()) / 2 + "px"
	});

	backBtnSpan.css({
		"top" : (backBtn.height() - backBtnSpan.height()) / 2 + "px",
		"left" : (backBtn.width() - backBtnSpan.width()) / 2 + "px"
	});

	cnv = navyField[0];
	ctx = cnv.getContext("2d");
	cnv.width = navyField.width();
	cnv.height = navyField.height();

	cellWidth = 0.08 * Math.min(cnv.width, cnv.height);
	offsetHeight = (cnv.height - 10 * cellWidth) / 2;
	offsetWidth = (cnv.width - 10 * cellWidth) / 2;
	letterWidth = cellWidth * 0.5;

	redrawField();
}

function redrawField() {
	ctx.beginPath();

	for (var i = 0; i <= 10; ++i) {
		ctx.moveTo(offsetWidth, offsetHeight + cellWidth * i);
		ctx.lineTo(offsetWidth + 10 * cellWidth, offsetHeight + cellWidth * i);

		ctx.moveTo(offsetWidth + cellWidth * i, offsetHeight);
		ctx.lineTo(offsetWidth + cellWidth * i, offsetHeight + 10 * cellWidth);
	}

	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.font = letterWidth + "px Cursive";

	for (var i = 0; i < 10; ++i) {
		ctx.fillText((i + 1) + "", offsetWidth - letterWidth * 1.5, offsetHeight + cellWidth * i + cellWidth * 0.7);
		ctx.fillText(String.fromCharCode(97 + i), offsetWidth + cellWidth * i + cellWidth * 0.4, offsetHeight - letterWidth * 0.5);
	}

	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = markColor;
	for (var i = 0; i < 10; ++i) {
		for (var j = 0; j < 10; ++j) {
			if (valField[j][i] == 0)
				continue;

			ctx.fillRect(offsetWidth + cellWidth * j + 2, offsetHeight + cellWidth * i + 2, cellWidth - 4, cellWidth - 4);
		}
	}

	ctx.closePath();
}

function onFieldClick (event) {
	if (event.offsetX < offsetWidth || event.offsetX > offsetWidth + 10 * cellWidth
		|| event.offsetY < offsetHeight || event.offsetY > offsetHeight + 10 * cellWidth)
		return;

	var x = Math.floor((event.offsetX - offsetWidth) / cellWidth);
	var y = Math.floor((event.offsetY - offsetHeight) / cellWidth);

	valField[x][y] = (valField[x][y] + 1) % 2;

	ctx.beginPath();

	if (valField[x][y] == 1) {
		ctx.fillStyle = markColor;
		ctx.fillRect(offsetWidth + cellWidth * x + 2, offsetHeight + cellWidth * y + 2, cellWidth - 4, cellWidth - 4);
	} else {
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(offsetWidth + cellWidth * x + 1, offsetHeight + cellWidth * y + 1, cellWidth - 2, cellWidth - 2);
	}

	ctx.closePath();
}

function onReadyBtnClick (event) {
	var foundError = false;

	for (var i = 0; i < 10; ++i) {
		for (var j = 0; j < 10; ++j) {
			if (valField[j][i] == 1) {

				if ((j - 1 >= 0 && i - 1 >= 0 && valField[j - 1][i - 1] == 1)
					|| (j + 1 < 10 && i - 1 >= 0 && valField[j + 1][i - 1] == 1)
					|| (j - 1 >= 0 && i + 1 < 10 && valField[j - 1][i + 1] == 1)
					|| (j + 1 < 10 && i + 1 < 10 && valField[j + 1][i + 1] == 1)) {

					foundError = true;
					break;
				}

			}
		}

		if (foundError)
			break;
	}

	if (foundError)
		return;

	deckers[0] = 4;
	deckers[1] = 3;
	deckers[2] = 2;
	deckers[3] = 1;
	for (var i = 0; i < 10; ++i) {
		for (var j = 0; j < 10; ++j)
			copyField[i][j] = valField[i][j];
	}

	for (var j = 0; j < 10; ++j) {
		for (var i = 0; i < 10; ++i) {
			if (copyField[j][i] == 0 || copyField[j][i] == 2)
				continue;

			var len = getLen(j, i);

			if (len > 4) {
				foundError = true;
				break;
			}

			deckers[len - 1]--;

			if (deckers[len - 1] < 0) {
				foundError = true;
				break;
			}
		}

		if (foundError)
			break;
	}

	if (foundError) {
		return;
	}

	for (var i = 0; i < 4; ++i) {
		if (deckers[i] != 0) {
			foundError = true;
			break;
		}
	}

	if (foundError) {
		return;
	}


	$.ajax({
		url : "afterPrepare.php",
		type : "POST",

		data : {
			"userid" : $("#userid").val(),
			"gameid" : $("#gameid").val(),
			"field" : valField
		},

		success : function(msg) {
			var res = parseInt(msg);

			switch(res) {
				case 1:
					console.log("wrong gameid");
					break;

				case 2:
					console.log("wrong userid for existing game");
					break;

				case 3:
					console.log("invalid game status");
					break;

				case 0:
					$("form[action=\"game.php\"] input[type=\"text\"]").val($("#gameid").val());
					$("form[action=\"game.php\"] input[type=\"submit\"]").click();
					break;

				default:
					console.log("Unknown error:");
					console.log(msg);
					break;
			}
		}
	});
}

function getLen(j, i) {
	if (j < 0 || j >= 10 || i < 0 || i >= 10)
		return 0;

	if (copyField[j][i] == 0 || copyField[j][i] == 2) return 0;

	copyField[j][i] = 2;

	return 1 + getLen(j - 1, i) + getLen(j, i - 1) + getLen(j + 1, i) + getLen(j, i + 1);
}

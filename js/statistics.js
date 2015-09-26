$(window).load(function() {

	$(window).resize(onInitAndResize);

	$("#btnDiv input").click(function() {
		document.location.href = "main.php";
	});

	onInitAndResize();

});

function onInitAndResize() {
	var gameName = $("#gameName");
	var mainDiv = $("#mainDiv");
	var statDiv = $("#statDiv");
	var btnDiv = $("#btnDiv");

	gameName.css("letter-spacing", $("body").width() * 0.03 + "px");

	mainDiv.height($("body").height() - $("#headerDiv").height() - 10 - 18);
	statDiv.css({
		"top" : (mainDiv.height() - statDiv.height()) / 2 + "px"
	});

	btnDiv.css({
		"top" : (parseInt(statDiv.css("top")) + statDiv.height()) + "px"
	});
}
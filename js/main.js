$(document).ready(function () {
	onInitAndResize();

	$("#logoutText").click(function() {
		$.ajax({
			url : "logout.php",
			type : "post",

			success : function(msg) {
				document.location.href = "login.php";
			}
		});
	});

	$("#modalBackground").hide();
	$("#modalDialog").hide();

	$("#createText").click(function() {
		$("#modalBackground").show();
		$("#modalDialog").show();

		$("#infoTd").html("");
		$("#opponentName").val("");

	});

	$("#chooseText").click(function() {
		document.location.href = "chooseGame.php";
	});

	$("#showText").click(function() {
		document.location.href = "statistics.php";
	});

	$("input[type='button'][value='Cancel']").click(function() {
		$("#modalBackground").hide();
		$("#modalDialog").hide();
	});

	$("input[type='button'][value='Create Game']").click(function() {
		var name = $("#opponentName").val();

		$.ajax({
			url : "createGame.php",
			data : { "name" : name },
			type : "post",
			dataType : "json",

			success : function(msg) {
				var ret = parseInt(msg[0]);

				switch(ret) {
					case 0:
						$("form[action=\"prepare.php\"] input[type=\"text\"]").val(msg[1]);
						$("form[action=\"prepare.php\"] input[type=\"submit\"]").click();
						break;

					case 1:
						$("#infoTd").html("Server Error");
						console.log("Bad AJAX request");
						break;

					case 2:
						$("#infoTd").html("Unknown user");
						break;

					case 3:
						$("#infoTd").html("Server Error");
						console.log("You have not been logged in!");
						break;

					case 4:
						$("#infoTd").html("Server Error");
						console.log("Server Database problem");
						break;

					default:
						console.log("Unknown server error");
						console.log(msg);
						console.log(msg[0]);
						console.log(msg[1]);
						break;
				}
			}
		});
	});

});

$(window).resize(onInitAndResize);

function onInitAndResize() {
	var width = $(window).width();
	var height = $(window).height();
	var margin = 0.03 * Math.min(width, height);

	var windowDiv = $("#windowDiv");
	var headerDiv = $("#headerDiv");
	var headerText = $("#headerText");

	var mainDiv = $("#mainDiv");
	var createDiv = $("#createDiv");
	var chooseDiv = $("#chooseDiv");
	var showDiv = $("#showDiv");
	var logoutDiv = $("#logoutDiv");

	var createText = $("#createText");
	var chooseText = $("#chooseText");
	var showText = $("#showText");
	var logoutText = $("#logoutText");

	var modalBackground = $("#modalBackground");
	var modalDialog = $("#modalDialog");
	var modalTable = $("#modalTable");
				
	windowDiv.width(width - 2 * margin);
	windowDiv.height(height - 2 * margin);
	windowDiv.css("margin", margin + "px");

	var lineHeight = Math.min(headerDiv.width() * 0.05, headerDiv.height());
	var fontSize = 0.8 * lineHeight;
	headerText.css("line-height", lineHeight + "px");
//	headerText.css("font-size", fontSize + "px");
	headerText.css("letter-spacing", headerDiv.width() * 0.03 + "px");
	headerText.css( {
		"top" : (headerDiv.height() - headerText.height()) / 2 + "px",
		"left" : (headerDiv.width() - headerText.width()) / 2 + "px"
	});

	mainDiv.width(windowDiv.width());
	mainDiv.height(windowDiv.height() * 0.65);

	var paddingTop = mainDiv.height() * 0.15;
	createDiv.css("padding-top", paddingTop + "px");
	chooseDiv.css("padding-top", paddingTop + "px");
	showDiv.css("padding-top", paddingTop + "px");
	logoutDiv.css("padding-top", paddingTop + "px");

	createText.css("margin-left", (createDiv.width() - createText.width()) / 2 + "px");
	chooseText.css("margin-left", (chooseDiv.width() - chooseText.width()) / 2 + "px");
	showText.css("margin-left", (showDiv.width() - showText.width()) / 2 + "px");
	logoutText.css("margin-left", (logoutDiv.width() - logoutText.width()) / 2 + "px");

	modalDialog.css({
		"top" : (modalBackground.height() - modalDialog.height()) / 2 + "px",
		"left" : (modalBackground.width() - modalDialog.width()) / 2 + "px"
	});
}
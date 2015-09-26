$(document).ready(function() {
	$("body").css("margin", "0px");
	onInitAndResize();

	$("input[name=\"btn\"]").click(function() {
		$.ajax({

			url : "loginHandler.php",
			type : "post",

			data : {
				"name" : $("input[name=\"name\"]").val(),
				"password" : $("input[name=\"pswrd\"]").val()
			},

			success : function (msg) {
				var result = parseInt(msg);

				switch (result) {
					case 1:
						$("#infoDiv").html("Database connection error occured.<br/>Please, report about it to the website administration.");
						console.log(msg);
						break;

					case 2:
						$("#infoDiv").html("There is no user with name \"" + $("input[name=\"name\"]").val() + "\" in the database.<br/>.");
						console.log(msg);
						break;

					case 3:
						$("#infoDiv").html("Wrong password for the user with name \"" + $("input[name=\"name\"\]").val() + "\".");
						console.log(msg);
						break;

					case 4:
						$("#infoDiv").html("You have made wrong AJAX request!<br/>You may call the website administration to report this problem.");
						console.log(msg);
						break;

					case 5:
						$("#infoDiv").html("Server database has incorrect structure.<br/>Please call the website administration.");	
						console.log(msg);
						break;

					case 6:
						$("#infoDiv").html("Cant use that name: incorrect symbol!");
						console.log(msg);
						break;

					case 7:
						$("#infoDiv").html("Cant use that password: incorrect symbol!");
						console.log(msg);
						break;

					case 0:
					//	$("#infoDiv").html("You have logged in successfully!");
						document.location.href = "main.php";
						break;

					default:
						$("#infoDiv").html("Login code = " + result + "<br/>Unknown result code.<br/>Please call the website administration.");
						console.log(msg);
						break;
				}
			}
		});

		$("input[name=\"pswrd\"]").val("");
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
	var tableDiv = $("#tableDiv");
	var formTable = $("#formTable");
				
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

	var marginSize = (windowDiv.width() - formTable.width()) / 2;
	tableDiv.css({
		"margin-left" : (marginSize - 30) + "px"
	});
}                                                     
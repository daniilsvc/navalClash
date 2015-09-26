$(document).ready(function() {
	$("body").css("margin", "0px");
	onInitAndResize();

	$("input[name=\"btn\"]").click(function() {
		var password = $("input[name=\"pswrd\"]").val();
		var confpassword = $("input[name=\"confpswrd\"]").val();

		if (password == "") {
			$("#infoDiv").html("Please, enter your password");
			return;
		}

		if (password != confpassword) {
			$("#infoDiv").html("You have incorect password confirmation");
			return;
		}

		$.ajax({
			url : "regHandler.php",
			type : "post",
			data : {
				"name" : $("input[name=\"name\"]").val(),
				"password" : $("input[name=\"pswrd\"]").val()
			},

			success : function(msg) {
				var result = parseInt(msg);

				switch (result) {
					case 0:
						$("#infoDiv").css("color", "green");
						$("#infoDiv").html("The user \"" + $("input[name=\"name\"]").val() + "\" has been registered successfuly.");
						break;

					case 1:
						$("#infoDiv").css("color", "red");
						$("#infoDiv").html("Failed connection to the database.");
						break;

					case 2:
						$("#infoDiv").css("color", "red");
						$("#infoDiv").html("The user with name \"" + $("input[name=\"name\"]").val() + "\" already exists.");
						break;

					case 3:
						$("#infoDiv").css("color", "red");
						$("#infoDiv").html("Wrong AJAX request.");
						break;

					case 4:
						$("#infoDiv").css("color", "red");
						$("#infoDiv").html("Server database may have incorrect structure");
						break;

					case 5:
						$("#infoDiv").css("color", "red");
						$("#infoDiv").html("Wrong user name: incorrect symbol!");
						break;

					case 6:
						$("#infoDiv").css("color", "red");
						$("#infoDiv").html("Wrong password: incorrect symbol!");
						break;

					default:
						$("#infoDiv").css("color", "red");
						$("#infoDiv").html("Reg code = " + result + "<br/>Unknown result code from server.");
				}
			}
		});

		$("input[name=\"pswrd\"]").val("");
		$("input[name=\"confpswrd\"]").val("");
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
		"margin-left" : (marginSize - 75) + "px"
	});
}
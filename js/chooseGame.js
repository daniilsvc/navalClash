$(window).load(function() {

	$(window).resize(onInitAndResize);

	$("#mainTable tr").click(function(event) {

		var gameid = $(event.target).parent().children(0).html();
		//alert($(event.target).parent().children(0).html());

		$("form[action=\"game.php\"] input[type=\"text\"]").val(gameid);
		$("form[action=\"game.php\"] input[type=\"submit\"]").click();
	});

	$("#refreshBtn").click(function() {
		location.reload();
	});

	$("#menuBtn").click(function() {
		document.location.href = "main.php"
	});

	onInitAndResize();

});

function onInitAndResize() {

	var body = $("body");
	var header = $("#header");
	var headerTable = $("#headerTable");
	var mainDiv = $("#mainDiv");
	var tableh = $("#tableh");
	var mainTable = $("#mainTable");
	var refbtn = $("#refreshBtn");
	var menubtn = $("#menuBtn");
	
	var btnSpace = 7;

	if ($("body").hasScrollBar())
		body.width($(window).width() - $.scrollbarWidth());
	else
		body.width($(window).width());	
	
	$("#headerTable tr:first-child td").css("letter-spacing", body.width() * 0.03 + "px");
	header.width(body.width());
	headerTable.width(header.width());
	headerTable.height(header.height());
	
	mainDiv.width(body.width());
	mainDiv.height(body.height() - header.height() - 18);

	$("#mainDiv td").css({
		"width" : mainDiv.width() * 0.2 + "px"
	});

	tableh.css({
		"left" : (mainDiv.width() - tableh.width()) / 2 + "px",
		"top" : 0
	});

	mainTable.css({
		"left" : (mainDiv.width() - mainTable.width()) / 2 + "px",
		"top" : 0
	});

	refbtn.css({
		"left" : (mainDiv.width() - (refbtn.width() + 21 + 7 + 21 + menubtn.width())) / 2 + "px",
		"top" : 0
	});

	menubtn.css({
		"left" : ((mainDiv.width() - (refbtn.width() + 21 + 7 + 21 + menubtn.width())) / 2 + 28 + refbtn.width()) + "px",
		"top" : 0
	});
}

(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);

$.scrollbarWidth = function() {
  var parent, child, width;

  if(width===undefined) {
    parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
    child=parent.children();
    width=child.innerWidth()-child.height(99).innerWidth();
    parent.remove();
  }

 return width;
};
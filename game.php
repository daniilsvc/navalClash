<?php
	session_start();

	function redirect($way) {
		?>

		<!DOCTYPE html>
		<form action="<?php echo $way;?>" method="post" name="frm">
			<input name="gameid" value="<?php echo $_REQUEST['gameid'];?>"/>
		</form>

		<script type="text/javascript">
			document.frm.submit();
		</script>

		<?php
	}

	//check $_SESSION and $_REQUEST
	if (!isset($_SESSION['userid']) || !isset($_REQUEST['gameid'])) {
		header("Location: index.php");
		exit;
	}

	// check if the gameid and userid correct
	$mysqli = new mysqli("localhost", "root", "", "navalClash", 3306);
	$res = $mysqli->query("select * from games where gameId=\"{$_REQUEST["gameid"]}\";");

	if ($res->num_rows == 0) {
		echo "There is no game with gameID={$_REQUEST["gameid"]}";
		exit;
	}

	$gameRow = $res->fetch_assoc();

	$isFirst = -1;
	if ($gameRow['gamer1'] == $_SESSION['userid'])
		$isFirst = 1;
	else if ($gameRow['gamer2'] == $_SESSION['userid'])
		$isFirst = 0;

	if ($isFirst == -1) {
		echo "Incorrect userID={$_SESSION['userid']} for the game with gameID={$_REQUEST['gameid']}";
		exit;
	}


	// check game status
	if ($gameRow['status'] == 6 || $gameRow['status'] == 5) {
		redirect("index.php");
		exit;
	}

	if ($gameRow['status'] == 0 || ($isFirst && $gameRow['status'] == 2) || (!$isFirst && $gameRow['status'] == 1)) {
		redirect("prepare.php");
		exit;
	}

	$res = $mysqli->query("select users1.name as name1, users2.name as name2 from users as users1, users as users2 where users1.userId={$gameRow['gamer1']} and users2.userID={$gameRow['gamer2']};");
	$names = $res->fetch_assoc();

	if (!$isFirst) {
		$tmp = $names['name1'];
		$names['name1'] = $names['name2'];
		$names['name2'] = $tmp;
	}

?>

<!DOCTYPE html>

<html>
	<head>
		<meta charset="utf-8"/>

		<link type="text/css" rel="stylesheet" href="./css/game.css"/>

		<script type="text/javascript" src="./js/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="./js/game.js"></script>

		<input type="text" id="userid" name="userid" value="<?php echo $_SESSION['userid'];?>" hidden/>
		<input type="text" id="gameid" name="gameid" value="<?php echo $_REQUEST['gameid'];?>" hidden/>
	</head>

	<body>
		<div id="headerDiv">
			<span id="headerName">Naval Clash</span><br/><br/>
			<span id="headerGame">Game #<?php echo $gameRow['gameId'];?></span>
		</div>
		<hr/>

		<div id="cnvDiv">
			<div id="user1Div">
				<div id="user1Header">
					<span><?php echo $names['name1'];?> (You)</span>
				</div>

				<canvas id="cnv1"></canvas>
			</div>

			<div id="user2Div">
				<div id="user2Header">
					<span><?php echo $names['name2'];?> (Opponent)</span>
				</div>

				<canvas id="cnv2"></canvas>
			</div>
		</div>

		<div id="menuDiv">
			<div id="infoDiv">
			</div>
		
			<div id="backDiv">
				<span>Back to Menu</span>
			</div>
		</div>

		<div id="modalDiv" hidden></div>
		<div id="modalWindow" hidden>

			<div id="modalText">
				<div>Status Text</div>
			</div>

			<div id="modalButton">
				<div>Continue</div>
			</div>
		</div>

	</body>
</html>

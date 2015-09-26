<?php

	session_start();

	if (!isset($_SESSION['userid']) || !isset($_REQUEST['gameid'])) {
		header("Location: index.php");
		exit;
	}

	$mysqli = new mysqli("localhost", "root", "", "navalClash", 3306);

	$res = $mysqli->query("select gameId, gamer1, gamer2 from games where gameId=\"{$_REQUEST["gameid"]}\";");
	if ($res->num_rows == 0) {           
		echo "There is no game with id = {$_REQUEST['gameid']}";
		exit;
	}

	$res = $res->fetch_assoc();

	if ($_SESSION['userid'] != $res['gamer1'] && $_SESSION['userid'] != $res['gamer2']) {
		echo "There is no user with id = {$_SESSION['userid']} for the game with id = {$_REQUEST['gameid']}";
		exit;
	}

?>

<!DOCTYPE html>

<html>

	<head>
		<script type="text/javascript" src="./js/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="./js/prepare.js"></script>
		<link type="text/css" href="./css/prepare.css" rel="stylesheet"/>

		<input id="userid" type="text" value="<?php echo $_SESSION['userid']?>" hidden/>
		<input id="gameid" type="text" value="<?php echo $_REQUEST['gameid']?>" hidden/>

	</head>

	<body>

		<div id="headerDiv">
			<span id="headerName">Naval Clash</span><br/><br/>
			<span id="headerGame">Prepare Your Navy</span>
		</div>
		<hr/>

		<div id="mainDiv">
			<canvas id="navyField"></canvas>

			<div id="readyBtn">
				<div id="rBtn">
					<div>Ready</div>
				</div>

				<div id="backBtn">
					<div>Back to Menu</div>
				</div>
			</div>

		</div>

		<form action="game.php" method="post" hidden>
			<input type="text" name="gameid"/>
			<input type="submit" name="submitForGame"/>
		</form>

	</body>

</html>

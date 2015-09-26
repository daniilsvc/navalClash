<?php
	session_start();
	if (!isset($_SESSION['userid'])) {
		header("Location: login.php");
		exit;
	}

	$mysqli = new mysqli("localhost", "root", "", "navalClash", 3306);
	$res = $mysqli->query("select name from users where userId={$_SESSION['userid']};");

	if ($res->num_rows == 0) {
		unset($_SESSION['userid']);
		header("Location: login.php");
		exit;
	}

	$row = $res->fetch_assoc();
	$logname = $row['name'];
?>

<!DOCTYPE html>

<html>

	<head>
		<script type="text/javascript" src="./js/jquery-2.1.1.min.js"></script>
		<link href="./css/main.css" type="text/css" rel="stylesheet"/>
	</head>

	<body>
		<div id="windowDiv">
			<div id="headerDiv">
				<div id="headerText">
					Naval Clash
				</div>
			</div>

			<div id="nameHeader">
				<?php echo $logname?>'s main page.
			</div>
			<hr/>

			<div id="mainDiv">

				<div id="createDiv">
					<span id="createText">[<span class="activeTxt">Create Game</span>]</span>
				</div>

				<div id="chooseDiv">
					<span id="chooseText">[<span class="activeTxt">Choose Game</span>]</span>
				</div>

				<div id="showDiv">
					<span id="showText">[<span class="activeTxt">Show Statistics</span>]</span>
				</div>

				<div id="logoutDiv">
					<span id="logoutText">[<span class="activeTxt">Log Out</span>]</span>
				</div>

			</div>

			<div id="modalBackground">
			</div>

			<div id="modalDialog">
				<div id="modalTable" style="margin : 5px">
					<table>
						<tr>
							<td colspan="2">Choose Your Opponent</td>
					 	</tr>

					 	<tr>
					 		<td colspan="2"><input id="opponentName" type="text" size="25" maxlength="20"/></td>
					 	</tr>

					 	<tr>
					 		<td style="text-align : left">
					 			<input type="button" value="Create Game"/>
					 		</td>

					 		<td style="text-align : right">
					 			<input type="button" value="Cancel"/>
					 		</td>
					 	</tr>

					 	<tr>
					 		<td colspan="2" id="infoTd"></td>
					 	</tr>

					 </table>
				</div>
			</div>

		<script type="text/javascript" src="./js/main.js"></script>

		<form action="prepare.php" method="post" hidden>
			<input type="text" name="gameid"/>
			<input type="submit" name="submitForGame"/>
		</form>
	</body>

</html>
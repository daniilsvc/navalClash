<?php
	session_start();

	if (!isset($_SESSION['userid'])) {
		header("Location: index.php");
		exit;
	}
?>

<!DOCTYPE html>

<html>

	<head>

		<meta charset="utf-8"/>
		<script type="text/javascript" src="./js/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="./js/chooseGame.js"></script>
		<link type="text/css" rel="stylesheet" href="./css/chooseGame.css"/>

	</head>

	<body>

		<div id="header">
			<table id="headerTable">
				<tr>
					<td>
						Naval Clash
					</td>
				</tr>

				<tr>
					<td>
						Choose Your Game
					</td>
				</tr>
			</table>
		</div>
		<hr/>

		<div id="mainDiv">
			<table id="tableh">
				<tr>
					<td>Game ID</td>
					<td>Opponent</td>
					<td>Start Date</td>
				</tr>
			</table>

			<table id="mainTable">
				<?php
					$mysqli = new mysqli("localhost", "root", "", "navalclash", 3306);
					$res = $mysqli->query("select gameId, startDate, name from users, games where
					(gamer1 = \"{$_SESSION['userid']}\" or gamer2 = \"{$_SESSION['userid']}\") and
					userId != \"{$_SESSION['userid']}\" and ((userId=gamer1 and gamer2Online=0) or (userId=gamer2 and gamer1Online=0))
					and status < '5'
					order by startDate;");

					while ($row = $res->fetch_assoc()) {
						echo "<tr>";
						echo "<td>{$row['gameId']}</td>";
						echo "<td>{$row['name']}</td>";
						echo "<td>{$row['startDate']}</td>";
						echo "</tr>";
					}
				?>
			</table>

			<div id="btnDiv">
				<input id="refreshBtn" type="button" value="Refresh Table"/>
				<input id="menuBtn" type="button" value="Back to Menu"/>
			</div>
		</div>

		<form action="game.php"  method="post" hidden>
			<input type="text" name="gameid"/>
			<input type="submit" name="submitForGame"/>
		</form>
	</body>

</html>



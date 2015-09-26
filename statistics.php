<?php
	session_start();

	if (!isset($_SESSION['userid'])) {
		header("Location: index.php");
		exit;
	}

	$mysqli = new mysqli("localhost", "root", "", "navalClash", 3306);
	$res = $mysqli->query("select name from users where userId={$_SESSION['userid']};");

	if ($res->num_rows == 0) {
		unset($_SESSION['userid']);
		header("Location: index.php");
		exit;
	}

	$res = $res->fetch_assoc();
	//$res = $mysqli->query("select gameId, gamer1, gamer2, startDate, endDate, status from games where (gamer1={$_SESSION['userid']} or gamer2={$_SESION['userid']}) and (status='5' or status='6');");
?>

<!DOCTYPE html>

<html>

	<head>
		<meta charset="utf-8"/>

		<link type="text/css" rel="stylesheet" href="./css/statistics.css"/>
		<script type="text/javascript" src="./js/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="./js/statistics.js"></script>

	</head>

	<body>

		<div id="headerDiv">
			<div id="gameName">Naval Clash</div>
			<div id="headerInfo"><?php echo $res["name"];?>'s Statistics</div>
		</div>
		<hr/>

		<div id="mainDiv">

			<div id="statDiv">
				Total Amount of Games: <?php
					$res = $mysqli->query("select count(*) as cnt from games where (gamer1={$_SESSION['userid']} or gamer2={$_SESSION['userid']}) and (status = '5' or status = '6');");
					$res = $res->fetch_assoc();
					echo $res['cnt']."<br/>";

					$allGames = $res['cnt'];
				?>
				Wins: <?php
					$res = $mysqli->query("select count(*) as cnt from games where
						(gamer1={$_SESSION['userid']} and status='5') or (gamer2={$_SESSION['userid']} and status='6');");
					$res = $res->fetch_assoc();
					$wins = $res['cnt'];

					echo "$wins (".round((($wins / $allGames) * 100), 2)."%)<br/>";
				?>
				Loses: <?php
					$res = $mysqli->query("select count(*) as cnt from games where
						(gamer1={$_SESSION['userid']} and status='6') or (gamer2={$_SESSION['userid']} and status='5');");

					$res = $res->fetch_assoc();
					$loses = $res['cnt'];

					echo "$loses (".round((($loses / $allGames) * 100), 2)."%)<br/>";
				?>

				Average Hits: <?php
					$res = $mysqli->query("select gamer1, gamer2, field1, field2 from games where (gamer1={$_SESSION['userid']} or gamer2={$_SESSION['userid']})
						and (status='5' or status='6');");

					$maxHits = 0;
					$minHits = 101;
					$amountOfFields = 0;
					$avgHits = 0;	

					while ($row = $res->fetch_assoc()) {
						$field = null;
						$fieldHits = 0;

						if ($row['gamer1'] == $_SESSION['userid']) {
							$field = $row['field1'];
						} else {
							$field = $row['field2'];
						}

						for ($i = 0; $i < 100; ++$i) {
							if ($field[$i] != '0')
								++$fieldHits;
						}

						$avgHits += $fieldHits;
						++$amountOfFields;

						if ($fieldHits > $maxHits)
							$maxHits = $fieldHits;

						if ($fieldHits < $minHits)
							$minHits = $fieldHits;
					}

					if ($amountOfFields != 0)
						$avgHits /= $amountOfFields;

					if ($amountOfFields == 0)
						echo "Not Defined";
					else
						echo round($avgHits, 0);

					echo "<br/>";
				?>

				Max Hits: <?php
					if ($maxHits == 0)
						echo "Not Defined";
					else
						echo $maxHits;

					echo "<br/>";
				?>

				Min Hits: <?php
					if ($minHits == 101)
						echo "Not Defined";
					else
						echo $minHits;

					echo "<br/>";
				?>
			</div>


			<div id="btnDiv">
				<input type="button" value="Back to Menu"/>
			</div>
		</div>

	</body>

</html>
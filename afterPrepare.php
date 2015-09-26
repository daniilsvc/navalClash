<?php

	if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
		&& strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == "xmlhttprequest") {

		if (!isset($_REQUEST['userid']) || !isset($_REQUEST['gameid']) || !isset($_REQUEST['field'])) {
			echo "Inavlid AJAX request";
			exit;
		}

		$mysqli = new mysqli("localhost", "root", "", "navalClash", 3306);
		$res = $mysqli->query("select status, gamer1, gamer2 from games where gameId=\"{$_REQUEST['gameid']}\";");

		if ($res->num_rows == 0) {
			echo "1"; // wrong gameid
			exit;
		}

		$res = $res->fetch_assoc();

		$isFirst = -1;
		if ($res['gamer1'] == $_REQUEST['userid']) {
			$isFirst = 1;
		} else if ($res['gamer2'] == $_REQUEST['userid']) {
			$isFirst = 0;
		}

		if ($isFirst == -1) {
			echo "2";  // wrong userid for existing gameid
			exit;
		}

		$status = $res['status'];
		$newStatus = -1;

		if ($status == 0 && $isFirst) {
			$newStatus = 1;
		} else if ($status == 0 && !$isFirst) {
			$newStatus = 2;
		} else if ($status == 1 && !$isFirst) {
			$newStatus = 3;
		} else if ($status == 2 && $isFirst) {
			$newStatus = 3;
		} else {
			echo "3"; // invalid game status
			exit;
		}

		$mysqli->query("update games set status=\"$newStatus\" where gameId=\"{$_REQUEST['gameid']}\";");

		$file = fopen("./games/{$_REQUEST['gameid']}", "r+");

		if (!$isFirst) {
			fseek($file, 100);
		}

		$str = "";

		for ($i = 0; $i < 10; ++$i) {
			for ($j = 0; $j < 10; ++$j) {
				$str .= $_REQUEST['field'][$i][$j];
			}
		}

		fwrite($file, $str);

		if ($isFirst)
			$mysqli->query("update games set field1=\"$str\" where gameId=\"{$_REQUEST['gameid']}\";");
		else
			$mysqli->query("update games set field2=\"$str\" where gameId=\"{$_REQUEST['gameid']}\";");

		echo "0";

		exit;
	}

	header("Location: index.php");

?>
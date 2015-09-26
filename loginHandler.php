<?php

	function checkSymbol($v) {
		if ($v < 33 || $v > 126 || $v == 34 || $v == 39 || $v == 96 || $v == 47 || $v == 92) {
			return 1;
		}

		return 0;
	}

	// check for AJAX query
	if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
		&& strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {


		if (!isset($_REQUEST['name']) || !isset($_REQUEST['password'])) {
			echo "4"; // bad ajax request
			exit;
		}

		$foundError = 0;
		$n = strlen($_REQUEST['name']);

		for ($i = 0; $i < $n; ++$i) {
			$val = ord($_REQUEST['name'][$i]);

			if (checkSymbol($val)) {
				$foundError = 1;
				break;
			}
		}

		if ($foundError) {
			echo "6"; // incorrect name
			exit;
		}

		$n = strlen($_REQUEST['password']);

		for ($i = 0; $i < $n; ++$i) {
			$val = ord($_REQUEST['password'][$i]);

			if (checkSymbol($val)) {
				$foundError = 1;
				break;
			}
		}

		if ($foundError) {
			echo "7"; // incorrect password
			exit;
		}

		$mysqli = new mysqli("localhost", "root", "", "navalClash", 3306);

		if ($mysqli->connect_errno) {
			echo "1"; // database connection error
			exit;
		}

		$res = $mysqli->query("select userId, name, password from users where name=\"".$_REQUEST['name']."\"");

		if (!$res) {
			echo "5"; // incorrect database structure
			exit;
		}

		if ($res->num_rows == 0) {
			echo "2"; // unknown nickname
			exit;
		}

		$row = $res->fetch_assoc();

		if ($row['password'] !== $_REQUEST['password']) {
			echo "3"; // wrong password
			exit;
		}

		// everything is ok

		session_start();
		$_SESSION['userid'] = $row['userId'];

		$res = $mysqli->query("update users set lastVisit=NOW() where userId={$_SESSION['userid']};");
		if (!$res) {
			echo "5";
			exit;
		}

		echo "0";
		exit;
	}

	header("Location: login.php");
?>

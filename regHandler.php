<?php

	function checkSymbol($v) {
		if ($v < 33 || $v > 126 || $v == 34 || $v == 39 || $v == 96 || $v == 47 || $v == 92) {
			return 1;
		}

		return 0;
	}

	if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']
		&& strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')) {

		if (!isset($_REQUEST['name']) || !isset($_REQUEST['password'])) {
			echo "3"; // wrong AJAX request
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
			echo "5"; // incorrect name
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
			echo "6"; // incorrect password
			exit;
		}

		$mysqli = new mysqli("localhost", "root", "", "navalclash", 3306);

		if ($mysqli->connect_errno) {
			echo "1";  // wrong db connection
			exit;
		}

		$res = $mysqli->query("select name from users where name=\"{$_REQUEST['name']}\"");
		if (!$res) {
			echo "4"; // wrong structure of database
			exit;
		}

		if ($res->num_rows != 0) {
			echo "2"; // user with this name already exists
			exit;
		}

		$res = $mysqli->query("insert into users () values (0, \"{$_REQUEST['name']}\", \"{$_REQUEST['password']}\", NOW(), NULL)");
		if (!$res) {                                                                                                         
			echo "4";
			exit;
		}

		echo "0";
		exit;
	}

	header("Location: registration.php");
?>
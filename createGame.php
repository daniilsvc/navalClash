<?php
	if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
		&& strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

		if (!isset($_REQUEST['name'])) {
			echo json_encode(array("1", "bad AJAX request")); // bad AJAX request
			exit;
		}

		session_start();
		if (!isset($_SESSION['userid'])) {
			echo json_encode(array("3", "Wrong Session Data")); // wrong user
			exit;
		}

		$mysqli = new mysqli("localhost", "root", "", "navalclash", 3306);
		if ($mysqli->connect_errno) {
			echo json_encode(array("4", "No Connection")); // no connection
			exit;
		}

		$res = $mysqli->query("select userId, name from users where name=\"{$_REQUEST['name']}\";");

		if (!$res) {
			echo json_encode(array("4", "Db Problem"));
			exit;  // db problem
		}

		if ($res->num_rows == 0) {
			echo json_encode(array("2", "Wrong UserName")); // wrong name
			exit;
		}

		$res = $res->fetch_assoc();
      if ($_SESSION['userid'] == $res['userId']) {
      	echo json_encode(array("2", "The same user"));
      	exit;
      }  

		$gamer1 = $_SESSION['userid'];
		$gamer2 = $res['userId'];

		$field = "";
		for ($i = 0; $i < 10; ++$i) {
			for ($j = 0; $j < 10; ++$j) {
				$field .= "0";
			}
		}

		$res = $mysqli->query("insert into games () values (0, NOW(), NULL, $gamer1, $gamer2, \"$field\", \"$field\", 0, 0, \"0\");");
		if (!$res) { echo json_encode(array("4", "game creation insert query error")); exit; }
		$res = $mysqli->query("select LAST_INSERT_ID() as col;");
		if (!$res) { echo json_encode(array("4", "last_insert_id query error")); exit; }
		$res = $res->fetch_assoc();
		$res = $res['col'];

		$f = fopen("./games/".$res, "w");

		fwrite ($f, $field);
		fwrite($f, $field);

		fclose($f);

		echo json_encode(array("0", $res));
		exit;
	}

	header("Location: login.php");
?>              
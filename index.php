<?php

	session_start();

	if (isset($_SESSION["userid"])) {
		header("Location: main.php");
	} else {
		header("Location: login.php");
	}

?>
<?php
	if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
		&& strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {

		session_start();
		if (isset($_SESSION['userid'])) {
			unset($_SESSION['userid']);
		}

		exit;
	}

	header("Location: index.php");
?>
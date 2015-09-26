<?php
	session_start();
	if (isset($_SESSION['userid'])) {
		header("Location: main.php");
		exit;
	}
?>

<!DOCTYPE html>

<html>

	<head>
		<script type="text/javascript" src="./js/jquery-2.1.1.min.js"></script>
		<link href="./css/registration.css" type="text/css" rel="stylesheet"/>
	</head>

	<body>
		<div id="windowDiv">

			<div id="headerDiv">
				<div id="headerText">
					Naval Clash
				</div>
			</div>

			<div id="nameHeader">
				Registration
			</div>

			<div id="mainDiv">

				<div id="tableDiv">
					<table id="formTable">
						<tr>
							<td class="name">
								Name:
							</td>
							<td>
								<input type="text" name="name" maxlength="20" size="20"/>
							</td>
						</tr>
			
						<tr>
							<td class="name">
								Password:
							</td>
							<td>
								<input type="password" name="pswrd" maxlength="20" size="20"/>
							</td>
						</tr>

						<tr>
							<td class="name">
								Confirm your password:
							</td>

							<td>
								<input type="password" name="confpswrd" maxlength="20" size="20"/>
							</td>
						</tr>

						<tr>
							<td>
								<a href="login.php">Log in</a>
							</td>
							<td>
								<input type="button" name="btn" value="Register User"/>
							</td>
						</tr>
					</table>

				</div>
			</div>

			<div id="infoDiv">
			</div>

		</div>

		<script type="text/javascript" src="./js/registration.js"></script>
	</body>

</html>
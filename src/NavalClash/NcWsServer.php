<?php
	namespace NavalClash;

	use Ratchet\MessageComponentInterface;
	use Ratchet\ConnectionInterface;

	class NcWsServer implements MessageComponentInterface {

		private $container;
		private $mysqli;

		function __construct() {
			$this->container = array();
			$this->mysqli = new \mysqli("localhost", "root", "", "navalClash", 3306);
		}

		public function onOpen(ConnectionInterface $con) {}

		public function onMessage(ConnectionInterface $con, $msg) {
			$msgAr = explode(" ", $msg);

			// too short message
			if (count($msgAr) < 3) {
				echo "Not enough message elements.\n";
				return;
			}

			// check mysql connection
			if ($this->mysqli->connect_errno) {
				echo "MySQL connection error#: {$this->mysqli->connect_errno}\n";
				echo $this->mysqli->connect_error;
				echo "\n";
				return;
			}

			$gameid = $msgAr[1];
			$userid = $msgAr[2];

			// check correctness of userid and gameid
			$res = $this->mysqli->query("select gameId, gamer1, gamer2, status from games where gameId = \"$gameid\";");

			if (!$res) {
				echo "MySQL query error\n";
				return;
			}

			if ($res->num_rows == 0) {
				echo "MySQL query error: There is no game with $gameid\n";
				return;
			}

			$row = $res->fetch_assoc();

			$isFirst = -1;

			if ($row['gamer1'] == $userid)
				$isFirst = 1;
			else if ($row['gamer2'] == $userid)
				$isFirst = 0;

			if ($isFirst == -1) {
				echo "MySQL query error: there is no user with $userid in game with $gameid\n";
				return;
			}

			if ($msgAr[0] == "open") {

				// main action on 'open' msg
				echo "OPEN game=$gameid user=$userid\n";

				// check whether gameid and useid are used
				if (isset($this->container[$gameid]) && (($isFirst && isset($this->container[$gameid]["con1"])) || (!$isFirst && isset($this->container[$gameid]["con2"])))) {
					echo "User $userid is already playing game $gameid\n";
					return;
				}

				// if your opponent is offline
				if (($isFirst && (!isset($this->container[$gameid]) || !isset($this->container[$gameid]["con2"])))
					|| (!$isFirst && (!isset($this->container[$gameid]) || !isset($this->container[$gameid]["con1"])))) {

					$status = $row["status"];

					$f = fopen("./../games/$gameid", "r+");

					if ($isFirst) {
						$this->container[$gameid]["con1"] = $con;
						$this->mysqli->query("update games set gamer1Online=1 where gameId=$gameid;");
					} else {
						$this->container[$gameid]["con2"] = $con;
						$this->mysqli->query("update games set gamer2Online=1 where gameId=$gameid;");
					}

					$this->container[$gameid]["gameStatus"] = $status;
					$this->container[$gameid]["file"] = $f;

					// send status and fields

					$firstField = null;
					$secondField = null;

					fseek($f, 0);
					if ($isFirst) {
						$firstField = fread($f, 100);
						$secondField = fread($f, 100);
					} else {
						$secondField = fread($f, 100);
						$firstField = fread($f, 100);
					}

					for ($i = 0; $i < 100; ++$i)
						if ($secondField[$i] == 1)
							$secondField[$i] = 0;

					$clientStatus = null;

					if (($status == 1 && $isFirst) || ($status == 2 && !$isFirst)) {
						$clientStatus = 0;
					} else if (($status == 3 && $isFirst) || ($status == 4 && !$isFirst)) {
						$clientStatus = 1;
					} else if (($status == 3 && !$isFirst) || ($status == 4 && $isFirst)) {
						$clientStatus = 2;
					} else if (($status == 5 && $isFirst) || ($status == 6 && !$isFirst)) {
						$clientStatus = 3;
					} else if (($status == 5 && !$isFirst) || ($status == 6 && $isFirst)) {
						$clientStatus = 4;
					}

					$con->send("getFields $clientStatus $firstField $secondField");

					return;
				}

				// if your opponent is online
				if ($isFirst) {
					$this->container[$gameid]["con1"] = $con;
					$this->mysqli->query("update games set gamer1Online=1 where gameId=$gameid;");
				} else {
					$this->container[$gameid]["con2"] = $con;
					$this->mysqli->query("update games set gamer2Online=1 where gameId=$gameid;");
				}

				$file = $this->container[$gameid]["file"];
				$firstField = null;
				$secondField = null;

				fseek($file, 0);
				if ($isFirst) {
					$firstField = fread($file, 100);
					$secondField = fread($file, 100);
				} else {
					$secondField = fread($file, 100);
					$firstField = fread($file, 100);
				}

				$preparedFirst = $firstField;
				$preparedSecond = $secondField;
				for ($i = 0; $i < 100; ++$i) {
					if ($firstField[$i] == 1)
						$preparedFirst[$i] = 0;

					if ($secondField[$i] == 1)
						$preparedSecond[$i] = 0;
				}

				$clientFirstStatus = null;
				$clientSecondStatus = null;

				if ($this->container[$gameid]["gameStatus"] == 1 || $this->container[$gameid]["gameStatus"] == 2)
					$this->container[$gameid]["gameStatus"] = 3;

				$status = $this->container[$gameid]["gameStatus"];

				if (($status == 1 && $isFirst) || ($status == 2 && !$isFirst)) {
					$clientFirstStatus = 0;
				} else if (($status == 3 && $isFirst) || ($status == 4 && !$isFirst)) {
					$clientFirstStatus = 1;
				} else if (($status == 3 && !$isFirst) || ($status == 4 && $isFirst)) {
					$clientFirstStatus = 2;
				} else if (($status == 5 && $isFirst) || ($status == 6 && !$isFirst)) {
					$clientFirstStatus = 3;
				} else if (($status == 5 && !$isFirst) || ($status == 6 && $isFirst)) {
					$clientFirstStatus = 4;
				}

				if ($clientFirstStatus == 1) {
					$clientSecondStatus = 2;
				} else if ($clientFirstStatus == 2) {
					$clientSecondStatus = 1;
				} else if ($clientFirstStatus == 3) {
					$clientSecondStatus = 4;
				} else if ($clientFirstStatus == 4) {
					$clientSecondStatus = 3;
				}

				$con->send("getFields $clientFirstStatus $firstField $preparedSecond");
				$secondCon = null;
				if ($isFirst)
					$secondCon = $this->container[$gameid]["con2"];
				else
					$secondCon = $this->container[$gameid]["con1"];

				$secondCon->send("getFields $clientSecondStatus $secondField $preparedFirst");



			} else if ($msgAr[0] == "move") {
				// main action on 'move' msg
				$x = $msgAr[3];
				$y = $msgAr[4];

				if (!isset($this->container[$gameid]) || !isset($this->container[$gameid]["file"])) {
					echo "Server Error: Not defined data in container. Move request for game=$gameid, from user=$userid\n";
					return;
				}

				// change opponent's field configuration
				$file = $this->container[$gameid]["file"];
				$indx = $x * 10 + $y;
				if ($isFirst) {
					fseek($file, 100);
				} else {
					fseek($file, 0);
				}

				$opponentField = fread($file, 100);
				$val = $opponentField[$indx];

				if ($val >= 2) {
					echo "Server Error: bad field[$x, $y] value: $val. Move request from game=$gameid, from user=$userid\n";
					return;
				}

				$val += 2;
				$opponentField[$indx] = $val."";

				if ($isFirst) {
					fseek($file, 100);
				} else {
					fseek($file, 0);
				}

				fwrite($file, $opponentField);

				// check for finish
				$finished = 1;
				for ($i = 0; $i < 100; ++$i) {
					if ($opponentField[$i] == 1) {
						$finished = 0;
						break;
					}
				}

				if ($finished) {

					if ($isFirst)
						$this->container[$gameid]["gameStatus"] = 5;
					else
						$this->container[$gameid]["gameStatus"] = 6;

					$yourField = null;
					if ($isFirst)
						fseek($file, 0);
					else
						fseek($file, 100);

					$yourField = fread($file, 100);

					if ($isFirst)
						$this->mysqli->query("update games set endDate=NOW(), field1=\"$yourField\", field2=\"$opponentField\" where gameId=$gameid;");
					else
						$this->mysqli->query("update games set endDate=NOW(), field1=\"$opponentField\", field2=\"$yourField\" where gameId=$gameid;");

				} else {

					if ($val == 2) {
						if ($isFirst)
							$this->container[$gameid]["gameStatus"] = 4;
						else
							$this->container[$gameid]["gameStatus"] = 3;
					}

				}

				$this->mysqli->query("update games set status=\"{$this->container[$gameid]["gameStatus"]}\" where gameId=$gameid;");

				// make client status
				$status = $this->container[$gameid]["gameStatus"];
				$clientFirstStatus = null;
				$clientSecondStatus = null;

				if (($status == 1 && $isFirst) || ($status == 2 && !$isFirst)) {
					$clientFirstStatus = 0;
				} else if (($status == 3 && $isFirst) || ($status == 4 && !$isFirst)) {
					$clientFirstStatus = 1;
				} else if (($status == 3 && !$isFirst) || ($status == 4 && $isFirst)) {
					$clientFirstStatus = 2;
				} else if (($status == 5 && $isFirst) || ($status == 6 && !$isFirst)) {
					$clientFirstStatus = 3;
				} else if (($status == 5 && !$isFirst) || ($status == 6 && $isFirst)) {
					$clientFirstStatus = 4;
				}

				if ($clientFirstStatus == 1) {
					$clientSecondStatus = 2;
				} else if ($clientFirstStatus == 2) {
					$clientSecondStatus = 1;
				} else if ($clientFirstStatus == 3) {
					$clientSecondStatus = 4;
				} else if ($clientFirstStatus == 4) {
					$clientSecondStatus = 3;
				}

				// send changes to clients
				$con->send("getStatus $clientFirstStatus $val $x $y 0");

				$opponentCon = null;
				if ($isFirst && isset($this->container[$gameid]["con2"]))
					$opponentCon = $this->container[$gameid]["con2"];

				if (!$isFirst && isset($this->container[$gameid]["con1"]))
					$opponentCon = $this->container[$gameid]["con1"];

				if ($opponentCon != null) {
					$opponentCon->send("getStatus $clientSecondStatus $val $x $y 1");
				}

			} else if ($msgAr[0] == "close") {

				// main action on 'close' msg
				echo "CLOSE game=$gameid user=$userid\n";

				if (!isset($this->container[$gameid]) || ($isFirst && !isset($this->container[$gameid]["con1"]))
					|| (!$isFirst && !isset($this->container[$gameid]["con2"]))) {
					return;
				}

				$gameIsEmpty = 0;
				if ($isFirst) {
					unset($this->container[$gameid]["con1"]);

					if (!isset($this->container[$gameid]["con2"]))
						$gameIsEmpty = 1;

					$this->mysqli->query("update games set gamer1Online=0 where gameId=$gameid;");
					
					fseek($this->container[$gameid]["file"], 0);
					$str = fread($this->container[$gameid]["file"], 100);
					$this->mysqli->query("update games set field1=\"$str\" where gameId=$gameid;");

				} else {
					unset($this->container[$gameid]["con2"]);

					if (!isset($this->container[$gameid]["con1"]))
						$gameIsEmpty = 1;

					$this->mysqli->query("update games set gamer2Online=0 where gameId=$gameid;");

					fseek($this->container[$gameid]["file"], 100);
					$str = fread($this->container[$gameid]["file"], 100);
					$this->mysqli->query("update games set field2=\"$str\" where gameId=$gameid;");
				}

				$this->mysqli->query("update games set status=\"{$this->container[$gameid]["gameStatus"]}\" where gameId=$gameid;");

				if ($gameIsEmpty) {
					fclose($this->container[$gameid]["file"]);
					unset($this->container[$gameid]["file"]);

					if ($this->container[$gameid]["gameStatus"] == 5 || $this->container[$gameid]["gameStatus"] == 6) {
						unlink("./../games/$gameid");
					}

					unset($this->container[$gameid]["gameStatus"]);
					unset($this->container[$gameid]);
				}

			} else {
				return;
			}
		}

		public function onClose(ConnectionInterface $con) {
			foreach ($this->container as $key => $value) {

				if (isset($this->container[$key]["con1"]) && ($this->container[$key]["con1"] === $con)) {

					echo "CLOSE game=$key\n";

					unset($this->container[$key]["gamer1"]);
					unset($this->container[$key]["con1"]);

					$this->mysqli->query("update games set gamer1Online=0 where gameId=$key;");

					fseek($this->container[$key]["file"], 0);
					$str = fread($this->container[$key]["file"], 100);
					$this->mysqli->query("update games set field1=\"$str\" where gameId=$key;");
					$this->mysqli->query("update games set status=\"{$this->container[$key]["gameStatus"]}\" where gameId=$key;");

					if (!isset($this->container[$key]["con2"])) {
						fclose($this->container[$key]["file"]);
						unset($this->container[$key]["file"]);

						if ($this->container[$key]["gameStatus"] == 5 || $this->container[$key]["gameStatus"] == 6) {
							unlink("./../games/$key");
						}

						unset($this->container[$key]["gameStatus"]);
						unset($this->container[$key]);
					}

					break;
				}

				if (isset($this->container[$key]["con2"]) && ($this->container[$key]["con2"] === $con)) {

					echo "CLOSE game=$key\n";

					unset($this->container[$key]["con2"]);

					$this->mysqli->query("update games set gamer2Online=0 where gameId=$key;");

					fseek($this->container[$key]["file"], 0);
					$str = fread($this->container[$key]["file"], 100);
					$this->mysqli->query("update games set filed2=\"$str\" where gameId=$key;");
					$this->mysqli->query("update games set status=\"{$this->container[$key]["gameStatus"]}\" where gameId=$key;");
					
					if (!isset($this->container[$key]["con1"])) {
						fclose($this->container[$key]["file"]);
						unset($this->container[$key]["file"]);

						if ($this->container[$key]["gameStatus"] == 5 || $this->container[$key]["gameStatus"] == 6) {
							unlink("./../games/$key");
						}


						unset($this->container[$key]["gameStatus"]);
						unset($this->container[$key]);
					}

					break;
				}

			}
		}

		public function onError(ConnectionInterface $con, \Exception $e) {
		}
	}

?>
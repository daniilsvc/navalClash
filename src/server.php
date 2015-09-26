<?php
	require_once "../vendor/autoload.php";

	use Ratchet\Server\IoServer;
	use Ratchet\Http\HttpServer;
	use Ratchet\WebSocket\WsServer;

	use \NavalClash\NcWsServer;

	$server = IoServer::factory(
		new HttpServer(
			new WsServer(
				new NcWsServer()
			)
		),

		5030
	);

	$server->run();
?>
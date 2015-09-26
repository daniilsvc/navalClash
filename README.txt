This is a Naval Clash game, written with JavaScript and PHP.
To use this game you have to place all project files in your HTTP server work folder.
You also need MySQL server to be run on port 3306. MySQL server need to have database navalClash, described in src/db&Composer/navalClash_db.sql file.
You need WebSocket server (i used PHP Ratchet library from http://www.socketo.me) to be run on port 5030.
You can install WebSocket server Ratcher using composer file src/db&Composer/composer.json

File structure of the project:
css/ - dir with CSS styles
games/ - here tmp files describing started but not finised games are placed
js/ - dir with javascript files for client (include jquery)
src/ - dir where you can find db conf file and WebSocket server files.

Important: I dont commit dependencies in my vendor directory, so you have to install them using composer.
	Just do next steps:
		* install composer from https://www.getcomposer.org
		* copy file src/db&Composer/composer.json to the root directory of project
		* run "php composer.pchar install

	as a result you will get vendor/ directory in the root of project, that contains Ratchet library.
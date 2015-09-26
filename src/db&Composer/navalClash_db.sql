use navalClash;

drop table if exists 'users';
drop table if exists 'games';

create table users (
	userId INT NOT NULL AUTO_INCREMENT,
	name CHAR(10),
	password CHAR(10),
	registerDate DATETIME,
	lastVisit DATETIME,
	
	PRIMARY KEY (userId)
);

create table games (
	gameId INT NOT NULL AUTO_INCREMENT,
	startDate DATETIME,
	endDate DATETIME,
	gamer1 INT,
	gamer2 INT,
	field1 TINYBLOB,
	field2 TINYBLOB,
	gamer1Online bit(1),
	gamer2Online bit(2),
	status ENUM('0', '1', '2', '3', '4', '5', '6')

	PRIMARY KEY (gameId)
);
CREATE DATABASE IF NOT EXISTS lyricsify;

DROP TABLE IF EXISTS `lyricsify`.`lyrics` ;
DROP TABLE IF EXISTS `lyricsify`.`songs` ;

CREATE TABLE `songs` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`artist` VARCHAR(300) NOT NULL,
	`title` VARCHAR(500) NOT NULL,
	`origLang` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`)
) DEFAULT CHARSET=UTF8

COLLATE='utf8_general_ci'
ENGINE=InnoDB;

DROP TABLE IF EXISTS `lyricsify`.`lyrics` ;

CREATE TABLE `lyrics` (
	`songId` INT NOT NULL,
	`transLang` VARCHAR(50) NOT NULL,
	`text` MEDIUMTEXT NOT NULL,
	PRIMARY KEY (`songId`, `transLang`)
) DEFAULT CHARSET=UTF8

COLLATE='utf8_general_ci'
ENGINE=InnoDB;


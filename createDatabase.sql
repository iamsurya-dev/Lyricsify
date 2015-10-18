CREATE DATABASE IF NOT EXISTS lyricsify;

DROP TABLE IF EXISTS `lyricsify`.`songs` ;

CREATE TABLE `songs` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`artist` VARCHAR(300) NOT NULL,
	`title` VARCHAR(500) NOT NULL,
	`origLang` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`)
)

COLLATE='utf8_general_ci'
ENGINE=InnoDB;

DROP TABLE IF EXISTS `lyricsify`.`lyrics` ;

CREATE TABLE `lyrics` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`songId` INT NOT NULL,
	`transLang` VARCHAR(50) NOT NULL,
	`text` MEDIUMTEXT NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_songs_id`
    FOREIGN KEY (`id`)
    REFERENCES `lyricsify`.`songs` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)

COLLATE='utf8_general_ci'
ENGINE=InnoDB;


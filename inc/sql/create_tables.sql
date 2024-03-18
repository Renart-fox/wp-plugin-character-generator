CREATE TABLE IF NOT EXISTS wp_cg_characters (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        time datetime DEFAULT CURRENT_TIMESTAMP,
        cg_name VARCHAR(100) NOT NULL,
		cg_obj JSON NOT NULL,
        PRIMARY KEY  (id)
);
/
CREATE TABLE IF NOT EXISTS wp_cg_systems (
		id mediumint(9) NOT NULL,
		cg_name VARCHAR(100) NOT NULL,
		PRIMARY KEY  (id)
);
/
CREATE TABLE IF NOT EXISTS wp_cg_characters_systems (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        characterId int NOT NULL,
		systemId int NOT NULL,
        PRIMARY KEY  (id),
		INDEX(systemId),
		FOREIGN KEY (characterId)
		REFERENCES wp_cg_characters(id),

		FOREIGN KEY (systemId)
		REFERENCES wp_cg_systems(id)
);
/
CREATE TABLE IF NOT EXISTS wp_cg_v5e_names(
    id mediumint(9) NOT NULL,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,

    PRIMARY KEY(id)
);
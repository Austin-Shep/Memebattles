DROP DATABASE IF EXISTS meme_battle;
CREATE DATABASE meme_battle;

-- for the manager account
INSERT INTO users
    (email, password,isManager, createdAt, updatedAt)
VALUES("chaosdoggs522@gmail.com", "Chaosdo1", true, "2018-12-02 16:25:26", "2018-12-02 16:25:26" );



INSERT INTO clickerUpgrades
    (clickPower, morePerClick,cost, createdAt, updatedAt)
VALUES
    (3 , 0.2 , 500, "2018-12-02 16:25:26", "2018-12-02 16:25:26");
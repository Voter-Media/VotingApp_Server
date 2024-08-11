
use election;

CREATE TABLE user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(10),
    email VARCHAR(255),
    year_level VARCHAR(50),
    faculty VARCHAR(100),
    gender VARCHAR(50),
    role VARCHAR(50),
    verified BOOLEAN
);

CREATE TABLE voter (
    voter_id INT PRIMARY KEY AUTO_INCREMENT,
    voted BOOLEAN DEFAULT FALSE,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE candidate (
    candidate_id INT PRIMARY KEY AUTO_INCREMENT,
    position VARCHAR(255),
    description VARCHAR(500),
    imageUrl VARCHAR(255),
    party VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE vote (
    vote_id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_id INT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    voter_id INT,
    FOREIGN KEY (candidate_id) REFERENCES candidate(candidate_id),
    FOREIGN KEY (voter_id) REFERENCES voter(voter_id)
);
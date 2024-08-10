
use election;

create table voters(
voter_id varchar(12),
voted boolean,
foreign key(voter_id) references user(user_id));

create table candidate (
candidate_id varchar(12),
position varchar(20),
imageUrl varchar(35),
party varchar(25),
foreign key(candidate_id) references user(user_id));

ALTER TABLE candidate
ADD votes numeric;

create table user(
user_id varchar(12) primary key,
firstName varchar(12),
lastName varchar(12),
phone varchar(10),
email varchar(30),
gender varchar(7),
faculty varchar(15),
level varchar(8),
role varchar(15),
description varchar(255),
imageUrl varchar(35),
verified boolean);

create table login(
username varchar(30),
login_time datetime,
user_id varchar(12) primary key ,
foreign key(user_id) references user(user_id));


create table vote(
vote_id numeric primary key,
candidate_id varchar(12),
date datetime,
voter_id varchar(12),
foreign key (candidate_id) references candidate(candidate_id),
foreign key (voter_id) references voters(voter_id));

INSERT INTO user (user_id, firstName, lastName, phone, email, gender, faculty, level, role, description, imageUrl, verified) VALUES
('U001', 'John', 'Doe', '1234567890', 'john@ex.com', 'Male', 'Eng', 'UG', 'Voter', 'Enthusiast', 'john.png', TRUE),
('U002', 'Jane', 'Smith', '0987654321', 'jane@ex.com', 'Female', 'Arts', 'Grad', 'Cand', 'Focused', 'jane.png', TRUE),
('U003', 'Alice', 'John', '1122334455', 'alice@ex.com', 'Female', 'Sci', 'UG', 'Voter', 'Enviro', 'alice.png', FALSE),
('U004', 'Bob', 'Brown', '2233445566', 'bob@ex.com', 'Male', 'Bus', 'Grad', 'Voter', 'Advocate', 'bob.png', TRUE),
('U005', 'Charlie', 'Davis', '3344556677', 'charlie@ex.com', 'Male', 'Med', 'UG', 'Cand', 'Health', 'charlie.png', TRUE),
('U006', 'Emily', 'Clark', '4455667788', 'emily@ex.com', 'Female', 'Law', 'Grad', 'Voter', 'Rights', 'emily.png', TRUE),
('U007', 'Frank', 'Edw', '5566778899', 'frank@ex.com', 'Male', 'Eng', 'UG', 'Cand', 'Energy', 'frank.png', FALSE),
('U008', 'Grace', 'Tay', '6677889900', 'grace@ex.com', 'Female', 'Sci', 'Grad', 'Voter', 'Renew', 'grace.png', TRUE),
('U009', 'Henry', 'Wil', '7788990011', 'henry@ex.com', 'Male', 'Arts', 'UG', 'Voter', 'Arts', 'henry.png', TRUE),
('U010', 'Ivy', 'Moore', '8899001122', 'ivy@ex.com', 'Female', 'Bus', 'Grad', 'Cand', 'Markets', 'ivy.png', TRUE);


INSERT INTO login (username, login_time, user_id) VALUES
('john', '2024-08-10 10:00:00', 'U001'),
('jane', '2024-08-10 10:05:00', 'U002'),
('alice', '2024-08-10 10:10:00', 'U003'),
('bob', '2024-08-10 10:15:00', 'U004'),
('charlie', '2024-08-10 10:20:00', 'U005'),
('emily', '2024-08-10 10:25:00', 'U006'),
('frank', '2024-08-10 10:30:00', 'U007'),
('grace', '2024-08-10 10:35:00', 'U008'),
('henry', '2024-08-10 10:40:00', 'U009'),
('ivy', '2024-08-10 10:45:00', 'U010');

INSERT INTO voters (voter_id, voted) VALUES
('U001', TRUE),
('U003', FALSE),
('U004', TRUE),
('U006', TRUE),
('U008', FALSE),
('U009', TRUE);

INSERT INTO candidate (candidate_id, position, imageUrl, party,votes) VALUES
('U002', 'Pres', 'jane.png', 'Culture','1'),
('U005', 'VP', 'charlie.png', 'Health','1'),
('U007', 'Treas', 'frank.png', 'Green','2'),
('U010', 'Sec', 'ivy.png', 'Biz','3');


INSERT INTO vote (vote_id, candidate_id, date, voter_id) VALUES
(1, 'U002', '2024-08-10 11:00:00', 'U001'),
(2, 'U002', '2024-08-10 11:05:00', 'U004'),
(3, 'U007', '2024-08-10 11:10:00', 'U006'),
(4, 'U010', '2024-08-10 11:15:00', 'U009'),
(5, 'U007', '2024-08-10 11:20:00', 'U001');



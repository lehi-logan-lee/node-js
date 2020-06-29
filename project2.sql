CREATE TABLE person
(
	id SERIAL PRIMARY KEY NOT NULL,
	first VARCHAR(100) NOT NULL,
	last VARCHAR(100)
);

INSERT INTO person(first, last) VALUES
  ('Thomas', 'Edison'),
  ('Scott', 'Burton'),
  ('Li', 'Hai'),
  ('Bill', 'Gates'),
  ('Steve', 'Jobs'),
  ('Jeff', 'Bezos'),
  ('Donald', 'Trump'),
  ('Jesus', 'Christ');

ALTER TABLE person
ADD balance FLOAT;

UPDATE person
SET first = 'Jeff', last= 'Bezos', balance = 113
WHERE id = 1;

UPDATE person
SET first = 'Bill', last= 'Gates', balance = 98
WHERE id = 2;
UPDATE person
SET first = 'Bernard', last= 'Arnault', balance = 76
WHERE id = 3;
UPDATE person
SET first = 'Warren', last= 'Buffett', balance = 67.5
WHERE id = 4;
UPDATE person
SET first = 'Larry', last= 'Ellison', balance = 59
WHERE id = 5;
UPDATE person
SET first = 'Amancio', last= 'Ortega', balance = 55.1
WHERE id = 6;
UPDATE person
SET first = 'Mark', last= 'Zuckerberg', balance = 54.7
WHERE id = 7;
UPDATE person
SET first = 'Jim', last= 'Walton', balance = 54.6
WHERE id = 8;

INSERT INTO person(first, last, balance) VALUES
  ('Alice', 'Walton', 54.4),
  ('S. Robson', 'Walton', 54.1);

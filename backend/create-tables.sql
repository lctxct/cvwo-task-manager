DROP TABLE IF EXISTS taskTag;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS tags;
CREATE TABLE tasks (
    id           INT AUTO_INCREMENT NOT NULL,
    date         VARCHAR(128) NOT NULL,
    title        VARCHAR(255) NOT NULL,
    description  VARCHAR(500) NOT NULL,
    PRIMARY KEY (`id`)
);


CREATE TABLE tags (
    id INT AUTO_INCREMENT NOT NULL,
    content VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO tasks
    (date, title, description)
VALUES 
    ('12/03/2021', 'Water mushrooms', 'Make sure water is wet'),
    ('15/02/2021', 'Fry tomatoes', 'With cheese'), 
    ('19/12/2021', 'End of the universe', 'Remember to bring a towel');

INSERT INTO tags
    (content)
VALUES 
    ('mushroom'), 
    ('water'), 
    ('food');

DROP TABLE IF EXISTS taskTag;
CREATE TABLE taskTag (
    task_id INT NOT NULL, 
    tag_id INT NOT NULL, 

    FOREIGN KEY (`task_id`) REFERENCES tasks(id), 
    FOREIGN KEY (`tag_id`) REFERENCES tags(id)
); 

INSERT INTO taskTag 
    (task_id, tag_id) 
VALUES 
    ('1', '1'), 
    ('1', '2'), 
    ('1', '3'), 
    ('2', '3');
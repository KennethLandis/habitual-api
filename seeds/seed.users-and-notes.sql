INSERT INTO clients (client_name, user_password)
VALUES
    ('portal', 'test1'),
    ('petch', 'test2'),
    ('byrd', 'test3');

INSERT INTO habits (habit_name, days_completed, client_id)
VALUES
    ('Do the dishes', 3, 2),
    ('Complete a Mythic', 0, 1),
    ('Maple Tour', 54, 3),
    ('Commerci', 2, 3),
    ('Check my email', 1, 2),
    ('Work on my css', 3, 2),
    ('Complete datastructures practice', 2, 2),
    ('Farm for a new mount', 1, 2);
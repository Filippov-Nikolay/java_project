INSERT INTO users (username, email, password_hash, role) VALUES
 ('teacher1', 'teacher1@example.com', 'hash1', 'TEACHER'),
 ('student1', 'student1@example.com', 'hash2', 'STUDENT');

INSERT INTO contacts (first_name, last_name, email, phone) VALUES
 ('Иван', 'Иванов', 'ivanov@example.com', '+70000000001'),
 ('Мария', 'Петрова', 'petrova@example.com', '+70000000002');

INSERT INTO subjects (name, description) VALUES
 ('Математика', 'Базовый курс алгебры и геометрии'),
 ('Физика', 'Основы механики и электродинамики');

INSERT INTO groups (name, course) VALUES
 ('ИТ-101', 1),
 ('ИТ-201', 2);

INSERT INTO submissions (student_id, subject_id, content, submitted_at) VALUES
 (2, 1, 'Работа по алгебре', SYSTIMESTAMP - INTERVAL '2' DAY),
 (2, 2, 'Лабораторная по физике', SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO assessments (submission_id, teacher_id, grade, commentText, assessed_at) VALUES
 (1, 1, 5, 'Отличная работа', SYSTIMESTAMP - INTERVAL '1' DAY),
 (2, 1, 4, 'Есть небольшие замечания', SYSTIMESTAMP);

INSERT INTO students (name, email) VALUES
 ('Anna Student', 'anna@example.com'),
 ('Bob Student', 'bob@example.com');

INSERT INTO courses (name, student_id) VALUES
 ('Math', 1),
 ('Physics', 1),
 ('History', 2);


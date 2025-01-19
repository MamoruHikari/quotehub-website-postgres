CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    book_name TEXT NOT NULL CHECK (book_name <> ''),
    author_name TEXT NOT NULL CHECK (author_name <> ''),
    date_read DATE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 10),
    opinion TEXT CHECK (opinion <> ''),
    amazon_link TEXT CHECK (amazon_link <> '')
);

CREATE TABLE identifiers (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    key VARCHAR(20) NOT NULL CHECK (key <> ''),
    value VARCHAR(30) NOT NULL CHECK (value <> ''),
    size CHAR(1) CHECK (size IN ('S', 'M', 'L'))
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    paragraph TEXT NOT NULL CHECK (paragraph <> '')
);

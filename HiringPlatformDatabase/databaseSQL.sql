-- BAZA DE DATE

-- Stergerea tabelelor
DROP TABLE roluri;
DROP TABLE utilizatori;
DROP TABLE token_autentificare;

-- Crearea tabelelor
CREATE TABLE roluri (
    id_rol VARCHAR2(36) CONSTRAINT pk_rol PRIMARY KEY,
    nume_rol VARCHAR(100) NOT NULL,
    descriere VARCHAR(255),
    CONSTRAINT rol_nume_unic UNIQUE (nume_rol)
);

CREATE TABLE utilizatori (
	id_utilizator VARCHAR2(36) CONSTRAINT pk_utilizator PRIMARY KEY,
    email VARCHAR2(100) NOT NULL,
    parola VARCHAR2(100) NOT NULL,
    nume_de_utilizator VARCHAR2(100) NOT NULL,
    data_inregistrare DATE NOT NULL,
    cont_activat NUMBER(1) NOT NULL,
    id_rol VARCHAR2(36) CONSTRAINT fk_utilizator_rol REFERENCES roluri(id_rol),
    CONSTRAINT utilizator_email_unic UNIQUE (email)
);

CREATE TABLE token_autentificare (
    id_token VARCHAR2(36) CONSTRAINT pk_token PRIMARY KEY,
    data_expirare DATE NOT NULL,
    token VARCHAR2(100) NOT NULL,
    id_utilizator VARCHAR2(36) CONSTRAINT fk_utilizator_token REFERENCES utilizatori(id_utilizator)
);

-- Verificarea datelor
SELECT * FROM roluri;
SELECT * FROM utilizatori;
SELECT * FROM token_autentificare;
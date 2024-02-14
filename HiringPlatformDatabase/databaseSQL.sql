-- BAZA DE DATE

-- Stergerea tabelelor
DROP TABLE token_autentificare;
DROP TABLE administratori;
DROP TABLE angajatori;
DROP TABLE candidati;
DROP TABLE utilizatori;
DROP TABLE adrese;
DROP TABLE orase;
DROP TABLE regiuni;
DROP TABLE tari;
DROP TABLE roluri;

-- Crearea tabelelor
CREATE TABLE tari (
    id_tara VARCHAR2(36) CONSTRAINT pk_tara PRIMARY KEY,
    nume VARCHAR(255) NOT NULL
);

CREATE TABLE regiuni (
    id_regiune VARCHAR2(36) CONSTRAINT pk_regiune PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    id_tara VARCHAR2(36) CONSTRAINT fk_regiune_tara REFERENCES tari(id_tara)
);

CREATE TABLE orase (
    id_oras VARCHAR2(36) CONSTRAINT pk_oras PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    id_regiune VARCHAR2(36) CONSTRAINT fk_oras_regiune REFERENCES regiuni(id_regiune)
);

CREATE TABLE adrese (
    id_adresa VARCHAR2(36) CONSTRAINT pk_adresa PRIMARY KEY,
    strada VARCHAR(255)  NOT NULL,
    cod_postal VARCHAR(255)  NOT NULL,
    id_oras VARCHAR2(36) CONSTRAINT fk_adresa_oras REFERENCES orase(id_oras)
);

CREATE TABLE roluri (
    id_rol VARCHAR2(36) CONSTRAINT pk_rol PRIMARY KEY,    
    nume_rol VARCHAR(100) NOT NULL,
    descriere VARCHAR(255),
    CONSTRAINT rol_nume_unic UNIQUE (nume_rol)
);

CREATE TABLE utilizatori (
	id_utilizator VARCHAR2(36) CONSTRAINT pk_utilizator PRIMARY KEY,
    email VARCHAR2(100) NOT NULL,
    parola VARCHAR2(100),
    data_inregistrare DATE NOT NULL,
    cont_activat NUMBER(1) NOT NULL,
    id_rol VARCHAR2(36) CONSTRAINT fk_utilizator_rol REFERENCES roluri(id_rol),
    CONSTRAINT utilizator_email_unic UNIQUE (email)
);

CREATE TABLE candidati (
	id_candidat VARCHAR2(36) CONSTRAINT pk_candidat PRIMARY KEY,
    nume VARCHAR2(100) NOT NULL,
    prenume VARCHAR2(100) NOT NULL,
    CONSTRAINT fk_utilizator_candidat FOREIGN KEY (id_candidat) REFERENCES utilizatori(id_utilizator)
);

CREATE TABLE angajatori (
	id_angajator VARCHAR2(36) CONSTRAINT pk_angajator PRIMARY KEY,
    nume_companie VARCHAR2(100) NOT NULL,
    CONSTRAINT fk_utilizator_angajat FOREIGN KEY (id_angajator) REFERENCES utilizatori(id_utilizator)
);

CREATE TABLE administratori (
	id_admin VARCHAR2(36) CONSTRAINT pk_admin PRIMARY KEY,
    nume_utilizator VARCHAR2(100) NOT NULL,
    id_creator_cont VARCHAR2(36),
    CONSTRAINT fk_utilizator_admin FOREIGN KEY (id_admin) REFERENCES utilizatori(id_utilizator),
    CONSTRAINT fk_creator_admin FOREIGN KEY (id_creator_cont) REFERENCES utilizatori(id_utilizator)
);

CREATE TABLE token_autentificare (
    id_token VARCHAR2(36) CONSTRAINT pk_token PRIMARY KEY,
    data_expirare DATE NOT NULL,
    token VARCHAR2(100) NOT NULL,
    id_utilizator VARCHAR2(36) CONSTRAINT fk_utilizator_token REFERENCES utilizatori(id_utilizator)
);

CREATE TABLE profiluri (
    id_profil VARCHAR2(36) CONSTRAINT pk_profil PRIMARY KEY,
    imagine BLOB,
    descriere VARCHAR2(4000) NOT NULL,
    nr_telefon VARCHAR2(10),
    site_oficial VARCHAR2(255),
    id_adresa VARCHAR2(36) CONSTRAINT fk_profil_adresa REFERENCES adrese(id_adresa),
    id_angajator VARCHAR2(36) CONSTRAINT fk_profil_angajator REFERENCES angajatori(id_angajator),
    CONSTRAINT nr_telefon_corect CHECK(LENGTH(nr_telefon) = 10 AND REGEXP_LIKE(nr_telefon, '^[0-9]+$'))
);

-- Verificarea datelor
SELECT * FROM roluri;
SELECT * FROM utilizatori;
SELECT * FROM administratori;
SELECT * FROM candidati;
SELECT * FROM angajatori;
SELECT * FROM tari;
SELECT * FROM adrese;
SELECT * FROM token_autentificare;
COMMIT;
-- BAZA DE DATE

-- Stergerea tabelelor
DROP TABLE intrebari;
DROP TABLE contine;
DROP TABLE etape;
DROP TABLE locuri_de_munca;
DROP TABLE token_autentificare;
DROP TABLE administratori;
DROP TABLE profiluri;
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
    CONSTRAINT fk_utilizator_candidat FOREIGN KEY (id_candidat) REFERENCES utilizatori(id_utilizator) ON DELETE CASCADE
);

CREATE TABLE angajatori (
	id_angajator VARCHAR2(36) CONSTRAINT pk_angajator PRIMARY KEY,
    nume_companie VARCHAR2(100) NOT NULL,
    CONSTRAINT fk_utilizator_angajat FOREIGN KEY (id_angajator) REFERENCES utilizatori(id_utilizator) ON DELETE CASCADE
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
    id_utilizator VARCHAR2(36) CONSTRAINT fk_utilizator_token REFERENCES utilizatori(id_utilizator) ON DELETE CASCADE
);

CREATE TABLE profiluri (
    id_profil VARCHAR2(36) CONSTRAINT pk_profil PRIMARY KEY,
    imagine BLOB,
    descriere CLOB NOT NULL,
    nr_telefon VARCHAR2(10),
    site_oficial VARCHAR2(255),
    id_adresa VARCHAR2(36) CONSTRAINT fk_profil_adresa REFERENCES adrese(id_adresa),
    id_angajator VARCHAR2(36) CONSTRAINT fk_profil_angajator REFERENCES angajatori(id_angajator) ON DELETE CASCADE,
    CONSTRAINT nr_telefon_corect CHECK(LENGTH(nr_telefon) = 10 AND REGEXP_LIKE(nr_telefon, '^[0-9]+$'))
);

CREATE TABLE locuri_de_munca (
    id_loc_de_munca VARCHAR2(36) CONSTRAINT pk_loc_de_munca PRIMARY KEY,
    id_angajator VARCHAR2(36) CONSTRAINT fk_loc_munca_angajator REFERENCES angajatori(id_angajator) ON DELETE CASCADE,
    id_oras VARCHAR2(36) CONSTRAINT fk_loc_de_munca_adresa REFERENCES orase(id_oras),
    titlu VARCHAR2(500) NOT NULL,
    descriere CLOB NOT NULL,
    tip_contract VARCHAR2(100) NOT NULL,
    regim_angajare VARCHAR2(100) NOT NULL,
    data_postarii DATE NOT NULL,
    industrie VARCHAR2(100) NOT NULL,
    mod_lucru VARCHAR2(100) NOT NULL,
    experienta VARCHAR2(100) NOT NULL,
    CONSTRAINT tip_contract_corect CHECK(tip_contract IN ('Norma intreaga', 'Norma redusa', 'Norma variabila')),
    CONSTRAINT regim_angajare_corect CHECK(regim_angajare IN ('Stagiu', 'Proiect', 'Contract determinat', 'Contract nedeterminat')),
    CONSTRAINT experienta_corecta CHECK(experienta IN ('Entry-Level', 'Junior', 'Intermediar')),
    CONSTRAINT mod_lucru_corect CHECK(mod_lucru IN ('On-Site', 'Remote', 'Hibrid'))
);

CREATE TABLE etape (
    id_etapa VARCHAR2(36) CONSTRAINT pk_etapa PRIMARY KEY,
    nume_etapa VARCHAR2(200) NOT NULL,
    CONSTRAINT etapa_nume_etapa UNIQUE (nume_etapa)
);

CREATE TABLE contine (
    id_etapa VARCHAR2(36) CONSTRAINT fk_etapa REFERENCES etape(id_etapa) ON DELETE CASCADE,
    id_loc_de_munca VARCHAR2(36) CONSTRAINT fk_contine_loc_de_munca REFERENCES locuri_de_munca(id_loc_de_munca) ON DELETE CASCADE,
    nr_etapa NUMBER NOT NULL,
    CONSTRAINT pk_contine PRIMARY KEY(id_etapa, id_loc_de_munca)
);

CREATE TABLE intrebari (
    id_intrebare VARCHAR2(36) CONSTRAINT pk_intrebare PRIMARY KEY,
    id_loc_de_munca VARCHAR2(36) CONSTRAINT fk_intrebare_loc_de_munca REFERENCES locuri_de_munca(id_loc_de_munca) ON DELETE CASCADE,
    text_intrebare VARCHAR2(500) NOT NULL,
    nr_intrebare NUMBER NOT NULL
);

-- Inserarea datelor initiale
INSERT INTO roluri (id_rol, nume_rol, descriere) VALUES 
(1, 'ROLE_ADMIN', 'The admin is the one who takes care of the management of the application.');
INSERT INTO roluri (id_rol, nume_rol, descriere) VALUES 
(2, 'ROLE_EMPLOYER', 'The employer is the one who seeks to hire a person for a job.');
INSERT INTO roluri (id_rol, nume_rol, descriere) VALUES 
(3, 'ROLE_CANDIDATE', 'The candidate wants to be employed at a job.');

INSERT INTO utilizatori (id_utilizator, email, parola, data_inregistrare, cont_activat, id_rol) 
VALUES (1, 'admin@gmail.com', '05bda27d-974f-4127-b6b1-0a062756687a', sysdate, 1, 1);

INSERT INTO administratori (id_admin, nume_utilizator, id_creator_cont) 
VALUES (1, 'Admin', null);

COMMIT;
    
-- Verificarea datelor
SELECT * FROM roluri;
SELECT * FROM utilizatori;
SELECT * FROM administratori;
SELECT * FROM candidati;
SELECT * FROM angajatori;
SELECT * FROM tari;
SELECT * FROM adrese;
SELECT * FROM token_autentificare;
SELECT * FROM profiluri;
SELECT * FROM locuri_de_munca;
SELECT * FROM etape;
SELECT * FROM contine;
SELECT * FROM intrebari;
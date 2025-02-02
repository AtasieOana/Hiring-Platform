-- BAZA DE DATE

-- Stergerea tabelelor
DROP TABLE reclamatii;
DROP TABLE recenzii;
DROP TABLE raspunsuri;
DROP TABLE aplica;
DROP TABLE cv;
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
DROP TABLE roluri;

-- Crearea tabelelor
CREATE TABLE regiuni (
    id_regiune VARCHAR2(36) CONSTRAINT pk_regiune PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    CONSTRAINT regiune_nume_unic UNIQUE (nume)
);

CREATE TABLE orase (
    id_oras VARCHAR2(36) CONSTRAINT pk_oras PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    id_regiune VARCHAR2(36) CONSTRAINT fk_oras_regiune REFERENCES regiuni(id_regiune),
    CONSTRAINT oras_per_regiune_unic UNIQUE (nume, id_regiune)
);

CREATE TABLE adrese (
    id_adresa VARCHAR2(36) CONSTRAINT pk_adresa PRIMARY KEY,
    strada VARCHAR(255) NOT NULL,
    cod_postal VARCHAR(255) NOT NULL,
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
    CONSTRAINT utilizator_email_unic UNIQUE (email),
    CONSTRAINT email_valid CHECK (REGEXP_LIKE(email, '.+@.+\..+')),
    CONSTRAINT parola_lungime_corecta CHECK (LENGTH(parola) >= 5)
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
    CONSTRAINT fk_utilizator_admin FOREIGN KEY (id_admin) REFERENCES utilizatori(id_utilizator) ON DELETE CASCADE,
    CONSTRAINT fk_creator_admin FOREIGN KEY (id_creator_cont) REFERENCES administratori(id_admin)
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
    id_adresa VARCHAR2(36) CONSTRAINT fk_profil_adresa REFERENCES adrese(id_adresa) ON DELETE CASCADE,
    id_angajator VARCHAR2(36) CONSTRAINT fk_profil_angajator REFERENCES angajatori(id_angajator) ON DELETE CASCADE,
    CONSTRAINT nr_telefon_corect CHECK(LENGTH(nr_telefon) = 10 AND REGEXP_LIKE(nr_telefon, '^[0-9]+$')),
    CONSTRAINT profil_angajator_unic UNIQUE (id_angajator)
);

CREATE TABLE locuri_de_munca (
    id_loc_de_munca VARCHAR2(36) CONSTRAINT pk_loc_de_munca PRIMARY KEY,
    id_angajator VARCHAR2(36) CONSTRAINT fk_loc_munca_angajator REFERENCES angajatori(id_angajator) ON DELETE CASCADE,
    id_oras VARCHAR2(36) CONSTRAINT fk_loc_de_munca_adresa REFERENCES orase(id_oras) ON DELETE CASCADE,
    titlu VARCHAR2(500) NOT NULL,
    descriere CLOB NOT NULL,
    tip_contract VARCHAR2(100) NOT NULL,
    regim_angajare VARCHAR2(100) NOT NULL,
    data_postarii DATE NOT NULL,
    industrie VARCHAR2(100) NOT NULL,
    mod_lucru VARCHAR2(100) NOT NULL,
    experienta VARCHAR2(100) NOT NULL,
    status VARCHAR2(10),
    CONSTRAINT status_corect CHECK(status IN ('deschis', 'inchis')),
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

CREATE TABLE cv (
    id_cv VARCHAR2(36) CONSTRAINT pk_cv PRIMARY KEY,
    id_candidat CONSTRAINT fk_cv_candidat REFERENCES candidati(id_candidat) ON DELETE CASCADE,
    nume_cv VARCHAR2(100) NOT NULL,
    data_incarcarii DATE NOT NULL,
    CONSTRAINT nume_cv_unic UNIQUE (nume_cv)
);

CREATE TABLE aplica (
    id_loc_de_munca VARCHAR2(36) CONSTRAINT fk_aplica_loc_de_munca REFERENCES locuri_de_munca(id_loc_de_munca) ON DELETE CASCADE,
    id_cv VARCHAR2(36) CONSTRAINT fk_aplica_cv REFERENCES cv(id_cv) ON DELETE CASCADE,
    id_candidat VARCHAR2(36) CONSTRAINT fk_aplica_candidat REFERENCES candidati(id_candidat) ON DELETE CASCADE,
    data_aplicarii DATE NOT NULL,
    id_etapa_curenta VARCHAR2(36) CONSTRAINT fk_aplica_etapa REFERENCES etape(id_etapa) ON DELETE CASCADE,
    status VARCHAR2(20) CHECK (status IN ('refuzat', 'in_curs', 'finalizat')) NOT NULL,
    motiv_refuz VARCHAR2(500),
    CONSTRAINT pk_aplica PRIMARY KEY(id_loc_de_munca, id_cv, id_candidat),
    CONSTRAINT candidat_loc_de_munca UNIQUE (id_loc_de_munca, id_candidat)
);

CREATE TABLE raspunsuri (
    id_raspuns VARCHAR2(36) CONSTRAINT pk_raspuns PRIMARY KEY,
    id_candidat VARCHAR2(36) CONSTRAINT fk_raspuns_candidat REFERENCES candidati(id_candidat) ON DELETE CASCADE,
    id_intrebare VARCHAR2(36) CONSTRAINT fk_raspuns_intrebare REFERENCES intrebari(id_intrebare) ON DELETE CASCADE,
    raspuns VARCHAR2(4000)
);

CREATE TABLE recenzii (
    id_recenzie VARCHAR2(36) CONSTRAINT pk_recenzie PRIMARY KEY,
    id_utilizator VARCHAR2(36) CONSTRAINT fk_recenzie_utilizator REFERENCES utilizatori(id_utilizator) ON DELETE CASCADE,
    id_angajator VARCHAR2(36) CONSTRAINT fk_recenzie_firma REFERENCES angajatori(id_angajator) ON DELETE CASCADE,
    id_recenzie_parinte VARCHAR2(36) CONSTRAINT fk_recenzie_raspuns REFERENCES recenzii(id_recenzie) ON DELETE CASCADE,
    comentariu VARCHAR2(1000) NOT NULL,
    data_comentariu DATE NOT NULL,
    nota NUMBER CONSTRAINT nota_valida CHECK (nota >= 0 AND nota <= 5)
);
    
CREATE TABLE reclamatii (
    id_reclamatie VARCHAR2(36) CONSTRAINT pk_reclamatie PRIMARY KEY,
    id_utilizator_reclamant VARCHAR2(36) CONSTRAINT fk_utilizator_reclamant REFERENCES utilizatori(id_utilizator) ON DELETE CASCADE,
    id_utilizator_reclamat VARCHAR2(36) CONSTRAINT fk_utilizator_reclamat REFERENCES utilizatori(id_utilizator) ON DELETE CASCADE,
    motiv CLOB NOT NULL,
    data_reclamatie DATE NOT NULL,
    status VARCHAR2(20) CHECK (status IN ('procesat', 'neprocesat')) NOT NULL,
    id_admin_procesare VARCHAR2(36) CONSTRAINT fk_admin_reclamatie REFERENCES administratori(id_admin) ON DELETE CASCADE
);

-- Verificarea datelor
SELECT * FROM roluri;
SELECT * FROM orase;
SELECT * FROM regiuni;
SELECT * FROM utilizatori;
SELECT * FROM administratori;
SELECT * FROM candidati;
SELECT * FROM angajatori;
SELECT * FROM adrese;
SELECT * FROM token_autentificare;
SELECT * FROM profiluri;
SELECT * FROM locuri_de_munca;
SELECT * FROM cv;
SELECT * FROM etape;
SELECT * FROM contine;
SELECT * FROM intrebari;
SELECT * FROM raspunsuri;
SELECT * FROM aplica; 
SELECT * FROM recenzii;
SELECT * FROM reclamatii;

-- Stergerea datelor din tabel
DELETE FROM reclamatii;
DELETE FROM recenzii;
DELETE FROM raspunsuri;
DELETE FROM aplica;
DELETE FROM cv;
DELETE FROM intrebari;
DELETE FROM contine;
DELETE FROM etape;
DELETE FROM locuri_de_munca;
DELETE FROM token_autentificare;
DELETE FROM administratori;
DELETE FROM profiluri;
DELETE FROM angajatori;
DELETE FROM candidati;
DELETE FROM utilizatori;
DELETE FROM adrese;
DELETE FROM orase;
DELETE FROM regiuni;
DELETE FROM roluri;
COMMIT;
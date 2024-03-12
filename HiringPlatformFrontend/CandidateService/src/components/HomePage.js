import React, {useEffect, useState} from 'react';
import HeaderPage from "./header/HeaderPage";
import "./HomePage.css";

export const industriesRo = [
    "Toate industriile", "Administrație", "Agricultură", "Arhitectură/Design interior", "Audit",
    "Bănci", "Chimie/Petrochimie", "Construcții/Instalații", "Educație", "Finanțe",
    "Imobiliare", "Inginerie", "IT Hardware", "IT Software", "Juridic", "Management", "Marketing",
    "Media/Jurnalism", "Psihologie", "Publicitate", "Radio/Televiziune", "Relații clienți",
    "Relații publice", "Resurse umane", "Telecomunicații",
    "Tipografie/Editură", "Traduceri", "Transport/Distribuție", "Turism", "Vânzări"
];
export const industriesEng = [
    "All industries", "Administration", "Agriculture", "Architecture/Interior Design", "Audit", "Banks",
    "Chemistry/Petro-chemistry", "Construction/Installations", "Education", "Finance",
    "Real Estate", "Engineering", "IT Hardware", "IT Software", "Legal", "Management", "Marketing",
    "Media/Journalism", "Psychology", "Advertising", "Radio/Television", "Customer Relations",
    "Public Relations", "Human Resources", "Telecommunications",
    "Printing/Publishing", "Translations", "Transportation/Distribution", "Tourism", "Sales"
];

export const possibleExperiences = ['Entry-Level', 'Junior', 'Intermediar']
export const experiencesRo = ["Entry-Level (0 ani)", "Junior (0-2 ani)", "Intermediar (2-4 ani)"];
export const experiencesEng = ["Entry-Level (0 years)", "Junior (0-2 years)", "Intermediary (2-4 years)"];

export const possibleContractType = ['Norma intreaga', 'Norma redusa', 'Norma variabila']
export const contractEn = ["Full-time", "Part-time", "Freelance"]
export const contractRo = ["Full-time", "Part-time", "Variabil"]

export const possibleRegimeEmp = ['Contract determinat', 'Stagiu', 'Contract nedeterminat', 'Proiect']
export const regimeEn = ["Fixed-term Contract", "Internship", "Indefinite-term Contract", "Project"]
export const regimeRo = ["Contract determinat", "Stagiu", "Contract nedeterminat", "Proiect"]

export const possibleWorkMode = ['On-Site', 'Remote', 'Hibrid']
export const workEn = ["On-Site", "Remote", "Hybrid"]
export const workRo = ["La birou", "La distanță", "Hibrid"]

export const possibleDates = ['Oricand', 'Luna trecuta', 'Saptamana trecuta', 'Ziua trecuta']
export const dateEn = ["Anytime", "In the last month", "In the last week", "In the last day"]
export const dateRo = ["Oricând", "În ultima lună", "În ultima săptămână", "În ultima zi"]

const HomePage = () => {



    return (
        <div>
            <HeaderPage/>
            TODO
        </div>
    );
};

export default HomePage;

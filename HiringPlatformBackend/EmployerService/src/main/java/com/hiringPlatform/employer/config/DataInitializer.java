package com.hiringPlatform.employer.config;

import com.hiringPlatform.employer.model.Stage;
import com.hiringPlatform.employer.repository.StageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    private final StageRepository stageRepository;

    @Autowired
    public DataInitializer(StageRepository stageRepository) {
        this.stageRepository = stageRepository;
    }

    @Override
    public void run(String... args) {
        // Create default stages
        List<String> stages = Arrays.asList("The candidate submitted a resume (Candidatul a depus un CV)", "Employer viewed the application (Angajatorul a vizualizat aplicarea)",
                "The applicant has been hired (Candidatul a fost angajat)", "Preliminary telephone interview (Interviu telefonic preliminar)",
                "Technical interview (Interviu tehnic)", "Personality tests (Teste de personalitate)", "Invitation to a social gathering (Invitație la o adunare socială)",
                "Background check (Verificarea referințelor)", "Hiring manager interview (Interviu cu managerul de angajare)",
                "Interview with the Human Resources Department (Interviu cu Departamentul de Resurse Umane)",
                "Interview with the Technical Team (Interviu cu Echipa Tehnică)", "Practical Interview (Interviu Practic)",
                "Assessment test (Test de evaluare)", "Language Proficiency Test (Test de competență lingvistică)");
        // Create default stages
        for(String stage: stages){
            Stage stageDb = new Stage();
            stageDb.setStageName(stage);
            stageRepository.save(stageDb);
        }
    }
}
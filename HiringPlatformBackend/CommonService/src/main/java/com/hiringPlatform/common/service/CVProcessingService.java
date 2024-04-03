package com.hiringPlatform.common.service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.hiringPlatform.common.model.response.CVCompletionLevelResponse;
import org.springframework.stereotype.Service;

import java.text.Normalizer;

@Service
public class CVProcessingService {

    private static final Pattern PHONE_NUMBER_PATTERN = Pattern.compile("[+]?[1-9][0-9 .\\-\\(]{8,}[0-9]");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-z0-9.-+]+@[a-z0-9.-+]+\\.[a-z]+");

    public CVCompletionLevelResponse processCV(String cvText) {
        Boolean hasPhoneNumber = containsPhoneNumber(cvText);
        Boolean hasEmail = containsEmail(cvText);
        Boolean hasEducationSection = containsEducationSection(cvText);
        Boolean hasExperienceSection = containsExperienceSection(cvText);
        Boolean hasSkillsInCV = containsSkillsInCV(cvText);
        Integer completenessScore = calculateCompletenessScore(hasPhoneNumber, hasEmail, hasEducationSection, hasExperienceSection, hasSkillsInCV);
        return new CVCompletionLevelResponse(hasPhoneNumber, hasEmail, hasEducationSection, hasExperienceSection, hasSkillsInCV, completenessScore);
    }

    private Boolean containsPhoneNumber(String text) {
        Matcher matcher = PHONE_NUMBER_PATTERN.matcher(text);
        return matcher.find();
    }

    private Boolean containsEmail(String text) {
        Matcher matcher = EMAIL_PATTERN.matcher(text);
        return matcher.find();
    }

    private Boolean containsEducationSection(String text) {
        // Implementarea verificării secțiunii de educație
        return false; // Implementați logica aici
    }

    private Boolean containsExperienceSection(String text) {
        // Implementarea verificării secțiunii de experiență
        return false; // Implementați logica aici
    }

    private Boolean containsSkillsInCV(String text) {
        // Implementarea verificării abilităților în CV
        return false; // Implementați logica aici
    }

    private Integer calculateCompletenessScore(boolean hasPhoneNumber, boolean hasEmail, boolean hasEducationSection, boolean hasExperienceSection, boolean hasSkillsInCV) {
        int totalChecks = 5; // Numărul total de elemente verificate
        int checksPassed = 0; // Numărul de elemente care au fost găsite în CV

        if (hasPhoneNumber) checksPassed++;
        if (hasEmail) checksPassed++;
        if (hasEducationSection) checksPassed++;
        if (hasExperienceSection) checksPassed++;
        if (hasSkillsInCV) checksPassed++;

        return checksPassed / totalChecks * 100; // Gradul de completare în procente
    }

    public String cleanText(String text, String language) {
        String cleanedText = text;

        // Eliminarea caracterelor speciale și a punctuațiilor
        cleanedText = removeSpecialCharacters(cleanedText);

        // Conversia textului în litere mici sau mari
        cleanedText = cleanedText.toLowerCase();

        // Eliminarea spațiilor albe inutile sau repetate
        cleanedText = cleanedText.trim().replaceAll("\\s+", " ");

        // Eliminarea stop words și alte prelucrări specifice fiecărei limbi
        if (language.equals("ro")) {
            // Preprocesare specifică limbii române
            cleanedText = removeStopWordsRomanian(cleanedText);
            // Alte prelucrări specifice limbii române
        } else if (language.equals("en")) {
            // Preprocesare specifică limbii engleze
            cleanedText = removeStopWordsEnglish(cleanedText);
            // Alte prelucrări specifice limbii engleze
        } else {
            // Alte prelucrări pentru alte limbi
        }

        return cleanedText;
    }

    private String removeSpecialCharacters(String text) {
        // Eliminarea caracterelor speciale și a punctuațiilor
        return text.replaceAll("[^a-zA-Z0-9\\s]", "");
    }


    private String removeStopWordsRomanian(String text) {
        // Eliminarea stop words pentru limba română
        String[] stopWords = {"și", "sau", "pe", "un", "o", "cu", "la"};
        for (String stopWord : stopWords) {
            text = text.replaceAll("\\b" + stopWord + "\\b", "");
        }
        return text;
    }

    private String removeStopWordsEnglish(String text) {
        // Eliminarea stop words pentru limba engleză
        String[] stopWords = {"and", "or", "on", "a", "an", "with", "the"};
        for (String stopWord : stopWords) {
            text = text.replaceAll("\\b" + stopWord + "\\b", "");
        }
        return text;
    }
}

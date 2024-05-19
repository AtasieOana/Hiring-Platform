import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import firebase from "../../util/firebase";
import { FIREBASE_PATH } from "../../util/constants";
import { FlagIcon } from "react-flag-kit";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addListener(handler);

    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
}

/**
 * Format date to be shown to the user
 * @param {string} dateString
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const calculateTimeDifference = (postingDate) => {
  const postedAt = new Date(postingDate);
  const now = new Date();
  const timeDifference = now - postedAt;

  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDifference = Math.floor(hoursDifference / 24);
  const weeksDifference = Math.floor(daysDifference / 7);
  const monthsDifference = Math.floor(daysDifference / 30);

  return {
    hours: hoursDifference,
    days: daysDifference,
    weeks: weeksDifference,
    months: monthsDifference,
  };
};

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result.split(",")[1]);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
const finishPDFGeneration = (doc, styling, cvData, addCV) => {
  const maxWidth = 115;

  const checkAndAddNewPage = (requiredSpace) => {
    if (rightColumnY > 290) {
      doc.addPage();
      // Left part of the CV is going to be brown
      doc.setFillColor(188, 143, 143);
      doc.rect(0, 0, 70, 300, "F");
      rightColumnY = 20;
    }
  };

  // Left side - on brown
  // Contact details
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Contact", 10, styling);
  // Add border after contact title
  doc.setDrawColor(255, 255, 255);
  doc.line(10, styling + 5, 100, styling + 5);

  // Contact details: email, phone, address
  doc.setFont("helvetica", "normal");
  styling += 12;
  if (cvData.email) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Email:", 10, styling);
    styling += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(cvData.email, 10, styling);
    styling += 7;
  }
  if (cvData.phone) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Phone:", 10, styling);
    styling += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(cvData.phone, 10, styling);
    styling += 7;
  }
  if (cvData.address) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Address:", 10, styling);
    styling += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(cvData.address, 10, styling);
  }

  // Right side
  // Firstname and lastname
  let name = cvData.firstname + " " + cvData.lastname;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(name, 85, 25);

  // Professional summary, education and experience on the right
  let rightColumnX = 85;
  let rightColumnY = 40;
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.text("Summary", rightColumnX, rightColumnY);
  rightColumnY += 7;

  // Add border
  doc.setDrawColor(139, 69, 19); // Maro
  doc.rect(rightColumnX, rightColumnY - 3, 250, 0.5, "F");
  rightColumnY += 5;

  // Summary
  if (cvData.professionalSummary) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    // Add spaces after each word to ensure proper word wrapping
    const formattedSummary = cvData.professionalSummary.replace(
      /(\S+)\s*/g,
      "$1 ",
    );
    const textLines = doc.splitTextToSize(formattedSummary, maxWidth);
    for (const line of textLines) {
      doc.text(line, rightColumnX, rightColumnY);
      rightColumnY += 5;
    }
  }

  rightColumnY += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.text("Education", rightColumnX, rightColumnY);
  rightColumnY += 7;
  doc.setFontSize(10);

  let requiredSpace = 20;

  // Add border
  doc.setDrawColor(139, 69, 19); // Maro
  doc.rect(rightColumnX, rightColumnY - 3, 250, 0.5, "F");
  rightColumnY += 5;

  // Education
  if (cvData.education.length > 0) {
    cvData.education.forEach((ed) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${ed.certificate}, ${ed.specialization}`,
        rightColumnX,
        rightColumnY,
      );
      rightColumnY += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(ed.institute, rightColumnX, rightColumnY);
      rightColumnY += 6;
      doc.setFont("helvetica", "italic");
      doc.text(
        `${ed.startYear} - ${ed.graduationYear}`,
        rightColumnX,
        rightColumnY,
      );
      rightColumnY += 6;
      doc.setFont("helvetica", "normal");
      const descriptionLines = doc.splitTextToSize(ed.description, maxWidth);
      descriptionLines.forEach((line) => {
        doc.text(line, rightColumnX, rightColumnY);
        rightColumnY += 5;
      });
      requiredSpace += cvData.education.length * 35;
      checkAndAddNewPage(requiredSpace);
    });
  }

  // Experience
  if (cvData.experience.length > 0) {
    rightColumnY += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text("Experience", rightColumnX, rightColumnY);
    rightColumnY += 7;

    // Add border
    doc.setDrawColor(139, 69, 19); // Maro
    doc.rect(rightColumnX, rightColumnY - 3, 250, 0.5, "F");
    rightColumnY += 5;

    cvData.experience.forEach((exp) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(exp.title, rightColumnX, rightColumnY);
      rightColumnY += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(exp.company, rightColumnX, rightColumnY);
      rightColumnY += 6;
      doc.setFont("helvetica", "italic");
      doc.text(
        `${exp.startYear} - ${exp.finishYear ? exp.finishYear : "Present"}`,
        rightColumnX,
        rightColumnY,
      );
      rightColumnY += 6;
      doc.setFont("helvetica", "normal");
      const descriptionLines = doc.splitTextToSize(exp.description, maxWidth);
      descriptionLines.forEach((line) => {
        doc.text(line, rightColumnX, rightColumnY);
        rightColumnY += 5;
      });
      rightColumnY += 10;
      requiredSpace += cvData.experience.length * 35;
      checkAndAddNewPage(requiredSpace);
    });
  }

  //doc.save('CV.pdf');
  // Convert the PDF to a Blob object
  const pdfBlob = doc.output("blob");
  const file = new File([pdfBlob], "CV.pdf", {
    type: "application/pdf",
    lastModified: Date.now(),
  });
  // Send the PDF to the backend
  addCV(file);
};

export const generatePDF = (cvData, addCV) => {
  const doc = new jsPDF();
  let styling = 76;

  // Add image (if available)
  if (cvData.image) {
    fileToBase64(cvData.image).then((base64String) => {
      let imgData = "data:image/jpeg;base64," + base64String;
      // Left part of the CV is going to be brown
      doc.setFillColor(188, 143, 143);
      doc.rect(0, 0, 70, 300, "F");
      doc.addImage(imgData, "JPEG", 13, 15, 45, 45);
      // Add border to the photo
      doc.setDrawColor(139, 69, 19);
      doc.setLineWidth(0.5);
      doc.rect(13, 15, 45, 45);
      finishPDFGeneration(doc, styling, cvData, addCV);
    });
  } else {
    // Left part of the CV is going to be brown
    styling = 39;
    doc.setLineWidth(0.5);
    doc.setFillColor(188, 143, 143);
    doc.rect(0, 0, 70, 300, "F");
    finishPDFGeneration(doc, styling, cvData, addCV);
  }
};

export const handleOpenCV = (cv) => {
  try {
    const storage = getStorage(firebase);
    const cvRef = ref(storage, FIREBASE_PATH + cv.cvNameComplete);
    getDownloadURL(cvRef).then((r) => window.open(r, "_blank"));
  } catch (error) {
    console.error("Error opening CV:", error);
  }
};

export const base64ToImage = (base64String) => {
  let byteString = atob(base64String.split(",")[1]);
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/jpeg" });
};

export const GBFlag = () => <FlagIcon code="GB" size={12} />;
export const ROFlag = () => <FlagIcon code="RO" size={12} />;

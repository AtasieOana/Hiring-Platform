import {useEffect, useState} from "react";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import firebase from "../../util/firebase";
import {FIREBASE_PATH} from "../../util/constants";

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

export const base64ToImage = (base64String) => {
    let byteString = atob(base64String.split(',')[1]);
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: 'image/jpeg'});
}

/**
 * Format date to be shown to the user
 * @param {string} dateString
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export const handleOpenCV = (cv) => {
    try {
        const storage = getStorage(firebase);
        const cvRef = ref(storage, FIREBASE_PATH + cv.cvNameComplete);
        getDownloadURL(cvRef).then(r=>window.open(r, '_blank'));
    } catch (error) {
        console.error('Error opening CV:', error);
    }
};

import {useEffect, useState} from "react";

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
    const blob = new Blob([ab], {type: 'image/jpeg'});
    return blob;
}



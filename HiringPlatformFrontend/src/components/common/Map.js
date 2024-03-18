import React, {useEffect, useState} from "react";
import {GoogleMap, Marker, useLoadScript} from '@react-google-maps/api';
import {useTranslation} from "react-i18next";
import {useMediaQuery} from "./CommonMethods";

const libraries = ['places'];

const MapDisplay = ({address}) => {

    const {t, i18n} = useTranslation();
    const isSmallScreen = useMediaQuery("(max-width: 800px)");
    const isMediumScreen = useMediaQuery("(min-width: 801px) and (max-width: 901px)");

    let mapContainerStyle;
    if (isSmallScreen) {
        mapContainerStyle = {
            width: '80vw',
            height: '40vh',
        };
    } else if (isMediumScreen) {
        mapContainerStyle = {
            width: '25vw',
            height: '30vh',
        };
    } else {
        mapContainerStyle = {
            width: '26vw',
            height: '40vh',
        };
    }
    const [center, setCenter] = useState({lat: 0, lng: 0});   // The central coordinates of the map
    const [error, setError] = useState(false);
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: 'AIzaSyC2iDzq02TITpaWLhbY_X-iVGLek3T2k8o',
        libraries: libraries,
        language: i18n.language // Set language based on i18n language
    });

    // Function to update the center coordinates after we geocode the address
    const getCenter = async () => {
        try {
            if (address && address.length > 5) {
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyC2iDzq02TITpaWLhbY_X-iVGLek3T2k8o`
                );
                const data = await response.json();
                if (data.results[0]?.geometry) {
                    const {lat, lng} = data.results[0].geometry.location;
                    setCenter({lat, lng});
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setError(true)
        }
    };

    useEffect(() => {
        getCenter().then();
    }, [address]);

    if (loadError) {
        return <div>{t('error_loading_maps')}</div>;
    }

    if (!isLoaded) {
        return <div>{t('loading_maps')}</div>;
    }

    // Defining a custom icon for the red marker
    const redMarkerIcon = {
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 40)
    };

    // Custom map options to show only desired controls
    const mapOptions = {
        mapTypeControl: false, // Hide map type control (map/satellite)
        streetViewControl: false, // Hide street view control
        fullscreenControl: false, // Hide fullscreen control
        zoomControl: true // Show zoom control
    };
    console.log(error)


    return (
        <div>
            {error ? (
                <p>{t('address_not_found')}</p>
            ) : (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                    options={mapOptions}
                >
                    <Marker position={center} icon={redMarkerIcon}
                    />
                </GoogleMap>
            )}
        </div>

    );
};

export default MapDisplay;
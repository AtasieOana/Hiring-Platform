import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {AppToaster} from "./AppToaster";
import {Intent} from "@blueprintjs/core";

const ImageUpload = ({onImageUpload, initialImg}) => {
    const {t} = useTranslation();

    const [selectedImage, setSelectedImage] = useState(initialImg);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // Check if the file is an image
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            onImageUpload(file)
        } else {
            AppToaster.show({
                message: t('profile_img_err'),
                intent: Intent.WARNING,
            });
        }
    };

    const handleRemoveImage = () => {
        onImageUpload(null)
        setSelectedImage(null);
    };

    return (
        <div>
            {selectedImage && (selectedImage?.size > 10) ? (
                    <div className="custom-file-container">
                        <button className="custom-file-upload" onClick={handleRemoveImage}>
                            {t('remove_img')}
                        </button>
                        <div>
                            <img className="custom-image"
                                 src={URL.createObjectURL(selectedImage)}
                                 alt="Image"/>
                        </div>
                    </div>
                ) :
                <div className="custom-file-container">
                    <label className="custom-file-upload">
                        {t('choose_img')}
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}}/>
                    </label>
                </div>}
        </div>
    );
};

export default ImageUpload;
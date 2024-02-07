import React, {useState} from 'react';
import {useTranslation} from "react-i18next";

const ImageUpload = () => {
    const {t} = useTranslation();

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    return (
        <div>
            <label className="custom-file-input-label">
                {t('choose_img')}
                <input type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}}/>
            </label>
            {selectedImage && (
                <div>
                    <img src={URL.createObjectURL(selectedImage)} alt="Selected"/>
                    <button onClick={handleRemoveImage}>Remove</button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
import React, {useState} from 'react';
import {Button, ControlGroup, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Profile.css';
import ImageUpload from "../common/ImageUpload";
import {useTranslation} from "react-i18next";
import HeaderPage from "../header/HeaderPageWithoutProfile";

const ProfilePage = () => {
    const {t} = useTranslation();

    const [formData, setFormData] = useState({
        image: null,
        phoneNumber: '',
        website: '',
        street: '',
        zipCode: '',
        city: '',
        region: '',
        country: '',
        description: ''
    });

    const [errors, setErrors] = useState({
        phoneNumber: false,
        street: false,
        zipCode: false,
        city: false,
        region: false,
        country: false,
        description: false
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleDescChange = (content, _delta, _source, _editor) => {
        setFormData({...formData, description: content});
    };

    const handleImageUpload = (image) => {
        setFormData({...formData, image: image});
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {...errors};
        // Phone number validation
        if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = true;
            valid = false;
        } else {
            newErrors.phoneNumber = false;
        }
        // Street validation
        if (formData.street && !/^[\w\d\s.,-]*$/.test(formData.street)) {
            newErrors.street = true;
            valid = false;
        } else if (formData.street.length < 10) {
            newErrors.street = true;
            valid = false;
        } else {
            newErrors.street = false;
        }
        // Zipcode validation
        if (formData.zipCode && !/^\d+$/.test(formData.zipCode)) {
            newErrors.zipCode = true;
            valid = false;
        } else {
            newErrors.zipCode = false;
        }
        // City, region and country validation
        const fieldsToValidate = ['city', 'region', 'country'];
        fieldsToValidate.forEach(field => {
            if (!formData[field] || (formData[field] && !/^[A-Za-z\s]*$/.test(formData[field]))) {
                newErrors[field] = true;
                valid = false;
            } else {
                newErrors[field] = false;
            }
        });
        // Description validation
        if (!formData.description || formData.description.length < 100) {
            newErrors.description = true;
            valid = false;
        } else {
            newErrors.description = false;
        }
        // Website validation
        if (formData.website && !/^https?:\/\/\S+$/.test(formData.website)) {
            newErrors.website = true;
            valid = false;
        } else {
            newErrors.website = false;
        }
        setErrors(newErrors);
        return valid;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Trimite datele către server sau procesează-le aici
            console.log('Formul este valid!');
        } else {
            console.log('Formul conține erori!');
        }
    };

    return (
        <div>
            <HeaderPage/>
            <div className="form-container">
                <div className="left-column">
                    <FormGroup label={t('image')}>
                        <ImageUpload onImageUpload={handleImageUpload}/>
                    </FormGroup>
                    <ControlGroup fill>
                        <FormGroup
                            label={t('phone_number')}
                            style={{flex: 1}}
                            intent={errors.phoneNumber ? Intent.DANGER : Intent.NONE}
                            helperText={errors.phoneNumber ? t('phone_number_err') : ""}
                        >
                            <InputGroup
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup
                            label={t('website')}
                            style={{flex: 1}}
                            intent={errors.website ? Intent.DANGER : Intent.NONE}
                            helperText={errors.website ? t('website_err') : ""}
                        >
                            <InputGroup
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </ControlGroup>
                    <FormGroup
                        label={t('street')}
                        intent={errors.street ? Intent.DANGER : Intent.NONE}
                        helperText={errors.street ? t('street_err') : ""}
                    >
                        <InputGroup
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <ControlGroup fill>
                        <FormGroup
                            label="Postal Code"
                            style={{flex: 1}}
                            intent={errors.zipCode ? Intent.DANGER : Intent.NONE}
                            helperText={errors.zipCode ? "Codul poștal trebuie să conțină doar cifre" : ""}
                        >
                            <InputGroup
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup
                            label="City"
                            style={{flex: 1}}
                            intent={errors.city ? Intent.DANGER : Intent.NONE}
                            helperText={errors.city ? "Orașul nu poate fi gol" : ""}
                        >
                            <InputGroup
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </ControlGroup>
                    <ControlGroup fill>
                        <FormGroup
                            label="Region"
                            style={{flex: 1}}
                            intent={errors.region ? Intent.DANGER : Intent.NONE}
                            helperText={errors.region ? "Regiunea poate conține doar litere și spații" : ""}
                        >
                            <InputGroup
                                type="text"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup
                            label="Country"
                            style={{flex: 1}}
                            intent={errors.country ? Intent.DANGER : Intent.NONE}
                            helperText={errors.country ? "Țara nu poate fi goală" : ""}
                        >
                            <InputGroup
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </ControlGroup>
                </div>
                <div className="right-column">
                    <FormGroup label="Description" intent={errors.description ? Intent.DANGER : Intent.NONE}
                               helperText={errors.description ? "Descrierea trebuie sa aiba minim 100 de caractere" : ""}>
                        <ReactQuill
                            theme="snow"
                            value={formData.description}
                            onChange={handleDescChange}
                        />
                    </FormGroup>
                </div>
            </div>
            <Button className="register-button"
                    small={true}
                    onClick={(e) => handleSubmit(e)}>
                Save profile
            </Button>
        </div>
    );
};

export default ProfilePage;

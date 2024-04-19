import React, {useEffect, useState} from 'react';
import {Button, ControlGroup, Divider, FormGroup, InputGroup, Intent, MenuItem, Position} from "@blueprintjs/core";
import ReactQuill from "react-quill";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import ProfileService from "../../services/profile.service";
import {AppToaster} from "../common/AppToaster";
import {setProfileActionData} from "../../redux/actions/profileActions";
import ImageUpload from "../common/ImageUpload";
import {base64ToImage} from "../common/CommonMethods";
import {BUCHAREST_ENG, BUCHAREST_RO} from "../../util/constants";
import {Select} from "@blueprintjs/select";

const EditProfileCommon = ({
                               formDataProps,
                               isAddOperationProps,
                               imgProp,
                               updateEditionState
                           }) => {

    const {t, i18n} = useTranslation();
    const [formData, setFormData] = useState(formDataProps);
    const employer = useSelector(state => state.auth.employer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [regionsOption, setRegionsOption] = useState([]);
    const [regionsCities, setRegionsCities] = useState([]);
    const [citiesOptions, setCitiesOption] = useState([])
    const regions = useSelector(state => state.address.regions);
    const citiesPerRegions = useSelector(state => state.address.citiesPerRegions);
    const [isComponentMounted, setIsComponentMounted] = useState([]);

    const [errors, setErrors] = useState({
        phoneNumber: false,
        street: false,
        zipCode: false,
        city: false,
        region: false,
        description: false
    });

    useEffect(() => {
        let firstRegion = BUCHAREST_RO
        if(i18n.language === "en"){
            firstRegion = BUCHAREST_ENG
        }
        if(formData.region === undefined || formData.region === ""){
            setFormData({...formData, city: citiesPerRegions[BUCHAREST_RO][0], region: firstRegion});
            setCitiesOption(citiesPerRegions[firstRegion])
        }
        else{
            setCitiesOption(citiesPerRegions[formData.region])
        }
        setRegionsOption(regions);
        setRegionsCities(citiesPerRegions);
        setIsComponentMounted(true)
    }, []);

    useEffect(() => {
        const switchLanguage = () => {
            const { language } = i18n;
            const isEnglish = language === "en";

            const regionToCheck = isEnglish ? BUCHAREST_RO : BUCHAREST_ENG;
            const regionToSet = isEnglish ? BUCHAREST_ENG : BUCHAREST_RO;

            if (formData.region === regionToCheck || formData.region === undefined || formData.region === "") {
                setFormData({...formData, city: regionToSet, region: regionToSet});
                setCitiesOption(citiesPerRegions[regionToSet]);
            }
            else{
                setCitiesOption(citiesPerRegions[formData.region]);
            }

            const updatedRegionsOption = regions.map(region => region === regionToCheck ? regionToSet : region);
            setRegionsOption(updatedRegionsOption);
            const updatedCitiesPerRegions = { ...citiesPerRegions };
            delete updatedCitiesPerRegions[regionToCheck];
            updatedCitiesPerRegions[regionToSet] = [regionToSet];
            setRegionsCities(updatedCitiesPerRegions);
        };
        if(isComponentMounted) {
            switchLanguage();
        }
    }, [i18n.language]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleCityChange = (city) => {
        setFormData({...formData, city: city});
    };

    const handleRegionChange = (region) => {
        let currentCitiesForRegion = regionsCities[region]
        setCitiesOption(currentCitiesForRegion);
        setFormData({...formData, region: region, city: currentCitiesForRegion[0]});
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
        if (!formData.street || formData.street.length < 10 || !/^[A-Za-zăâîșțĂÂÎȘȚ\d\s.,\-]*$/u.test(formData.street)) {
            newErrors.street = true;
            valid = false;
        } else {
            newErrors.street = false;
        }
        // Zipcode validation
        if (!formData.zipCode || !/^\d+$/.test(formData.zipCode)) {
            newErrors.zipCode = true;
            valid = false;
        } else {
            newErrors.zipCode = false;
        }
        // City and region validation
        const fieldsToValidate = ['city', 'region'];
        fieldsToValidate.forEach(field => {
            if (!formData[field] || (formData[field] && !/^[A-Za-zăâîșțĂÂÎȘȚ\s\-]*$/u.test(formData[field]))) {
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

    const addEmployerProfile = (request) => {
        ProfileService.addEmployerProfile(request)
            .then(() => {
                AppToaster.show({
                    message: t('create_profile_success'),
                    intent: Intent.SUCCESS,
                });
                dispatch(setProfileActionData(true));
                navigate('/editAccount');
            })
            .catch(error => {
                console.log('Error: ', error.message);
                AppToaster.show({
                    message: t('create_profile_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    const editEmployerProfile = (request) => {
        if (typeof request.imagine === "string") {
            request.imagine = base64ToImage(`data:image/jpeg;base64,${request.imagine}`)
        }
        ProfileService.updateEmployerProfile(request)
            .then(() => {
                AppToaster.show({
                    message: t('update_profile_success'),
                    intent: Intent.SUCCESS,
                });
                updateEditionState();
            })
            .catch(error => {
                console.error('Error: ', error.message);
                AppToaster.show({
                    message: t('update_profile_err'),
                    intent: Intent.DANGER,
                });
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            let city = formData.city
            if(city === BUCHAREST_ENG){
                city = BUCHAREST_RO
            }
            let region = formData.region
            if(region === BUCHAREST_ENG){
                region = BUCHAREST_RO
            }
            let request = {
                imagine: formData.image,
                description: formData.description,
                phone: formData.phoneNumber,
                site: formData.website,
                street: formData.street,
                zipCode: formData.zipCode,
                cityName: city,
                regionName: region,
                employerId: employer.employerId,
            }
            if (isAddOperationProps) {
                addEmployerProfile(request)
            } else {
                editEmployerProfile(request)
            }
        }
    };

    const modules = {
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic', 'underline'],
            [{'color': []}],
            [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image'],
            ['clean']
        ]
    };

    const filterOption = (query, item, _index, _exactMatch) => {
        return item.toLowerCase().indexOf(query.toLowerCase()) > -1;
    };

    console.log(regionsOption, citiesOptions)
    const renderLeftModule = () => {
        return <div className="left-column">
            <div className="profile-column-title">
                {t('general_details_dialog')}
            </div>
            <div className="profile-column-content-fields">
                <FormGroup
                    label={t('website')}
                    style={{flex: 1}}
                    intent={errors.website ? Intent.DANGER : Intent.NONE}
                    helperText={errors.website ? t('website_err') : ""}
                    className={"edit-profile-field"}
                >
                    <InputGroup
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                    />
                </FormGroup>
                <ControlGroup fill>

                <FormGroup
                    label={t('phone_number')}
                    style={{flex: 1}}
                    intent={errors.phoneNumber ? Intent.DANGER : Intent.NONE}
                    helperText={errors.phoneNumber ? t('phone_number_err') : ""}
                    className={"edit-profile-field"}
                >
                    <InputGroup
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </FormGroup>
                    <FormGroup
                        label={t('zip')}
                        style={{flex: 1}}
                        intent={errors.zipCode ? Intent.DANGER : Intent.NONE}
                        helperText={errors.zipCode ? t('zip_req') : ""}
                        labelInfo={"*"}
                        className={"edit-profile-field"}
                    >
                        <InputGroup
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                        />
                    </FormGroup>
                </ControlGroup>
                <FormGroup
                    label={t('street')}
                    intent={errors.street ? Intent.DANGER : Intent.NONE}
                    helperText={errors.street ? t('street_err') : ""}
                    labelInfo={"*"}
                    className={"edit-profile-field"}
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
                        label={t('region')}
                        style={{flex: 1}}
                        intent={errors.region ? Intent.DANGER : Intent.NONE}
                        helperText={errors.region ? t('region_req') : ""}
                        labelInfo={"*"}
                        className={"edit-profile-field"}
                    >
                        <Select
                            usePortal={false}
                            items={regionsOption}
                            itemRenderer={(item, { handleClick, modifiers }) => (
                                <MenuItem
                                    key={item}
                                    text={item}
                                    onClick={handleClick}
                                    active={modifiers.active}
                                />
                            )}
                            onItemSelect={(item) => handleRegionChange(item)}
                            fill={true}
                            matchTargetWidth={true}
                            minimal={true}
                            popoverProps={{ minimal: true, position: Position.TOP}}
                            activeItem={formData.region}
                            scrollToActiveItem={true}
                            filterable={true}
                            itemPredicate={filterOption}
                        >
                            <Button text={formData.region}
                                    rightIcon="double-caret-vertical"
                                    fill={true}/>
                        </Select>
                    </FormGroup>
                    <FormGroup
                        label={t('city')}
                        style={{flex: 1}}
                        intent={errors.city ? Intent.DANGER : Intent.NONE}
                        helperText={errors.city ? t('city_req') : ""}
                        labelInfo={"*"}
                        className={"edit-profile-field"}
                    >
                        <Select
                            usePortal={false}
                            items={citiesOptions}
                            itemRenderer={(item, { handleClick, modifiers }) => (
                                <MenuItem
                                    key={item}
                                    text={item}
                                    onClick={handleClick}
                                    active={modifiers.active}
                                />
                            )}
                            onItemSelect={(item) => handleCityChange(item)}
                            fill={true}
                            matchTargetWidth={true}
                            resetOnClose={true}
                            minimal={true}
                            popoverProps={{ minimal: true, position: Position.TOP}}
                            activeItem={formData.city}
                            scrollToActiveItem={true}
                            filterable={true}
                            itemPredicate={filterOption}
                        >
                            <Button text={formData.city}
                                    rightIcon="double-caret-vertical"
                                    fill={true}/>
                        </Select>
                    </FormGroup>
                </ControlGroup>

                <Divider/>
                <ImageUpload onImageUpload={handleImageUpload} initialImg={imgProp}/>

            </div>
        </div>
    }

    const renderRightModule = () => {
        return <div className="right-column">
            <div className="profile-column-title-desc">
                <span>
                    {t('the_description')}
                </span>
                {errors.description && <span className="profile-column-desc-error">
                    {t('job_desc_error')}
                </span>}
            </div>
            <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleDescChange}
                modules={modules}
            />
        </div>
    }

    return (
        <div className="create-profile">
            <div className="create-profile-background">
                <div className="create-profile-button-container">
                    <Button className="create-profile-button"
                            small={true}
                            onClick={(e) => handleSubmit(e)}>
                        {t('save_profile')}
                    </Button>
                </div>
                <div className="form-container-profile">
                    {renderLeftModule()}
                    {renderRightModule()}
                </div>
            </div>
        </div>
    );


};

export default EditProfileCommon;

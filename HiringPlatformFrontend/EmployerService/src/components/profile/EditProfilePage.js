import React, {useState} from 'react';
import 'react-quill/dist/quill.snow.css';
import './EditProfile.css';
import HeaderWithoutProfile from "../header/HeaderPageWithoutProfile";
import EditProfileCommon from "./EditProfileCommon";

const EditProfilePage = () => {
    const formData = useState({
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

    return (
        <div>
            <HeaderWithoutProfile/>
            <EditProfileCommon formDataProps={formData} isAddOperationProps={true} imgProp=""
                               updateEditionState={() => {
                               }}/>
        </div>
    );
};

export default EditProfilePage;

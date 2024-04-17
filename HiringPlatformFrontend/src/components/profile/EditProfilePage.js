import React, {useState} from 'react';
import 'react-quill/dist/quill.snow.css';
import './EditProfile.css';
import EditProfileCommon from "./EditProfileCommon";
import HeaderWithoutProfile from "../header/HeaderPageWithoutProfile";

const EditProfilePage = () => {
    const formData = useState({
        image: null,
        phoneNumber: '',
        website: '',
        street: '',
        zipCode: '',
        city: '',
        region: '',
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

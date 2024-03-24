import React, {useEffect, useState} from "react";
import {Dialog, Button, Classes, Intent, FormGroup} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";
import {AppToaster, AppToasterTop} from "./AppToaster";
import ComplaintService from "../../services/complaint.service";
import ReactQuillDinamic from "./reactQuill/ReactQuillDinamic";
import "./ComplaintDialog.css"

const ComplaintDialog = ({ isOpen, complainantUser, complainedUser, onClose }) => {

    const { t} = useTranslation();

    const [motivation, setMotivation] = useState("")
    const [motivationError, setMotivationError] = useState(false)

    useEffect(() => {
        setMotivationError(false)
        setMotivation("")
    }, [isOpen]);

    const validateComplaint = () =>{
        if(motivation.length < 100){
            setMotivationError(true)
        }
        else{
            setMotivationError(false)
            makeComplaint()
        }
    }

    const makeComplaint = () =>{
        let request = {
            motivation: motivation,
            complainantUserEmail: complainantUser,
            complainedUserEmail: complainedUser,
        }
        ComplaintService.addComplaint(request).then(() => {
            AppToasterTop.show({
                message: t('complain_success'),
                intent: Intent.SUCCESS,
            });
            onClose();
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToasterTop.show({
                message: t('complain_err'),
                intent: Intent.DANGER,
            });
        });
    }

    const handleMotivationChange = (content, _delta, _source, _editor) => {
        setMotivation(content);
    };

    return (
        <Dialog isOpen={isOpen}
                onClose={onClose}
                title={t('complaint_details')}
                canOutsideClickClose={false}
                className="complaint-dialog"
        >
            <div className={Classes.DIALOG_BODY}>
                <div className="complaint-description">{t('complaint_desc')} <span className="complaint-description-bold">{complainedUser}</span> {t('complaint_desc1')}</div>
                <FormGroup
                    intent={motivationError ? Intent.DANGER : Intent.NONE}
                    helperText={motivationError ? t('complain_in') : ""}
                    className="complaint-motivation"
                >
                    <ReactQuillDinamic
                        value={motivation}
                        handleDescChange={handleMotivationChange}>
                    </ReactQuillDinamic>
                </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button intent="danger" onClick={validateComplaint}>{t('submit')}</Button>
                    <Button onClick={onClose}>{t('cancel')}</Button>
                </div>
            </div>
        </Dialog>

    );
};

export default ComplaintDialog;

import React from 'react';
import {Button, Dialog, DialogBody, DialogFooter} from "@blueprintjs/core";
import {useTranslation} from "react-i18next";

const AddJobDialog = ({idDialogOpen, handleDialogAction}) => {

    const {t} = useTranslation();

    const addJob = () => {
        console.log("TODO")
    }

    return (
        <Dialog
            isOpen={idDialogOpen}
            onClose={handleDialogAction}
            title="Add new job"
            canOutsideClickClose={false}
            usePortal={false}
        >
            <DialogBody useOverflowScrollContainer={false}>
                <p>Continut</p>
                <DialogFooter minimal={true} actions={
                    <div>
                        <Button intent="danger" onClick={addJob}>{t('delete')}</Button>
                        <Button onClick={handleDialogAction}>{t('cancel')}</Button>
                    </div>
                }/>
            </DialogBody>
        </Dialog>
    );
};

export default AddJobDialog;

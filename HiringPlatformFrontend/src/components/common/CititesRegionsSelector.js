import React, { useState, useEffect } from 'react';
import { Select } from '@blueprintjs/select';
import {Button, Intent, MenuItem} from '@blueprintjs/core';
import {AppToaster} from "./AppToaster";
import CommonService from "../../services/common.service";

const OraseComponent = () => {

    const BUCURESTI = "București"
    const [regiuni, setRegiuni] = useState([]);
    const [orase, setOrase] = useState([]);
    const [regiuneSelectata, setRegiuneSelectata] = useState(BUCURESTI);
    const [orasSelectat, setOrasSelectat] = useState('');
    const [currentCities, setCurrentCities] = useState([])

    useEffect(() => {
        getAllCitiesByRegions()
    }, []);

    /**
     * Sa pun in redux la inceput in app de exemplu, si dupa sa le iau de acolo
     */
    const getAllCitiesByRegions = () =>{
        CommonService.getAllCitiesByRegions().then((response) => {
            setRegiuni(Object.keys(response.data));
            setOrase(response.data);
            setCurrentCities(response.data[BUCURESTI])
            setOrasSelectat(response.data[BUCURESTI][0])
            console.log(response.data, Object.keys(response.data))
        }).catch(error => {
            console.error('Error: ', error.message);
            AppToaster.show({
                message: "TODO",
                intent: Intent.DANGER,
            });
        });
    }

    const handleRegiuneChange = (regiune) => {
        setRegiuneSelectata(regiune);
        setOrasSelectat(orase[regiune][0]); // resetăm orașul selectat atunci când se schimbă regiunea
        setCurrentCities(orase[regiune]); // actualizăm lista de orașe pentru regiunea selectată
    };

    const handleOrasChange = (oras) => {
        setOrasSelectat(oras);
    };

    return (
        <div>
            <Select
                items={regiuni}
                filterable={false}
                itemRenderer={(item, { handleClick }) => (
                    <MenuItem
                        key={item}
                        text={item}
                        onClick={handleClick}
                    />
                )}
                onItemSelect={handleRegiuneChange}
                popoverProps={{ minimal: true }}
                resetOnClose={true}
                value={regiuneSelectata}
            >
                <Button>{regiuneSelectata}</Button>
            </Select>

            <Select
                items={currentCities}
                filterable={false}
                itemRenderer={(item, { handleClick }) => (
                    <MenuItem
                        key={item}
                        text={item}
                        onClick={handleClick}
                    />
                )}
                onItemSelect={handleOrasChange}
                popoverProps={{ minimal: true }}
                resetOnClose={true}
                value={orasSelectat}
            >
                <Button>{orasSelectat}</Button>
            </Select>
        </div>
    );
};

export default OraseComponent;

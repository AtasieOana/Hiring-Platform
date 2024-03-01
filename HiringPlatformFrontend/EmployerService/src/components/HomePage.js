import React, {useState} from 'react';
import HeaderPage from "./header/HeaderPage";
import AddJobDialog from "./job/AddJobDialog";
import {Button} from "@blueprintjs/core";

const HomePage = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogAction = () => {
        setIsDialogOpen(!isDialogOpen);
    }
    return (
        <div>
            <HeaderPage/>
            TODO: HOME PAGE FOR EMPLOYER
            <Button className="add-job-button" onClick={handleDialogAction}>
                Adauga job
            </Button>
            <AddJobDialog isDialogOpen={isDialogOpen} handleDialogAction={handleDialogAction}/>
        </div>
    );
};

export default HomePage;

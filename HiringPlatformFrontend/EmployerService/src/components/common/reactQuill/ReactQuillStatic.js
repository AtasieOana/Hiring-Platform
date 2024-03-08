import React from 'react';
import ReactQuill from "react-quill";

const ReactQuillStatic = ({ value }) => {

    return <ReactQuill
        value={value}
        readOnly={true}
        theme={"bubble"}
    />
};

export default ReactQuillStatic;

import React from 'react';
import ReactQuill from "react-quill";

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
const ReactQuillDynamic = ({ value, handleDescChange }) => {

    return <ReactQuill
            theme="snow"
            value={value}
            onChange={handleDescChange}
            modules={modules}
           />
};

export default ReactQuillDynamic;

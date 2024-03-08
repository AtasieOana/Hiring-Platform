import React from 'react';
import { MultiSelect } from '@blueprintjs/select';
import { MenuItem } from '@blueprintjs/core';

const MultiSelectType = ({ options, possibleOptions, selectedOptions, onChange }) => {

    const handleItemSelect = (selectedItem) => {
        let index = options.findIndex(i => i === selectedItem)
        if(index > -1){
            onChange(possibleOptions[index])
        }
    };

    return (
        <MultiSelect
            items={options}
            selectedItems={selectedOptions}
            noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
            onItemSelect={handleItemSelect}
            tagRenderer={item => item}
            popoverProps={{ minimal: true }}
            itemRenderer={(item, { handleClick }) => (
                <MenuItem
                    key={item}
                    text={item}
                    onClick={handleClick}
                    icon={selectedOptions.includes(item) ? 'tick' : 'blank'}
                />
            )}
            tagInputProps={{
                onRemove: handleItemSelect,
                tagProps: {minimal: true},
            }}
        />
    );
};

export default MultiSelectType;

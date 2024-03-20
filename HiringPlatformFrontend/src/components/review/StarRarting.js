import React from 'react';
import { Icon } from '@blueprintjs/core';

const StarRating = ({ value, onStarClick, isReadOnly }) => {
    const stars = [];

    if(isReadOnly){
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= value;
            stars.push(
                <Icon
                    key={i}
                    icon={isFilled ? "star" : "star-empty"}
                    style={{ marginRight: '2px' }}
                    className={isFilled ? "review-star-icon" : ""}
                />
            );
        }
    }
    else{
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= value;
            stars.push(
                <Icon
                    key={i}
                    icon={isFilled ? "star" : "star-empty"}
                    onClick={() => onStarClick(i)}
                    style={{ cursor: 'pointer', marginRight: '2px' }}
                    className={isFilled ? "review-star-icon" : ""}
                />
            );
        }
    }

    return (
        <div>
            {stars}
        </div>
    );
};

export default StarRating;

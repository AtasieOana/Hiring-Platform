const initialState = {
    regions: [],
    citiesPerRegions:[],
};

const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ADDRESS_DATA':
            return {
                ...state,
                regions: action.payload.regions,
                citiesPerRegions: action.payload.citiesPerRegions,
            };
        default:
            return state;
    }
};

export default addressReducer;

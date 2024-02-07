import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {persistor, store} from "./redux/reducers/persistReducer";
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from "react-redux";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </PersistGate>
    </Provider>,
);

reportWebVitals();

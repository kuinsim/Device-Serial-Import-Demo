import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import 'spectre.css';
import FormContainer from './containers/FormContainer';

const App = () => {
    return (
        <div className="main-container">
            <h1>Device Serial Import Demo</h1>
            <FormContainer />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('device-serial-import-demo-app'));

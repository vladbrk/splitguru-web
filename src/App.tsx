import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Receipt from './components/Receipt'
import Members from './components/Members'
import SettlementComp from './components/SettlementComp'
import Entry from './components/Entry'
import Login from './components/Login'
import Menu from './components/Menu'
import 'bootstrap/dist/css/bootstrap.min.css';
import { StompSessionProvider } from "react-stomp-hooks";
import { baseUrl } from './settings/index'
import './i18n/config';

function App() {
    return (
        <div className="App">
            <StompSessionProvider url={ baseUrl + "/websocket" }>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <Entry/> }/>
                    <Route path="/login" element={ <Login/> }/>
                    <Route path="/bill" element={<Menu/>}>
                        <Route path="/bill/receipt" element={ <Receipt/> }/>
                        <Route path="/bill/members" element={ <Members/> }/>
                        <Route path="/bill/settlement" element={ <SettlementComp/> }/>
                    </Route>
                </Routes>
            </BrowserRouter>
            </StompSessionProvider>

        </div>
  );
}

export default App;

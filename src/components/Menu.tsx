import React from 'react'
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap'
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import logo from '../img/split_guru_pt_small_logo.png';

import Person from '../store/reducers/Person'
import Room from '../store/reducers/Room'
import axios from 'axios'
import { baseUrl } from '../settings/index'
import { useTranslation } from 'react-i18next'

const Menu = () : JSX.Element => {

    const user: Person = useSelector((state: any) => state.receipt.user)
    const room: Room = useSelector((state: any) => state.receipt.room)
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const generatePin = async () => {
        const { data } = await axios.get(baseUrl + '/api/room/' + room.id + '/share',
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        alert("Pin : " + data)
    }

    const changeLang = (lang: string) => {
        i18n.changeLanguage(lang)
    }

    return (<>
        <Navbar bg='light' expand='lg'>
            <Container>
                <Navbar.Brand onClick={() => { navigate("/bill/receipt") }}>
                    <img  style={{float: 'left'}}
                      src={logo}
                      width="40"
                      height="40"
                      className="d-inline-block align-top"
                      alt="React Bootstrap logo"
                    />
                    <div style={{float: 'left'}}>
                        <div style={{color: '#3A424C', fontSize: '20px'}}>SPLIT GURU</div>
                        <div style={{color: '#EC6164', fontSize: '10px', marginTop: '-5px', letterSpacing: '3px'}}>split your bill</div>
                    </div>


                </Navbar.Brand>
                {/*<Navbar.Brand href="/bill/receipt">Split Guru</Navbar.Brand>*/}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => { navigate("/bill/receipt") }}>{t("menu.bill")}</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/bill/settlement") }}>{t("menu.settlement")}</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/bill/members") }}>{t("menu.members")}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Badge bg="info">
                    <div style={{fontSize: '9px', textAlign: 'left', color: '#3A424C'}}>user</div>
                    <div>{ user.name }</div>
                </Badge>
                <span>&nbsp;</span>
                <Badge bg="info">
                    <div style={{fontSize: '9px', textAlign: 'left', color: '#3A424C'}}>room</div>
                    <div>{ room.room }</div>
                    <Button variant="outline-primary"
                        size="sm"
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => generatePin()}>Share</Button>
                </Badge>

                    <Button variant="outline-primary" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changeLang('ru')}>Рус</Button>
                    <Button variant="outline-primary" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changeLang('en')}>En</Button>
            </Container>
        </Navbar>
        <Outlet/>
    </>)
}

export default Menu
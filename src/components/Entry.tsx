import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Stack, Form, Button } from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useActions } from '../hooks/useActions'
import logo from '../img/split_guru_pt_small_logo.png';
import { baseUrl } from '../settings/index'
import Room from '../store/reducers/Room'
import { useTranslation } from 'react-i18next'

const Entry = () : JSX.Element => {

    const [pin, setPin] = useState('')
    const navigate = useNavigate()

    const { setRoom } = useActions()
    const { t, i18n } = useTranslation()

    const createRoom = async () => {
        try {
                let r = new Room()
                r.id = ''
                r.room = pin
                let { data } = await axios.post(baseUrl + "/api/room/create",
                    JSON.stringify(r),
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                setRoom(data)
                navigate("/login")
        } catch(e) {
            console.error(e)
        }
    }

    const enterRoom = async () => {
        try {
            const { data } = await axios.get(baseUrl + "/api/room/by_pin/" + pin,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            setRoom(data)
            navigate("/login")
        } catch(e) {
            alert("Room not found");  // TODO make it better
            console.error(e)
        }
    }

    const changeLang = (lang: string) => {
        i18n.changeLanguage(lang)
    }

    return (
        <>
            <Container >
                <Row className="justify-content-md-center">
                    <Col xs lg="2"></Col>
                    <Col md="auto">
                        <div>

                            <img  style={{float: 'left'}}
                                              src={logo}
                                              width="100"
                                              height="100"
                                              className="d-inline-block align-top"
                                              alt="React Bootstrap logo"
                                            />
                            <div style={{float: 'left'}}>
                                <div style={{color: '#3A424C', fontSize: '50px'}}>SPLIT GURU</div>
                                <div style={{color: '#EC6164', fontSize: '25px', marginTop: '-15px', letterSpacing: '8px'}}>split your bill</div>
                            </div>
                        </div>
                    </Col>
                    <Col xs lg="2">
                        <Button variant="outline-primary" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changeLang('ru')}>Рус</Button>
                        <Button variant="outline-primary" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changeLang('en')}>En</Button>
                    </Col>
                </Row>
            </Container>

            <Container style={{marginTop: '50px'}}>
                <Stack gap={3} className="col-md-2 mx-auto">

                        <h3 style={{color: '#3A424C', marginBottom: '-5px'}}>{t("entry.h.choose_room")}</h3>
                        <Form.Control type="text"
                            placeholder={t("entry.p.enter_room")}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}/>
                        <Button variant="success"
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => createRoom()}>{t('entry.new_room')}</Button>
                        <Button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => enterRoom()}>{t('entry.enter_by_pin')}</Button>
                </Stack>
            </Container>

            <ExistedRooms/>


        </>
    )
}

const ExistedRooms = () : JSX.Element => {

    const [rooms, setRooms] = useState(new Array<Room>())
    const { setRoom } = useActions()
    const navigate = useNavigate()

    const { t } = useTranslation()

    useEffect(() => {
        findRoomByGlobalSession()
    }, [])


    const chooseRoom = (room?: Room) => {
        if (room != undefined) {
            setRoom(room)
            navigate("/login")
        }
    }

    const findRoomByGlobalSession = async () => {
        try {
            const { data } = await axios.get(baseUrl + "/api/room/find_by_global_session",
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

            setRooms(data)
        } catch(e) {
            console.error(e)
        }
    }


    const renderHeader = () : JSX.Element => {
        return (
            <div>
                <h4 style={{color: '#3A424C', marginBottom: '-5px'}}>{t("entry.h.last_rooms")}</h4>
                <div style={{fontSize: '14px'}}>{t("entry.h.choose_existed_room")}</div>
            </div>
        )
    }

    return (<>

        <Container style={{marginTop: '50px'}}>
            <Stack gap={3} className="col-md-2 mx-auto">
                { rooms.length > 0 ? renderHeader() : null}
                { rooms.map((room: Room, index: any) =>
                    <Button  key={ index }
                        type="button"
                        size="sm"
                        variant="outline-primary"
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => chooseRoom(room)}>{ room.room }</Button>
                )}
            </Stack>
        </Container>
    </>)
}


export default Entry;
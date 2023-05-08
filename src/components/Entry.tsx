import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Stack, Form, Button } from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useActions } from '../hooks/useActions'
import logo from '../img/split_guru_pt_small_logo.png';
import { baseUrl } from '../settings/index'
import Room from '../store/reducers/Room'

const Entry = () : JSX.Element => {

    const [pin, setPin] = useState('')
    const navigate = useNavigate()

    const { setRoom } = useActions()

    const createRoom = async () => {
        try {
            const { data } = await axios.get(baseUrl + "/api/room/check/" + pin,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            if (data.success) {
                alert("Room already exist! Enter other name");
            } else {
                await axios.get(baseUrl + "/api/room/create/" + pin,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                setRoom(pin)
                navigate("/login")
            }
        } catch(e) {
            console.error(e)
        }
    }

    const enterRoom = async () => {
        try {
            const { data } = await axios.get(baseUrl + "/api/room/check/" + pin,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            if (data.success) {
                setRoom(pin)
                navigate("/login")
            } else {
                alert("Room not found");
            }
        } catch(e) {
            console.error(e)
        }
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
                    <Col xs lg="2"></Col>
                </Row>
            </Container>

            <Container style={{marginTop: '50px'}}>
                <Stack gap={3} className="col-md-2 mx-auto">

                        <h3 style={{color: '#3A424C', marginBottom: '-5px'}}>Choose room</h3>
                        <Form.Control type="text"
                            placeholder="New room name or PIN"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}/>
                        <Button variant="success"
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => createRoom()}>New Room</Button>
                        <Button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => enterRoom()}>Enter by PIN</Button>
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

    useEffect(() => {
        findRoomByGlobalSession()
    }, [])


    const chooseRoom = (roomName?: string) => {
        if (roomName != undefined) {
            setRoom(roomName)
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
                <h4 style={{color: '#3A424C', marginBottom: '-5px'}}>Found your room</h4>
                <div style={{fontSize: '14px'}}>Choose one if you want continue</div>
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
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => chooseRoom(room.room)}>{ room.room }</Button>
                )}
            </Stack>
        </Container>
    </>)
}


export default Entry;
import React, { useState } from 'react'
import { Container, Row, Col, Stack, Form, Button } from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useActions } from '../hooks/useActions'
import logo from '../img/split_guru_pt_small_logo.png';
import { baseUrl } from '../settings/index'


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
                            placeholder="Enter room pin"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}/>
                        <Button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => enterRoom()}>Enter</Button>
                        <Button type="button"
                            variant="success"
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => createRoom()}>New Room</Button>
                </Stack>
            </Container>
        </>
    )
}

export default Entry;
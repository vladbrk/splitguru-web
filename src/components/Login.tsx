import React, { useState } from 'react'
import { Container, Button, Form, Stack, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useActions } from '../hooks/useActions'
import { useSelector } from 'react-redux'
import axios from 'axios'
import logo from '../img/split_guru_pt_small_logo.png';
import { baseUrl } from '../settings/index'

import Person from '../store/reducers/Person'

const Login = () : JSX.Element => {

    const navigate = useNavigate()

    const user: Person = useSelector((state: any) => state.receipt.user)
    const room: string = useSelector((state: any) => state.receipt.room)

    const [name, setName] = useState("")

    const { addProduct, setUserName, addMember, updateUser } = useActions()

    const saveName = async () => {
        user.name = name
        try {
            let { data } = await axios.post(baseUrl + "/api/room/" + room + "/member/add",
                JSON.stringify(user),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

            updateUser(data)
            //addMember(data)

            navigate("/bill/receipt")
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
            <h4 style={{color: '#3A424C', marginBottom: '-5px'}}>Introduce yourself</h4>
            <Form.Control type="text"
                placeholder="Enter First/Last name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setName(e.target.value)}/>
            <Button variant="success"
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => saveName()}>Enter</Button>
            </Stack>
        </Container>
        </>
    )
}

export default Login
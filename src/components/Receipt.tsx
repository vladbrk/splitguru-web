import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { actionCreators } from '../store/index'
import Product from '../store/reducers/Product'
import Person from '../store/reducers/Person'
import Settlement from '../store/reducers/Settlement'
import Debt from '../store/reducers/Debt'
import { Container, Row, Col, Table, Button, Form, Badge, Navbar, Nav, Accordion, Alert, Modal} from 'react-bootstrap'
import {
  StompSessionProvider,
  useSubscription,
  useStompClient
} from "react-stomp-hooks";
import axios from 'axios'
import { baseUrl } from '../settings/index'

const Receipt = () : JSX.Element => {

    const [showAlert, setShowAlert] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [newProductName, setNewProductName] = useState('')
    const [newProductPrice, setNewProductPrice] = useState('')

    const stompClient = useStompClient();

    const dispatch = useDispatch()
    const { addProduct, updateProducts, setUserName, addMember, updateUser, updateMembers, setSettlement } = bindActionCreators(actionCreators, dispatch)

    const products: Array<Product> = useSelector((state: any) => state.receipt.products)
    const members: Array<Person> = useSelector((state: any) => state.receipt.members)
    const user: Person = useSelector((state: any) => state.receipt.user)
    const room: string = useSelector((state: any) => state.receipt.room)

    useSubscription("/topic/" + room + "/members", (message) => {
        updateMembers(JSON.parse(message.body))
    });

    useSubscription("/topic/" + room + "/products", (message) => {
        updateProducts(JSON.parse(message.body))
    });

    useSubscription("/topic/" + room + "/receipt/calculate", (message) => {
        setSettlement(JSON.parse(message.body))
    });

    useEffect(() => {
        initMembers()
        initProducts()
        initSettlement()
    }, [])

    const initMembers = async () => {
        try {
            const { data } = await axios.get(baseUrl + '/api/room/' + room + '/members',
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            updateMembers(data)
        } catch(e) {
            console.error(e)
        }
    }

    const initProducts = async () => {
        try {
            const { data } = await axios.get(baseUrl + '/api/room/' + room + '/products',
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            updateProducts(data)
        } catch(e) {
            console.error(e)
        }
    }

    const initSettlement = async () => {
            try {
                const { data } = await axios.get(baseUrl + '/api/room/' + room + '/settlement/calculate',
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                setSettlement(data)
            } catch(e) {
                console.error(e)
            }
        }


    const toString = (persons: Array<Person> | undefined) : string => {

        if (persons == undefined || persons.length == 0) {
            return '-'
        }
        if (persons.length == 1) {
            return persons[0].name + ''
        }
        if (persons.length == 2) {
            return persons[0].name + ', ' + persons[1].name + ''
        }
        return persons[0].name + ', ' + persons[1].name + ' +' + (persons.length - 2)

    }

    const newProduct = () => {
        let product: Product = new Product('', newProductName, Number(newProductPrice), [user], [user])


        if(stompClient != undefined && stompClient.connected) {
             stompClient.publish({
               destination: '/app/' + room +'/addproduct',
               body: JSON.stringify(product)
             });
          }
        setNewProductName('')
        setNewProductPrice('')
    }


    const containPerson = (persons: Array<Person>, person: Person) : boolean => {
        let newArr = persons.filter((p, index, arr) => p.id === person.id)
        return newArr.length > 0
    }


    const action = (product: Product, person: Person, payer: boolean) => {

        let exists = true
        if (payer) {
            exists = containPerson(check(product.payers), person)
        } else {
            exists = containPerson(check(product.consumers), person)
        }
        return (<>
            { exists ?
                <Button variant="danger"
                    size="sm"
                    onClick={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => removePerson(e, product, person, payer)}>-</Button>
                : <Button variant="success"
                    size="sm"
                    onClick={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => addPerson(e, product, person, payer)}>+</Button>
            }
        </>)
    }

    const addPerson = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, product: Product, person: Person, payer: boolean) => {
        e.stopPropagation();
        if (payer) {
            check(product.payers).push(person)
        } else {
            check(product.consumers).push(person)
        }


        if(stompClient != undefined && stompClient.connected) {
             stompClient.publish({
               destination: '/app/' + room +'/product/update',
               body: JSON.stringify(product)
             });
          }
    }

    const removePerson = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, product: Product, person: Person, payer: boolean) => {
        e.stopPropagation();
        if (payer) {
            let newPayers = check(product.payers).filter((el, index, array) => el.id !== person.id)
            product.payers = newPayers
        } else {
            let newConsumers = check(product.consumers).filter((el, index, array) => el.id !== person.id)
            product.consumers = newConsumers
        }


        if(stompClient != undefined && stompClient.connected) {
             stompClient.publish({
               destination: '/app/' + room +'/product/update',
               body: JSON.stringify(product)
             });
          }
    }

    const check = (persons?: Array<Person>) : Array<Person> => {
        if (persons == null) {
            return new Array<Person>()
        }
        return persons
    }

    const showEditProductModal = (p: Product) => {
        setShowModal(true)
    }

    const handleCloseEditProductModal = () => {
            setShowModal(false)
        }

    return (<>

                    {/*<Container>

                    <Accordion >
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Bill members</Accordion.Header>

                            <Accordion.Body>
                                { members.map((m) => {
                                  return (<>
                                      <Badge pill bg="info">
                                          { m.name }
                                      </Badge> <span> </span>

                                  </>)
                                })}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion >

                    </Container>*/}

                    <Container>
                    <h1 style={{marginTop: '20px'}}>Bill</h1>
                    <Alert show={showAlert} variant="success">
                        <Alert.Heading>Add new item</Alert.Heading>
                        <p>
                          Add new item to the bill, that price you want to split with your friends
                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                          <Button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setShowAlert(false)} variant="outline-success">
                            Got it!
                          </Button>
                        </div>
                      </Alert>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Prodcut</th>
                                <th>Price</th>
                                <th>Payers</th>
                                <th>Consumers</th>
                                {/*<th></th>
                                <th></th>*/}
                            </tr>
                        </thead>
                        <tbody>
                        { products.map((p) => {
                            return (
                                <tr key={ p.id } onClick={(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => { showEditProductModal(p) }}>
                                    <td>{ p.name }</td>
                                    <td>{ p.price }</td>
                                    <td>{ toString(p.payers)} {action(p, user, true) }</td>
                                    <td>{ toString(p.consumers)} {action(p, user, false) }</td>
                                    {/*<td><Button variant="danger">Eat</Button></td>
                                    <td><Button variant="warning">Pay</Button></td>*/}
                                </tr>
                            )
                        })}
                            <tr>
                                <td>
                                    <Form.Floating>
                                        <Form.Control id="productName"
                                            type="text"
                                            placeholder="Product name"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setNewProductName(e.target.value)}/>
                                        <label htmlFor="productName">Product name</label>
                                    </Form.Floating>
                                </td><td>
                                    <Form.Floating>
                                        <Form.Control id="productPrice"
                                            type="text"
                                            placeholder="Price"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setNewProductPrice(e.target.value)}/>
                                        <label htmlFor="productPrice">Price</label>
                                    </Form.Floating>
                                </td>
                                <td>{user.name}</td>
                                <td>{user.name}</td>
                                {/*<td><Button variant="danger">Eat</Button></td>
                                <td><Button variant="warning">Pay</Button></td>*/}
                            </tr>
                        </tbody>

                    </Table>
                    <Button variant="success"
                        onClick={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => newProduct()}>Add item</Button>



        </Container>

        <UserSettlementTable/>

        <Modal show={showModal}  onHide={() => handleCloseEditProductModal()}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Product Name"
                        autoFocus
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="text" placeholder="Price" />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleCloseEditProductModal()}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleCloseEditProductModal()}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>


    </>)
}

const UserSettlementTable = () : JSX.Element => {

    const settlement: Settlement = useSelector((state: any) => state.receipt.userSettlement)

    const tbody = () : JSX.Element => {

        if (settlement.debts.length > 0) {
            return (<>
                {settlement.debts.map((d: Debt, index: any) =>  (

                    <tr key={ index }>
                        <td>{ d.debtor.name }</td>
                        <td>{ d.recepient.name }</td>
                        <td>{ d.amount }</td>
                    </tr>
               ))}
            </>)
        } else {
            return (
                <tr>
                    <td colSpan={3}>Have no debts</td>
                </tr>
            )
        }

    }

    return (<>
        <Container>
            <h1 style={{marginTop: '20px'}}>Settlemet</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Debtor</th>
                        <th>Recepient</th>
                        <th>Amount</th>
                    </tr>
                </thead>

                <tbody>
                    { tbody() }
                </tbody>

            </Table>
        </Container>
    </>)
}




export default Receipt
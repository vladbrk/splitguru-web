import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { actionCreators } from '../store/index'
import Product from '../store/reducers/Product'
import Person from '../store/reducers/Person'
import Settlement from '../store/reducers/Settlement'
import Debt from '../store/reducers/Debt'
import Room from '../store/reducers/Room'
import EditPosition from './EditPosition'
import { Container, Row, Col, Table, Button, Form, Badge, Navbar, Nav, Accordion, Alert, Modal} from 'react-bootstrap'
import {
  StompSessionProvider,
  useSubscription,
  useStompClient
} from "react-stomp-hooks";
import axios from 'axios'
import { baseUrl } from '../settings/index'
import { useTranslation } from 'react-i18next'
import './receipt.css'

const Receipt = () : JSX.Element => {

    const [showAlert, setShowAlert] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState('')
    const [newProductName, setNewProductName] = useState('')
    const [newProductPrice, setNewProductPrice] = useState('')

    const stompClient = useStompClient();

    const dispatch = useDispatch()
    const { addProduct, updateProducts, setUserName, addMember, updateUser, updateMembers, setSettlement } = bindActionCreators(actionCreators, dispatch)
    const { t } = useTranslation()

    const products: Array<Product> = useSelector((state: any) => state.receipt.products)
    const members: Array<Person> = useSelector((state: any) => state.receipt.members)
    const user: Person = useSelector((state: any) => state.receipt.user)
    const room: Room = useSelector((state: any) => state.receipt.room)

    useSubscription("/topic/" + room.id + "/members", (message) => {
        updateMembers(JSON.parse(message.body))
    });

    useSubscription("/topic/" + room.id + "/products", (message) => {
        updateProducts(JSON.parse(message.body))
    });

    useSubscription("/topic/" + room.id + "/receipt/calculate", (message) => {
        setSettlement(JSON.parse(message.body))
    });

    useEffect(() => {
        initMembers()
        initProducts()
        initSettlement()
    }, [])

    const initMembers = async () => {
        try {
            const { data } = await axios.get(baseUrl + '/api/room/' + room.id + '/members',
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
            const { data } = await axios.get(baseUrl + '/api/room/' + room.id + '/products',
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
                const { data } = await axios.get(baseUrl + '/api/room/' + room.id + '/settlement/calculate',
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
               destination: '/app/' + room.id +'/addproduct',
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


    const renderActionButton = (product: Product, person: Person, payer: boolean) => {

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
                    className="receipt receipt__action-button"
                    onClick={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => removePerson(e, product, person, payer)}>-</Button>
                : <Button variant="success"
                    size="sm"
                    className="receipt receipt__action-button"
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
               destination: '/app/' + room.id +'/product/update',
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
               destination: '/app/' + room.id +'/product/update',
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
        setSelectedProductId(p.id || '')
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
                    <h1 style={{marginTop: '20px'}}>{t("receipt.h.bill")}</h1>
                    <Alert show={showAlert} variant="success">
                        <Alert.Heading>{t("receipt.alert.h.add_new_item")}</Alert.Heading>
                        <p>
                            {t("receipt.alert.c.add_new_item")}
                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                          <Button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setShowAlert(false)}
                            variant="outline-success">
                            {t("receipt.alert.c.ok")}
                          </Button>
                        </div>
                      </Alert>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>{t("receipt.table.h.product")}</th>
                                <th>{t("receipt.table.h.price")}</th>
                                <th>{t("receipt.table.h.payers")}</th>
                                <th>{t("receipt.table.h.consumers")}</th>
                            </tr>
                        </thead>
                        <tbody>
                        { products.map((p) => {
                            return (
                                <tr key={ p.id } onClick={(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => { showEditProductModal(p) }}>
                                    <td>{ p.name }</td>
                                    <td>{ p.price }</td>
                                    <td>{renderActionButton(p, user, true) }<div className="receipt receipt__action-caption">{ toString(p.payers)}</div></td>
                                    <td>{renderActionButton(p, user, false) }<div className="receipt receipt__action-caption">{ toString(p.consumers)}</div></td>
                                </tr>
                            )
                        })}
                            <tr>
                                <td>
                                    <Form.Floating>
                                        <Form.Control id="productName"
                                            type="text"
                                            placeholder={t("receipt.table.p.product_name")}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setNewProductName(e.target.value)}/>
                                        <label htmlFor="productName">{t("receipt.table.p.product_name")}</label>
                                    </Form.Floating>
                                </td><td>
                                    <Form.Floating>
                                        <Form.Control id="productPrice"
                                            type="text"
                                            placeholder={t("receipt.table.p.price")}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setNewProductPrice(e.target.value)}/>
                                        <label htmlFor="productPrice">{t("receipt.table.p.price")}</label>
                                    </Form.Floating>
                                </td>
                                <td>{user.name}</td>
                                <td>{user.name}</td>
                            </tr>
                        </tbody>

                    </Table>
                    <Button variant="success"
                        onClick={ (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => newProduct()}>{t("receipt.table.b.add_item")}</Button>



        </Container>

        <UserSettlementTable/>

        <EditPosition show={showModal} id={selectedProductId} onHide={() => handleCloseEditProductModal()} />

    </>)
}

const UserSettlementTable = () : JSX.Element => {

    const { t } = useTranslation()
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
                    <td colSpan={3}>{t("settlement.table.no_debts")}</td>
                </tr>
            )
        }

    }

    return (<>
        <Container>
            <h1 style={{marginTop: '20px'}}>{t("settlement.h.settlement")}</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>{t("settlement.table.h.debtor")}</th>
                        <th>{t("settlement.table.h.recepient")}</th>
                        <th>{t("settlement.table.h.amount")}</th>
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
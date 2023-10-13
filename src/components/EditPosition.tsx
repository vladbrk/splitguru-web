import React, { useState, useEffect } from 'react'
import Product from '../store/reducers/Product'
import axios from 'axios'
import { baseUrl } from '../settings/index'
import { Container, Row, Col, Table, Button, Form, Badge, Navbar, Nav, Accordion, Alert, Modal} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'


const EditPosition = ({show = false, id = '', onHide = () => { }}) : JSX.Element => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [product, setProduct] = useState(new Product())

    const [showModal, setShowModal] = useState(false)

    const { t } = useTranslation()

    useEffect(() => {
        getProduct()
        setShowModal(show)
    }, [show])

    const handleCloseEditProductModal = () => {
        setShowModal(false)
        onHide()
    }

    const getProduct = async () => {
        try {
            const { data } = await axios.get(baseUrl + '/api/product/' + id,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            setName(data.name)
            setPrice(String(data.price))
        } catch(e) {
            console.error(e);
        }

    }

    const saveChanges = async () => {
        product.name = name
        product.price = parseInt(price)
        try {
            await axios.put(baseUrl + '/api/product/' + id,
                JSON.stringify(product),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
        } catch(e) {
            console.error(e);
        }
    }



    return (<>
        <Modal show={showModal}  onHide={() => handleCloseEditProductModal()}>
            <Modal.Header closeButton>
              <Modal.Title>{t("edit_position.h.edit_item")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("edit_position.product_name")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("edit_position.product_name")}
                    autoFocus
                    value={ name }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>{t("edit_position.price")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("edit_position.price")}
                    value={ price }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)  => setPrice(e.target.value)}/>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleCloseEditProductModal()}>
                {t("edit_position.close")}
              </Button>
              <Button variant="primary" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => saveChanges()}>
                {t("edit_position.save_changes")}
              </Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default EditPosition
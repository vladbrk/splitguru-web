import React from 'react'
import { useSelector } from 'react-redux'
import Person from '../store/reducers/Person'
import { Container, Table } from 'react-bootstrap'
import { baseUrl } from '../settings/index'
import { useTranslation } from 'react-i18next'

const Members = () : JSX.Element => {
    const members: Array<Person> = useSelector((state: any) => state.receipt.members)
    const { t } = useTranslation()

    return (<>
        <h1 style={{marginTop: '20px'}}>{t("members.h.members")}</h1>

        <Container>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>{t("members.table.h.name")}</th>
                </tr>
            </thead>
            <tbody>
            { members.map((m) => {
                return (
                    <tr key={ m.id }>
                        <td>{ m.name }</td>
                    </tr>
                )
            })}
            </tbody>
        </Table>

        </Container>
    </>)
}

export default Members
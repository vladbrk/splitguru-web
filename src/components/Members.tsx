import React from 'react'
import { useSelector } from 'react-redux'
import Person from '../store/reducers/Person'
import { Container, Table } from 'react-bootstrap'
import { baseUrl } from '../settings/index'

const Members = () : JSX.Element => {
    const members: Array<Person> = useSelector((state: any) => state.receipt.members)

    return (<>
        <h1 style={{marginTop: '20px'}}>Members</h1>

        <Container>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    {/*<th></th>*/}
                </tr>
            </thead>
            <tbody>
            { members.map((m) => {
                return (
                    <tr key={ m.id }>
                        <td>{ m.name }</td>
                        {/*<td><Button variant="primary">Switch</Button></td>*/}
                    </tr>
                )
            })}
            </tbody>
        </Table>

        </Container>
    </>)
}

export default Members
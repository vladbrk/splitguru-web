import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Table } from 'react-bootstrap'

import Settlement from '../store/reducers/Settlement'
import Debt from '../store/reducers/Debt'

const SettlementComp = () : JSX.Element => {

    const settlement: Settlement = useSelector((state: any) => state.receipt.settlement)

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

export default SettlementComp
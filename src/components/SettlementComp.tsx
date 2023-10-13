import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Table } from 'react-bootstrap'

import Settlement from '../store/reducers/Settlement'
import Debt from '../store/reducers/Debt'
import { useTranslation } from 'react-i18next'

const SettlementComp = () : JSX.Element => {

    const { t } = useTranslation()

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

export default SettlementComp
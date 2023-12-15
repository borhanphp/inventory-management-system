import React from 'react';
import { Col, Row } from 'reactstrap';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';

const LedgerDetails = ( { state } ) => {
    console.log( state );
    return (
        <>
            <div className='p-1 border rounded-3'>
                <Row>
                    <Col xs={12} sm={12} md={4}>
                        <ErpInput
                            label="Date Range"
                            type="Date"
                            sideBySide={false}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={4}>
                        <ErpSelect
                            label="Business Location"
                            sideBySide={false}
                        />
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col md={6}>
                        <div className='bg-light'><p className='text-black fw-bold p-1'>To:</p></div>
                        <div>
                            <ErpDetails value={state?.name} sideBySide={false} />
                            <ErpDetails value={state?.business_name} sideBySide={false} />
                            <ErpDetails value={state?.name} sideBySide={false} />
                            <ErpDetails value={state?.address} sideBySide={false} />
                            <ErpDetails value={`Mobile:  ${state?.mobile}`} sideBySide={false} />
                            <ErpDetails value={`Tax Number:  ${state?.tax_number}`} sideBySide={false} />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='bg-light'><p className='text-black fw-bold p-1 text-end fs-4'>Account Summery</p></div>
                        <p className='text-end'>12/12/2022 To 12/12/2023</p>
                        <hr />
                        <div className=''>
                            <Row>
                                <Col>Opening Balance</Col>
                                <Col className="text-end"><p>$ {state?.opening_balance}</p></Col>
                            </Row>
                            <Row>
                                <Col>Total Purchase</Col>
                                <Col className="text-end"><p>$ {state?.opening_balance}</p></Col>
                            </Row>
                            <Row>
                                <Col>Total paid</Col>
                                <Col className="text-end"><p>$ {state?.opening_balance}</p></Col>
                            </Row>
                            <Row>
                                <Col>Advance Balance</Col>
                                <Col className="text-end"><p>$ {state?.advance_balance}</p></Col>
                            </Row>
                            <Row>
                                <Col><p className='fw-bolder'>Balance due</p></Col>
                                <Col className="text-end"><p>$ {state?.purchase_due}</p></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row className='mt-2'>
                    <Col>
                        <p className='text-center'>Showing all invoices and payments between 01/01/2023 and 12/31/2023</p>
                        <table className='table w-100'>
                            <thead className='bg-light'>
                                <tr>
                                    <th>Date</th>
                                    <th>Reference No</th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Payment Status</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                    <th>Balance</th>
                                    <th>Payment Method</th>
                                    <th>Others</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>12/12/2022</td>
                                    <td>RF124587</td>
                                    <td>Opening Balance</td>
                                    <td>Awesome Shop</td>
                                    <td>$ 0.00</td>
                                    <td>$ 0.00</td>
                                    <td>$ 0.00</td>
                                    <td>$ 0.00</td>
                                    <td>Cash</td>
                                    <td>Others</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </div>

        </>
    );
};

export default LedgerDetails;
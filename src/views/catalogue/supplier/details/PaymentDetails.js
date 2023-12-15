import React from 'react';
import { Col, Row } from 'reactstrap';
import InPaginate from '../../../../utility/custom/CustomPagination';

const PaymentDetails = () => {
    return (
        <>
            <div className='p-1 border rounded-3'>
                <Row className=''>
                    <Col>
                        <table className='table table-bordered w-100'>
                            <thead className='bg-light'>
                                <tr>
                                    <th>Paid on</th>
                                    <th>Reference No</th>
                                    <th>Amount</th>
                                    <th>Payment Method</th>
                                    <th>Payment For</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Paid on</td>
                                    <td>Reference No</td>
                                    <td>Amount</td>
                                    <td>Payment Method</td>
                                    <td>Payment For</td>
                                    <td>Action</td>
                                </tr>
                            </tbody>
                        </table>
                        <InPaginate total={20} />
                    </Col>
                </Row>
            </div>

        </>
    );
};

export default PaymentDetails;
import React from 'react';
import { Col, Row } from 'reactstrap';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import InPaginate from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';

const PurchaseDetails = ( { state } ) => {
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
                </Row>
                <Row className='px-1'>
                    <CustomHeader>
                        <ErpInput
                            label="Search"
                            sideBySide={false}
                        />
                    </CustomHeader>
                </Row>

                <Row className='mt-2'>
                    <Col>
                        <table className='table table-bordered w-100'>
                            <thead className='bg-light'>
                                <tr>
                                    <th>Action</th>
                                    <th>Date</th>
                                    <th>Reference No</th>
                                    <th>Location</th>
                                    <th>Supplier</th>
                                    <th>Purchase Status</th>
                                    <th>Payment Status</th>
                                    <th>Grand Total</th>
                                    <th>Payment Due</th>
                                    <th>Added By</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Action</td>
                                    <td>Date</td>
                                    <td>Reference No</td>
                                    <td>Location</td>
                                    <td>Supplier</td>
                                    <td>Purchase Status</td>
                                    <td>Payment Status</td>
                                    <td>Grand Total</td>
                                    <td>Payment Due</td>
                                    <td>Added By</td>
                                </tr>
                                <tr className='bg-light'>
                                    <td colSpan={5} className="text-center">Total:</td>
                                    <td></td>
                                    <td></td>
                                    <td>$ 0.00</td>
                                    <td>
                                        <p>Purchase Due - $ 0.00</p>
                                        <p>Purchase Return - $ 0.00</p>
                                    </td>
                                    <td></td>
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

export default PurchaseDetails;
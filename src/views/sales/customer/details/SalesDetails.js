import React from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import InPaginate from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';

const SalesDetails = ( { state } ) => {

    const statusPayment = [
        { label: 'Paid', value: 'Paid' },
        { label: 'Due', value: 'Due' },
        { label: 'Partial', value: 'Partial' },
        { label: 'Overdue', value: 'Overdue' }
    ];
    return (
        <>
            <div className='p-1 border rounded-3'>
                <Row>
                    <Col xs={12} sm={12} md={4}>
                        <ErpSelect
                            label="Payment Status"
                            options={statusPayment}
                            sideBySide={false}
                            onChange={() => { }}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={4}>
                        <ErpInput
                            label="Date Range"
                            type="Date"
                            sideBySide={false}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={4} className="mt-2">
                        <FormGroup check >
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="checkSub"
                                // onChange={() => setCatField( !catField )}
                                />{" "}
                                Subscriptions
                            </Label>
                        </FormGroup>
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
                                    <th>Invoice No.</th>
                                    <th>Customer Name</th>
                                    <th>Contact No.</th>
                                    <th>Location</th>
                                    <th>Payment Status</th>
                                    <th>Payment Method</th>
                                    <th>Total Amount</th>
                                    <th>Total Paid</th>
                                    <th>Sell Due</th>
                                    <th>Sell Return Due</th>
                                    <th>Shipping Status</th>
                                    <th>Total Items</th>
                                    <th>Added By</th>
                                    <th>Sell Note</th>
                                    <th>Staff Note</th>
                                    <th>Shipping Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Action</td>
                                    <td>Date</td>
                                    <td>Invoice No.</td>
                                    <td>{state?.name}</td>
                                    <td>{state?.mobile}</td>
                                    <td>{state?.address}</td>
                                    <td>Payment Status</td>
                                    <td>Payment Method</td>
                                    <td>Total Amount</td>
                                    <td>Total Paid</td>
                                    <td>Sell Due</td>
                                    <td>Sell Return Due</td>
                                    <td>Shipping Status</td>
                                    <td>Total Items</td>
                                    <td>Added By</td>
                                    <td>Sell Note</td>
                                    <td>Staff Note</td>
                                    <td>Shipping Details</td>
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

export default SalesDetails;
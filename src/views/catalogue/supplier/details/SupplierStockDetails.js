import React from 'react';
import { Col, Row } from 'reactstrap';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import InPaginate from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';

const SupplierStockDetails = () => {
    return (
        <>
            <div className='p-1 border rounded-3'>
                <Row>
                    <Col xs={12} sm={12} md={4}>
                        <ErpSelect
                            label="Business Location"
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
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Purchase Quantity</th>
                                    <th>Total Sold</th>
                                    <th>Total Unit Transfered</th>
                                    <th>Total Returned</th>
                                    <th>Current Stock</th>
                                    <th>Current Stock Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Product</td>
                                    <td>SKU</td>
                                    <td>Purchase Quantity</td>
                                    <td>Total Sold</td>
                                    <td>Total Unit Transfered</td>
                                    <td>Total Returned</td>
                                    <td>Current Stock</td>
                                    <td>Current Stock Value</td>
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

export default SupplierStockDetails;
import React from 'react';
import { Col, Row } from 'reactstrap';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import InPaginate from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';

const DocumentDetails = () => {
    return (
        <>
            <div className='p-1 border rounded-3'>
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
                                    <th>Heading</th>
                                    <th>Added By</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Action</th>
                                    <th>Heading</th>
                                    <th>Added By</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
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

export default DocumentDetails;
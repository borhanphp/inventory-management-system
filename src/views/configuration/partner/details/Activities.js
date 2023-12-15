import React from 'react';
import { Col, Row } from 'reactstrap';
import InPaginate from '../../../../utility/custom/CustomPagination';

const Activities = () => {
    return (
        <>
            <div className='p-1 border rounded-3'>
                <Row className=''>
                    <Col>
                        <table className='table table-bordered w-100'>
                            <thead className='bg-light'>
                                <tr>
                                    <th>Date</th>
                                    <th>Action</th>
                                    <th>By</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Date</td>
                                    <td>Action</td>
                                    <td>By</td>
                                    <td>Note</td>
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

export default Activities;
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardText, Col, Modal, Row, Table } from 'reactstrap';
import { getSalesById } from '../store/actions';

const InvoiceView = ( { openInvoiceModal, handleInvoiceModalClosed, invoiceToggle } ) => {
    const { salesBasicInfo } = useSelector( ( { posReducer } ) => posReducer )
    const location = useLocation()
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const invoiceId = location?.state



    useEffect( () => {
        if ( invoiceId?.id ) {
            dispatch( getSalesById( invoiceId?.id ) )
        }
    }, [invoiceId] )

    const Print = () => {
        const printableDiv = document.getElementById( 'printable-content' );

        if ( printableDiv ) {
            const printContents = printableDiv.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            setTimeout( () => {
                document.body.innerHTML = originalContents;
                navigate( 0 )
                localStorage.removeItem( "items" );
            }, 100 );
        } else {
            console.error( 'Not Found Invoice' );
        }
    };


    const handleCancel = () => {
        invoiceToggle()
        navigate( 0 )
        localStorage.removeItem( "items" );
    }

    return (
        <Modal
            isOpen={openInvoiceModal}
            onClosed={handleInvoiceModalClosed}
            toggle={invoiceToggle}
            className=""
            size='lg'
        >


            <div id="printable-content">
                <Card className='invoice-preview-card px-2'>
                    <CardBody className=''>
                        {/* Header */}
                        <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0 py-2'>
                            <div>
                                <div className='logo-wrapper'>

                                    <h3 className='text-primary'>G Store</h3>
                                </div>
                                <CardText className='mb-25'>Anas Tower(4th Floor), 3068/A, Rahattarpul</CardText>
                                <CardText className='mb-25'>Bakalia, Chattogram, Bangladesh</CardText>
                                <CardText className='mb-0'>quadriontechnologies.com</CardText>
                            </div>
                            <div className='mt-md-0 mt-2'>
                                <h4 className='invoice-title'>
                                    Invoice: <span className='invoice-number'>{salesBasicInfo?.referenceNo}</span>
                                </h4>


                                <div className='d-flex'>
                                    <p className='invoice-date-title me-2'>Date:</p>
                                    <p className='invoice-date'>{moment( salesBasicInfo?.referenceDate ).format( "DD-MMM-YYYY" )} </p>
                                </div>
                            </div>
                        </div>
                        {/* /Header */}
                    </CardBody>

                    <hr className='invoice-spacing' />

                    {/* Address and Contact */}
                    <CardBody className='invoice-padding pt-0 p-3'>
                        <Row className='invoice-spacing'>
                            <Col className='p-0' xl='8'>
                                <h6 className='mb-2'>Invoice To:</h6>
                                <h6 className='mb-25'></h6>
                                <CardText className='mb-25'>{salesBasicInfo?.customerName}</CardText>
                                <CardText className='mb-25'>{salesBasicInfo?.city}</CardText>
                                <CardText className='mb-25'>{salesBasicInfo?.division}</CardText>
                                <CardText className='mb-0'>{salesBasicInfo?.postalCode}</CardText>
                            </Col>
                            <Col className='p-0 mt-xl-0 mt-2' xl='4'>
                                <h6 className='mb-2'>Payment Details:</h6>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='pe-1 text-nowrap'>Payment Type:</td>
                                            <td>
                                                <span className='fw-bold'>{salesBasicInfo?.payments[0]?.paymentMethod}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='pe-1'>Amount:</td>
                                            <td> <span className='fw-bold'>{salesBasicInfo?.payments[0]?.totalAmount}</span></td>
                                        </tr>
                                        <tr>
                                            <td className='pe-1'>Bank Name:</td>
                                            <td> <span className='fw-bold'>Bangladesh Bank</span></td>
                                        </tr>
                                        <tr>
                                            <td className='pe-1'>Country:</td>
                                            <td> <span className='fw-bold'>Bangladesh</span></td>
                                        </tr>
                                        <tr>
                                            <td className='pe-1'>IBAN:</td>
                                            <td> <span className='fw-bold'>ETD95476213874685</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </CardBody>
                    {/* /Address and Contact */}

                    {/* Invoice Description */}
                    <Table responsive className='mb-3'>
                        <thead>
                            <tr className='text-center'>
                                <th className='' style={{ padding: "5px" }}>#SL</th>
                                <th className=' px-0 text-start' style={{ padding: "5px" }}>Products</th>
                                <th className='' style={{ padding: "5px" }}>Quantity</th>
                                <th className='' style={{ padding: "5px" }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                salesBasicInfo?.items &&
                                salesBasicInfo?.items?.map( ( data, i ) => {
                                    return (
                                        <tr key={i} className="text-center">
                                            <td className='p-0'>
                                                <p className='card-text fw-bold mb-25'>{i + 1}</p>
                                            </td>
                                            <td className='p-0 text-start'>
                                                <p className='card-text fw-bold mb-25'>{data?.description}</p>
                                            </td>
                                            <td className='p-0'>
                                                <span className='fw-bold'>{data?.quantity}</span>
                                            </td>
                                            <td className='p-0'>
                                                <span className='fw-bold'>{data?.total}</span>
                                            </td>
                                        </tr>
                                    )
                                } )
                            }
                        </tbody>
                    </Table>
                    {/* /Invoice Description */}

                    {/* Total & Sales Person */}
                    <CardBody className='invoice-padding pb-0'>
                        <Row className='invoice-sales-total-wrapper float-end'>


                            <Col className='p-0 mt-xl-0 mt-2 me-2' md='4'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='pe-1'>Subtotal:</td>
                                            <td>
                                                <span className='fw-bold'>{salesBasicInfo?.subtotal}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='pe-1'>Discount:</td>
                                            <td> <span className='fw-bold'>{salesBasicInfo?.discount}</span></td>
                                        </tr>
                                        <tr>
                                            <td className='pe-1'>Vat:</td>
                                            <td> <span className='fw-bold'>{salesBasicInfo?.vat}</span></td>
                                        </tr>
                                        <tr className='border-top-0'>
                                            <td className='pe-1 fw-bold'>Total:</td>
                                            <td> <span className='fw-bold'>{salesBasicInfo?.total}</span></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </CardBody>
                    {/* /Total & Sales Person */}

                    <hr className='invoice-spacing' />

                    {/* Invoice Note */}
                    <CardBody className='invoice-padding pt-0'>
                        <Row>
                            <Col sm='12'>
                                <span className='fw-bold'>Note: </span>
                                <span>
                                    It was a pleasure working with you and your team. We hope you will keep us in mind for future. Thank You!
                                </span>
                            </Col>
                            <Col sm='12'>

                                <span>
                                    <Button
                                        className='float-end mt-1'
                                        color="primary"
                                        onClick={() => { Print() }}
                                    >Print</Button>
                                </span>

                                <span>
                                    <Button
                                        className='float-end mt-1 me-1'
                                        color="secondary"
                                        onClick={() => { handleCancel() }}
                                    >Cancel</Button>
                                </span>

                            </Col>
                        </Row>
                    </CardBody>
                    {/* /Invoice Note */}
                </Card>
            </div>


        </Modal>
    );
};

export default InvoiceView;
// import moment from 'moment';
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button, Col, NavItem, Row } from 'reactstrap';
// import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
// import { ErpDetails } from '../../../../utility/custom/ErpDetails';
// import FormContentLayout from '../../../../utility/custom/FormContentLayout';
// import FormLayout from '../../../../utility/custom/FormLayout';
// import { getPurchaseById } from '../store';


// const breadcrumb = [
//     {
//         id: 'home',
//         name: 'Home',
//         link: "/",
//         isActive: false,
//         hidden: false
//     }
// ];

// const PurchaseDetails = () => {
//     const { purchaseData } = useSelector( ( { purchase } ) => purchase );
//     const location = useLocation();
//     const dispatch = useDispatch()
//     const purchaseId = location.state;
//     const navigate = useNavigate();
//     useEffect( () => {
//         dispatch( getPurchaseById( purchaseId ) )
//     }, [purchaseId] )

//     const items = purchaseData?.items


//     return (
//         <>
//             <ActionMenu
//                 title="Purchase Details"
//                 breadcrumb={breadcrumb}
//             >
//                 <NavItem className="me-1" >
//                     <Button
//                         size="sm"
//                         color="danger"
//                         onClick={() => { navigate( -1 ) }}
//                     >Back</Button>
//                 </NavItem>
//             </ActionMenu>
//             <div className='mt-3'>
//                 <FormLayout>
//                     <div className='p-2'>
//                         <FormContentLayout title="Purchase Details">
//                             <Col xs={6} className="">
//                                 <div className="text-black">
//                                     <ErpDetails label="Purchase Order Code" value={purchaseData?.name} />
//                                     <ErpDetails label="Supplier Name" value={purchaseData?.supplierName} />
//                                     <ErpDetails label="Currency" value={purchaseData?.currency} />
//                                     <ErpDetails label="Currency Rate" value={purchaseData?.currencyRate} />
//                                     <ErpDetails label="Purchase Date" value={moment( purchaseData?.date ).format( 'DD-MMM-YY' )} />
//                                 </div>
//                             </Col>
//                             <Col xs={6} className="">
//                                 <div className="text-black">
//                                     <ErpDetails label="Delivery Date" value={moment( purchaseData?.deliveryDate ).format( 'DD-MMM-YY' )} />
//                                     <ErpDetails label="Receive Point" value={purchaseData?.receivePoint} />
//                                     <ErpDetails label="Type" value={purchaseData?.type?.label} />
//                                     <ErpDetails label="Status" value={purchaseData?.status?.label} />
//                                     <ErpDetails label="Note" value={purchaseData?.note} />
//                                 </div>
//                             </Col>
//                         </FormContentLayout>
//                     </div>
//                     <Row className='mt-2'>
//                         <Col>
//                             <p className='text-center'>All Items for this Purchase Order</p>
//                             <table className='table w-100'>
//                                 <thead className='bg-light'>
//                                     <tr>
//                                         <th>Item Name</th>
//                                         <th>Price</th>
//                                         <th>Quantity</th>
//                                         <th>Total</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {items &&
//                                         items?.map( ( item, i ) => {
//                                             return (
//                                                 <tr key={i}>
//                                                     <td>{item.description}</td>
//                                                     <td>{item.price}</td>
//                                                     <td>{item.quantity}</td>
//                                                     <td>{item.total}</td>
//                                                 </tr>
//                                             )
//                                         } )
//                                     }

//                                 </tbody>
//                             </table>
//                         </Col>
//                     </Row>
//                 </FormLayout>
//             </div>

//         </>

//     );
// };

// export default PurchaseDetails;
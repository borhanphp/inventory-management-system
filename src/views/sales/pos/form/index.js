/* eslint-disable no-tabs */
import axios from "axios";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Edit, X } from "react-feather";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Card, Col,
	Container, FormGroup, Input,
	InputGroup, Label, Row
} from "reactstrap";
import "../../../../assets/scss/sales/sales.scss";
import { getAllCustomerCm, getAllItemsCm } from "../../../../redux/common/store";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { confirmDialog } from "../../../../utility/custom/ConfirmDialog";
import ErpSelect from "../../../../utility/custom/ErpSelect";
import { numberWithCommas } from "../../../../utility/enums";
import ItemForm from "../../../catalogue/item/form";
import { getItemsByFilter } from "../../../catalogue/item/store";
import InvoiceView from "../details/InvoiceModal";
import {
	addNewSales,
	bindSalesInfo,
	cartProduct, decrementQty, deleteProduct, incrementQty, saveProduct, updateSales
} from "../store/actions";
import CustomerForm from "./CustomerForm";
import DiscountForm from "./DiscountForm";
import NoteForm from "./NoteForm";
import PaymentMethod from "./PaymentMethod";
import ShippingForm from "./ShippingForm";
import VatForm from "./VatForm";


const PosForm = ( { salesId } ) => {
	const { customerDataCm, itemsDataCm } = useSelector( ( { commons } ) => commons );
	const { cartItems } = useSelector( ( { posProducts } ) => posProducts );
	const { salesBasicInfo } = useSelector( ( { posReducer } ) => posReducer );
	const [openModal, setOpenModal] = useState( false );
	const [openProductModal, setOpenProductModal] = useState( false );
	const [openDiscountModal, setOpenDiscountModal] = useState( false );
	const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState( false );
	const [openTaxModal, setOpenTaxModal] = useState( false );
	const [openShippingModal, setOpenShippingModal] = useState( false );
	const [openSuspendModal, setOpenSuspendModal] = useState( false );
	const [openInvoiceModal, setOpenInvoiceModal] = useState( false );
	const [sAlert, setAlert] = useState( false );
	const [paymentOnType, setPaymentOnType] = useState( '' );
	const [listSearch, setListSearch] = useState( null );
	const [randomRef, setRandomRef] = useState( '' )
	const [discountOnType, setDiscountOnType] = useState( '' );
	const [vatNumberAmount, setVatNumberAmount] = useState( 0 );
	const [isWholesale, setIsWholesale] = useState( false );
	const [isInstasale, setIsInstasale] = useState( false );


	const filteredItemsDataCm = itemsDataCm?.filter( ( item ) => item.stock > 0 );

	const navigate = useNavigate()
	const { items } = salesBasicInfo;

	const getReferenceNo = async () => {
		const apiEndPoint = `${generalStoreApi.sales.referenceNo}`;
		const res = await axios.get( apiEndPoint );
		setRandomRef( res.data.poNo )
	};

	useEffect( () => {
		getReferenceNo()
		dispatch( bindSalesInfo( { ...salesBasicInfo, referenceNo: randomRef } ) );
		return () => {
			localStorage.removeItem( "items" );
		}
	}, [] )

	useEffect( () => {
		if ( !salesBasicInfo?.items?.length ) {
			setVatNumberAmount( '' );
			setDiscountOnType( '' );
		}
	}, [salesBasicInfo?.items] )


	// useEffect( () => {
	// 	const beforeUnloadHandler = ( e ) => {
	// 		e.preventDefault();
	// 		e.returnValue = "";
	// 		return "Are you sure you want to leave?";
	// 	};
	// 	window.addEventListener( "beforeunload", beforeUnloadHandler );
	// 	return () => {
	// 		window.removeEventListener( "beforeunload", beforeUnloadHandler );
	// 	};
	// }, [] );

	useEffect( () => {
		dispatch( bindSalesInfo( {
			...salesBasicInfo,
			items: cartItems
		} ) )
	}, [cartItems] );


	const noteData = ( data ) => {
		dispatch( bindSalesInfo( { ...salesBasicInfo, note: data } ) )
	}


	const handleInputOnChange = ( itemId, e ) => {
		const { type, name, value } = e.target;
		const updatedCartItems = items?.map( ( item ) => {
			if ( item?.id === itemId ) {
				const newValue = +value;
				if ( newValue > item.stock && name === "quantity" ) {
					toast.error( "Reach the available stock." );
					return item;
				}
				return { ...item, [name]: newValue };
			}
			return item;
		} );
		dispatch( bindSalesInfo( {
			...salesBasicInfo,
			items: updatedCartItems,
		} ) );
	};

	const dispatch = useDispatch();
	useEffect( () => {
		dispatch( cartProduct() );
	}, [] );

	useEffect( () => {
		dispatch( getAllItemsCm() )
	}, [] );

	const getTotalItems = ( data ) => {
		return data ?? 0;
	}

	useEffect( () => {
		getTotalItems();
	}, [salesBasicInfo] )



	const handleModalOpen = () => {
		setOpenModal( true );
	};

	const handleModalClosed = () => {
		setOpenModal( false );
	};

	// discount modal
	const handleDiscountModalOpen = () => {
		setOpenDiscountModal( true );
	};

	const handleDiscountModalClosed = () => {
		setOpenDiscountModal( false );
	};

	// payment modal
	const handlePaymentModalOpen = () => {
		setOpenPaymentMethodModal( true );
	};

	const handlePaymentModalClosed = () => {
		setOpenPaymentMethodModal( false );
	};


	// tax modal
	const handleTaxModalOpen = () => {
		setOpenTaxModal( true );
	};

	const handleTaxModalClosed = () => {
		setOpenTaxModal( false );
	};

	// shipping modal
	const handleShippingModalOpen = () => {
		setOpenShippingModal( true );
	};

	const handleShippingModalClosed = () => {
		setOpenShippingModal( false );
	};


	// suspend modal
	const handleSuspendModalOpen = () => {
		setOpenSuspendModal( true );
	};

	const handleSuspendModalClosed = () => {
		setOpenSuspendModal( false );
	};

	// invoice modal
	const handleInvoiceModalOpen = () => {
		setOpenInvoiceModal( true );
	};

	const handleInvoiceModalClosed = () => {
		setOpenInvoiceModal( false );
	};


	// deleting items
	const deleteItems = ( id ) => {
		dispatch( deleteProduct( id ) );
	};


	// customer dropdown data
	const handleCustomerOnFocus = () => {
		if ( !customerDataCm.length ) {
			dispatch( getAllCustomerCm() )
		}
	}

	// item dropdown data
	const handleItemsOnFocus = () => {
		if ( !itemsDataCm.length ) {
			dispatch( getAllItemsCm() )
		}
	}

	const customerDropDownChange = ( data, e ) => {
		const { name } = e;
		dispatch( bindSalesInfo( { ...salesBasicInfo, [name]: data } ) )
	};
	const handleDropDownOnChange = ( data, e ) => {
		dispatch( saveProduct( data ) );
		dispatch( cartProduct() );
	};

	const itemsData = salesBasicInfo?.items || [];
	const allQty = _.sum( itemsData?.map( ( d ) => d?.quantity ) );
	const totalSubTotal = _.sum( itemsData?.map( ( d ) => isWholesale ? ( d?.quantity * d?.wholeSalePrice ) : ( d?.quantity * d?.salesPrice ) ) );

	const confirmObj = {
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		confirmButtonText: 'Yes!',
		cancelButtonText: 'No'
	};

	const deleteData = () => {
		confirmDialog( {
			...confirmObj
		} ).then( async e => {
			if ( e.isConfirmed ) {
				localStorage.removeItem( "items" );
				dispatch( cartProduct() );
				setPaymentOnType( '' )
				setDiscountOnType( '' )
				setVatNumberAmount( '' )
			}
		} );
	};


	const discountTypeData = ( discountData ) => {
		setDiscountOnType( discountData )
	}


	const getDiscountOnType = () => {
		if ( discountOnType?.discountType?.value === "Percentage" ) {
			const discountNumber = discountOnType?.discountNumber;
			let result;
			result = ( ( discountNumber / 100 ) * totalSubTotal ) || 0;
			result = result.toFixed( 2 );
			return Number( result );
		} else {
			const discountNumber = discountOnType?.discountNumber || 0;
			return Number( discountNumber ).toFixed( 2 );
		}

	};

	const vatNumberData = ( data ) => {
		setVatNumberAmount( data?.vatNumber )
	}

	const getVatNumber = () => {
		let result;
		result = ( ( vatNumberAmount / 100 ) * totalSubTotal ) || 0;
		result = result.toFixed( 2 );

		return Number( result );
	};



	const paymentMethodTypeData = ( data ) => {
		setPaymentOnType( data )
	}

	const getSubtotal = ( dd ) => {
		const result = isWholesale ? ( dd?.wholeSalePrice * dd?.quantity ) : ( dd?.salesPrice * dd?.quantity )
		return result;
	}

	const handleOnSubmit = () => {
		if ( salesId && !salesBasicInfo?.note ) {
			toast.error( 'Write A Void Note' )
		} else {
			if ( !salesBasicInfo?.items?.length ) {
				toast.error( 'Please add items first' );
				setPaymentOnType( '' );
			} else if ( !paymentOnType?.methodType?.label ) {
				toast.error( 'Select Payment Method' )
			} else {
				const submittedData = {
					...salesBasicInfo,
					referenceNo: salesBasicInfo?.referenceNo ? salesBasicInfo?.referenceNo : randomRef,
					customerId: salesBasicInfo?.customerId?.value ? salesBasicInfo?.customerId?.value : 1,
					subtotal: _.sum( items?.map( fd => isWholesale ? ( fd.quantity * fd.wholeSalePrice ) : ( fd.quantity * fd.salesPrice ) ) ),
					discountReference: Number( discountOnType?.discountNumber ) ? 'discount' : null,
					discount: ( discountOnType?.discountNumber && discountOnType?.discountType?.value === "Fixed" ) ? Number( discountOnType?.discountNumber ) : 0,
					discountPercentage: ( discountOnType?.discountNumber && discountOnType?.discountType?.value === "Percentage" ) ? Number( discountOnType?.discountNumber ) : 0,
					vatReference: Number( vatNumberAmount ) ? 'vat' : null,
					vat: 0,
					salesType: isInstasale ? 'Instant' : isWholesale ? "Whole" : "Regular",
					soldFrom: salesBasicInfo?.soldFrom,
					vatPercentage: vatNumberAmount ? Number( vatNumberAmount ) : 0,
					total: _.sum( items?.map( fd => isWholesale ? ( fd.quantity * fd.wholeSalePrice ) : fd.quantity * fd.salesPrice ) ),
					items: items?.map( item => ( {
						id: item?.id ? item?.id : 0,
						itemId: item?.itemId ? item?.itemId : item.id,
						unitPrice: Number( isWholesale ? item.wholeSalePrice : item.salesPrice ),
						quantity: Number( item.quantity ),
						subtotal: isWholesale ? item.quantity * item.wholeSalePrice : item.quantity * item.salesPrice,
						discount: 0,
						discountPercentage: 0,
						vat: 0,
						vatPercentage: 0,
						total: isWholesale ? ( item.quantity * item.wholeSalePrice ) : ( item.quantity * item.salesPrice )
					} ) ),
					payments: [{
						paymentMethod: paymentOnType?.methodType?.label,
						amount: Number( paymentOnType?.amount ),
						transactionReference: "1010"
					}]
				}

				console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
				if ( salesId ) {
					dispatch( updateSales( submittedData, navigate ) );
					setPaymentOnType( '' )
					setDiscountOnType( '' )
					setVatNumberAmount( '' )
				} else {
					const paramObj = {
						page: 1,
						pageSize: 2000,
						includes: [],
						filters: [],
						sorts: [],
					};
					dispatch( addNewSales( submittedData, getReferenceNo ) );
					setPaymentOnType( '' )
					setDiscountOnType( '' )
					setVatNumberAmount( '' )
					dispatch( cartProduct() )
					dispatch( getItemsByFilter( paramObj ) )
					handleInvoiceModalOpen( true )
				}
			}
		}

	}

	const handleInstantSale = () => {
		setIsInstasale( !isInstasale );
		setIsWholesale( !isInstasale ? true : false );

	}

	return (
		<div style={{ position: 'relative' }}>
			<Card className="p-2" style={{ height: "860px" }}>

				<Container>
					<div className="d-flex flex-items-center justify-content-end gap-2">
						<div>
							<FormGroup switch>
								<Input
									type="switch"
									checked={isWholesale}
									disabled={isInstasale}
									onClick={() => {
										setIsWholesale( !isWholesale );
									}}
								/>
								<Label check>{isWholesale ? "Wholesale Price" : "Regular Price"}</Label>
							</FormGroup>
						</div>
						<div>
							|
						</div>
						<div>
							<p className="text-end fst-italic">{salesBasicInfo?.referenceNo ? salesBasicInfo?.referenceNo : randomRef}</p>
						</div>

					</div>
					<Row className="mb-2">
						<Col md={3}>
							<img style={{ width: "100%", marginTop: "-20px" }} src="/gs-logo.png" />
						</Col>
						<Col md={4}>
							<ErpSelect
								sideBySide={false}
								// classNames="mt-1"
								name="customerId"
								options={customerDataCm?.filter( cu => !cu.isSupplier )}
								value={salesBasicInfo.customerId}
								onFocus={() => { handleCustomerOnFocus() }}
								onChange={( data, e ) => { customerDropDownChange( data, e ); }}
							// secondaryOption={
							// 	<div className="input-group-append" style={{ zIndex: 0 }}>
							// 		<Button.Ripple
							// 			// tag={InputGroupText}
							// 			onClick={() => {
							// 				handleModalOpen();
							// 			}}
							// 			style={{ minHeight: "30px", minWidth: "35px" }}
							// 			className="btn-icon w-100 pt-0 p-0 h-100"
							// 			color="primary"
							// 		>
							// 			<UserPlus size={16} />
							// 		</Button.Ripple>
							// 	</div>
							// }
							/>
						</Col>
						<Col md={5}>
							<ErpSelect
								sideBySide={false}
								// classNames="mt-1"
								// options={productOptions}
								placeholder="Type Product Name to Search..."
								value={listSearch}
								options={filteredItemsDataCm}
								onFocus={() => { handleItemsOnFocus() }}
								onChange={( data, e ) => { handleDropDownOnChange( data, e ); }}
								components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
								openMenuOnFocus={false}
								openMenuOnClick={false}
							/>
						</Col>
					</Row>

					<div style={{ maxHeight: "560px", overflowY: "auto" }}>
						<table className="w-100">
							<thead className="text-center" style={{ backgroundColor: "#dce0dd" }}>
								<th className="text-start border ps-1">Product</th>
								<th className="border" style={{ width: "150px" }}>Quantity</th>
								<th className="border text-nowrap" style={{ width: "100px" }}>{isWholesale ? "Wholesale Price" : "Price"}</th>
								<th className="border" style={{ width: "150px" }}>Total</th>
								<th className="border" style={{ width: "5px" }}>Action</th>
							</thead>
							<tbody>
								{
									items && items?.map( ( dd, ii ) => {
										return (
											<tr key={ii}>
												<td
													className="ps-1 border fw-bold"
													style={{}}
												>{dd?.description}</td>
												<td className="border">
													<div className="d-flex flex-items-center">
														<div
															className="border cursor-pointer"
															style={{ padding: "0px 8px", backgroundColor: "#E8F6F0" }}
															onClick={() => { dispatch( decrementQty( dd.id ) ) }}
														>
															<div style={{ paddingTop: "3px" }}>-</div>
														</div>
														<div>
															<InputGroup>
																<Input
																	id="quantityId"
																	className="text-end"
																	name="quantity"
																	type="number"
																	bsSize="sm"
																	value={dd?.quantity}
																	onChange={( e ) => { handleInputOnChange( dd.id, e ); }}
																	onFocus={( e ) => { e.target.select(); }}
																/>
															</InputGroup>
														</div>
														<div
															className="border cursor-pointer"
															style={{ padding: "0px 8px", backgroundColor: "#E8F6F0" }}
															onClick={() => { dispatch( incrementQty( dd.id ) ) }}
														>
															<div style={{ paddingTop: "3px" }}>+</div>
														</div>
													</div>
												</td>
												<td className="border">
													<Input
														id="salesPriceId"
														name={!isWholesale ? 'salesPrice' : 'wholeSalePrice'}
														// name='salesPrice'
														type="number"
														className="text-end"
														bsSize="sm"
														value={!isWholesale ? dd?.salesPrice : dd?.wholeSalePrice}
														onChange={( e ) => { handleInputOnChange( dd.id, e ); }}
														onFocus={( e ) => { e.target.select(); }}
													/>
												</td>
												<td className="text-center border">
													{numberWithCommas( getSubtotal( dd ) )}
												</td>
												<td className="text-center border">
													<X
														className="cursor-pointer"
														onClick={() => {
															deleteItems( dd?.id );
														}}
													/>
												</td>
											</tr>
										)
									} )
								}

							</tbody>
						</table>
						{/* <Row
							className="main-container"
							style={{ maxHeight: "560px", overflowY: "auto" }}
						>
							<Row className="border pt-1 mb-1 font-design">
								<Col md="4" sm="4">
									<p className="text-nowrap">Product</p>
								</Col>
								<Col md="3" sm="3">
									<p className="text-center text-nowrap">Quantity</p>
								</Col>
								<Col md="2" sm="2">
									<p className="text-center text-nowrap">Price</p>
								</Col>
								<Col md="2" sm="2">
									<p className="text-center text-nowrap">Total</p>
								</Col>
								<Col md="1" sm="1">
									<p className="text-center text-nowrap">Action</p>

								</Col>
							</Row>
							{items &&
								items?.map( ( dd, ii ) => {
									return (
										<Row
											key={ii}
											style={{
												borderBottom: "1px solid #f2f2f0",
												marginBottom: "5px"
											}}
										>
											<Col md="4" sm="4">
												<p style={{ fontWeight: "400", color: "black" }}>
													{dd?.description}
												</p>
											</Col>
											<Col md="3" sm="3" className="text-center">
												<div className="d-flex flex-items-center">
													<div
														className="border cursor-pointer"
														style={{ padding: "0px 8px" }}
														onClick={() => { dispatch( decrementQty( dd.id ) ) }}
													>
														<div style={{ paddingTop: "3px" }}>-</div>
													</div>
													<div>
														<InputGroup>
															<Input
																id="quantityId"
																className="text-end"
																name="quantity"
																type="number"
																bsSize="sm"
																value={dd?.quantity}
																onChange={( e ) => { handleInputOnChange( dd.id, e ); }}
																onFocus={( e ) => { e.target.select(); }}
															/>
														</InputGroup>
													</div>
													<div
														className="border cursor-pointer"
														style={{ padding: "0px 8px" }}
														onClick={() => { dispatch( incrementQty( dd.id ) ) }}
													>
														<div style={{ paddingTop: "3px" }}>+</div>
													</div>
												</div>
											</Col>
											<Col md="2" sm="2" className="text-center">
												<Input
													id="salesPriceId"
													name="salesPrice"
													type="number"
													className="text-end"
													bsSize="sm"
													value={dd?.salesPrice}
													onChange={( e ) => { handleInputOnChange( dd.id, e ); }}
													onFocus={( e ) => { e.target.select(); }}
												/>
											</Col>
											<Col md="2" sm="2" className="text-center">
												{numberWithCommas( getSubtotal( dd ) )}
											</Col>
											<Col md="1" sm="1" className="text-center">
												<X
													className="cursor-pointer"
													onClick={() => {
														deleteItems( dd?.id );
													}}
												/>
											</Col>
										</Row>
									);
								} )}

						</Row> */}
					</div>

					<div className="w-100 pe-5" style={{ position: "absolute", bottom: "25px" }}>

						<div>
							<FormGroup check>
								<Input
									type="checkbox"
									checked={isInstasale}
									onClick={() => { handleInstantSale() }}
								/>
								<Label check>
									Q-Sale
								</Label>
							</FormGroup>
						</div>

						<hr />
						<Row>
							<Col md={7}>
								<Row className="">
									<Col xs={6} className="mb-1">
										<Button
											className="me-1 w-100"
											size=""
											color="primary"
											disabled={!salesBasicInfo?.items?.length}
											onClick={() => { handlePaymentModalOpen() }}>
											{/* <DollarSign size={12} className="" /> */}
											{
												paymentOnType ?
													paymentOnType?.methodType?.label + ' ' + paymentOnType?.amount :
													'Pay Invoice'
											}
										</Button>
									</Col>

									<Col xs={6}>
										<Button
											className="w-100"
											color="danger"
											onClick={() => { deleteData(); }}
										>Cancel</Button>

									</Col>
									{/* <Col xs={6} >
										<Button
											className="w-100"
											color="secondary"
										// onClick={() => { deleteData(); }}
										>Print Invoice</Button>

									</Col> */}



									<Col xs={12}>
										<Button
											className="btn-success w-100"
											onClick={handleOnSubmit}
											disabled={!salesBasicInfo?.items?.length}
										>
											Submit
										</Button>
									</Col>

								</Row>
							</Col>
							<Col md={5} className="">

								<table className="w-100">
									{/* <tr className="">
										<th className="">Items :</th>
										<td className="text-end fw-bolder">

											{getTotalItems( allQty )}

										</td>
									</tr> */}
									<tr>
										<th className="">Sub Total :</th>
										<td className="text-end fw-bolder">
											{numberWithCommas( totalSubTotal )}
										</td>
									</tr>
									<tr>
										<th className="">
											Tax(+){" "}
											<Edit
												size={15}
												className="cursor-pointer"
												hidden={!salesBasicInfo?.items?.length}
												onClick={handleTaxModalOpen}
											/>{" "}:
										</th>
										<td className="text-end fw-bolder">
											{getVatNumber().toFixed( 2 ) ?? 0}
										</td>
									</tr>
									<tr>
										<th className="">
											Discount(-){" "}
											<Edit
												size={15}
												className="cursor-pointer"
												hidden={!salesBasicInfo?.items?.length}
												onClick={handleDiscountModalOpen}
											/>{" "}:
										</th>
										<td className="text-end fw-bolder">
											{getDiscountOnType()}
										</td>
									</tr>
									<tr>
										<th className="h3 fw-bolder">Total :</th>
										<td className="text-end h3 fw-bolder">
											{numberWithCommas( ( totalSubTotal - getDiscountOnType() + getVatNumber() ).toFixed( 2 ) )}
										</td>
									</tr>
								</table>
							</Col>

						</Row>
					</div>

				</Container>

			</Card>


			{openProductModal &&
				<ItemForm
					open={openProductModal}
					toggleSidebar={() => setOpenProductModal( !openProductModal )}
				/>
			}

			{/* this is customer modal */}
			{openModal && <CustomerForm
				openModal={openModal}
				handleModalClosed={handleModalClosed}
				customerToggle={() => setOpenModal( !openModal )}
				customerDropDownChange={customerDropDownChange}
			/>
			}


			{/* this is discount modal */}
			{openDiscountModal && <DiscountForm
				openDiscountModal={openDiscountModal}
				handleDiscountModalClosed={handleDiscountModalClosed}
				discountToggle={() => setOpenDiscountModal( !openDiscountModal )}
				discountTypeData={discountTypeData}
				discountOnType={discountOnType}
			/>
			}
			{/* this is payment method modal */}
			{openPaymentMethodModal && <PaymentMethod
				totalAmount={( totalSubTotal - getDiscountOnType() + getVatNumber() ).toFixed( 2 )}
				openPaymentMethodModal={openPaymentMethodModal}
				handlePaymentModalClosed={handlePaymentModalClosed}
				paymentMethodToggle={() => setOpenPaymentMethodModal( !openPaymentMethodModal )}
				paymentMethodTypeData={paymentMethodTypeData}
			/>
			}


			{/* this is vat modal */}
			{openTaxModal && <VatForm
				openTaxModal={openTaxModal}
				handleTaxModalClosed={handleTaxModalClosed}
				vatToggle={() => setOpenTaxModal( !openTaxModal )}
				vatNumberData={vatNumberData}
				vatNumberAmount={vatNumberAmount}
			/>
			}

			{/* this is shipping modal */}
			{
				openShippingModal && <ShippingForm
					openShippingModal={openShippingModal}
					handleShippingModalClosed={handleShippingModalClosed}
					shippingToggle={() => setOpenShippingModal( !openShippingModal )}
				/>
			}

			{/* this is suspend modal */}

			{
				openSuspendModal && <NoteForm
					openSuspendModal={openSuspendModal}
					handleSuspendModalClosed={handleSuspendModalClosed}
					suspendToggle={() => setOpenSuspendModal( !openSuspendModal )}
					noteData={noteData}
				/>
			}

			{/* invoice modal */}
			{
				openInvoiceModal && <InvoiceView
					openInvoiceModal={openInvoiceModal}
					handleInvoiceModalClosed={handleInvoiceModalClosed}
					invoiceToggle={() => setOpenInvoiceModal( !openInvoiceModal )}
				/>
			}


			{sAlert && <CustomAlert />}

		</div>
	);
};

export default PosForm;

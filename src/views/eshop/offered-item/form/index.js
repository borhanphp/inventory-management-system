import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, Col, Label, Row } from 'reactstrap'
import * as yup from 'yup'
import { getAllItemsCm } from '../../../../redux/common/store'
import CustomDatePicker from '../../../../utility/custom/CustomDatePicker'
import FormContentLayout from '../../../../utility/custom/FormContentLayout'
import FormLayout from '../../../../utility/custom/FormLayout'
import InInput from '../../../../utility/custom/InInput'
import InSelect from '../../../../utility/custom/InSelect'
import { currentTime } from '../../../../utility/enums'
import OfferedItemList from '../list'
import { addOfferedItem, bindOfferedItemInfo, getAllOfferedItems, updateOfferedItem } from '../store'
import { initialOfferedData } from '../store/model'

const OfferedItemForm = () => {
    const { offeredItemsBasicInfo } = useSelector( ( { offeredItems } ) => offeredItems );
    const { itemsDataCm } = useSelector( ( { commons } ) => commons );
    const dispatch = useDispatch()
    const [minDate, setMinDate] = useState( '' );


    const offerSchema = yup.object().shape( {
        itemId: offeredItemsBasicInfo?.itemId ? yup.string() : yup.string().required( 'itemId is Required!!!' ),
        offeredPrice: offeredItemsBasicInfo?.offeredPrice ? yup.string() : yup.string().required( 'itemId is Required!!!' ),
        stringStartDate: offeredItemsBasicInfo?.stringStartDate ? yup.string() : yup.string().required( 'itemId is Required!!!' ),
        stringEndDate: offeredItemsBasicInfo?.stringEndDate ? yup.string() : yup.string().required( 'itemId is Required!!!' ),
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( offerSchema )
    } );

    useEffect( () => {
        const today = new Date().toISOString().split( 'T' )[0];
        setMinDate( today );
        return () => {
            dispatch( bindOfferedItemInfo( offeredItemsBasicInfo ) )
        }
    }, [] );

    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        if ( name === "offeredPrice" ) {
            if ( value > offeredItemsBasicInfo?.itemId?.salesPrice ) {
                toast.error( 'Offer Price Should Be Less Then Sales Price' )
                return;
            }
        }
        dispatch( bindOfferedItemInfo( { ...offeredItemsBasicInfo, [name]: value } ) )
    }
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        dispatch( bindOfferedItemInfo( { ...offeredItemsBasicInfo, [name]: data, offeredPrice: 0 } ) )
    }
    const handleDateChange = ( data, name ) => {
        dispatch( bindOfferedItemInfo( { ...offeredItemsBasicInfo, [name]: data[0] } ) )
    }
    const handleClear = () => {
        dispatch( bindOfferedItemInfo( initialOfferedData ) )
    }

    const handleOnSubmit = () => {
        const { itemId, stringStartDate, stringEndDate, comments, offeredPrice } = offeredItemsBasicInfo;
        const submittedData = {
            ...offeredItemsBasicInfo,
            itemId: itemId.value,
            offeredPrice: +offeredPrice,
            stringStartDate: moment( stringStartDate ).format( 'DD-MM-YYYY' ) + ' ' + currentTime(),
            stringEndDate: moment( stringEndDate ).format( 'DD-MM-YYYY' ) + ' ' + currentTime(),
            comments: comments ?? "",
        }

        // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )

        dispatch( offeredItemsBasicInfo?.id ? updateOfferedItem( submittedData ) : addOfferedItem( submittedData ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    const paramObj = {
                        page: 1,
                        pageSize: 10
                    }
                    dispatch( getAllOfferedItems( paramObj ) )
                    dispatch( bindOfferedItemInfo( initialOfferedData ) )
                    toast.success( offeredItemsBasicInfo?.id ? `Updated Successfully` : 'Offered Item Created' );
                }

            } )

    }

    const handleOnFocus = () => {
        if ( !itemsDataCm.length ) {
            dispatch( getAllItemsCm() )
        }
    }

    return (
        <>
            {/* <ActionMenu>

            </ActionMenu> */}
            <Row className=''>
                <Col lg={4} className="" >
                    <Card className='earnings-card p-0' style={{ height: "80vh" }}>
                        <CardBody>
                            <FormLayout>
                                <FormContentLayout title="Add Offered Item">
                                    <Col xs={12}>
                                        <div >
                                            <InSelect
                                                label="Select Item"
                                                name="itemId"
                                                bsSize="sm"
                                                id="nameId"
                                                options={itemsDataCm}
                                                value={offeredItemsBasicInfo.itemId}
                                                onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                                onFocus={() => { handleOnFocus(); }}
                                                className={classNames( `erp-dropdown-select ${( errors && errors?.itemId && !offeredItemsBasicInfo?.itemId ) && 'is-invalid'}` )}

                                            />

                                            <InInput
                                                label="Original Price"
                                                name="originalPrice"
                                                bsSize="sm"
                                                id="originalPrice"
                                                type="number"
                                                disabled
                                                value={offeredItemsBasicInfo?.itemId?.salesPrice ?? 0}
                                                onChange={() => { }}
                                            />

                                            <InInput
                                                label="Offer Price"
                                                name="offeredPrice"
                                                bsSize="sm"
                                                id="offeredPrice"
                                                type="number"
                                                value={offeredItemsBasicInfo?.offeredPrice}
                                                onChange={( e ) => { handleOnChange( e ); }}
                                                onFocus={( e ) => { e.target.select() }}
                                                className={classNames( `erp-dropdown-select ${( errors && errors?.offeredPrice && !offeredItemsBasicInfo?.offeredPrice ) && 'is-invalid'}` )}
                                            />

                                            <Label
                                                className="mt-1"
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >Start Date</Label>
                                            <CustomDatePicker
                                                placeholder="Start Date"
                                                id="stringStartDate"
                                                minDate={minDate}
                                                name="stringStartDate"
                                                value={offeredItemsBasicInfo?.stringStartDate}
                                                onChange={( data ) => handleDateChange( data, "stringStartDate" )}
                                                invalid={( errors && errors?.stringStartDate && !offeredItemsBasicInfo?.stringStartDate ) && true}
                                            />

                                            <Label
                                                className="mt-1"
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >End Date</Label>
                                            <CustomDatePicker
                                                placeholder="End Date"
                                                id="stringEndDate"
                                                name="stringEndDate"
                                                minDate={offeredItemsBasicInfo?.stringStartDate}
                                                value={offeredItemsBasicInfo?.stringEndDate}
                                                onChange={( data ) => handleDateChange( data, "stringEndDate" )}
                                                invalid={( errors && errors?.stringEndDate && !offeredItemsBasicInfo?.stringEndDate ) && true}

                                            />


                                            <InInput
                                                label="Note"
                                                name="comments"
                                                bsSize="sm"
                                                id="comments"
                                                value={offeredItemsBasicInfo?.comments}
                                                onChange={( e ) => { handleOnChange( e ); }}
                                            />

                                        </div>

                                    </Col>
                                    <Col xs={12}>
                                        <Button
                                            color="secondary"
                                            size="sm"
                                            className='mt-1 float-end'
                                            onClick={() => { handleClear() }}
                                        >Clear</Button>

                                        {
                                            offeredItemsBasicInfo?.id &&
                                                offeredItemsBasicInfo?.id ?
                                                (
                                                    <Button
                                                        color="primary"
                                                        size="sm"
                                                        className='mt-1 float-end me-1'
                                                        // onClick={() => { handleOnSubmit() }}
                                                        onClick={handleSubmit( handleOnSubmit )}

                                                    >Update</Button>
                                                ) : (
                                                    <Button
                                                        color="primary"
                                                        size="sm"
                                                        className='mt-1 float-end me-1'
                                                        // onClick={() => { handleOnSubmit() }}
                                                        onClick={handleSubmit( handleOnSubmit )}

                                                    >Submit</Button>
                                                )
                                        }


                                    </Col>
                                </FormContentLayout>
                            </FormLayout>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={8}>
                    <OfferedItemList />
                </Col>
            </Row>
        </>
    )
}

export default OfferedItemForm
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { XSquare } from 'react-feather';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, FormGroup, Input, Label, NavItem, Row } from 'reactstrap';
import * as yup from 'yup';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { getAllCountriesCm, getAllZoneCm } from '../../../../redux/common/store';
import { API } from '../../../../services/api_endpoint';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { getAllAreaByFilter } from '../../area/store';
import { bindPartnerInfo, getPartnerById, updatePartner } from '../store';
import { initialPartnerData } from '../store/model';



const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];





const EditForm = () => {
    const { zoneDataCm, countriesData } = useSelector( ( { commons } ) => commons )
    const { partnerBasicInfo } = useSelector( ( { partners } ) => partners )
    const { allData } = useSelector( ( { area } ) => area )

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const ref = useRef();
    const location = useLocation();
    const { partnerId, currentPage, rowsPerPage } = location.state;

    useEffect( () => {
        dispatch( getPartnerById( partnerId ) );

        return () => {
            dispatch( bindPartnerInfo( initialPartnerData ) )
        }
    }, [] )


    ///For Validation Start
    const formSchema = yup.object().shape( {
        name: partnerBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
        country: partnerBasicInfo?.countryId ? yup.string() : yup.string().required( 'Country is Required!!!' ),
        zone: partnerBasicInfo?.zoneId ? yup.string() : yup.string().required( 'Zone is Required!!!' ),
        code: partnerBasicInfo?.code ? yup.string() : yup.string().required( 'Zone is Required!!!' ),
        businessType: partnerBasicInfo?.businessType ? yup.string() : yup.string().required( 'businessType is Required!!!' ),
        // paymentTerm: partnerBasicInfo?.paymentTerm ? yup.string() : yup.string().required( 'paymentTerm is Required!!!' )
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( formSchema )
    } );



    const handleNavigate = () => {
        navigate( '/partner-list' );
    }

    const handleInputOnChange = ( e ) => {
        const { name, value, type, checked } = e.target;
        if ( name === 'code' ) {
            if ( value.length > 6 ) {
                toast.error( 'Code must be less then 6 character' )
                return;
            } else {
                const updatedObj = {
                    ...partnerBasicInfo,
                    [name]: type === "checkbox" ? checked : type === "number" ? Number( value ) : value
                }
                dispatch( bindPartnerInfo( updatedObj ) );
            }
        } else if ( name === "paymentTerm" ) {
            if ( value < 0 ) {
                toast.error( 'Negative value not allowed!' )
                return;
            } else {
                const updatedObj = {
                    ...partnerBasicInfo,
                    [name]: type === "checkbox" ? checked : type === "number" ? Number( value ) : value
                }
                dispatch( bindPartnerInfo( updatedObj ) );
            }

        } else {
            const updatedObj = {
                ...partnerBasicInfo,
                [name]: type === "checkbox" ? checked : type === "number" ? Number( value ) : value
            }
            dispatch( bindPartnerInfo( updatedObj ) );
        }


    };

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        const updatedObj = {
            ...partnerBasicInfo,
            [name]: data
        }
        dispatch( bindPartnerInfo( updatedObj ) );
    };

    // handling logo upload with this function
    const handleLogoUpload = ( e ) => {
        const files = e.target.files[0];
        console.log( e.target.files )

        if ( files ) {
            const reader = new FileReader();
            reader.onload = ( event ) => {
                const base64Data = event.target.result;
                const logoData = {
                    name: files.name.split( "." ).shift(),
                    extension: `.` + files.type.split( "/" ).pop(),
                    data: base64Data,
                };

                if ( logoData ) {
                    dispatch( bindPartnerInfo( { ...partnerBasicInfo, logo: logoData } ) );
                }
            };
            reader.readAsDataURL( files );
        }
    };
    // handling images upload with this function
    const handleLogoWithDetailsUpload = ( e ) => {
        const files = e.target.files[0];
        console.log( e.target.files )

        if ( files ) {
            const reader = new FileReader();
            reader.onload = ( event ) => {
                const base64Data = event.target.result;
                const logoWithDetailsData = {
                    name: files.name.split( "." ).shift(),
                    extension: `.` + files.type.split( "/" ).pop(),
                    data: base64Data,
                };

                if ( logoWithDetailsData ) {
                    dispatch( bindPartnerInfo( { ...partnerBasicInfo, logoWithDetails: logoWithDetailsData } ) );
                }
            };
            reader.readAsDataURL( files );
        }
    };
    // handling images upload with this function
    const handleStampUpload = ( e ) => {
        const files = e.target.files[0];
        console.log( e.target.files )

        if ( files ) {
            const reader = new FileReader();
            reader.onload = ( event ) => {
                const base64Data = event.target.result;
                const stampData = {
                    name: files.name.split( "." ).shift(),
                    extension: `.` + files.type.split( "/" ).pop(),
                    data: base64Data,
                };

                if ( stampData ) {
                    dispatch( bindPartnerInfo( { ...partnerBasicInfo, stamp: stampData } ) );
                }
            };
            reader.readAsDataURL( files );
        }
    };
    // handling images upload with this function
    const handleSignUpload = ( e ) => {
        const files = e.target.files[0];
        console.log( e.target.files )

        if ( files ) {
            const reader = new FileReader();
            reader.onload = ( event ) => {
                const base64Data = event.target.result;
                const signData = {
                    name: files.name.split( "." ).shift(),
                    extension: `.` + files.type.split( "/" ).pop(),
                    data: base64Data,
                };

                if ( signData ) {
                    dispatch( bindPartnerInfo( { ...partnerBasicInfo, sign: signData } ) );
                }
            };
            reader.readAsDataURL( files );
        }
    };


    const handleOnSubmit = () => {
        const {
            isSupplier,
            isCustomer,
            isRepresentative,
            zoneId,
            areaId,
            businessType,
            paymentTerm,
            countryId,
            logo,
            logoWithDetails,
            stamp,
            sign,
            contactPersonOneName,
            contactPersonOneMobileNo,
            contactPersonTwoName,
            contactPersonTwoMobileNo,
            logoUrl,
            logoWithDetailsUrl,
            signUrl,
            stampUrl
        } = partnerBasicInfo;
        if ( !isSupplier && !isCustomer && !isRepresentative ) {
            toast.error( 'Select Partner Type' );
            return;
        }

        if ( contactPersonOneName && !contactPersonOneMobileNo ) {
            toast.error( 'Give the Contact Person One Mobile Number' )
            return;
        } else if ( !contactPersonOneName && contactPersonOneMobileNo ) {
            toast.error( 'Give the Contact Person One Name' )
            return
        }

        if ( contactPersonTwoName && !contactPersonTwoMobileNo ) {
            toast.error( 'Give the Contact Person Two Mobile Number' )
            return;
        } else if ( !contactPersonTwoName && contactPersonTwoMobileNo ) {
            toast.error( 'Give the Contact Person Two Name' )
            return
        }


        const submittedData = {
            ...partnerBasicInfo,
            zoneId: zoneId.value,
            areaId: areaId.value,
            businessType: businessType.value,
            paymentTerm: paymentTerm?.toString(),
            countryId: countryId.value,
            contactPersonOne: {
                name: contactPersonOneName ? contactPersonOneName : null,
                mobileNo: contactPersonOneMobileNo ? contactPersonOneMobileNo : null
            },
            contactPersonTwo: {
                name: contactPersonTwoName ? contactPersonTwoName : null,
                mobileNo: contactPersonTwoMobileNo ? contactPersonTwoMobileNo : null
            },
            logo: {
                name: logo?.name ? logo?.name : logoUrl,
                extension: logo.extension,
                data: logo.data,
                isBase: true,
                id: 0
            },
            isLogoUpdated: partnerBasicInfo?.logo?.data ? true : false,
            logoWithDetails: {
                name: logoWithDetails.name ? logoWithDetails.name : logoWithDetailsUrl,
                extension: logoWithDetails.extension,
                data: logoWithDetails.data,
                isBase: true,
                id: 0
            },
            isLogoWithDetailsUpdated: partnerBasicInfo?.logoWithDetails.data ? true : false,
            sign: {
                name: sign.name ? sign.name : signUrl,
                extension: sign.extension,
                data: sign.data,
                isBase: true,
                id: 0
            },
            isSignUpdated: partnerBasicInfo?.sign.data ? true : false,

            stamp: {
                name: stamp.name ? stamp.name : stampUrl,
                extension: stamp.extension,
                data: stamp.data,
                isBase: true,
                id: 0
            },
            isStampUpdated: partnerBasicInfo?.stamp.data ? true : false,

        }
        console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( updatePartner( submittedData ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                }
                navigate( '/partner-list' );
                dispatch( bindPartnerInfo( initialPartnerData ) )
                toast.success( 'Partner Updated' )
            } )
    };

    const handleClearSupplierForm = () => {
        dispatch( bindPartnerInfo( initialPartnerData ) );
    };

    const handleZoneOnFocus = () => {
        if ( !zoneDataCm.length ) {
            dispatch( getAllZoneCm() )
        }
    }

    const getCountries = () => {
        if ( !countriesData.length ) {
            dispatch( getAllCountriesCm() )
        }
    };

    useEffect( () => {
        localStorage.removeItem( "items" )
    }, [] )


    const businessTypes = [
        { label: 'Individual', value: "Individual" },
        { label: 'Corporate', value: "Corporate" }
    ];


    const handleLogoDelete = () => {
        dispatch( bindPartnerInfo( { ...partnerBasicInfo, logo: "", logoUrl: "" } ) );
        if ( ref.current ) {
            ref.current.value = {};
        }
    }
    const handleLogoDetailsDelete = () => {
        dispatch( bindPartnerInfo( { ...partnerBasicInfo, logoWithDetails: "", logoWithDetailsUrl: "" } ) );
        if ( ref.current ) {
            ref.current.value = {};
        }
    }
    const handleStampDelete = () => {
        dispatch( bindPartnerInfo( { ...partnerBasicInfo, stamp: "", stampUrl: "" } ) );
        if ( ref.current ) {
            ref.current.value = {};
        }
    }
    const handleSignDelete = () => {
        dispatch( bindPartnerInfo( { ...partnerBasicInfo, sign: "", signUrl: "" } ) );
        if ( ref.current ) {
            ref.current.value = {};
        }
    }

    console.log( 'console.test', partnerBasicInfo )
    // console.log( 'allData', allData )

    const paramsObj = {
        page: 1,
        pageSize: 10000
    }
    const getAreaOnFocus = () => {
        dispatch( getAllAreaByFilter( paramsObj ) )
    }

    return (
        <div>
            <ActionMenu
                title='Edit Partner'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        // onClick={handleOnSubmit}
                        onClick={handleSubmit( handleOnSubmit )}
                    >Save</Button>
                </NavItem>
                <NavItem className="" >
                    <Button
                        color='info'
                        size='sm'
                        onClick={() => { navigate( '/partner-list' ) }}
                    >View List</Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>
                <FormLayout>
                    <div className='mb-1'>
                        <FormContentLayout title="Basic Information">
                            <div className="">
                                <Row>
                                    <Col lg={2}>
                                        <p className='fw-bolder mt-1'>Partner Category :</p>
                                    </Col>
                                    <Col lg={1}>
                                        <FormGroup check className="mt-1">
                                            <Label check>
                                                <Input
                                                    type="checkbox"
                                                    name="isSupplier"
                                                    checked={partnerBasicInfo.isSupplier}
                                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                                />{" "}
                                                Supplier
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={1}>
                                        <FormGroup check className="mt-1">
                                            <Label check>
                                                <Input
                                                    type="checkbox"
                                                    name="isCustomer"
                                                    checked={partnerBasicInfo.isCustomer}
                                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                                />{" "}
                                                Customer
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                    <Col lg={1}>
                                        <FormGroup check className="mt-1">
                                            <Label check>
                                                <Input
                                                    type="checkbox"
                                                    name="isRepresentative"
                                                    checked={partnerBasicInfo.isRepresentative}
                                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                                />{" "}
                                                Representative
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                        </FormContentLayout>
                    </div>
                    <FormContentLayout>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpInput
                                label="Name"
                                classNames="mt-1"
                                name="name"
                                value={partnerBasicInfo.name}
                                onChange={( e ) => handleInputOnChange( e )}
                                className={classNames( `erp-dropdown-select ${( errors && errors?.name && !partnerBasicInfo?.name ) && 'is-invalid'}` )}

                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpInput
                                label="Short Code"
                                classNames="mt-1"
                                name="code"
                                value={partnerBasicInfo.code}
                                onChange={( e ) => handleInputOnChange( e )}
                                onFocus={( e ) => { e.target.select() }}
                                className={classNames( `erp-dropdown-select ${( errors && errors?.code && !partnerBasicInfo?.code ) && 'is-invalid'}` )}

                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpInput
                                label="Contact No."
                                classNames="mt-1"
                                name="mobileNo"
                                value={partnerBasicInfo.mobileNo}
                                onChange={( e ) => handleInputOnChange( e )}

                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpInput
                                label="Email"
                                classNames="mt-1"
                                name="email"
                                value={partnerBasicInfo.email ?? ""}
                                onChange={( e ) => handleInputOnChange( e )}

                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpInput
                                label="Fax"
                                classNames="mt-1"
                                name="fax"
                                value={partnerBasicInfo.fax}
                                onChange={( e ) => handleInputOnChange( e )}

                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpSelect
                                label="Business Type"
                                name="businessType"
                                options={businessTypes}
                                value={partnerBasicInfo.businessType}
                                onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.businessType && !partnerBasicInfo?.businessType ) && 'is-invalid'}` )}

                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpInput
                                label="Payment Term"
                                name="paymentTerm"
                                type="number"
                                className="text-end"
                                value={partnerBasicInfo.paymentTerm}
                                onFocus={( e ) => { e.target.select() }}
                                onChange={( e ) => { handleInputOnChange( e ); }}
                                classNames="mt-1"
                                // classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.paymentTerm && !partnerBasicInfo?.paymentTerm ) && 'is-invalid'}` )}
                                secondaryOption={
                                    <div>
                                        <ErpInput
                                            sideBySide={false}
                                            disabled
                                            name="bin"
                                            value="Days"
                                            onChange={() => ( {} )}

                                        />
                                    </div>
                                }
                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpInput
                                label="BIN"
                                classNames="mt-1"
                                name="bin"
                                value={partnerBasicInfo.bin}
                                onChange={( e ) => handleInputOnChange( e )}

                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpInput
                                label="Commission Rate"
                                classNames="mt-1"
                                name="commission"
                                className="text-end"
                                value={partnerBasicInfo.commission}
                                onChange={( e ) => handleInputOnChange( e )}
                                onFocus={( e ) => { e.target.select() }}
                            />
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                            <ErpInput
                                label="Discount"
                                classNames="mt-1"
                                name="discount"
                                className="text-end"
                                value={partnerBasicInfo.discount}
                                onChange={( e ) => handleInputOnChange( e )}
                                onFocus={( e ) => { e.target.select() }}
                            />
                        </Col>

                    </FormContentLayout>

                    {/* details information section */}
                    <div className='mt-3'>

                        <FormContentLayout title="Details Information">
                            <Col md={6} lg={4} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Country"
                                    name="countryId"
                                    options={countriesData}
                                    value={partnerBasicInfo.countryId}
                                    onFocus={() => { getCountries() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.country && !partnerBasicInfo?.countryId ) && 'is-invalid'}` )}
                                />

                            </Col>

                            <Col md={6} lg={4} xl={3} xxl={3}>
                                <ErpInput
                                    label="State/Division"
                                    classNames="mt-1"
                                    name="division"
                                    value={partnerBasicInfo.division}
                                    onChange={( e ) => handleInputOnChange( e )}
                                />

                            </Col>
                            <Col md={6} lg={4} xl={3} xxl={3}>
                                <ErpInput
                                    label="City"
                                    classNames="mt-1"
                                    name="city"
                                    value={partnerBasicInfo.city}
                                    onChange={( e ) => handleInputOnChange( e )}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.city && !partnerBasicInfo?.city ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={6} lg={4} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Zone"
                                    name="zoneId"
                                    options={zoneDataCm}
                                    value={partnerBasicInfo.zoneId}
                                    onFocus={() => { handleZoneOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.zone && !partnerBasicInfo?.zoneId ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={6} lg={4} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Area"
                                    name="areaId"
                                    options={allData}
                                    value={partnerBasicInfo.areaId}
                                    onFocus={() => { getAreaOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.zone && !partnerBasicInfo?.zoneId ) && 'is-invalid'}` )}
                                />
                            </Col>

                            <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                                <ErpInput
                                    label="Address"
                                    classNames="mt-1"
                                    name="addressLine"
                                    value={partnerBasicInfo.addressLine}
                                    onChange={( e ) => handleInputOnChange( e )}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.addressLine && !partnerBasicInfo?.addressLine ) && 'is-invalid'}` )}
                                />
                            </Col>

                            <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                                <ErpInput
                                    label="Postal Code"
                                    classNames="mt-1"
                                    name="postalCode"
                                    value={partnerBasicInfo.postalCode}
                                    onChange={( e ) => handleInputOnChange( e )}
                                />
                            </Col>

                            <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
                                <ErpInput
                                    label="Description"
                                    classNames="mt-1"
                                    name="note"
                                    type="textarea"
                                    value={partnerBasicInfo.note}
                                    onChange={( e ) => handleInputOnChange( e )}
                                />
                            </Col>

                        </FormContentLayout>

                    </div>
                    <div className='mt-3'>

                        <FormContentLayout title="Attachments">
                            <Col md={6} lg={4} xl={3} xxl={3}>
                                <div className="mt-1" style={{ position: "relative" }}>
                                    {
                                        partnerBasicInfo?.logo ?
                                            <img
                                                src={partnerBasicInfo?.logo?.data ? partnerBasicInfo?.logo?.data : `${API}/${partnerBasicInfo?.logoUrl?.split( '/' ).slice( 1 ).join( '/' )}`}
                                                // src={""}
                                                alt=""
                                                className='w-100'
                                                style={{
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            :
                                            <img
                                                src="/null-photo.png"
                                                alt=""
                                                className='w-100'
                                                style={{
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />


                                    }
                                    <span style={{ position: 'absolute', right: "0", top: "0" }}>
                                        <XSquare
                                            onClick={() => { handleLogoDelete() }}
                                            color='red'
                                            size={25}
                                            style={{ cursor: 'pointer', marginRight: '5px' }}

                                        />
                                    </span>
                                    <Label className='btn btn-light w-100 btn-sm mt-1'>
                                        Add Logo
                                        <input
                                            hidden
                                            type="file"
                                            ref={ref}
                                            // sideBySide={false}
                                            readOnly={true}
                                            value={''}
                                            onChange={( e ) => { handleLogoUpload( e ) }}
                                        />
                                    </Label>
                                </div>

                            </Col>


                            <Col md={6} lg={4} xl={3} xxl={3}>
                                <div className="mt-1" style={{
                                    position: 'relative'
                                }}>
                                    {
                                        partnerBasicInfo?.logoWithDetails ?
                                            <img
                                                src={partnerBasicInfo?.logoWithDetails?.data ? partnerBasicInfo?.logoWithDetails?.data : `${API}/${partnerBasicInfo?.logoWithDetailsUrl?.split( '/' ).slice( 1 ).join( '/' )}`}

                                                alt=""
                                                className='w-100'
                                                style={{
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            :
                                            <img
                                                src="/null-photo.png"
                                                alt=""
                                                className='w-100'
                                                style={{
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />

                                    }
                                    <span style={{ position: 'absolute', right: "0", top: "0" }}>
                                        <XSquare
                                            onClick={() => { handleLogoDetailsDelete() }}
                                            color='red'
                                            size={25}
                                            style={{ cursor: 'pointer', marginRight: '5px' }}

                                        />
                                    </span>
                                    <Label className='btn btn-light w-100 btn-sm mt-1'>
                                        Logo With Details
                                        <input
                                            hidden
                                            ref={ref}
                                            type="file"
                                            // sideBySide={false}
                                            readOnly={true}
                                            value={''}
                                            onChange={( e ) => { handleLogoWithDetailsUpload( e ) }}
                                        />
                                    </Label>
                                </div>

                            </Col>






                            <Col md={6} lg={4} xl={3} xxl={3}>
                                <div className="mt-1" style={{ position: "relative" }}>
                                    {
                                        partnerBasicInfo?.stamp ?
                                            <img
                                                src={partnerBasicInfo?.stamp?.data ? partnerBasicInfo?.stamp?.data : `${API}/${partnerBasicInfo?.stampUrl?.split( '/' ).slice( 1 ).join( '/' )}`}

                                                alt=""
                                                className='w-100'
                                                style={{
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            :
                                            <img
                                                src="/null-photo.png"
                                                alt=""
                                                className='w-100'
                                                style={{
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />

                                    }
                                    <span style={{ position: 'absolute', right: "0", top: "0" }}>
                                        <XSquare
                                            onClick={() => { handleStampDelete() }}
                                            color='red'
                                            size={25}
                                            style={{ cursor: 'pointer', marginRight: '5px' }}

                                        />
                                    </span>
                                    <Label className='btn btn-light w-100 btn-sm mt-1'>
                                        Stamp
                                        <input
                                            hidden
                                            type="file"
                                            ref={ref}

                                            // sideBySide={false}
                                            readOnly={true}
                                            value={''}
                                            onChange={( e ) => { handleStampUpload( e ) }}
                                        />
                                    </Label>
                                </div>
                            </Col>





                            <Col md={6} lg={4} xl={3} xxl={3}>
                                <div className="mt-1" style={{ position: "relative" }}>
                                    {
                                        partnerBasicInfo?.sign ?
                                            <img
                                                src={partnerBasicInfo?.sign?.data ? partnerBasicInfo?.sign?.data : `${API}/${partnerBasicInfo?.signUrl?.split( '/' ).slice( 1 ).join( '/' )}`}

                                                alt=""
                                                className='w-100'
                                                style={{
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            :
                                            <img
                                                src="/null-photo.png"
                                                alt=""
                                                className='w-100'
                                                style={{
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />

                                    }

                                    <span style={{ position: 'absolute', right: "0", top: "0" }}>
                                        <XSquare
                                            onClick={() => { handleSignDelete() }}
                                            color='red'
                                            size={25}
                                            style={{ cursor: 'pointer', marginRight: '5px' }}

                                        />
                                    </span>



                                    <Label className='btn btn-light w-100 btn-sm mt-1'>
                                        Sign
                                        <input
                                            hidden
                                            type="file"
                                            ref={ref}

                                            // sideBySide={false}
                                            readOnly={true}
                                            value={''}
                                            onChange={( e ) => { handleSignUpload( e ) }}
                                        />
                                    </Label>
                                </div>
                            </Col>


                        </FormContentLayout>

                    </div>
                    <div className='mt-3'>
                        <Row>
                            <Col md={6} className="p-1">
                                <FormContentLayout title="Contact Person One">
                                    <Col md={12}>
                                        <ErpInput
                                            classNames="mt-1"
                                            label="Name"
                                            placeholder="Name"
                                            sideBySide={false}
                                            name="contactPersonOneName"
                                            value={partnerBasicInfo.contactPersonOneName ?? ""}
                                            onChange={( e ) => { handleInputOnChange( e ) }}
                                        />
                                    </Col>
                                    <Col md={12}>
                                        <ErpInput
                                            classNames="mt-1"
                                            label="Mobile Number"
                                            placeholder="Mobile Number"
                                            sideBySide={false}
                                            name="contactPersonOneMobileNo"
                                            value={partnerBasicInfo.contactPersonOneMobileNo ?? ""}
                                            onChange={( e ) => { handleInputOnChange( e ) }}
                                        />
                                    </Col>
                                    {/* <Button
                  className='mt-2'
                  color="light"
                  size='sm'
                  onClick={() => { handleContactTwoModalOpen() }}
                >Add Contact Person One</Button> */}
                                </FormContentLayout>

                            </Col>
                            <Col md={6} className="p-1">
                                <div className='ps-1'>
                                    <FormContentLayout title="Contact Person Two">
                                        <Col md={12}>
                                            <ErpInput
                                                classNames="mt-1"
                                                label="Name"
                                                placeholder="Name"
                                                sideBySide={false}
                                                name="contactPersonTwoName"
                                                value={partnerBasicInfo.contactPersonTwoName ?? ""}
                                                onChange={( e ) => { handleInputOnChange( e ) }}
                                            />
                                        </Col>
                                        <Col md={12}>
                                            <ErpInput
                                                classNames="mt-1"
                                                label="Mobile Number"
                                                placeholder="Mobile Number"
                                                sideBySide={false}
                                                name="contactPersonTwoMobileNo"
                                                value={partnerBasicInfo.contactPersonTwoMobileNo ?? ""}
                                                onChange={( e ) => { handleInputOnChange( e ) }}
                                            />
                                        </Col>
                                        {/* <Button
                    className='mt-2 me-1'
                    color="light"
                    size='sm'
                    onClick={() => { handleContactOneModalOpen() }}
                  >Add Contact Person Two</Button> */}
                                    </FormContentLayout>
                                </div>
                            </Col>
                        </Row>

                    </div>
                </FormLayout >
            </div>
        </div >
    )
}

export default EditForm
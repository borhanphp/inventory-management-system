import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import * as yup from 'yup';
import { getAllCountriesCm, getAllZoneCm } from '../../../../redux/common/store';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { bindSupplierInfo, getSupplierByFilter, getSupplierById, updateSupplier } from '../store';
import { initialSupplierData } from '../store/model';



const SupplierEditForm = () => {
  const { zoneDataCm, countriesData } = useSelector( ( { commons } ) => commons )
  const { supplierBasicInfo } = useSelector( ( { suppliers } ) => suppliers )
  const [errorMsg, setErrorMsg] = useState( '' )
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const supplierId = location.state
  const { contactType,
    name,
    mobileNo,
    email,
    zoneId,
    businessType,
    note,
    addressLine,
    city,
    postalCode,
    division,
    countryId,
    paymentTerm,
    bin,
    commission,
    contactPersonOneName,
    contactPersonOneMobileNo,
    contactPersonTwoName,
    contactPersonTwoMobileNo,
  } = supplierBasicInfo;
  console.log( 'countryId', countryId )

  ///For Validation Start
  const formSchema = yup.object().shape( {
    name: supplierBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    mobileNo: supplierBasicInfo?.mobileNo?.length ? yup.string() : yup.string().required( 'Mobile No. is Required!!!' ),
    country: supplierBasicInfo?.countryId ? yup.string() : yup.string().required( 'Country is Required!!!' ),
    zone: supplierBasicInfo?.zoneId ? yup.string() : yup.string().required( 'Zone is Required!!!' ),
    businessType: supplierBasicInfo?.businessType ? yup.string() : yup.string().required( 'businessType is Required!!!' ),
    paymentTerm: supplierBasicInfo?.paymentTerm ? yup.string() : yup.string().required( 'paymentTerm is Required!!!' ),
    bin: supplierBasicInfo?.bin?.length ? yup.string() : yup.string().required( 'BIN is Required!!!' ),
    addressLine: supplierBasicInfo?.addressLine?.length ? yup.string() : yup.string().required( 'Address is Required!!!' ),
    city: supplierBasicInfo?.city?.length ? yup.string() : yup.string().required( 'city is Required!!!' ),
    email: supplierBasicInfo?.email?.length ? yup.string() : yup.string().required( 'email is Required!!!' ),
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( formSchema )
  } );

  ///For Validation End

  useEffect( () => {
    dispatch( getSupplierById( supplierId ) )
  }, [supplierId] )

  useEffect( () => {
    return () => {
      dispatch( bindSupplierInfo( initialSupplierData ) )

    }
  }, [] )

  const handleNavigate = () => {
    const paramObj = {
      page: 1,
      pageSize: 10
    }
    dispatch( getSupplierByFilter( paramObj ) )
    navigate( '/catalogue/supplier/list' );
  }

  const handleInputOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...supplierBasicInfo,
      [name]: value
    }
    dispatch( bindSupplierInfo( updatedObj ) );
  };

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    const updatedObj = {
      ...supplierBasicInfo,
      [name]: data
    }
    dispatch( bindSupplierInfo( updatedObj ) );
  };

  const handleOnSubmit = () => {
    const { contactType, zoneId, businessType, paymentTerm, countryId } = supplierBasicInfo;
    const submittedData = {
      ...supplierBasicInfo,
      contactType: contactType.value,
      zoneId: zoneId.value,
      businessType: businessType.value,
      countryId: countryId.value,
      paymentTerm: paymentTerm.value,
      contactPersonOne: {
        name: contactPersonOneName ? contactPersonOneName : null,
        mobileNo: contactPersonOneMobileNo ? contactPersonOneMobileNo : null
      },
      contactPersonTwo: {
        name: contactPersonTwoName ? contactPersonTwoName : null,
        mobileNo: contactPersonTwoMobileNo ? contactPersonTwoMobileNo : null
      }
    }
    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( updateSupplier( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: 1,
            pageSize: 10
          }
          dispatch( getSupplierByFilter( paramObj ) )
          toast.success( 'Updated Successfully' )
          navigate( '/catalogue/supplier/list' );

        }

      } )
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

  const payTermOptions = [
    { label: 'Daily', value: "Daily" },
    { label: 'Weekly', value: "Weekly" },
    { label: 'Monthly', value: "Monthly" }
  ];
  const businessTypes = [
    { label: 'Corporate', value: "Corporate" },
    { label: 'Retailer', value: "Retailer" },
    { label: 'Supplier', value: "Supplier" },
    { label: 'Whole', value: "Whole" },
    { label: 'Walk_In', value: "Walk_In" }
  ];
  const contactTypes = [
    { label: 'Both', value: "Both" },
    { label: 'Supplier', value: "Supplier" }
  ];


  return (
    <div>
      <FormLayout>
        <div className='text-end'>
          <Button
            color='success'
            size='sm'
            onClick={handleSubmit( handleOnSubmit )}
          >Update</Button>
          <Button
            className='ms-1'
            color='info'
            size='sm'
            onClick={() => { handleNavigate(); }}
          >Back</Button>
        </div>
        <FormContentLayout title="Basic Information">
          <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
            <ErpSelect
              label="Supplier Types"
              classNames="mt-1"
              name="contactType"
              options={contactTypes}
              value={contactType}
              onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            />

            <ErpSelect
              label="Payment Term"
              name="paymentTerm"
              value={paymentTerm}
              options={payTermOptions}
              onChange={( data, e ) => { handleDropDownChange( data, e ); }}
              classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.paymentTerm && !supplierBasicInfo?.paymentTerm ) && 'is-invalid'}` )}

            />

          </Col>


          <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
            <ErpInput
              label="Supplier Name"
              classNames="mt-1"
              name="name"
              value={name}
              onChange={( e ) => handleInputOnChange( e )}
              className={classNames( `erp-dropdown-select ${( errors && errors?.name && !supplierBasicInfo?.name ) && 'is-invalid'}` )}

            />

            <ErpSelect
              label="Business Type"
              name="businessType"
              options={businessTypes}
              value={businessType}
              onChange={( data, e ) => { handleDropDownChange( data, e ); }}
              classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.businessType && !supplierBasicInfo?.businessType ) && 'is-invalid'}` )}

            />

          </Col>

          <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
            <ErpInput
              label="Mobile No."
              classNames="mt-1"
              name="mobileNo"
              value={mobileNo}
              onChange={( e ) => handleInputOnChange( e )}
              className={classNames( `erp-dropdown-select ${( errors && errors?.mobileNo && !supplierBasicInfo?.mobileNo ) && 'is-invalid'}` )}

            />
            <ErpInput
              label="BIN"
              classNames="mt-1"
              name="bin"
              value={bin}
              onChange={( e ) => handleInputOnChange( e )}
              className={classNames( `erp-dropdown-select ${( errors && errors?.bin && !supplierBasicInfo?.bin ) && 'is-invalid'}` )}

            />
          </Col>

          <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
            <ErpInput
              label="Email"
              classNames="mt-1"
              name="email"
              value={email}
              onChange={( e ) => handleInputOnChange( e )}
              className={classNames( `erp-dropdown-select ${( errors && errors?.email && !supplierBasicInfo?.email ) && 'is-invalid'}` )}

            />
            <ErpInput
              label="Commission"
              classNames="mt-1"
              name="commission"
              value={commission}
              onChange={( e ) => handleInputOnChange( e )}
            />

          </Col>

        </FormContentLayout>

        {/* details information section */}
        <div className='mt-3'>

          <FormContentLayout title="Details Information">
            <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
              <ErpInput
                label="Address"
                classNames="mt-1"
                name="addressLine"
                value={addressLine}
                onChange={( e ) => handleInputOnChange( e )}
                className={classNames( `erp-dropdown-select ${( errors && errors?.addressLine && !supplierBasicInfo?.addressLine ) && 'is-invalid'}` )}

              />

              <ErpSelect
                label="Country"
                name="countryId"
                options={countriesData}
                value={countryId}
                onFocus={() => { getCountries() }}
                onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.country && !supplierBasicInfo?.countryId ) && 'is-invalid'}` )}

              />
            </Col>

            <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
              <ErpInput
                label="City"
                classNames="mt-1"
                name="city"
                value={city}
                onChange={( e ) => handleInputOnChange( e )}
                className={classNames( `erp-dropdown-select ${( errors && errors?.city && !supplierBasicInfo?.city ) && 'is-invalid'}` )}

              />

              <ErpInput
                label="Postal Code"
                classNames="mt-1"
                name="postalCode"
                value={postalCode}
                onChange={( e ) => handleInputOnChange( e )}
              />


            </Col>

            <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>


              <ErpInput
                label="Division"
                classNames="mt-1"
                name="division"
                value={division}
                onChange={( e ) => handleInputOnChange( e )}
              />

              <ErpInput
                label="Note"
                classNames="mt-1"
                name="note"
                value={note}
                onChange={( e ) => handleInputOnChange( e )}
              />
            </Col>

            <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>

              <ErpSelect
                label="Zone"
                name="zoneId"
                options={zoneDataCm}
                value={zoneId}
                onFocus={() => { handleZoneOnFocus() }}
                onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.zone && !supplierBasicInfo?.zoneId ) && 'is-invalid'}` )}

              />
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
                    value={contactPersonOneName}
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
                    value={contactPersonOneMobileNo}
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
                      value={contactPersonTwoName}
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
                      value={contactPersonTwoMobileNo}
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
    </div >
  );
};

export default SupplierEditForm;
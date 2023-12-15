import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import * as yup from 'yup';
import { getAllZoneCm } from '../../../../redux/common/store';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { locationJson } from '../../../../utility/enums';
import { bindCustomerInfo, getCustomerByFilter, getCustomerById, updateCustomer } from '../store';
import { initialCustomerData } from '../store/model';



const CustomerEditForm = () => {
  const addressData = useMemo( () => locationJson, [] );
  const { zoneDataCm } = useSelector( ( { commons } ) => commons )
  const { customerBasicInfo } = useSelector( ( { customers } ) => customers )
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const customerId = location.state;
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
  } = customerBasicInfo;

  ///For Validation Start
  const formSchema = yup.object().shape( {
    name: customerBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    mobileNo: customerBasicInfo?.mobileNo?.length ? yup.string() : yup.string().required( 'Mobile No. is Required!!!' ),
    bin: customerBasicInfo?.contactType?.value === 'Both' ? customerBasicInfo?.bin?.length ? yup.string() : yup.string().required( 'Mobile No. is Required!!!' ) : yup.string(),
    address: customerBasicInfo?.addressLine?.length ? yup.string() : yup.string().required( 'addressLine No. is Required!!!' ),
    country: customerBasicInfo?.countryId ? yup.string() : yup.string().required( 'Country is Required!!!' ),
    zone: customerBasicInfo?.zoneId ? yup.string() : yup.string().required( 'Zone is Required!!!' ),
    businessType: customerBasicInfo?.businessType ? yup.string() : yup.string().required( 'businessType is Required!!!' ),
    paymentTerm: customerBasicInfo?.paymentTerm ? yup.string() : yup.string().required( 'paymentTerm is Required!!!' ),
    email: customerBasicInfo?.email?.length ? yup.string() : yup.string().required( 'email is Required!!!' ),

  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( formSchema )
  } );

  ///For Validation End


  useEffect( () => {
    dispatch( getCustomerById( customerId ) )
  }, [customerId] )

  useEffect( () => {
    return () => {
      dispatch( bindCustomerInfo( initialCustomerData ) )
    }
  }, [] )

  const handleInputOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...customerBasicInfo,
      [name]: value
    }
    dispatch( bindCustomerInfo( updatedObj ) );
  };

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    const updatedObj = {
      ...customerBasicInfo,
      [name]: data
    }
    dispatch( bindCustomerInfo( updatedObj ) );
  };

  const handleOnSubmit = () => {
    const { contactType, zoneId, businessType, paymentTerm, email } = customerBasicInfo;
    const submittedData = {
      ...customerBasicInfo,
      contactType: contactType.value,
      email: email ? email : null,
      zoneId: zoneId.value,
      businessType: businessType.value,
      countryId: 1,
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
    // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( updateCustomer( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        }
        const paramObj = {
          page: 1,
          pageSize: 10
        }
        dispatch( getCustomerByFilter( paramObj ) );
        navigate( '/sales/customer/list' )
        toast.success( 'Updated Successfully' );
      } )
  };


  const handleZoneOnFocus = () => {
    if ( !zoneDataCm.length ) {
      dispatch( getAllZoneCm() )
    }
  }

  const payTermOptions = [
    { label: 'Daily', value: "Daily" },
    { label: 'Weekly', value: "Weekly" },
    { label: 'Monthly', value: "Monthly" }
  ];
  const businessTypes = [
    { label: 'Retailer', value: "Retailer" },
    { label: 'Whole', value: "Whole" },
    { label: 'Walk_In', value: "Walk_In" }
  ];
  const contactTypesOption = [
    { label: 'Both', value: "Both" },
    { label: 'Customer', value: "Customer" }
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
            onClick={() => { navigate( -1 ); }}
          >Back</Button>
        </div>
        <FormContentLayout title="Basic Information">
          <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
            <ErpSelect
              label="Customer Types"
              classNames="mt-1"
              name="contactType"
              options={contactTypesOption}
              value={contactType}
              onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            />

            <ErpSelect
              label="Payment Term"
              name="paymentTerm"
              value={paymentTerm}
              options={payTermOptions}
              onChange={( data, e ) => { handleDropDownChange( data, e ); }}
              classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.paymentTerm && !customerBasicInfo?.paymentTerm ) && 'is-invalid'}` )}
            />

          </Col>


          <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
            <ErpInput
              label="Customer Name"
              classNames="mt-1"
              name="name"
              value={name}
              onChange={( e ) => handleInputOnChange( e )}
              className={classNames( `erp-dropdown-select ${( errors && errors?.name && !customerBasicInfo?.name ) && 'is-invalid'}` )}
            />

            <ErpSelect
              label="Business Type"
              name="businessType"
              options={businessTypes}
              value={businessType}
              onChange={( data, e ) => { handleDropDownChange( data, e ); }}
              classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.businessType && !customerBasicInfo?.businessType ) && 'is-invalid'}` )}

            />

          </Col>

          <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
            <ErpInput
              label="Mobile No."
              classNames="mt-1"
              name="mobileNo"
              value={mobileNo}
              onChange={( e ) => handleInputOnChange( e )}
              className={classNames( `erp-dropdown-select ${( errors && errors?.mobileNo && !customerBasicInfo?.mobileNo ) && 'is-invalid'}` )}

            />

            {
              contactType?.label &&
                contactType?.label === 'Both' ?
                <ErpInput
                  label="BIN"
                  classNames="mt-1"
                  name="bin"
                  value={bin}
                  onChange={( e ) => handleInputOnChange( e )}
                  className={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.bin && !customerBasicInfo?.bin ) && 'is-invalid'}` )}

                />
                : ""}
          </Col>

          <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
            <ErpInput
              label="Email"
              classNames="mt-1"
              name="email"
              value={email}
              onChange={( e ) => handleInputOnChange( e )}
              className={classNames( `erp-dropdown-select ${( errors && errors?.email && !customerBasicInfo?.email ) && 'is-invalid'}` )}

            />
            {
              contactType?.label &&
                contactType?.label === 'Both' ?
                <ErpInput
                  label="Commission"
                  classNames="mt-1"
                  name="commission"
                  value={commission}
                  onChange={( e ) => handleInputOnChange( e )}
                />
                : ""
            }


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
                onChange={( e ) => { handleInputOnChange( e ) }}
                className={classNames( `erp-dropdown-select ${( errors && errors?.address && !customerBasicInfo?.addressLine ) && 'is-invalid'}` )}

              />

              <ErpSelect
                label="Country"
                name="countryId"
                options={addressData}
                classNamePrefix='dropdown'
                value={countryId}
                onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.country && !customerBasicInfo?.countryId ) && 'is-invalid'}` )}

              />
            </Col>

            <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3}>
              <ErpInput
                label="City"
                classNames="mt-1"
                name="city"
                value={city}
                onChange={( e ) => handleInputOnChange( e )}
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
                classNames={classNames( `mt-1 erp-dropdown-select ${( errors && errors?.zone && !customerBasicInfo?.zoneId ) && 'is-invalid'}` )}
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

export default CustomerEditForm;
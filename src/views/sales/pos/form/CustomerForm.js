import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import ErpInput from "../../../../utility/custom/ErpInput";
import { addNewCustomer } from "../../customer/store";

const initialState = {
  name: "",
  mobileNo: ""
}
const CustomerForm = ( { openModal, handleModalClosed, customerToggle, customerDropDownChange } ) => {

  const dispatch = useDispatch();
  const [formData, setFormData] = useState( initialState );

  useEffect( () => {
    return () => {
      setFormData( initialState )
    }
  }, [] )
  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    setFormData( { ...formData, [name]: value } );
  }

  const handleOnSubmit = () => {
    if ( !formData?.mobileNo?.length ) {
      toast.error( 'Mobile Number Needed' );
      return;
    }
    dispatch( addNewCustomer( formData ) )
      .then( ( res ) => {
        const name = res?.payload?.name;
        const mobileNo = res?.payload?.mobileNo;
        const customerId = res?.payload?.id;
        const error409 = res?.error?.message?.includes( '409' );
        if ( error409 ) {
          toast.error( 'Customer already exists' );
          return;
        }

        const newData = {
          ...res?.payload,
          label: mobileNo + ' ' + name,
          value: customerId
        }

        const newE = {
          action: "select-option",
          name: "customerId",
          option: undefined
        }
        customerDropDownChange( newData, newE )
        customerToggle();
        toast.success( 'Customer added' )

      } )
  }

  const handleClear = () => {
    setFormData( initialState )
  }
  return (
    <Modal
      isOpen={openModal}
      onClosed={handleModalClosed}
      toggle={customerToggle}
      className="modal-dialog-centered modal-md"
    >
      <ModalHeader
        className="bg-light"
        toggle={customerToggle}
      >
        Add New Customer
      </ModalHeader>
      <ModalBody className="px-5 pb-5">
        <Row tag="form">

          <Col md={12} className="mt-1">
            <ErpInput
              label="Name"
              name="name"
              placeholder="Name"
              sideBySide={false}
              value={formData.name}
              onChange={( e ) => { handleOnChange( e ) }}
            />
          </Col>

          <Col md={12} className="mt-1">
            <ErpInput
              label="Mobile No."
              placeholder="Mobile No."
              name="mobileNo"
              sideBySide={false}
              value={formData.mobileNo}
              onChange={( e ) => { handleOnChange( e ) }}
            />
          </Col>

          <Col className="text-center mt-2 float-end" xs={12}>
            <div className="float-end">
              <Button
                size="sm"
                color="primary"
                className="me-1"
                onClick={() => { handleOnSubmit() }}
              >
                Save
              </Button>
              <Button
                size="sm"
                type="reset"
                outline
                onClick={() => { handleClear() }}
              >
                Clear
              </Button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>


  );
};

export default CustomerForm;

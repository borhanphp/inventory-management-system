import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import InInput from "../../../../utility/custom/InInput";
import { bindBuyerInfo, getAllBuyerByFilter, updateBuyer } from "../store";

const BuyerEditForm = ( { editFormOpen, toggleEditSidebar, currentPage } ) => {
  const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );
  const dispatch = useDispatch();


  const buyerSchema = yup.object().shape( {
    type: buyerBasicInfo?.type ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    name: buyerBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    address: buyerBasicInfo?.address?.length ? yup.string() : yup.string().required( 'address is Required!!!' ),
    code: buyerBasicInfo?.code?.length ? yup.string() : yup.string().required( 'swiftCode is Required!!!' ),
    contactNo: buyerBasicInfo?.contactNo?.length ? yup.string() : yup.string().required( 'accountNo is Required!!!' ),
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( buyerSchema )
  } );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...buyerBasicInfo,
      [name]: value
    };
    dispatch( bindBuyerInfo( updatedObj ) );
  };

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    dispatch( bindBuyerInfo( { ...buyerBasicInfo, [name]: data } ) )
  }


  const handleOnSubmit = () => {
    const { type, name } = buyerBasicInfo;
    const submittedData = {
      ...buyerBasicInfo,
      name: name.trim(),
      type: type.value
    }
    dispatch( updateBuyer( submittedData ) )
      .then( () => {
        const paramObj = {
          page: currentPage,
          pageSize: 10
        }
        dispatch( getAllBuyerByFilter( paramObj ) )
        toggleEditSidebar()
        toast.success( 'Buyer/Consignee Updated Successfully' )
      } )
  };


  const optionsData = [
    { label: "Both", value: "Both" },
    { label: "Buyer", value: "Buyer" },
    { label: "Consignee", value: "Consignee" }
  ]

  return (
    <>
      <Sidebar
        size="lg"
        open={editFormOpen}
        title="Edit Buyer"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleEditSidebar}
      >
        <div>

          <ErpSelect
            label="Type"
            id="type"
            name="type"
            options={optionsData}
            sideBySide={false}
            value={buyerBasicInfo.type}
            onChange={( data, e ) => handleDropDownChange( data, e )}
            classNames={classNames( `erp-dropdown-select ${( errors && errors?.type && !buyerBasicInfo?.type ) && 'is-invalid'}` )}

          />

          <InInput
            label="Name"
            name="name"
            bsSize="sm"
            id="name"
            value={buyerBasicInfo?.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !buyerBasicInfo?.name?.length ) && 'is-invalid'}` )}
          />

          <InInput
            label="Address"
            name="address"
            bsSize="sm"
            id="address"
            value={buyerBasicInfo.address}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.address && !buyerBasicInfo?.address?.length ) && 'is-invalid'}` )}
          />

          <InInput
            label="Code"
            name="code"
            bsSize="sm"
            id="code"
            value={buyerBasicInfo.code}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.code && !buyerBasicInfo?.code?.length ) && 'is-invalid'}` )}
          />

          <InInput
            label="Contact No"
            name="contactNo"
            bsSize="sm"
            id="contactNo"
            value={buyerBasicInfo.contactNo}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.contactNo && !buyerBasicInfo?.contactNo?.length ) && 'is-invalid'}` )}
          />

          <InInput
            label="Note"
            name="note"
            bsSize="sm"
            id="note"
            type="textarea"
            value={buyerBasicInfo.note}
            onChange={( e ) => { handleOnChange( e ); }}
          />

        </div>
        <div className="mt-1">
          <Button type="submit" size="sm" className="me-1" color="primary"
            // onClick={() => { handleOnSubmit(); }}
            onClick={handleSubmit( handleOnSubmit )}
          >
            Update
          </Button>
          <Button type="reset" size="sm" color="secondary" outline onClick={toggleEditSidebar}>
            Cancel
          </Button>
        </div>
      </Sidebar>

    </>
  );
};

export default BuyerEditForm;

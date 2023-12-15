import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import InInput from "../../../../utility/custom/InInput";
import { bindBankInfo, getAllBankByFilter, updateBank } from "../store";
import { initialBankData } from "../store/model";

const BankEditForm = ( { editFormOpen, toggleEditSidebar, currentPage } ) => {
  const { bankBasicInfo } = useSelector( ( { banks } ) => banks );
  const { countriesData } = useSelector( ( { commons } ) => commons );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState( false );
  const [submitted, setSubmitted] = useState( false );


  const bankSchema = yup.object().shape( {
    bankName: bankBasicInfo?.bankName?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    address: bankBasicInfo?.address?.length ? yup.string() : yup.string().required( 'address is Required!!!' ),
    swiftCode: bankBasicInfo?.swiftCode?.length ? yup.string() : yup.string().required( 'swiftCode is Required!!!' ),
    accountNo: bankBasicInfo?.accountNo?.length ? yup.string() : yup.string().required( 'accountNo is Required!!!' ),

  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( bankSchema )
  } );



  useEffect( () => {
    if ( submitted ) {
      dispatch( bindBankInfo( initialBankData ) );
    }
  }, [submitted] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...bankBasicInfo,
      [name]: value
    };
    dispatch( bindBankInfo( updatedObj ) );
  };


  const handleOnSubmit = () => {
    const { name } = bankBasicInfo;
    const submittedData = {
      ...bankBasicInfo,
      name: name?.trim()
    }
    dispatch( updateBank( submittedData ) )
      .then( () => {
        const paramObj = {
          page: currentPage,
          pageSize: 10
        }
        dispatch( getAllBankByFilter( paramObj ) )
        toggleEditSidebar()
        toast.success( 'Bank Updated Successfully' )
      } )
  };



  return (
    <>
      <Sidebar
        size="lg"
        open={editFormOpen}
        title="Edit Bank"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleEditSidebar}
      >
        <div>
          <InInput
            label="Bank Name"
            name="bankName"
            bsSize="sm"
            id="bankName"
            value={bankBasicInfo?.bankName}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.bankName && !bankBasicInfo?.bankName?.length ) && 'is-invalid'}` )}
          />

          <InInput
            label="Address"
            name="address"
            bsSize="sm"
            id="address"
            value={bankBasicInfo.address}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.address && !bankBasicInfo?.address?.length ) && 'is-invalid'}` )}
          />

          <InInput
            label="Swift Code"
            name="swiftCode"
            bsSize="sm"
            id="swiftCode"
            value={bankBasicInfo.swiftCode}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.swiftCode && !bankBasicInfo?.swiftCode?.length ) && 'is-invalid'}` )}
          />

          <InInput
            label="Account No"
            name="accountNo"
            bsSize="sm"
            id="accountNo"
            value={bankBasicInfo.accountNo}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.accountNo && !bankBasicInfo?.accountNo?.length ) && 'is-invalid'}` )}
          />

          <InInput
            label="Beneficiary Name"
            name="beneficiaryName"
            bsSize="sm"
            id="beneficiaryName"
            value={bankBasicInfo.beneficiaryName}
            onChange={( e ) => { handleOnChange( e ); }}
          />

          <InInput
            label="Beneficiary Address"
            name="beneficiaryAddress"
            bsSize="sm"
            id="beneficiaryAddress"
            value={bankBasicInfo.beneficiaryAddress}
            onChange={( e ) => { handleOnChange( e ); }}
          />


          <InInput
            label="Note"
            name="note"
            bsSize="sm"
            id="note"
            type="textarea"
            value={bankBasicInfo.note}
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

export default BankEditForm;

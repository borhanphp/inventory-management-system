import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import { getAllCostingHeadCm, getAllCurrencyCm, getAllScCm } from "../../../../redux/common/store";
import ErpInput from "../../../../utility/custom/ErpInput";
import ErpSelect from "../../../../utility/custom/ErpSelect";
import InInput from "../../../../utility/custom/InInput";
import { addNewScPayment, bindScPaymentInfo, getAllScPaymentByFilter } from "../store";
import { initialScPaymentData } from "../store/model";


const ScPaymentForm = ( { open, toggleSidebar, handleBankFromOpen } ) => {
  const { scPaymentBasicInfo } = useSelector( ( { scPayments } ) => scPayments );
  const { scDataCm, costingHeadDataCm, currencyDataCm } = useSelector( ( { commons } ) => commons );
  const dispatch = useDispatch();

  const scPaymentSchema = yup.object().shape( {
    scId: scPaymentBasicInfo?.scId ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    headId: scPaymentBasicInfo?.headId ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    currencyId: scPaymentBasicInfo?.currencyId ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    currencyRate: scPaymentBasicInfo?.currencyRate ? yup.string() : yup.string().required( 'Name is Required!!!' ),
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( scPaymentSchema )
  } );


  useEffect( () => {
    return () => {
      bindScPaymentInfo( initialScPaymentData )
    }
  }, [] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...scPaymentBasicInfo,
      [name]: value
    };
    dispatch( bindScPaymentInfo( updatedObj ) );
  };

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    dispatch( bindScPaymentInfo( { ...scPaymentBasicInfo, [name]: data } ) )
  }

  const handleOnSubmit = () => {
    const { scId, headId, amount, currencyId, currencyRate, date, note } = scPaymentBasicInfo;
    const submittedData = {
      scId: scId?.value,
      date: date,
      headId: headId?.value,
      currencyId: currencyId?.value ? currencyId?.value : null,
      currencyRate: +currencyRate,
      amount: +amount,
      note: note
    }

    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( addNewScPayment( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: 1,
            pageSize: 10
          }
          dispatch( getAllScPaymentByFilter( paramObj ) )
          toggleSidebar()
          toast.success( 'New SC Payment Added' )
        }

      } )
  };


  const handleReset = () => {
    reset();
    dispatch( bindScPaymentInfo( initialScPaymentData ) );

  };


  const paramObj = {
    page: 1,
    pageSize: 100000000
  }
  const getScDataOnFocus = () => {
    if ( !scDataCm.length ) {
      dispatch( getAllScCm( paramObj ) )
    }
  }

  const getCurrencyDataOnFocus = () => {
    if ( !currencyDataCm.length ) {
      dispatch( getAllCurrencyCm( paramObj ) )
    }
  }

  const getCostingHeadDataOnFocus = () => {
    dispatch( getAllCostingHeadCm( paramObj ) )
  }

  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Payments"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        onClose={handleBankFromOpen}
      >
        <div>
          <ErpSelect
            label="SC Number"
            sideBySide={false}
            name="scId"
            options={scDataCm}
            value={scPaymentBasicInfo.scId}
            onFocus={() => { getScDataOnFocus() }}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.scId && !scPaymentBasicInfo?.scId ) && 'is-invalid'}` )}
          />

          <ErpSelect
            label="Costing Head ( Payment )"
            sideBySide={false}
            name="headId"
            classNames="mt-1"
            options={costingHeadDataCm?.filter( cost => cost?.type === "Payment" )}
            value={scPaymentBasicInfo.headId}
            onFocus={() => { getCostingHeadDataOnFocus() }}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.headId && !scPaymentBasicInfo?.headId ) && 'is-invalid'}` )}
          />

          <ErpInput
            sideBySide={false}
            label="Date"
            name="date"
            type="date"
            value={scPaymentBasicInfo.date}
            onChange={( e ) => { handleOnChange( e ); }}
          />

          <ErpSelect
            label="Currency"
            sideBySide={false}
            name="currencyId"
            classNames="mt-1"
            options={currencyDataCm}
            value={scPaymentBasicInfo.currencyId}
            onFocus={() => { getCurrencyDataOnFocus() }}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.currencyId && !scPaymentBasicInfo?.currencyId ) && 'is-invalid'}` )}
          />

          <ErpInput
            sideBySide={false}
            label="Currency Rate"
            name="currencyRate"
            type="number"
            value={scPaymentBasicInfo.currencyRate}
            onFocus={( e ) => { e.target.select() }}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `text-end erp-dropdown-select ${( errors && errors?.currencyRate && !scPaymentBasicInfo?.currencyRate ) && 'is-invalid'}` )}
          />

          <ErpInput
            sideBySide={false}
            label="Amount"
            name="amount"
            type="number"
            value={scPaymentBasicInfo.amount}
            onFocus={( e ) => { e.target.select() }}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `text-end erp-dropdown-select ${( errors && errors?.amount && !scPaymentBasicInfo?.amount ) && 'is-invalid'}` )}

          />

          <InInput
            label="Note"
            name="note"
            bsSize="sm"
            id="note"
            type="textarea"
            value={scPaymentBasicInfo.note}
            onChange={( e ) => { handleOnChange( e ); }}
          />

        </div>
        <div className="mt-1">
          <Button type="submit" size="sm" className="me-1" color="primary"
            // onClick={() => { handleOnSubmit(); }}
            onClick={handleSubmit( handleOnSubmit )}
          >
            Submit
          </Button>
          <Button type="reset" size="sm" color="secondary" outline onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Sidebar>

    </>
  );
};

export default ScPaymentForm;

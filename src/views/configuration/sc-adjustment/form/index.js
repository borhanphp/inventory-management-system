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
import { addNewScAdjustment, bindScAdjustmentInfo, getAllScAdjustmentByFilter, getScByIdForAdjustment } from "../store";
import { initialScAdjustmentData } from "../store/model";


const ScPaymentForm = ( { open, toggleSidebar, handleBankFromOpen } ) => {
  const { scAdjustmentBasicInfo } = useSelector( ( { scAdjustments } ) => scAdjustments );
  const { scDataCm, costingHeadDataCm, currencyDataCm } = useSelector( ( { commons } ) => commons );
  const dispatch = useDispatch();

  const scPaymentSchema = yup.object().shape( {
    scId: scAdjustmentBasicInfo?.scId ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    headId: scAdjustmentBasicInfo?.headId ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    currencyId: scAdjustmentBasicInfo?.currencyId ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    currentCurrencyRate: scAdjustmentBasicInfo?.currentCurrencyRate ? yup.string() : yup.string().required( 'Name is Required!!!' ),
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( scPaymentSchema )
  } );

  const calculateAmount = () => {
    const calAmount = ( scAdjustmentBasicInfo.currentCurrencyRate - scAdjustmentBasicInfo.avgCurrencyRate ) * scAdjustmentBasicInfo.dueAmount;
    dispatch( bindScAdjustmentInfo( { ...scAdjustmentBasicInfo, amount: calAmount } ) )
  };

  useEffect( () => {
    calculateAmount();
  }, [scAdjustmentBasicInfo?.currentCurrencyRate] )


  useEffect( () => {
    return () => {
      dispatch( bindScAdjustmentInfo( initialScAdjustmentData ) )
    }
  }, [] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...scAdjustmentBasicInfo,
      [name]: value
    };
    dispatch( bindScAdjustmentInfo( updatedObj ) );
  };


  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    if ( name === "salesContractId" ) {
      dispatch( getScByIdForAdjustment( data?.value ) )
        .then( ( res ) => {
          console.log( res );
          dispatch( bindScAdjustmentInfo( res?.payload ) )
        } )
    } else {
      dispatch( bindScAdjustmentInfo( { ...scAdjustmentBasicInfo, [name]: data } ) )

    }
  }

  const handleOnSubmit = () => {
    const { scId, headId, amount, currencyId, paidAmount, note, currentCurrencyRate, avgCurrencyRate, date, dueAmount } = scAdjustmentBasicInfo;
    const finalAmount = currentCurrencyRate ? ( currentCurrencyRate - avgCurrencyRate ) * dueAmount : amount;
    const submittedData = {
      scId: scId,
      headId: headId?.value,
      date: date,
      currencyId: currencyId?.value ? currencyId?.value : null,
      amount: finalAmount?.toFixed( 4 ),
      note: note,
      currentCurrencyRate: +currentCurrencyRate,
      averageCurrencyRate: avgCurrencyRate,
      due: dueAmount
    }

    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( addNewScAdjustment( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: 1,
            pageSize: 10
          }
          dispatch( getAllScAdjustmentByFilter( paramObj ) )
          toggleSidebar()
          toast.success( 'New SC Adjustment Added' )
        }

      } )
  };


  const handleReset = () => {
    reset();
    bindScAdjustmentInfo( initialScAdjustmentData )

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
        title="New Adjustment"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        onClose={handleBankFromOpen}
      >
        <div>
          <ErpSelect
            label="SC Number"
            sideBySide={false}
            name="salesContractId"
            options={scDataCm}
            value={scAdjustmentBasicInfo?.salesContractId}
            onFocus={() => { getScDataOnFocus() }}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.salesContractId && !scAdjustmentBasicInfo?.salesContractId ) && 'is-invalid'}` )}
          />

          <ErpSelect
            label="Costing Head ( Adjustment )"
            sideBySide={false}
            name="headId"
            classNames="mt-1"
            options={costingHeadDataCm?.filter( cost => cost?.type === "Adjustment" )}
            value={scAdjustmentBasicInfo?.headId}
            onFocus={() => { getCostingHeadDataOnFocus() }}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.headId && !scAdjustmentBasicInfo?.headId ) && 'is-invalid'}` )}
          />

          <ErpInput
            sideBySide={false}
            label="Date"
            name="date"
            type="date"
            value={scAdjustmentBasicInfo.date}
            onChange={( e ) => { handleOnChange( e ); }}
          />

          <ErpSelect
            label="Currency"
            sideBySide={false}
            name="currencyId"
            classNames="mt-1"
            isDisabled={true}
            options={currencyDataCm}
            value={scAdjustmentBasicInfo?.currencyId}
            onFocus={() => { getCurrencyDataOnFocus() }}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.currencyId && !scAdjustmentBasicInfo?.currencyId ) && 'is-invalid'}` )}
          />

          <ErpInput
            sideBySide={false}
            label="Average Currency Rate"
            name="averageCurrencyRate"
            type="number"
            classNames="mt-1"
            disabled={true}
            value={scAdjustmentBasicInfo?.avgCurrencyRate}
            onFocus={( e ) => { e.target.select() }}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `text-end erp-dropdown-select ${( errors && errors?.avgCurrencyRate && !scAdjustmentBasicInfo?.avgCurrencyRate ) && 'is-invalid'}` )}
          />

          <ErpInput
            sideBySide={false}
            label="Currency Rate"
            name="currentCurrencyRate"
            type="number"
            classNames="mt-1"

            value={scAdjustmentBasicInfo?.currentCurrencyRate}
            onFocus={( e ) => { e.target.select() }}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `text-end erp-dropdown-select ${( errors && errors?.currentCurrencyRate && !scAdjustmentBasicInfo?.currentCurrencyRate ) && 'is-invalid'}` )}
          />

          <ErpInput
            sideBySide={false}
            label="Due"
            name="due"
            type="number"
            classNames="mt-1"

            disabled={true}
            value={scAdjustmentBasicInfo?.dueAmount}
            onFocus={( e ) => { e.target.select() }}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `text-end erp-dropdown-select ${( errors && errors?.due && !scAdjustmentBasicInfo?.due ) && 'is-invalid'}` )}

          />
          <ErpInput
            sideBySide={false}
            label="Amount"
            name="amount"
            type="number"
            classNames="mt-1"
            value={scAdjustmentBasicInfo?.amount}
            onFocus={( e ) => { e.target.select() }}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `text-end erp-dropdown-select ${( errors && errors?.amount && !scAdjustmentBasicInfo?.amount ) && 'is-invalid'}` )}

          />

          <InInput
            label="Note"
            name="note"
            bsSize="sm"
            id="note"
            type="textarea"
            value={scAdjustmentBasicInfo?.note}
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

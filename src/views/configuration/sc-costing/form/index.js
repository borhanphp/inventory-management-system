import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import { getAllCostingHeadCm, getAllScCm } from "../../../../redux/common/store";
import ErpInput from "../../../../utility/custom/ErpInput";
import ErpSelect from "../../../../utility/custom/ErpSelect";
import InInput from "../../../../utility/custom/InInput";
import { addNewScCosting, bindScCostingInfo, getAllScCostingByFilter, getCiByScId } from "../store";
import { initialScCostingData } from "../store/model";


const ScCostingForm = ( { open, toggleSidebar, handleBankFromOpen } ) => {
  const { scCostingBasicInfo, ciDataForCosting } = useSelector( ( { scCostings } ) => scCostings );
  const { scDataCm, ciDataCm, costingHeadDataCm } = useSelector( ( { commons } ) => commons );
  const dispatch = useDispatch();

  const scCostingSchema = yup.object().shape( {
    scId: scCostingBasicInfo?.scId ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    headId: scCostingBasicInfo?.headId ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    ciId: scCostingBasicInfo?.ciId ? yup.string() : yup.string().required( 'Name is Required!!!' ),
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( scCostingSchema )
  } );


  useEffect( () => {
    return () => {
      bindScCostingInfo( initialScCostingData )
    }
  }, [] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;

    const updatedObj = {
      ...scCostingBasicInfo,
      [name]: value
    };
    dispatch( bindScCostingInfo( updatedObj ) );
  };

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    if ( name === 'scId' ) {
      dispatch( bindScCostingInfo( { ...scCostingBasicInfo, [name]: data, ciId: null } ) )
    } else {
      dispatch( bindScCostingInfo( { ...scCostingBasicInfo, [name]: data } ) )
    }
  }

  const handleOnSubmit = () => {
    const { scId, headId, ciId, amount, date, note } = scCostingBasicInfo;
    const submittedData = {
      scId: scId?.value,
      headId: headId?.value,
      ciId: ciId?.value ? ciId?.value : null,
      date: date,
      amount: +amount,
      note: note
    }

    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( addNewScCosting( submittedData ) )
      .then( () => {
        const paramObj = {
          page: 1,
          pageSize: 10
        }
        dispatch( getAllScCostingByFilter( paramObj ) )
        toggleSidebar()
        toast.success( 'New SC Costing Added' )
      } )
  };


  const handleReset = () => {
    reset();
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
  const getCiDataOnFocus = () => {
    dispatch( getCiByScId( scCostingBasicInfo?.scId?.value ) )
  }

  const getCostingHeadDataOnFocus = () => {
    dispatch( getAllCostingHeadCm( paramObj ) )
  }

  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Expenses"
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
            value={scCostingBasicInfo.scId}
            onFocus={() => { getScDataOnFocus() }}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.scId && !scCostingBasicInfo?.scId ) && 'is-invalid'}` )}
          />

          <ErpSelect
            label="Costing Head ( Charge )"
            sideBySide={false}
            name="headId"
            classNames="mt-1"
            options={costingHeadDataCm?.filter( cost => cost?.type === "Charge" )}
            value={scCostingBasicInfo.headId}
            onFocus={() => { getCostingHeadDataOnFocus() }}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.headId && !scCostingBasicInfo?.headId ) && 'is-invalid'}` )}
          />

          <ErpSelect
            label="CI Number"
            sideBySide={false}
            name="ciId"
            classNames="mt-1"
            isDisabled={!scCostingBasicInfo.scId}
            options={ciDataForCosting}
            value={scCostingBasicInfo.ciId}
            onFocus={() => { getCiDataOnFocus() }}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.ciId && !scCostingBasicInfo?.ciId ) && 'is-invalid'}` )}
          />

          <ErpInput
            sideBySide={false}
            label="Date"
            name="date"
            type="date"
            value={scCostingBasicInfo.date}
            onChange={( e ) => { handleOnChange( e ); }}
          />

          <ErpInput
            sideBySide={false}
            label="Amount"
            name="amount"
            type="number"
            className="text-end"
            value={scCostingBasicInfo.amount}
            onFocus={( e ) => { e.target.select() }}
            onChange={( e ) => { handleOnChange( e ); }}
          />

          <InInput
            label="Note"
            name="note"
            bsSize="sm"
            id="note"
            type="textarea"
            value={scCostingBasicInfo.note}
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

export default ScCostingForm;

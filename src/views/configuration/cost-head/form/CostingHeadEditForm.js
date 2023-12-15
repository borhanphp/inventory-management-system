import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import InInput from "../../../../utility/custom/InInput";
import { bindCostingHeadInfo, getAllCostingHeadByFilter, updateCostingHead } from "../store";
import { initialCostingHeadData } from "../store/model";

const CostingHeadEditForm = ( { editFormOpen, toggleEditSidebar, currentPage } ) => {
  const { costingHeadBasicInfo } = useSelector( ( { costingHeads } ) => costingHeads );
  const dispatch = useDispatch();


  const costHeadSchema = yup.object().shape( {
    name: costingHeadBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    type: costingHeadBasicInfo?.type ? yup.string() : yup.string().required( 'Name is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( costHeadSchema )
  } );


  useEffect( () => {
    return () => {
      bindCostingHeadInfo( initialCostingHeadData )
    }
  }, [] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...costingHeadBasicInfo,
      [name]: value
    };
    dispatch( bindCostingHeadInfo( updatedObj ) );
  };

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    dispatch( bindCostingHeadInfo( { ...costingHeadBasicInfo, [name]: data } ) )
  }


  const handleOnSubmit = () => {
    const { name, type, note } = costingHeadBasicInfo;
    const submittedData = {
      ...costingHeadBasicInfo,
      name: name,
      type: type?.value,
      note: note
    }
    dispatch( updateCostingHead( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: currentPage,
            pageSize: 10
          }
          dispatch( getAllCostingHeadByFilter( paramObj ) )
          toggleEditSidebar()
          toast.success( 'Costing Head Updated Successfully' )
        }

      } )
  };

  const costingHeadsType = [
    { label: "Charge", value: "Charge" },
    { label: "Payment", value: "Payment" },
    { label: "Adjustment", value: "Adjustment" }
  ]

  return (
    <>
      <Sidebar
        size="lg"
        open={editFormOpen}
        title="Edit Cost Head"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleEditSidebar}
      >
        <div>
          <InInput
            label="Cost Head Name"
            name="name"
            bsSize="sm"
            id="name"
            value={costingHeadBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `mb-1 erp-dropdown-select ${( errors && errors?.name && !costingHeadBasicInfo?.name?.length ) && 'is-invalid'}` )}
          />

          <ErpSelect
            label="Type"
            sideBySide={false}
            name="type"
            options={costingHeadsType}
            value={costingHeadBasicInfo.type}
            isDisabled={true}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.type && !costingHeadBasicInfo?.type?.length ) && 'is-invalid'}` )}
          />

          <InInput
            label="Note"
            name="note"
            bsSize="sm"
            id="note"
            type="textarea"
            value={costingHeadBasicInfo.note}
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

export default CostingHeadEditForm;

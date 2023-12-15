import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import InInput from "../../../../utility/custom/InInput";
import { addNewItemType, bindItemTypeInfo, getAllItemTypeByFilter } from "../store";
import { initialItemTypeData } from "../store/model";

const ItemTypeForm = ( { open, toggleSidebar, handleFormOpen } ) => {
  const { itemTypeBasicInfo } = useSelector( ( { itemtypes } ) => itemtypes );
  const dispatch = useDispatch();


  const itemTypeSchema = yup.object().shape( {
    name: itemTypeBasicInfo?.name?.trim()?.length ? yup.string() : yup.string().required( 'Name is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( itemTypeSchema )
  } );


  useEffect( () => {
    return () => {
      dispatch( bindItemTypeInfo( initialItemTypeData ) );
    }
  }, [] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...itemTypeBasicInfo,
      [name]: value
    };
    dispatch( bindItemTypeInfo( updatedObj ) );
  };

  const handleOnSubmit = () => {
    const { name, note } = itemTypeBasicInfo;
    const submittedData = {
      name: name?.trim(),
      note: note?.trim()
    }
    dispatch( addNewItemType( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: 1,
            pageSize: 10
          }
          dispatch( getAllItemTypeByFilter( paramObj ) )
          toggleSidebar()
          toast.success( 'New Type Added' )
        }

      } );
  };
  const handleReset = () => {
    reset();
    dispatch( bindItemTypeInfo( initialItemTypeData ) );

  };

  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Item Type"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        onClose={handleFormOpen}
      >
        <div>
          <InInput
            label="Item Type Name"
            name="name"
            bsSize="sm"
            id="nameId"
            value={itemTypeBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !itemTypeBasicInfo?.name ) && 'is-invalid'}` )}
          />

          <InInput
            label="Short Description"
            name="note"
            bsSize="sm"
            id="note"
            value={itemTypeBasicInfo.note}
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

export default ItemTypeForm;

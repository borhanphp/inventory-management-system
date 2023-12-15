import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import ErpInput from "../../../../utility/custom/ErpInput";
import { bindItemTypeInfo, getAllItemTypeByFilter, updateItemType } from "../store";
import { initialItemTypeData } from "../store/model";


const ItemTypeEditForm = ( { editFormOpen, toggleEditSidebar, currentPage } ) => {
  const { itemTypeBasicInfo } = useSelector( ( { itemtypes } ) => itemtypes );
  const dispatch = useDispatch();

  const zoneSchema = yup.object().shape( {
    name: itemTypeBasicInfo?.name?.trim()?.length ? yup.string() : yup.string().required( 'Name is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( zoneSchema )
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
      ...itemTypeBasicInfo,
      name: name?.trim(),
      note: note?.trim()
    }
    dispatch( updateItemType( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: currentPage,
            pageSize: 10
          }
          dispatch( getAllItemTypeByFilter( paramObj ) )
          toggleEditSidebar()
          toast.success( 'Type Updated' )
        }

      } );;

  };

  const handleSidebarClosed = () => {
    toggleEditSidebar();
  };

  return (
    <>
      <Sidebar
        size="lg"
        open={editFormOpen}
        title="Edit Item Type"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleEditSidebar}
      >
        <div>
          <ErpInput
            label="Item Type Name"
            name="name"
            bsSize="sm"
            id="nameId"
            sideBySide={false}
            value={itemTypeBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `mb-1 erp-dropdown-select ${( errors && errors?.name && !itemTypeBasicInfo?.name ) && 'is-invalid'}` )}
          />

          <ErpInput
            label="Short Description"
            name="note"
            bsSize="sm"
            id="note"
            sideBySide={false}
            value={itemTypeBasicInfo.note}
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

export default ItemTypeEditForm;

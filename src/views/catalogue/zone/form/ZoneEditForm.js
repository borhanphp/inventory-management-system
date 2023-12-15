import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import ErpInput from "../../../../utility/custom/ErpInput";
import { bindZoneInfo, getAllZoneByFilter, updateZone } from "../store";
import { initialZoneData } from "../store/model";


const ZoneEditForm = ( { editFormOpen, toggleEditSidebar, currentPage } ) => {
  const { zoneBasicInfo } = useSelector( ( { zones } ) => zones );
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState( false );

  const zoneSchema = yup.object().shape( {
    name: zoneBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( zoneSchema )
  } );

  useEffect( () => {
    if ( submitted ) {
      dispatch( bindZoneInfo( initialZoneData ) );
    }
  }, [submitted] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...zoneBasicInfo,
      [name]: value
    };
    dispatch( bindZoneInfo( updatedObj ) );
  };

  const getSubmitResponse = ( condition ) => {
    setSubmitted( condition );
    dispatch( bindZoneInfo( initialZoneData ) );
  };
  const handleOnSubmit = () => {
    dispatch( updateZone( { ...zoneBasicInfo } ) )
      .then( () => {
        const paramObj = {
          page: currentPage,
          pageSize: 10
        }
        dispatch( getAllZoneByFilter( paramObj ) )
        toggleEditSidebar()
        toast.success( 'Zone Updated' )
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
        title="Edit Zone"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleEditSidebar}
      >
        <div>
          <ErpInput
            label="Zone Name"
            name="name"
            bsSize="sm"
            id="nameId"
            sideBySide={false}
            value={zoneBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !zoneBasicInfo?.name ) && 'is-invalid'}` )}
          />
          {errors?.name && !zoneBasicInfo?.name && <small className="text-danger">Name is required.</small>}

          <ErpInput
            label="Short Description"
            name="note"
            bsSize="sm"
            id="note"
            sideBySide={false}
            value={zoneBasicInfo.note}
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

export default ZoneEditForm;

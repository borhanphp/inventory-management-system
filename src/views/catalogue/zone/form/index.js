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
import { addNewZone, bindZoneInfo, getAllZone } from "../store";
import { initialZoneData } from "../store/model";

const ZoneForm = ( { open, toggleSidebar, handleFormOpen } ) => {
  const { zoneBasicInfo } = useSelector( ( { zones } ) => zones );
  const [isLoading, setIsLoading] = useState( false );
  const [submitted, setSubmitted] = useState( false );
  const dispatch = useDispatch();


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
      toast.success( 'Brand has been added' );
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

  const handleOnSubmit = () => {
    dispatch( addNewZone( { ...zoneBasicInfo } ) )
      .then( () => {
        const paramObj = {
          page: 1,
          pageSize: 10
        }
        dispatch( getAllZone( paramObj ) )
        toggleSidebar()
        toast.success( 'New Zone Added' )
      } );
  };
  const handleReset = () => {
    reset();
    dispatch( bindZoneInfo( initialZoneData ) );

  };

  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Zone"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        onClose={handleFormOpen}
      >
        <div>
          <InInput
            label="Zone Name"
            name="name"
            bsSize="sm"
            id="nameId"
            value={zoneBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !zoneBasicInfo?.name ) && 'is-invalid'}` )}
          />
          {errors?.name && !zoneBasicInfo?.name && <small className="text-danger">Name is required.</small>}

          <InInput
            label="Short Description"
            name="note"
            bsSize="sm"
            id="note"
            value={zoneBasicInfo.note}
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

export default ZoneForm;

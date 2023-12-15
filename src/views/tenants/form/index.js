import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormGroup, Input, Label } from "reactstrap";
import * as yup from 'yup';
import ErpInput from "../../../utility/custom/ErpInput";
import InInput from "../../../utility/custom/InInput";
import { addNewTenants, bindTenantsInfo } from "../store";
import { initialTenantsData } from "../store/model";


const TenantsForm = ( { open, toggleSidebar, handleFormOpen } ) => {
  const { tenantsData } = useSelector( ( { tenants } ) => tenants );
  const [isLoading, setIsLoading] = useState( false );
  const [submitted, setSubmitted] = useState( false );
  const dispatch = useDispatch();

  const tenantSchema = yup.object().shape( {
    name: tenantsData?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( tenantSchema )
  } );

  useEffect( () => {
    if ( submitted ) {
      dispatch( bindTenantsInfo( initialTenantsData ) );
      toast.success( 'Tenant has been added' );
    }
  }, [submitted] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...tenantsData,
      [name]: value
    };
    dispatch( bindTenantsInfo( updatedObj ) );
  };

  const loading = ( condition ) => {
    setIsLoading( condition );
  };
  const handleOnSubmit = () => {
    dispatch( addNewTenants( { ...tenantsData, status: true }, loading, setSubmitted ) );
    toggleSidebar();
  };
  const handleReset = () => {
    reset();
    dispatch( bindTenantsInfo( null ) );
  };

  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Tenants"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        onClose={handleFormOpen}
      >
        <div>
          <InInput
            label="Name"
            name="name"
            bsSize="sm"
            id="nameId"
            placeholder="Name"
            value={tenantsData.name}
            onChange={( e ) => { handleOnChange( e ); }}
          // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
          />
          {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}

          <ErpInput
            label="Phone Number"
            name="phoneNumber"
            id="phoneNumberId"
            sideBySide={false}
            classNames="mt-1"
            placeholder="Phone Number"
            value={tenantsData.phoneNumber}
            onChange={( e ) => { handleOnChange( e ); }}
          // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
          />
          {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}

          <ErpInput
            label="Email"
            name="email"
            id="nameId"
            type="email"
            sideBySide={false}
            classNames="mt-1"
            placeholder="Email Address"
            value={tenantsData.email}
            onChange={( e ) => { handleOnChange( e ); }}
          // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
          />
          {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}

          <ErpInput
            label="Connection String"
            name="connectionString"
            id="connectionStringId"
            sideBySide={false}
            classNames="mt-1"
            placeholder="Connection String"
            value={tenantsData.connectionString}
            onChange={( e ) => { handleOnChange( e ); }}
          // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
          />
          {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}

          <ErpInput
            label="Subscription Start Date"
            name="subscriptionStartDate"
            id="subscriptionStartDateId"
            type="date"
            sideBySide={false}
            classNames="mt-1"
            value={tenantsData.subscriptionStartDate}
            onChange={( e ) => { handleOnChange( e ); }}
          // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
          />
          {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}

          <ErpInput
            label="Subscription End Date"
            name="subscriptionEndDate"
            id="subscriptionStartDateId"
            type="date"
            sideBySide={false}
            classNames="mt-1"
            value={tenantsData.subscriptionEndDate}
            onChange={( e ) => { handleOnChange( e ); }}
          // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
          />
          {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}


          <FormGroup check className="mt-1 ">
            <Label check>
              <Input
                type="checkbox"
                name="checkSub"
              // onChange={() => setCatField( !catField )}
              />{" "}
              Is Active?
            </Label>
          </FormGroup>

        </div>
        <div className="mt-1">
          <Button type="submit" size="sm" className="me-1" color="primary"
            // onClick={() => { handleOnSubmit(); }}
            onClick={handleSubmit( handleOnSubmit )}
          >
            Submit
          </Button>
          <Button type="reset" size="sm" color="secondary" outline onClick={toggleSidebar}>
            Cancel
          </Button>
        </div>
      </Sidebar>

    </>
  );
};

export default TenantsForm;

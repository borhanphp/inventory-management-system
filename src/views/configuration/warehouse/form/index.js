import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, FormGroup,
  Input, Label
} from "reactstrap";
import * as yup from 'yup';
import { getAllCountriesCm } from "../../../../redux/common/store";
import ErpInput from "../../../../utility/custom/ErpInput";
import ErpSelect from "../../../../utility/custom/ErpSelect";
import { addNewWarehouse, bindWarehouseInfo, getAllWarehouseByFilter } from "../store";
import { initialWarehouseData } from "../store/model";


const WarehouseForm = ( { open, toggleSidebar } ) => {
  const { warehouseBasicInfo } = useSelector( ( { warehouses } ) => warehouses );
  const { countriesData } = useSelector( ( { commons } ) => commons );

  const dispatch = useDispatch();
  const [catField, setCatField] = useState( false );

  const currencySchema = yup.object().shape( {
    name: warehouseBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    shortForm: warehouseBasicInfo?.shortForm?.length ? yup.string() : yup.string().required( 'Short Form is Required!!!' )
  } );

  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( currencySchema )
  } );

  const handleOnChange = ( e ) => {
    const { type, checked, name, value } = e.target;
    const updatedObj = {
      ...warehouseBasicInfo,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number( value ) : value
    };
    dispatch( bindWarehouseInfo( updatedObj ) );
  };


  const handleOnSubmit = () => {
    const submittedData = {
      ...warehouseBasicInfo,
      state: warehouseBasicInfo?.state?.label,
      city: warehouseBasicInfo?.city?.label,
      // countryId: warehouseBasicInfo?.countryId ? warehouseBasicInfo?.countryId?.countryId : 1
      countryId: 1
    }
    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( addNewWarehouse( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: 1,
            pageSize: 10
          }
          dispatch( getAllWarehouseByFilter( paramObj ) )
          toast.success( 'Warehouse added successfully' )
          toggleSidebar();
        }

      } )

  };

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    const updatedObj = {
      ...warehouseBasicInfo,
      [name]: data
    };
    dispatch( bindWarehouseInfo( updatedObj ) );
  };

  const handleSidebarClosed = () => {
    toggleSidebar();
  };

  const clearAllField = () => {
    reset();
    dispatch( bindWarehouseInfo( initialWarehouseData ) );
  };

  const getCountries = () => {
    if ( !countriesData.length ) {
      dispatch( getAllCountriesCm() )
    }
  };




  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Warehouse"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        onClosed={handleSidebarClosed}
      >
        <div>
          <ErpInput
            id="name"
            label="Name"
            name="name"
            sideBySide={false}
            placeholder="Warehouse Name"
            value={warehouseBasicInfo.name}
            onChange={( e ) => handleOnChange( e )}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !warehouseBasicInfo?.name ) && 'is-invalid'}` )}

          />



          <ErpInput
            label="Short Form"
            id="shortForm"
            name="shortForm"
            classNames="mt-1"
            sideBySide={false}
            placeholder="Short Form"
            value={warehouseBasicInfo.shortForm}
            onChange={( e ) => handleOnChange( e )}
            className={classNames( `erp-dropdown-select ${( errors && errors?.shortForm && !warehouseBasicInfo?.shortForm ) && 'is-invalid'}` )}

          />

          <ErpInput
            label="Description"
            id="note"
            name="note"
            classNames="mt-1"
            sideBySide={false}
            placeholder="Warehouse Description"
            value={warehouseBasicInfo.note}
            onChange={( e ) => handleOnChange( e )}
          />

          <ErpInput
            label="Address"
            id="address"
            name="address"
            classNames="mt-1"
            sideBySide={false}
            placeholder="Address"
            value={warehouseBasicInfo.address}
            onChange={( e ) => handleOnChange( e )}
          />

          <ErpSelect
            label="Country"
            id="countryId"
            name="countryId"
            classNames="mt-1"
            options={countriesData}
            sideBySide={false}
            value={warehouseBasicInfo.countryId}
            onFocus={() => { getCountries() }}
            onChange={( data, e ) => handleDropDownChange( data, e )}
          />

          <ErpInput
            label="State"
            name="state"
            id="state"
            placeholder="State"
            classNames="mt-1"
            sideBySide={false}
            value={warehouseBasicInfo.state}
            onChange={( e ) => handleOnChange( e )}
          />
          <ErpInput
            label="City"
            name="city"
            id="city"
            placeholder="City"
            classNames="mt-1"
            sideBySide={false}
            value={warehouseBasicInfo.city}
            onChange={( e ) => handleOnChange( e )}
          />

          <ErpInput
            label="Postal Code"
            name="postalCode"
            id="postalCode"
            classNames="mt-1"
            sideBySide={false}
            placeholder="Postal Code"
            value={warehouseBasicInfo.postalCode}
            onChange={( e ) => handleOnChange( e )}
          />


          <FormGroup check className="mt-1">
            <Label check>
              <Input
                id="isCentralWarehouse"
                type="checkbox"
                name="isCentralWarehouse"
                checked={warehouseBasicInfo.isCentralWarehouse}
                onChange={( e ) => handleOnChange( e )}
              />{" "}
              Is Central?
            </Label>
          </FormGroup>

        </div>
        <div className="mt-1">
          <Button
            className="me-1"
            size="sm"
            color="primary"
            // onClick={() => { handleOnSubmit() }}
            onClick={handleSubmit( handleOnSubmit )}

          >
            Submit
          </Button>
          <Button
            type="reset"
            color="secondary"
            size="sm"
            outline
            onClick={() => { clearAllField(); }}
          >
            Clear
          </Button>
        </div>
      </Sidebar>

    </>
  );
};

export default WarehouseForm;

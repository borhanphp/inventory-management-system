import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import { getAllCountriesCm } from "../../../../redux/common/store";
import ErpSelect from "../../../../utility/custom/ErpSelect";
import InInput from "../../../../utility/custom/InInput";
import { addNewBrand, bindBrandInfo, getAllBrand } from "../store";
import { initialBrandData } from "../store/model";


const BrandForm = ( { open, toggleSidebar, handleBrandFromOpen, currentPage, rowsPerPage } ) => {
  const { brandBasicInfo } = useSelector( ( { brands } ) => brands );
  const { countriesData } = useSelector( ( { commons } ) => commons );
  const dispatch = useDispatch();

  const brandSchema = yup.object().shape( {
    name: brandBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    countryOfOrigin: brandBasicInfo?.countryOfOrigin ? yup.string() : yup.string().required( 'countryOfOrigin is Required!!!' ),
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( brandSchema )
  } );


  useEffect( () => {
    return () => {
      dispatch( bindBrandInfo( initialBrandData ) );
    }
  }, [] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    if ( name === 'name' ) {
      if ( value.length > 25 ) {
        return;
      } else {
        const updatedObj = {
          ...brandBasicInfo,
          [name]: value
        };
        dispatch( bindBrandInfo( updatedObj ) );
      }
    } else {
      const updatedObj = {
        ...brandBasicInfo,
        [name]: value
      };
      dispatch( bindBrandInfo( updatedObj ) );
    }

  };

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    dispatch( bindBrandInfo( { ...brandBasicInfo, [name]: data } ) )
  }

  const getCountriesByFocus = () => {
    if ( !countriesData.length ) {
      dispatch( getAllCountriesCm() )
    }
  }

  const handleOnSubmit = () => {
    const { countryOfOrigin } = brandBasicInfo;
    const submittedData = {
      ...brandBasicInfo,
      countryOfOrigin: countryOfOrigin.value
    }
    // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( addNewBrand( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: currentPage,
            pageSize: rowsPerPage
          }
          dispatch( getAllBrand( paramObj ) )
          toggleSidebar()
          toast.success( 'New Brand Added' )
        }

      } )
  };


  const handleReset = () => {
    reset();
    dispatch( bindBrandInfo( initialBrandData ) );
  };

  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Brand"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        onClose={handleBrandFromOpen}
      >
        <div>
          <InInput
            label="Brand Name"
            name="name"
            bsSize="sm"
            id="nameId"
            value={brandBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name?.length || brandBasicInfo?.name?.length >= 25 ) && 'is-invalid'}` )}
          />
          {brandBasicInfo?.name?.length >= 25 && <small className="text-danger">Name must be 25 character or less</small>}


          <ErpSelect
            sideBySide={false}
            classNames="mt-1"
            label="Manufactured Country"
            name="countryOfOrigin"
            bsSize="sm"
            id="countryOfOriginId"
            options={countriesData}
            value={brandBasicInfo.countryOfOrigin}
            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
            onFocus={() => { getCountriesByFocus() }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.countryOfOrigin && !brandBasicInfo?.countryOfOrigin ) && 'is-invalid'}` )}
          />


          <InInput
            label="Description"
            name="note"
            bsSize="sm"
            id="note"
            value={brandBasicInfo.note}
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

export default BrandForm;

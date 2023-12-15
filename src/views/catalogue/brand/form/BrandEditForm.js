import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import { getAllCountriesCm } from "../../../../redux/common/store";
import ErpInput from "../../../../utility/custom/ErpInput";
import ErpSelect from "../../../../utility/custom/ErpSelect";
import { bindBrandInfo, getAllBrand, updateBrand } from "../store";
import { initialBrandData } from "../store/model";

const BrandEditForm = ( { editFormOpen, toggleEditSidebar, currentPage, rowsPerPage } ) => {
  const { brandBasicInfo } = useSelector( ( { brands } ) => brands );
  const { countriesData } = useSelector( ( { commons } ) => commons );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState( false );
  const [submitted, setSubmitted] = useState( false );


  const brandSchema = yup.object().shape( {
    name: brandBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    countryOfOrigin: brandBasicInfo?.countryOfOrigin ? yup.string() : yup.string().required( 'countryOfOrigin is Required!!!' )

  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( brandSchema )
  } );



  useEffect( () => {
    if ( submitted ) {
      dispatch( bindBrandInfo( initialBrandData ) );
    }
  }, [submitted] );

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


  const getSubmitResponse = ( condition ) => {
    setSubmitted( condition );
    dispatch( bindBrandInfo( initialBrandData ) );
  };

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
    dispatch( updateBrand( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: currentPage,
            pageSize: rowsPerPage
          }
          dispatch( getAllBrand( paramObj ) )
          toggleEditSidebar()
          toast.success( 'Brand Updated Successfully' )
        }

      } )
  };



  return (
    <>
      <Sidebar
        size="lg"
        open={editFormOpen}
        title="Edit Brand"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleEditSidebar}
      >
        <div>
          <ErpInput
            label="Brand Name"
            name="name"
            bsSize="sm"
            id="nameId"
            sideBySide={false}
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

          <ErpInput
            label="Description"
            classNames="mt-1"
            name="note"
            bsSize="sm"
            id="note"
            sideBySide={false}
            value={brandBasicInfo.note}
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

export default BrandEditForm;

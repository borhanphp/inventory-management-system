import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, FormGroup,
  Input, Label
} from "reactstrap";
import * as yup from 'yup';
import { getAllCategoryCm, getAllSegmentCm } from "../../../../redux/common/store";
import ErpInput from "../../../../utility/custom/ErpInput";
import ErpSelect from "../../../../utility/custom/ErpSelect";
import { addNewCategory, bindCategoryInfo, getAllCategoryByFilter } from "../store";
import { initialCategoryData } from "../store/model";

const CategoryForm = ( { open, toggleSidebar } ) => {
  const { categoryBasicInfo, loading } = useSelector( ( { categories } ) => categories );
  const { categoryDataCm, segmentDataCm } = useSelector( ( { commons } ) => commons );
  const [catField, setCatField] = useState( false );
  const dispatch = useDispatch();

  const categorySchema = yup.object().shape( {
    name: categoryBasicInfo?.name ? yup.string() : yup.string().required( 'Name is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( categorySchema )
  } );


  const handleOnChange = ( e ) => {
    const { type, checked, name, value } = e.target;
    const updatedObj = {
      ...categoryBasicInfo,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number( value ) : value
    };
    dispatch( bindCategoryInfo( updatedObj ) );
  };



  const handleOnSubmit = () => {
    const { name, categorySegments, parentCategoryId, taxPercentage, visibleInPos, visibleInEcommerce, sortOrder, note } = categoryBasicInfo;
    const submittedData = {
      name: name,
      parentCategoryId: parentCategoryId?.value ? parentCategoryId?.value : 0,
      visibleInPos: visibleInPos,
      visibleInEcommerce: visibleInEcommerce,
      icon: "icon.jpg",
      note: note ? note : '',
      taxPercentage: taxPercentage ? taxPercentage : 0,
      sortOrder: sortOrder,
      categorySegments: categorySegments.map( ( segData, seqIndex ) => ( {
        segmentId: segData?.value ? segData?.value : 0,
        sequence: seqIndex + 1
      } ) )
    }
    // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( addNewCategory( submittedData ) )
      .then( ( res ) => {
        console.log( res )

        if ( res.error ) {
          return;
        } else {
          const initData = {
            page: 1,
            pageSize: 10
          };
          dispatch( getAllCategoryByFilter( initData ) )
          toggleSidebar();
          toast.success( "Category Added Successfully" )
        }

      } )

  };

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    const updatedObj = {
      ...categoryBasicInfo,
      [name]: data
    };
    dispatch( bindCategoryInfo( updatedObj ) );
  };

  const handleSidebarClosed = () => {
    toggleSidebar();
  };

  const clearAllField = () => {
    dispatch( bindCategoryInfo( initialCategoryData ) );
  };

  useEffect( () => {
    dispatch( getAllCategoryCm() )
  }, [] )

  const handleCategoryOnFocus = () => {
    if ( !categoryDataCm.length ) {
      dispatch( getAllCategoryCm() )
    }
  }
  const handleSegmentOnFocus = () => {
    dispatch( getAllSegmentCm() )

  }

  // const handleCreateSegment = ( data ) => {
  //   const submittedData = {
  //     name: data,
  //     note: "",
  //     values: [
  //       {
  //         value: "default value"
  //       }
  //     ]
  //   }

  //   dispatch( addNewSegment( submittedData ) );
  // }


  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Category"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        onClosed={handleSidebarClosed}
      >
        <div>
          <div className="mb-1">
            <FormGroup check className="mt-1">
              <Label check>
                <Input
                  type="checkbox"
                  name="checkSub"
                  onChange={() => setCatField( !catField )}
                />{" "}
                Has Parent?
              </Label>
            </FormGroup>

            {catField && (
              <ErpSelect
                label="Parent Category"
                id="parentCategoryIdId"
                name="parentCategoryId"
                classNames="mt-1"
                sideBySide={false}
                options={categoryDataCm}
                value={categoryBasicInfo?.parentCategoryId}
                onFocus={() => { handleCategoryOnFocus() }}
                onChange={( data, e ) => handleDropDownChange( data, e )}
              />
            )}
          </div>

          <ErpInput
            label="Name"
            name="name"
            sideBySide={false}
            placeholder="Category Name"
            value={categoryBasicInfo.name}
            onChange={( e ) => handleOnChange( e )}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !categoryBasicInfo?.name ) && 'is-invalid'}` )}

          />

          <ErpInput
            label="Description"
            name="note"
            classNames="mt-1"
            sideBySide={false}
            placeholder="Write Description"
            value={categoryBasicInfo.note}
            onChange={( e ) => handleOnChange( e )}
          />

          <ErpInput
            label="Sort Order"
            name="sortOrder"
            classNames="mt-1"
            type="number"
            sideBySide={false}
            placeholder="Sort Order"
            value={categoryBasicInfo.sortOrder}
            onChange={( e ) => handleOnChange( e )}
          />

          {/* <ErpSelect
            label="Category Segment"
            id="categorySegmentsId"
            name="categorySegments"
            classNames="mt-1"
            sideBySide={false}
            isMulti
            options={segmentDataCm.map( sd => ( { label: sd.name, value: sd.id } ) )}
            value={categoryBasicInfo?.categorySegments}
            onFocus={() => { handleSegmentOnFocus() }}
            onChange={( data, e ) => handleDropDownChange( data, e )}
          // onCreateOption={( inputValue ) => { handleCreateSegment( inputValue ) }}
          /> */}

          <FormGroup check className="mt-1">
            <Label check>
              <Input
                type="checkbox"
                name="visibleInPos"
                checked={categoryBasicInfo?.visibleInPos}
                onChange={( e ) => handleOnChange( e )}
              />{" "}
              Visible In Pos?
            </Label>
          </FormGroup>

          <FormGroup check className="mt-1">
            <Label check>
              <Input
                type="checkbox"
                name="visibleInEcommerce"
                checked={categoryBasicInfo?.visibleInEcommerce}
                onChange={( e ) => handleOnChange( e )}
              />{" "}
              Visible In E-Commerce?
            </Label>
          </FormGroup>


        </div>
        <div className="mt-1">
          <Button type="submit" className="me-1" size="sm" color="primary"
            // onClick={() => { handleOnSubmit() }}
            onClick={handleSubmit( handleOnSubmit )}
            disabled={loading ?? true}
          >
            {loading ? 'Processing...' : 'Submit'}
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

export default CategoryForm;

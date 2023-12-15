import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect, useState } from "react";
import { PlusSquare, Trash2 } from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Input, Row, Table } from "reactstrap";
import * as yup from 'yup';
import { confirmDialog } from "../../../../utility/custom/ConfirmDialog";
import ErpInput from "../../../../utility/custom/ErpInput";
import { randomIdGenerator } from "../../../../utility/Utils";
import { bindPackageTypeInfo, getAllPackageTypeByFilter, updatePackageType } from "../store";
import { initialPackageTypeData } from "../store/model";


const ItemTypeEditForm = ( { editFormOpen, toggleEditSidebar, currentPage } ) => {
  const { packageTypeBasicInfo } = useSelector( ( { packagetypes } ) => packagetypes );
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState( false );

  const zoneSchema = yup.object().shape( {
    name: packageTypeBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( zoneSchema )
  } );

  useEffect( () => {
    if ( submitted ) {
      dispatch( bindPackageTypeInfo( initialPackageTypeData ) );
    }
  }, [submitted] );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...packageTypeBasicInfo,
      [name]: value
    };
    dispatch( bindPackageTypeInfo( updatedObj ) );
  };

  const handleSizeOnChange = ( e, packageId ) => {
    const { name, value } = e.target;
    const updatedObj = packageTypeBasicInfo?.sizes?.map( ( item ) =>
      item.id === packageId ? { ...item, [name]: value } : item
    );
    dispatch( bindPackageTypeInfo( {
      ...packageTypeBasicInfo,
      sizes: updatedObj,
    } ) );
  };



  const handleOnSubmit = () => {
    const { sizes } = packageTypeBasicInfo;
    const submittedData = {
      ...packageTypeBasicInfo,
      sizes: sizes.map( size => ( {
        size: size.value
      } ) )
    }
    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( updatePackageType( submittedData ) )
      .then( () => {
        const paramObj = {
          page: currentPage,
          pageSize: 10
        }
        dispatch( getAllPackageTypeByFilter( paramObj ) )
        toggleEditSidebar()
        toast.success( 'Type Updated' )
      } );;

  };


  const addSizeRows = () => {
    dispatch( bindPackageTypeInfo(
      {
        ...packageTypeBasicInfo,
        sizes: [
          ...packageTypeBasicInfo.sizes,
          {
            id: randomIdGenerator(),
            value: []
          }
        ]
      } ) );
  }

  const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes!',
    cancelButtonText: 'No'
  };

  const handleRowDelete = ( id ) => {
    confirmDialog( confirmObj )
      .then( e => {
        if ( e.isConfirmed ) {
          const updatedRows = packageTypeBasicInfo.sizes.filter( d => d.id !== id );
          dispatch( bindPackageTypeInfo( { ...packageTypeBasicInfo, sizes: updatedRows } ) );
        }
      } );

  };

  return (
    <>
      <Sidebar
        size="lg"
        open={editFormOpen}
        title="Edit Package Type"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleEditSidebar}
      >
        <div>
          <ErpInput
            label="Package Type Name"
            name="name"
            bsSize="sm"
            id="nameId"
            sideBySide={false}
            value={packageTypeBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !packageTypeBasicInfo?.name ) && 'is-invalid'}` )}
          />

          <ErpInput
            label="Short Description"
            className="mt-1"
            name="note"
            bsSize="sm"
            id="note"
            sideBySide={false}
            value={packageTypeBasicInfo.note}
            onChange={( e ) => { handleOnChange( e ); }}
          />

        </div>
        <div className="mt-1">
          <Row className="custom-table">
            <Col className="pl-1 pr-0">
              <Table responsive bordered >
                <thead className="text-center" >
                  <tr >
                    <th className="px-1" style={{ padding: "0" }}>Sizes</th>
                    <th className="px-1" style={{ padding: "0" }}>Action</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {packageTypeBasicInfo?.sizes?.map( ( sValue, i ) => (
                    <tr key={i}>
                      <td style={{ padding: '0px' }}>
                        <Input
                          type="text"
                          name="value"
                          bsSize="sm"
                          value={sValue.value}
                          // disabled={!unit.isEdit}
                          onChange={( e ) => { handleSizeOnChange( e, sValue.id ); }}
                        // className={classNames( `erp-dropdown-select ${( errors && errors?.segmentValue && !segmentBasicInfo?.values?.length ) && 'is-invalid'}` )}

                        />
                      </td>


                      <td className="sl" style={{ padding: '0px', width: "10px" }}>
                        <span className="d-flex justify-content-center">
                          <Button.Ripple
                            // disabled={rows.length === 1 ?? true}
                            // disabled={true}
                            id="editRow"
                            // tag={Label}
                            onClick={() => { handleRowDelete( sValue.id ); }}
                            className="btn-icon p-0 cursor-pointer"
                            color="flat-success"
                          >
                            <Trash2 size={16} id="editRow" color="red" />
                          </Button.Ripple>
                        </span>
                      </td>
                    </tr>
                  ) )}

                </tbody>
              </Table>
              <Button.Ripple
                id="AddSegRowId"
                onClick={() => { addSizeRows(); }}
                className="btn-icon cursor-pointer"
                color="flat-success"
              >
                <PlusSquare size={18} id="AddSegRowId" color="green" />
              </Button.Ripple>
            </Col>
          </Row>
          <Row>

          </Row>
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

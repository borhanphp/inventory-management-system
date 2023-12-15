import { yupResolver } from '@hookform/resolvers/yup'
import classNames from "classnames"
import { useEffect, useState } from "react"
import { PlusSquare, Trash2 } from "react-feather"
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { Button, Card, Col, Input, NavItem, Row, Table } from "reactstrap"
import * as yup from 'yup'
import ActionMenu from '../../../../@core/layouts/components/ActionMenu'
import { confirmDialog } from "../../../../utility/custom/ConfirmDialog"
import ErpInput from '../../../../utility/custom/ErpInput'
import FormContentLayout from '../../../../utility/custom/FormContentLayout'
import FormLayout from '../../../../utility/custom/FormLayout'
import InInput from "../../../../utility/custom/InInput"
import { randomIdGenerator } from "../../../../utility/Utils"
import { addNewSegment, bindSegmentInfo, getSegmentByFilter } from "../store"
import { initialSegmentData } from "../store/model"


const breadcrumb = [
  {
    id: 'home',
    name: 'Home',
    link: "/",
    isActive: false,
    hidden: false
  }
];

const SegmentForm = () => {
  const { segmentBasicInfo } = useSelector( ( { segments } ) => segments );
  const [rows, setRows] = useState( [{ id: randomIdGenerator(), value: '' }] );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const segmentSchema = yup.object().shape( {
    name: segmentBasicInfo?.name?.trim()?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    // segmentValue: segmentBasicInfo?.values?.length ? yup.string() : yup.string().required( 'Value is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( segmentSchema )
  } );

  useEffect( () => {
    return () => {
      dispatch( bindSegmentInfo( initialSegmentData ) );
    }
  }, [] )

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...segmentBasicInfo,
      [name]: value
    };
    dispatch( bindSegmentInfo( updatedObj ) );
  };

  const handleValueOnChange = ( e, id ) => {
    const { name, value } = e.target;
    const updatedRows = rows.map( row => {
      if ( row.id === id ) {
        return {
          ...row,
          [name]: value
        };
      }
      return row;
    } );
    setRows( updatedRows );
    dispatch( bindSegmentInfo( { ...segmentBasicInfo, values: updatedRows } ) );
  };


  const handleOnSubmit = () => {
    const { name, note } = segmentBasicInfo;
    const submittedObj = {
      name: name?.trim(),
      note: note?.trim(),
      values: segmentBasicInfo?.values?.filter( fItem => fItem.value.length > 0 ).map( ( value ) => ( {
        value: value?.value?.trim()
      } ) ),
      status: true
    }
    // console.log( 'submittedObj', JSON.stringify( submittedObj, null, 2 ) )
    dispatch( addNewSegment( submittedObj ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramObj = {
            page: 1,
            pageSize: 10
          }
          dispatch( getSegmentByFilter( paramObj ) )
          dispatch( bindSegmentInfo( initialSegmentData ) )
          setRows( [{ id: randomIdGenerator(), value: '' }] )
          toast.success( 'Segment added successfully' );
        }

      } )
  };

  const handleReset = () => {
    dispatch( bindSegmentInfo( null ) );
  };

  const addRows = () => {
    setRows( [
      ...rows, {
        id: randomIdGenerator(),
        value: []
      }
    ] );
  };

  const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes!',
    cancelButtonText: 'No'
  };

  //delete segment value row
  const handleRowDelete = ( id ) => {
    confirmDialog( confirmObj )
      .then( e => {
        if ( e.isConfirmed ) {
          const updatedRows = rows.filter( d => d.id !== id );
          setRows( updatedRows );
          dispatch( bindSegmentInfo( { ...segmentBasicInfo, values: updatedRows } ) );
        }
      } );

  };


  return (
    <>
      <ActionMenu
        title='New Variant'
        breadcrumb={breadcrumb}
      >
        <NavItem className="me-1" >
          <Button
            size="sm"
            color="primary"
            onClick={handleSubmit( handleOnSubmit )}
          >Save</Button>
        </NavItem>
        <NavItem className="mr-1" >
          <Button
            size="sm"
            color="info"
            onClick={() => { navigate( '/catalogue/segment/list' ); }}
          >View List</Button>
        </NavItem>
      </ActionMenu>
      <div className='mt-3'>
        <Card className='px-1' style={{ height: '80vh' }}>
          <Row>
            <Col lg={4}>
              <FormLayout>
                <FormContentLayout title="Variant Info">
                  <div>
                    <ErpInput
                      label="Name"
                      name="name"
                      sideBySide={false}
                      placeholder="Name"
                      id="sku"
                      value={segmentBasicInfo.name}
                      onChange={( e ) => { handleOnChange( e ) }}
                      className={classNames( `erp-dropdown-select ${( errors && errors?.name && !segmentBasicInfo?.name ) && 'is-invalid'}` )}
                    />


                    <InInput
                      label="Description"
                      name="note"
                      placeholder="Description"
                      id="sku"
                      value={segmentBasicInfo.note}
                      onChange={( e ) => { handleOnChange( e ) }}
                    />

                  </div>
                  <div className="mt-1 text-end">
                    <Button type="reset" size="sm" color="secondary" outline onClick={() => { handleReset() }}>
                      Clear
                    </Button>
                  </div>
                </FormContentLayout>
              </FormLayout>
            </Col>
            <Col lg={8}>
              <FormLayout>
                <FormContentLayout title="Variant Values">
                  <div>
                    <div className="">
                      <Row className="custom-table">
                        <Col className="pl-1 pr-0">
                          <Table responsive bordered >
                            <thead className="text-center" >
                              <tr >
                                <th className="px-1" style={{ padding: "0" }}>Values</th>
                                <th className="px-1" style={{ padding: "0" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody className="text-center">
                              {rows?.map( ( sValue, i ) => (
                                <tr key={i}>
                                  <td style={{ padding: '0px' }}>
                                    <Input
                                      type="text"
                                      name="value"
                                      bsSize="sm"
                                      value={sValue.value}
                                      // disabled={!unit.isEdit}
                                      onChange={( e ) => { handleValueOnChange( e, sValue.id ); }}
                                    // className={classNames( `erp-dropdown-select ${( errors && errors?.segmentValue && !segmentBasicInfo?.values?.length ) && 'is-invalid'}` )}

                                    />
                                  </td>


                                  <td className="sl" style={{ padding: '0px', width: "10px" }}>
                                    <span className="d-flex justify-content-center">
                                      <Button.Ripple
                                        disabled={rows.length === 1 ?? true}
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
                            onClick={() => { addRows(); }}
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

                  </div>
                  {/* <div className="mt-1">
                <Button type="submit" size="sm" className="me-1" color="primary"
                  // onClick={() => { handleOnSubmit() }}
                  onClick={handleSubmit( handleOnSubmit )}

                >
                  Submit
                </Button>
                <Button type="reset" size="sm" color="secondary" outline onClick={() => { handleReset() }}>
                  Clear
                </Button>
              </div> */}
                </FormContentLayout>
              </FormLayout>
            </Col>
          </Row>
        </Card>
      </div>

    </>
  )
}

export default SegmentForm

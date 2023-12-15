import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import React, { useEffect } from "react";
import { CheckSquare, Edit, PlusSquare } from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody, Col,
  FormGroup, Input, Label,
  Row,
  Table
} from "reactstrap";
import * as yup from 'yup';
import { randomIdGenerator } from "../../../../utility/Utils";
import { bindUnitSetInfo, getUnitSetByIdForAssign, updateUnitSet } from "../store";

const unitAddForm = () => {
  const { unitSetBasicInfo } = useSelector( ( { units } ) => units );
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location

  useEffect( () => {
    dispatch( getUnitSetByIdForAssign( state.id ) )
  }, [state.id] )


  const findIsEdit = unitSetBasicInfo?.units?.filter( d => d?.isEdit );

  const nameLen = findIsEdit[0]?.name?.length;
  const shortNameLen = findIsEdit[0]?.shortForm?.length;
  const factorLen = findIsEdit[0]?.factorValue;

  const unitsSchema = yup.object().shape( {
    name: nameLen ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    shortName: shortNameLen ? yup.string() : yup.string().required( 'Short Name is Required!!!' ),
    factorField: factorLen ? yup.string() : yup.string().required( 'Factor Value is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( unitsSchema )
  } );

  // console.log( 'nameLen', nameLen > 0 );


  const handleUnitsEditControl = rowId => {
    const { units } = unitSetBasicInfo;
    const updatedUnits = units.map( row => {
      if ( row.rowId === rowId ) {
        return {
          ...row,
          isEdit: true,
        };
      }
      return row;
    } );
    const updateBasicInfo = {
      ...unitSetBasicInfo,
      units: updatedUnits
    }
    dispatch( bindUnitSetInfo( updateBasicInfo ) )
  };

  const handleUnitsEditControlDisabled = rowId => {
    const { units } = unitSetBasicInfo;
    const updatedUnits = units.map( row => {
      if ( row.rowId === rowId ) {
        return {
          ...row,
          isEdit: false,
        };
      }
      return row;
    } );
    const updateBasicInfo = {
      ...unitSetBasicInfo,
      units: updatedUnits
    }
    dispatch( bindUnitSetInfo( updateBasicInfo ) )
  };


  const addUnitRows = () => {
    const { units } = unitSetBasicInfo;
    const newRow = {
      rowId: randomIdGenerator(),
      id: null,
      name: '',
      note: '',
      shortForm: '',
      factorValue: '',
      isBase: false,
      isEdit: true
    };
    const updatedUnits = [...units, newRow]
    const updateBasicInfo = {
      ...unitSetBasicInfo,
      units: updatedUnits
    }
    dispatch( bindUnitSetInfo( updateBasicInfo ) )

  };

  const handleOnChange = ( e, rowId ) => {
    const { type, name, value, checked } = e.target;
    const { units } = unitSetBasicInfo;
    const updatedUnits = units.map( unit => {
      if ( unit.rowId === rowId ) {
        unit = {
          ...unit,
          [name]: type === 'checkbox' ? checked : type === 'number' ? Number( value ) : value
        };
      } else {
        if ( type === 'checkbox' ) {
          unit = {
            ...unit,
            [name]: false
          };
        }
      }
      return unit;
    } );
    const updateBasicInfo = {
      ...unitSetBasicInfo,
      units: updatedUnits
    }
    dispatch( bindUnitSetInfo( updateBasicInfo ) )
  };

  const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes!',
    cancelButtonText: 'No'
  };

  // const handleUnitRowsDelete = ( rowId ) => {
  //   confirmDialog( confirmObj )
  //     .then( e => {
  //       if ( e.isConfirmed ) {
  //         const { units } = unitSetBasicInfo;
  //         const updatedUnits = units.filter( d => d.rowId !== rowId );
  //         const updateBasicInfo = {
  //           ...unitSetBasicInfo,
  //           units: updatedUnits
  //         }
  //         dispatch( bindUnitSetInfo( updateBasicInfo ) )
  //       }
  //     } );

  // };


  const handleSubmitChanges = () => {
    const { units } = unitSetBasicInfo;

    const submittedObj = {
      ...unitSetBasicInfo,
      isActive: true,
      units: units.map( unit => ( {
        id: unit.id ?? 0,
        name: unit?.name,
        unitOfMeasureSetId: unitSetBasicInfo.id,
        note: unit.note,
        shortForm: unit.shortForm,
        factorValue: unit.factorValue,
        isBase: unit.isBase,
      } ) )
    }
    console.log( 'submittedObj', JSON.stringify( submittedObj, null, 2 ) )
    dispatch( updateUnitSet( submittedObj ) )
      .then( ( res ) => {
        console.log( res )
        if ( res.error ) {
          return;
        } else {
          dispatch( getUnitSetByIdForAssign( state.id ) )
          toast.success( 'Successfully Completed' )
        }

      } )
  };


  return (
    <>
      <Card className="p-1" style={{ height: "80vh" }}>
        <CardBody>
          <div className='text-end'>
            <Button
              color='success'
              size='sm'
              // onClick={() => { handleSubmitChanges() }}
              onClick={handleSubmit( handleSubmitChanges )}

            >Save</Button>
            <Button
              className='ms-1'
              color='info'
              size='sm'
              onClick={() => { navigate( -1 ); }}
            >Back</Button>
          </div>
          <Row>
            <Col xs="3" sm="3" md="3" lg="3" xl="3" className="text-nowrap">
              <Label className="text-dark font-weight-bold pb-1" for="styleNo">
                Unit Set Name
              </Label>
              <p className="h4 font-weight-bold">{unitSetBasicInfo?.name}</p>
            </Col>
            <Col xs="3" sm="3" md="3" lg="3" xl="3" className="text-nowrap">
              <Label className="text-dark font-weight-bold pb-1" for="season">
                Descriptions
              </Label>
              <p className="h4 font-weight-bold">{unitSetBasicInfo?.note}</p>
            </Col>
          </Row>

          <div className="divider divider-left divider-primary">
            <div className="divider-text text-secondary font-weight-bolder">
              Units
            </div>
          </div>

          <div className="border p-1">
            <Row className="custom-table">
              <Col className="pl-1 pr-0">
                <Table responsive bordered>
                  <thead className="text-center">
                    <tr>
                      <th>Action</th>
                      <th>Unit Name</th>
                      <th>Unit Code</th>
                      <th>Unit Description</th>
                      <th>Factor</th>
                      <th>Base Unit</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {unitSetBasicInfo?.units?.map( ( uData, i ) => (
                      <tr key={i}>
                        <td className="sl" style={{ padding: '0px' }}>
                          <span className="d-flex justify-content-center">
                            {
                              uData?.isEdit ?
                                <Button.Ripple
                                  id="editRow"
                                  // tag={Label}
                                  onClick={() => { handleUnitsEditControlDisabled( uData.rowId ) }}
                                  className="btn-icon p-0"
                                  color="flat-success"
                                >
                                  <CheckSquare
                                    size={16}
                                    id="editRow"
                                    color="purple"

                                  />
                                </Button.Ripple>
                                :
                                <Button.Ripple
                                  id="editRow"
                                  // tag={Label}
                                  onClick={() => { handleUnitsEditControl( uData.rowId ); }}
                                  className="btn-icon p-0"
                                  color="flat-success"
                                >

                                  <Edit
                                    size={16}
                                    id="editRow"
                                    color="green"

                                  />
                                </Button.Ripple>
                            }


                          </span>
                        </td>
                        <td style={{ padding: '0px' }}>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            bsSize="sm"
                            value={uData.name}
                            disabled={!uData.isEdit}
                            onChange={( e ) => { handleOnChange( e, uData.rowId ); }}
                            className={
                              findIsEdit[0]?.rowId === uData.rowId ?
                                classNames( `erp-dropdown-select ${( errors && errors?.name && !nameLen ) && 'is-invalid'}` )
                                : ''
                            }

                          />
                        </td>
                        <td style={{ padding: '0px' }}>
                          <Input
                            type="text"
                            name="shortForm"
                            id="shortForm"
                            bsSize="sm"
                            value={uData.shortForm}
                            disabled={!uData.isEdit}
                            onChange={( e ) => { handleOnChange( e, uData.rowId ); }}
                            className={
                              findIsEdit[0]?.rowId === uData.rowId ?
                                classNames( `erp-dropdown-select ${( errors && errors?.shortName && !shortNameLen ) && 'is-invalid'}` )
                                : ''
                            }

                          />
                        </td>

                        <td style={{ padding: '0px' }}>
                          <Input
                            type="text"
                            name="note"
                            id="note"
                            bsSize="sm"
                            value={uData.note}
                            disabled={!uData.isEdit}
                            onChange={( e ) => { handleOnChange( e, uData.rowId ); }}
                          />
                        </td>
                        <td style={{ padding: '0px' }}>
                          <Input
                            type="number"
                            name="factorValue"
                            id="factorValue"
                            bsSize="sm"
                            value={!uData.isBase ? uData.factorValue : 1}
                            disabled={!uData.isEdit}
                            onChange={( e ) => { handleOnChange( e, uData.rowId ); }}
                            onFocus={( e ) => { e.target.select() }}
                            className={
                              findIsEdit[0]?.rowId === uData.rowId ?
                                classNames( `erp-dropdown-select ${( errors && errors?.factorField && !factorLen ) && 'is-invalid'}` )
                                : ''
                            }
                          />
                        </td>
                        <td style={{ padding: '0px' }}>
                          <span className="d-flex justify-content-center">
                            <FormGroup check className="mt-1">
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="isBase"
                                  id="isBase"
                                  disabled={!uData.isEdit}
                                  checked={uData?.isBase}
                                  onChange={( e ) => { handleOnChange( e, uData.rowId ); }}
                                />
                              </Label>
                            </FormGroup>
                          </span>
                        </td>
                      </tr>
                    ) )}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>

              <Col className="d-flex " xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button.Ripple
                  id="AddSegRowId"
                  tag={Label}
                  // hidden={( findIsEdit.length > 0 && ( !( nameLen > 0 ) || !( shortNameLen > 0 ) || !( factorLen > 0 ) ) ) ?? true}

                  onClick={() => { addUnitRows(); }}
                  className="btn-icon cursor-pointer"
                  color="flat-success"
                >
                  <PlusSquare size={18} id="AddSegRowId" color="green" />
                </Button.Ripple>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>


    </>
  );
};

export default unitAddForm;

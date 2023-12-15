import Sidebar from "@components/sidebar"
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from "classnames"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "reactstrap"
import * as yup from 'yup'
import InInput from "../../../../utility/custom/InInput"
import { bindUnitSetInfo, getAllUnitSetByFilter, updateUnitSet } from "../store"


const UnitEditForm = ( { editFormOpen, toggleEditSidebar, currentPage } ) => {
  const { unitSetBasicInfo } = useSelector( ( { units } ) => units );
  console.log( 'unitSetBasicInfo', unitSetBasicInfo )

  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState( false );

  const unitsSchema = yup.object().shape( {
    name: unitSetBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( unitsSchema )
  } );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const { units } = unitSetBasicInfo
    const updatedObj = {
      ...unitSetBasicInfo,
      units,
      [name]: value
    };
    dispatch( bindUnitSetInfo( updatedObj ) );
  };




  const handleOnSubmit = () => {
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
    dispatch( updateUnitSet( submittedObj ) )
      .then( () => {
        const paramObj = {
          page: currentPage,
          pageSize: 10
        }
        dispatch( getAllUnitSetByFilter( paramObj ) )
        toggleEditSidebar()
        toast.success( 'Updated Successfully' );
      } )
  };

  const handleSidebarClosed = () => {
    toggleEditSidebar();
  };

  const handleReset = () => {
    toggleEditSidebar();
  }


  return (
    <>
      <Sidebar
        size="lg"
        open={editFormOpen}
        title="Edit Units"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleEditSidebar}
        onClosed={handleSidebarClosed}
      >
        <div>
          <InInput
            label="Unit Set Name"
            name="name"
            id="sku"
            value={unitSetBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ) }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !unitSetBasicInfo?.name ) && 'is-invalid'}` )}
          />


          <InInput
            label="Description"
            name="note"
            id="sku"
            value={unitSetBasicInfo.note}
            onChange={( e ) => { handleOnChange( e ) }}
          />

        </div>
        <div className="mt-1">
          <Button type="submit" size="sm" className="me-1" color="primary"
            // onClick={() => { handleOnSubmit() }}
            onClick={handleSubmit( handleOnSubmit )}

          >
            Update
          </Button>
          <Button type="reset" size="sm" color="secondary" outline onClick={() => { handleReset() }}>
            Cancel
          </Button>
        </div>
      </Sidebar>

    </>
  )
}

export default UnitEditForm

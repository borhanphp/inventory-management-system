import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import InInput from "../../../../utility/custom/InInput";
import { addNewUnitSet, bindUnitSetInfo, getAllUnitSetByFilter } from "../store";
import { initialUnitSetData } from "../store/model";


const ItemForm = ( { open, toggleSidebar } ) => {
  const { unitSetBasicInfo } = useSelector( ( { units } ) => units );
  const dispatch = useDispatch();

  const unitsSchema = yup.object().shape( {
    name: unitSetBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' )
  } );
  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( unitsSchema )
  } );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...unitSetBasicInfo,
      [name]: value
    };
    dispatch( bindUnitSetInfo( updatedObj ) );
  };


  const handleOnSubmit = () => {
    dispatch( addNewUnitSet( { ...unitSetBasicInfo } ) )
      .then( () => {
        const paramObj = {
          page: 1,
          pageSize: 10
        }
        dispatch( getAllUnitSetByFilter( paramObj ) )
        toggleSidebar();
        toast.success( 'Unit Set has been added' );
      } )

  };
  const handleReset = () => {
    reset();
    dispatch( bindUnitSetInfo( initialUnitSetData ) );
  };

  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Unit Set"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
      >
        <div>
          <InInput
            label="Unit Set Name"
            name="name"
            id="sku"
            value={unitSetBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !unitSetBasicInfo?.name ) && 'is-invalid'}` )}
          />


          <InInput
            label="Description"
            name="note"
            id="sku"
            value={unitSetBasicInfo.note}
            onChange={( e ) => { handleOnChange( e ); }}
          />

        </div>
        <div className="mt-1">
          <Button type="submit" size="sm" className="me-1" color="primary"
            // onClick={() => { handleOnSubmit() }}
            onClick={handleSubmit( handleOnSubmit )}

          >
            Submit
          </Button>
          <Button type="reset" size="sm" color="secondary" outline onClick={() => { handleReset(); }}>
            Clear
          </Button>
        </div>
      </Sidebar>

    </>
  );
};

export default ItemForm;

import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import InInput from "../../../../utility/custom/InInput";
import { addNewCurrency, bindCurrencyInfo, getAllCurrencyByFilter } from "../store";

const CurrencyForm = ( { open, toggleSidebar, handleFormOpen } ) => {
  const { currencyBasicInfo } = useSelector( ( { currencies } ) => currencies );
  const dispatch = useDispatch();

  const currencySchema = yup.object().shape( {
    name: currencyBasicInfo?.name?.length ? yup.string() : yup.string().required( 'Name is Required!!!' ),
    rate: currencyBasicInfo?.rate?.length ? yup.string() : yup.string().required( 'Rate is Required!!!' )
  } );

  const { reset, handleSubmit, formState: { errors } } = useForm( {
    mode: 'onChange',
    resolver: yupResolver( currencySchema )
  } );

  const handleOnChange = ( e ) => {
    const { name, value } = e.target;
    const updatedObj = {
      ...currencyBasicInfo,
      [name]: value
    };
    dispatch( bindCurrencyInfo( updatedObj ) );
  };


  const handleOnSubmit = () => {
    if ( isNaN( currencyBasicInfo?.rate ) ) {
      toast.error( 'Rate Should be a number' )
    } else {
      dispatch( addNewCurrency( currencyBasicInfo ) )
        .then( ( res ) => {
          if ( res.error ) {
            return;
          } else {
            const paramsObj = {
              page: 1,
              pageSize: 10
            };
            dispatch( getAllCurrencyByFilter( paramsObj ) )
            toggleSidebar()
            toast.success( 'New Currency Added' )
          }
        } )
    }
  };
  const handleReset = () => {
    reset();
    dispatch( bindCurrencyInfo( null ) );
  };

  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title="New Currency"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        onClose={handleFormOpen}
      >
        <div>
          <InInput
            label="Currency Name"
            name="name"
            bsSize="sm"
            id="nameId"
            value={currencyBasicInfo.name}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.name && !currencyBasicInfo?.name ) && 'is-invalid'}` )}
          />

          <InInput
            label="Rate"
            name="rate"
            bsSize="sm"
            id="rateId"
            value={currencyBasicInfo.rate}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.rate && !currencyBasicInfo?.rate ) && 'is-invalid'}` )}
          />
          <InInput
            label="Currency Sign"
            name="sign"
            bsSize="sm"
            id="sign"
            value={currencyBasicInfo.sign}
            onChange={( e ) => { handleOnChange( e ); }}
          />

          <InInput
            label="Note"
            name="note"
            bsSize="sm"
            id="note"
            value={currencyBasicInfo.description}
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
          <Button type="reset" size="sm" color="secondary" outline onClick={() => { handleReset() }}>
            Reset
          </Button>
        </div>
      </Sidebar>

    </>
  );
};

export default CurrencyForm;

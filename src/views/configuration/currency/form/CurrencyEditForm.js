import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import InInput from "../../../../utility/custom/InInput";
import { bindCurrencyInfo, getAllCurrency, updateCurrency } from "../store";


const CurrencyEditForm = ( { editFormOpen, toggleEditSidebar, currentPage } ) => {
  const { currencyBasicInfo } = useSelector( ( { currencies } ) => currencies );
  const dispatch = useDispatch();

  const currencySchema = yup.object().shape( {
    name: currencyBasicInfo?.name?.length
      ? yup.string()
      : yup.string().required( 'Name is Required!!!' ),
    rate: currencyBasicInfo?.rate
      ? yup.number()
      : yup.number().typeError( 'Rate should be a Number' ).required( 'Rate is Required!!!' )
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
    if ( isNaN( currencyBasicInfo.rate ) ) {
      toast.error( 'Rate Should be a number' )
    } else {
      dispatch( updateCurrency( { ...currencyBasicInfo } ) )
        .then( ( res ) => {
          if ( res.error ) {
            return;
          } else {
            const paramsObj = {
              page: currentPage,
              pageSize: 10
            };
            dispatch( getAllCurrency( paramsObj ) )
            toggleEditSidebar()
            toast.success( 'Currency Updated' )
          }

        } )

    }
  };

  return (
    <>
      <Sidebar
        size="lg"
        open={editFormOpen}
        title="Edit Currency"
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleEditSidebar}
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
          {errors?.name && !currencyBasicInfo?.name && <small className="text-danger">Name is required.</small>}

          <InInput
            label="Rate"
            name="rate"
            bsSize="sm"
            id="rateId"
            value={currencyBasicInfo.rate}
            onChange={( e ) => { handleOnChange( e ); }}
            className={classNames( `erp-dropdown-select ${( errors && errors?.rate && !currencyBasicInfo?.rate ) && 'is-invalid'}` )}
          />
          {errors?.rate && !currencyBasicInfo?.rate && <small className="text-danger">Rate is required.</small>}

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
            value={currencyBasicInfo.note}
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

export default CurrencyEditForm;

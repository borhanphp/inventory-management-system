import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import ErpInput from "../../../../utility/custom/ErpInput";
import { bindAreaInfo, filterParams, getAllAreaByFilter, initialAreaData, updateArea } from "../store";


const AreaEditForm = ( { editFormOpen, toggleEditSidebar, currentPage, pageSize } ) => {
    const { areaBasicInfo } = useSelector( ( { area } ) => area );
    const dispatch = useDispatch();
    const [submitted, setSubmitted] = useState( false );

    const areaSchema = yup.object().shape( {
        name: areaBasicInfo?.name?.trim().length ? yup.string() : yup.string().required( 'Name is Required!!!' )
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( areaSchema )
    } );

    useEffect( () => {
        if ( submitted ) {
            dispatch( bindAreaInfo( initialAreaData ) );
        }
    }, [submitted] );

    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...areaBasicInfo,
            [name]: value
        };
        dispatch( bindAreaInfo( updatedObj ) );
    };


    const handleOnSubmit = () => {
        dispatch( updateArea( { ...areaBasicInfo } ) )
            .then( () => {
                const paramObj = { ...filterParams, pageSize }
                dispatch( getAllAreaByFilter( paramObj ) )
                toggleEditSidebar()
                toast.success( 'Zone Updated' )
            } );;

    };

    const handleSidebarClosed = () => {
        toggleEditSidebar();
    };

    return (
        <>
            <Sidebar
                size="lg"
                open={editFormOpen}
                title="Edit Area"
                headerClassName="mb-1"
                contentClassName="pt-0"
                toggleSidebar={toggleEditSidebar}
            >
                <div>
                    <ErpInput
                        label="Area Name"
                        name="name"
                        bsSize="sm"
                        id="nameId"
                        sideBySide={false}
                        value={areaBasicInfo.name}
                        onChange={( e ) => { handleOnChange( e ); }}
                        className={classNames( `erp-dropdown-select ${( errors && errors?.name && !areaBasicInfo?.name.trim() ) && 'is-invalid'}` )}
                    />
                    {errors?.name && !areaBasicInfo?.name && <small className="text-danger">Name is required.</small>}

                    <ErpInput
                        label="Short Description"
                        name="note"
                        bsSize="sm"
                        id="note"
                        sideBySide={false}
                        value={areaBasicInfo.note}
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

export default AreaEditForm;

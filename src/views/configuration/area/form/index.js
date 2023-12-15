import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import * as yup from 'yup';
import InInput from "../../../../utility/custom/InInput";
import { addNewArea, bindAreaInfo, filterParams, getAllAreaByFilter, initialAreaData } from "../store";



const AreaForm = ( { open, toggleSidebar, handleFormOpen, pageSize } ) => {
    const { areaBasicInfo } = useSelector( ( { area } ) => area );
    const [isLoading, setIsLoading] = useState( false );
    const [submitted, setSubmitted] = useState( false );
    const dispatch = useDispatch();


    const areaSchema = yup.object().shape( {
        name: areaBasicInfo?.name?.trim().length ? yup.string() : yup.string().required( 'Name is Required!!!' )
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( areaSchema )
    } );


    // useEffect( () => {
    //     if ( submitted ) {
    //         dispatch( bindZoneInfo( initialZoneData ) );
    //         toast.success( 'Brand has been added' );
    //     }
    // }, [submitted] );

    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...areaBasicInfo,
            [name]: value
        };
        dispatch( bindAreaInfo( updatedObj ) );
    };

    const handleOnSubmit = () => {
        dispatch( addNewArea( areaBasicInfo ) )
            .then( () => {
                const paramObj = { ...filterParams, pageSize }
                dispatch( getAllAreaByFilter( paramObj ) )
                toggleSidebar()
                toast.success( 'New Area Added' )
            } );
    };
    const handleReset = () => {
        reset();
        dispatch( bindAreaInfo( initialAreaData ) );

    };

    return (
        <>
            <Sidebar
                size="lg"
                open={open}
                title="New Area"
                headerClassName="mb-1"
                contentClassName="pt-0"
                toggleSidebar={toggleSidebar}
                onClose={handleFormOpen}
            >
                <div>
                    <InInput
                        label="Area Name"
                        name="name"
                        bsSize="sm"
                        id="nameId"
                        value={areaBasicInfo.name}
                        onChange={( e ) => { handleOnChange( e ); }}
                        className={classNames( `erp-dropdown-select ${( errors && errors?.name && !areaBasicInfo?.name.trim() ) && 'is-invalid'}` )}
                    />
                    {errors?.name && !areaBasicInfo?.name && <small className="text-danger">Name is required.</small>}

                    <InInput
                        label="Short Description"
                        name="note"
                        bsSize="sm"
                        id="note"
                        value={areaBasicInfo.note}
                        onChange={( e ) => { handleOnChange( e ); }}
                    />

                </div>
                <div className="mt-1">
                    <Button type="submit" size="sm" className="me-1" color="primary"
                        onClick={handleSubmit( handleOnSubmit )}
                    >
                        Submit
                    </Button>
                    <Button
                        type="reset"
                        size="sm" c
                        color="secondary"
                        outline
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </Sidebar>

        </>
    );
};

export default AreaForm;

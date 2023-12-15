import Sidebar from "@components/sidebar";
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import { Plus } from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label } from "reactstrap";
import * as yup from 'yup';
import { API } from "../../../../services/api_endpoint";
import ErpInput from "../../../../utility/custom/ErpInput";
import InInput from "../../../../utility/custom/InInput";
import { randomIdGenerator } from '../../../../utility/Utils';
import { bindFeaturedCategoryInfo, getAllFeaturedCategoryByFilter, updateFeaturedCategory } from "../store";



const EditForm = ( { editFormOpen, toggleEditSidebar, handleEditFormOpen, itemsToggle, currentPage } ) => {
    const { featuredCategoryBasicInfo } = useSelector( ( { featuredCategories } ) => featuredCategories );
    const { categoryDataCm } = useSelector( ( { commons } ) => commons );
    const dispatch = useDispatch();
    const { image, imageUrl } = featuredCategoryBasicInfo;
    const featuredCategorySchema = yup.object().shape( {
        name: featuredCategoryBasicInfo?.name.length ? yup.string() : yup.string().required( 'categoryId is Required!!!' )
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( featuredCategorySchema )
    } );

    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...featuredCategoryBasicInfo,
            [name]: value
        };
        dispatch( bindFeaturedCategoryInfo( updatedObj ) );
    };

    const handleModalOpen = () => {
        itemsToggle()
        const editData = {
            ...featuredCategoryBasicInfo,
            isEdit: true
            // [name]: `${formatDate + ' ' + thisTime}`
        };
        dispatch( bindFeaturedCategoryInfo( editData ) );
    }



    const handleOnSubmit = () => {
        const { id, name, comments, image, items } = featuredCategoryBasicInfo;
        const submittedData = {
            id: id,
            name: name?.trim(),
            comments: comments,
            image: image,
            imageUrl: imageUrl,
            isActive: true,
            items: items?.map( ( item ) => ( {
                itemId: item.itemId ? item.itemId : item.id,
                comments: item.comments ?? ''
            } ) )
        }

        image ? delete submittedData.imageUrl : delete submittedData.image

        // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( updateFeaturedCategory( submittedData ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    const paramObj = {
                        page: currentPage,
                        pageSize: 10
                    }
                    dispatch( getAllFeaturedCategoryByFilter( paramObj ) )
                    toggleEditSidebar()
                    toast.success( 'Updated Successfully' )
                }

            } )
    };

    // handling images upload with this function
    const handleFileUpload = ( e ) => {
        const files = e.target.files[0];
        let imageObj = {};

        if ( files ) {
            const reader = new FileReader()
            reader.onload = ( event ) => {
                const base64Data = event.target.result;
                imageObj = {
                    name: files.name.split( "." ).shift(),
                    isBase: false,
                    extension: `.` + files.type.split( "/" ).pop(),
                    data: base64Data,
                    imgId: randomIdGenerator()
                };

                if ( imageObj ) {
                    dispatch( bindFeaturedCategoryInfo( { ...featuredCategoryBasicInfo, image: imageObj } ) );
                }
            };
            reader.readAsDataURL( files );
        }
    };


    const handleReset = () => {
        reset();
    };

    return (
        <>
            <Sidebar
                size="lg"
                open={editFormOpen}
                title="Edit Featured Category"
                headerClassName="mb-1"
                contentClassName="pt-0"
                toggleSidebar={toggleEditSidebar}
                onClose={handleEditFormOpen}
            >
                <div>

                    <InInput
                        label="Category Name"
                        name="name"
                        bsSize="sm"
                        value={featuredCategoryBasicInfo.name}
                        onChange={( e ) => { handleOnChange( e ); }}
                        className={classNames( `erp-dropdown-select ${( errors && errors?.name && !featuredCategoryBasicInfo?.name ) && 'is-invalid'}` )}

                    />

                    <InInput
                        label="Note"
                        name="comments"
                        bsSize="sm"
                        id="comments"
                        value={featuredCategoryBasicInfo.comments}
                        onChange={( e ) => { handleOnChange( e ); }}
                    />


                    <div className="mt-1">
                        {
                            image || imageUrl &&
                                image?.data || imageUrl ?
                                <img
                                    // src={image?.data}
                                    src={image?.data && image?.data || imageUrl && `${API}/${imageUrl?.replace( 'wwwroot/', '' )}`}
                                    alt=""
                                    className='w-100'
                                    style={{
                                        height: '250px',
                                        objectFit: 'cover'
                                    }}
                                />
                                :
                                <img
                                    src="/null-photo.png"
                                    alt=""
                                    className='w-100'
                                    style={{
                                        height: '250px',
                                        objectFit: 'cover'
                                    }}
                                />

                        }


                        <Label className='btn btn-light w-100 btn-sm mt-1'>
                            Choose Images
                            <ErpInput
                                hidden
                                type="file"
                                sideBySide={false}
                                readOnly={true}
                                onChange={( e ) => { handleFileUpload( e ) }}
                            />
                        </Label>
                    </div>

                    <ErpInput
                        classNames="mt-1"
                        label="Select Items"
                        sideBySide={false}
                        readOnly={true}
                        style={{ fontWeight: 'bold' }}
                        value={`${featuredCategoryBasicInfo?.items?.length} items added`}
                        secondaryOption={
                            <div className="input-group-append" style={{ zIndex: 0 }}>
                                <Button.Ripple
                                    onClick={() => {
                                        handleModalOpen();
                                    }}
                                    style={{ minHeight: "30px", minWidth: "35px" }}
                                    className="btn-icon w-100 pt-0 p-0 h-100"
                                    color="primary"
                                >
                                    <Plus size={16} />
                                </Button.Ripple>
                            </div>
                        }
                    />
                </div>
                <div className="mt-1">
                    <Button type="submit" size="sm" className="me-1" color="primary"
                        // onClick={() => { handleOnSubmit(); }}
                        onClick={handleSubmit( handleOnSubmit )}
                    >
                        Update
                    </Button>
                    <Button type="reset" size="sm" color="secondary" outline onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </Sidebar>

        </>
    );
};

export default EditForm;

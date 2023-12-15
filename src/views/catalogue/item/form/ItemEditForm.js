import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import classNames from 'classnames';
import { useEffect, useState } from "react";
import { CheckSquare, Plus, PlusSquare, Square, Trash2, XSquare } from 'react-feather';
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Button,
    Col, FormGroup, Input, Label, Modal,
    ModalBody,
    ModalHeader,
    NavItem,
    Row
} from "reactstrap";
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import * as yup from 'yup';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import '../../../../assets/scss/item/item-style.scss';
import { getAllBrandCm, getAllCategoryForItem, getAllCountriesCm, getAllItemTypeCm, getAllPackageTypeCm, getAllSegmentCm, getAllUnitCm, getSegmentValuesCm } from '../../../../redux/common/store';
import { API, generalStoreApi } from '../../../../services/api_endpoint';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CreateSelect from '../../../../utility/custom/CreateSelect';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import InInput from '../../../../utility/custom/InInput';
import InSelect from '../../../../utility/custom/InSelect';
import { randomIdGenerator } from '../../../../utility/Utils';
import { addNewBrand } from '../../brand/store';
import { addNewCategory } from '../../category/store';
import { initialCategoryData } from '../../category/store/model';
import { addNewItemType } from '../../itemtype/store';
import { initialItemTypeData } from '../../itemtype/store/model';
import { addNewPackageType, getPackageTypeById } from '../../packagetype/store';
import { addNewSegment, getSegmentsByCategoryId } from '../../segment/store';
import { initialSegmentData } from '../../segment/store/model';
import { initialItemState } from "../model";
import { bindItemInfo, deleteItemImage, getAllItem, getItemById, updateItems } from "../store";




const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];


const ItemEditForm = () => {
    const { itemBasicInfo } = useSelector( ( { items } ) => items );
    const { unitDataCm, brandDataCm, itemCategories, itemTypeDataCm, packageTypeDataCm, countriesData, segmentDataCm, segmentValuesCm } = useSelector( ( { commons } ) => commons );
    const [packageTypeSizes, setPackageTypeSizes] = useState( [] )

    // console.log( itemBasicInfo )
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const itemId = location.state

    let getSerial = itemBasicInfo?.segments?.map( ( d ) => d?.serial );
    let maxSerial = Math.max( ...getSerial );
    console.log( 'maxSerial', maxSerial );

    useEffect( () => {
        dispatch( getItemById( itemId ) );
    }, [itemId] )


    const itemNameValue = itemBasicInfo?.segments?.filter( dd => dd.segmentId && dd.values !== null )?.map( d => d?.values )?.map( d => d?.label ).join( ' ' );


    const addSegmentRows = () => {
        dispatch( bindItemInfo(
            {
                ...itemBasicInfo,
                segments: [
                    ...itemBasicInfo.segments,
                    {
                        rowId: randomIdGenerator(),
                        value: [],
                        serial: maxSerial > 1 ? maxSerial + 1 : 3,
                        values: null
                    }]
            } ) )
    };

    const [openModal, setOpenModal] = useState( false );
    const [sidebarOpen, setSidebarOpen] = useState( false );

    const addItemSchema = yup.object().shape( {
        itemName: itemBasicInfo?.itemName?.length ? yup.string() : yup.string().required( 'Item Name is Required!!!' ),
        category: itemBasicInfo?.categoryId ? yup.string() : yup.string().required( 'Category is Required!!!' ),
        itemType: itemBasicInfo?.itemTypeId ? yup.string() : yup.string().required( 'itemType is Required!!!' ),
        packageType: itemBasicInfo?.packageTypeId ? yup.string() : yup.string().required( 'packageType is Required!!!' ),
        itemService: itemBasicInfo?.itemService ? yup.string() : yup.string().required( 'itemService is Required!!!' ),
        brand: itemBasicInfo?.brandId ? yup.string() : yup.string().required( 'Brand is Required!!!' ),
        manufacturedCountry: itemBasicInfo?.manufacturedCountry ? yup.string() : yup.string().required( 'manufacturedCountry is Required!!!' ),
        // salesPrice: itemBasicInfo?.salesPrice ? yup.string() : yup.string().required( 'itemType is Required!!!' ),
        uom: itemBasicInfo?.unitOfMeasureId ? yup.string() : yup.string().required( 'UOM is Required!!!' )
    } );

    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( addItemSchema )
    } );

    useEffect( () => {
        return () => {
            dispatch( bindItemInfo( itemBasicInfo ) )
        }
    }, [] )


    const toggleSidebar = () => {
        // dispatch( bindBrandInfo( initialBrandData ) )
        setSidebarOpen( !sidebarOpen );
    }

    const handleValuesFormOpen = () => {
        setSidebarOpen( false );
    };


    // On change function for all input fields without drop down fields
    const handleOnChange = ( e ) => {
        const { type, checked, name, value } = e.target;
        const updatedObj = {
            ...itemBasicInfo,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number( value ) : value
        };
        dispatch( bindItemInfo( updatedObj ) );
    };

    useEffect( () => {
        if ( itemBasicInfo?.categoryId?.id ) {
            dispatch( getSegmentsByCategoryId( itemBasicInfo?.categoryId?.id ) );
        }
    }, [itemBasicInfo?.categoryId] )



    //  Drop Down On change function from drop down fields
    const handleDropDownChange = async ( data, e ) => {
        // console.log( data )
        const { name } = e;
        let updatedObj
        if ( name === 'packageTypeId' ) {
            updatedObj = {
                ...itemBasicInfo,
                packageTypeSizeId: null,
                [name]: data
            };
            const res = await dispatch( getPackageTypeById( data.id ) )
            const packageSizeOptions = res?.payload?.sizes.map( s => (
                { ...s, value: s.packageTypeId, label: s.size }
            ) )
            setPackageTypeSizes( packageSizeOptions )
        } else {
            updatedObj = {
                ...itemBasicInfo,
                [name]: data
            };
        }
        dispatch( bindItemInfo( updatedObj ) );

    };


    const handleDateChange = ( data, name ) => {
        dispatch( bindItemInfo( { ...itemBasicInfo, [name]: data[0] } ) )
    }

    const handleOnSubmit = () => {
        const checkBase = itemBasicInfo?.images?.some( ddd => ddd.isBase === true );
        const {
            categoryId,
            brandId,
            unitOfMeasureId,
            vatType,
            vatPercentage,
            discountType,
            partNo,
            itemType,
            otherChargeType,
            manufacturedCountry,
            itemTypeId,
            packageTypeId,
            itemService,
            segments,
            isAvailableOnEcommerce,
            eshopStockPercentage,
            packageTypeSizeId,
            additionalInfo
        } = itemBasicInfo;

        if ( isAvailableOnEcommerce ) {
            if ( eshopStockPercentage === 0 || !eshopStockPercentage ) {
                toast.error( 'Stock Percentage for E-Commerce Needed and Should Be More Then 0' );
                return;
            }
        }

        const submittedData = {
            ...itemBasicInfo,
            categoryId: categoryId?.value,
            brandId: brandId?.value,
            unitOfMeasureId: unitOfMeasureId?.value,
            vatPercentage: vatPercentage?.value,
            otherChargeType: otherChargeType?.value,
            discountType: discountType?.value,
            vatType: vatType?.value,
            itemType: itemType?.value,
            itemService: itemService?.value,
            itemTypeId: itemTypeId?.value,
            packageTypeId: packageTypeId?.value,
            hasSegments: segments?.filter( dd => dd.segmentId && dd.values !== null )?.length ? true : false,
            manufacturedCountry: manufacturedCountry?.value || 1,
            salesPrice: itemBasicInfo?.salesPrice || 0,
            partNo: partNo ? partNo : "",
            additionalInfo: additionalInfo ? additionalInfo : "",
            packageTypeSizeId: packageTypeSizeId.value,
            packageTypeSize: packageTypeSizeId?.label,
            purchasePrice: itemBasicInfo?.purchasePrice || 0,
            applicableDiscount: itemBasicInfo?.applicableDiscount || 0,
            segments: segments?.filter( dd => dd.segmentId && dd.values !== null )?.map( seg => seg?.values )?.map( ( segData ) => ( {
                segmentId: segData?.segmentId,
                segmentValue: segData?.label,
                serial: segData?.serial,
                isApplicableForVariant: false,
            } ) ),
            images: itemBasicInfo?.images?.map( ( im, imIndex ) => ( {
                id: im.id,
                name: im.image ? im.image : im.name,
                extension: im.extension,
                isBase: checkBase ? im?.isBase : imIndex === 0 ? true : false,
                itemId: im.itemId ? im.itemId : 0,
                data: im.data
            } ) )
        };

        console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) );
        dispatch( updateItems( submittedData ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    const paramObj = {
                        page: 1,
                        pageSize: 10
                    }
                    dispatch( getAllItem( paramObj ) )
                    navigate( "/catalogue/item/list" )
                    toast.success( 'Item Updated Successfully' )
                }

            } )
    };

    console.log( itemBasicInfo.segments )

    const handleFileUpload = ( e ) => {
        const files = e.target.files;
        const imagesArray = [];

        if ( files ) {
            for ( let i = 0; i < files.length; i++ ) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = ( event ) => {
                    const base64Data = event.target.result;
                    imagesArray.push( {
                        id: 0,
                        name: file.name,
                        isBase: false,
                        extension: `.` + file.type.split( "/" ).pop(),
                        data: base64Data,
                        imgId: randomIdGenerator(),
                    } );

                    if ( imagesArray.length === files.length ) {
                        dispatch( bindItemInfo( { ...itemBasicInfo, images: [...itemBasicInfo.images, ...imagesArray] } ) );
                    }
                };

                reader.readAsDataURL( file );
            }
        }
    };

    const handleDefaultImage = ( id ) => {
        // console.log( 'default id', id );

        dispatch( bindItemInfo(
            {
                ...itemBasicInfo,
                images: itemBasicInfo?.images?.map( img => ( {
                    ...img,
                    isBase: ( img.id || img.imgId ) === id ? true : false
                } ) )
            } ) )
        toast.success( 'This Image set as Default' )
    }
    const handleImageView = () => {
        console.log( 'view image' );
    }
    const handleImageDelete = ( img ) => {
        if ( img?.itemId ) {
            dispatch( deleteItemImage( img ) )
                .then( () => {
                    const filteredImage = itemBasicInfo?.images?.filter( d => d.id !== img.id );
                    dispatch( bindItemInfo( { ...itemBasicInfo, images: [...filteredImage] } ) );
                    toast.success( 'Image deleted' )

                } )
        } else {
            const filteredImage = itemBasicInfo?.images?.filter( d => d.imgId !== img.imgId );
            dispatch( bindItemInfo( { ...itemBasicInfo, images: [...filteredImage] } ) );
        }


    }

    const confirmObj = {
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
    };

    const deleteData = ( img ) => {
        confirmDialog( {
            ...confirmObj
        } ).then( async e => {
            if ( e.isConfirmed ) {
                handleImageDelete( img )
            }
        } );
    };



    // clearing the field if needed
    const clearAllField = () => {
        dispatch( bindItemInfo( initialItemState ) );
    };


    // closing modal
    const handleModalClosed = () => {
        setOpenModal( false );
    };

    // this function will call before selecting category field
    // dispatching an action from common redux reducers which is located at src/redux/common/actions folder.
    const handleCategoryOnFocus = () => {
        // if ( !itemCategories.length ) {
        dispatch( getAllCategoryForItem() )
        // }
    }

    // this function will call before selecting segments field
    // dispatching an action from common redux reducers which is located at src/redux/common/actions folder.



    const handleSegmentOnFocus = () => {
        const paramObj = {
            page: 1,
            pageSize: 10000000
        }
        // if ( !segmentDataCm.length ) {
        dispatch( getAllSegmentCm( paramObj ) )
        // }
    }

    // Segments modal open function which will open if category selected
    const handleModalOpen = () => {
        setOpenModal( true )
    }

    // this function will call before selecting brand field
    // dispatching an action from common redux reducers which is located at src/redux/common/actions folder.
    const handleBrandOnFocus = () => {
        // if ( !brandDataCm.length ) {
        dispatch( getAllBrandCm() )
        // }
    }

    // this function will call before selecting UOM (Unit of Measurement) field
    // dispatching an action from common redux reducers which is located at src/redux/common/actions folder.
    const handleUnitOnFocus = () => {
        // if ( !unitDataCm.length ) {
        dispatch( getAllUnitCm() )
        // }
    }
    const paramObj = {
        page: 1,
        pageSize: 100000
    }
    const handleItemTypeOnFocus = () => {
        // if ( !itemTypeDataCm.length ) {
        dispatch( getAllItemTypeCm( paramObj ) )
        // }
    }
    const handlePackageTypeOnFocus = () => {
        // if ( !packageTypeDataCm.length ) {
        dispatch( getAllPackageTypeCm( paramObj ) )
        // }
    }


    const handleInstantCategoryCreate = ( inputData ) => {
        dispatch( addNewCategory( {
            ...initialCategoryData,
            name: inputData
        } ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    const newCategoryId = res?.payload?.id
                    const newCategoryName = res?.payload?.name
                    const newData = {
                        category: newCategoryName,
                        id: newCategoryId,
                        label: newCategoryName,
                        value: newCategoryId
                    }
                    const newE = {
                        action: "select-option",
                        name: "categoryId",
                        option: undefined
                    }

                    handleDropDownChange( newData, newE );
                    toast.success( 'category created successfully' )
                }

            } )
    }

    const handleInstantBrandCreate = ( inputData ) => {
        dispatch( addNewBrand( { name: inputData, countryOfOrigin: 1, note: "" } ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    const newBrandId = res?.payload?.id
                    const newBrandName = res?.payload?.name
                    const newData = {
                        id: newBrandId,
                        label: newBrandName,
                        value: newBrandId
                    }
                    const newE = {
                        action: "select-option",
                        name: "brandId",
                        option: undefined
                    }

                    handleDropDownChange( newData, newE );
                    toast.success( 'New Brand Created' )
                }


            } )
    }
    const handleInstantItemTypeCreate = ( inputData ) => {
        dispatch( addNewItemType( {
            ...initialItemTypeData,
            name: inputData
        } ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    const newId = res?.payload?.id
                    const newName = res?.payload?.name
                    const newData = {
                        id: newId,
                        label: newName,
                        value: newId
                    }
                    const newE = {
                        action: "select-option",
                        name: "itemTypeId",
                        option: undefined
                    }

                    handleDropDownChange( newData, newE );
                    toast.success( 'Item Type Created' )
                }

            } )
    }
    const handleInstantPackageTypeCreate = ( inputData ) => {
        dispatch( addNewPackageType( { name: inputData } ) )
            .then( ( res ) => {
                const newId = res?.payload?.id
                const newName = res?.payload?.name
                const newData = {
                    id: newId,
                    label: newName,
                    value: newId
                }
                const newE = {
                    action: "select-option",
                    name: "packageTypeId",
                    option: undefined
                }

                handleDropDownChange( newData, newE );
                toast.success( 'Package Type Created' )
            } )
    }


    const handleSegmentOnChange = ( data, e, rowId ) => {
        const { segments } = itemBasicInfo;
        const updatedSegments = segments.map( ( row ) => {
            if ( row.rowId === rowId || row.id === rowId ) {
                return {
                    ...row,
                    segmentId: data.value,
                    segmentName: data.label,
                    label: data.label,
                    value: data.label
                };
            }
            return row;
        } );
        const updateBasicInfo = {
            ...itemBasicInfo,
            segments: updatedSegments,
        };
        dispatch( bindItemInfo( updateBasicInfo ) );

    };




    const handleSegmentValueOnChange = ( data, e, rowId ) => {
        const { segments } = itemBasicInfo;
        const newSerial = maxSerial + 1;
        let count = itemBasicInfo.segments.length;
        console.log( 'newSerial', newSerial );


        const updatedSegments = segments.map( ( row ) => {
            if ( row.rowId === rowId || row.id === rowId ) {
                return {
                    ...row,
                    values: {
                        id: data.id,
                        segmentId: data.segmentId,
                        label: data.label,
                        value: data.value,
                        serial: newSerial,
                    },
                };
            }
            return row;
        } );

        const updateBasicInfo = {
            ...itemBasicInfo,
            segments: updatedSegments,
        };
        dispatch( bindItemInfo( updateBasicInfo ) );
    };




    const onFocusValues = ( id ) => {
        dispatch( getSegmentValuesCm( id ) )
    }


    const handleInstantSegmentCreate = ( inputData, rowId ) => {
        dispatch( addNewSegment( {
            ...initialSegmentData,
            name: inputData
        } ) )
            .then( ( res ) => {
                const newId = res?.payload?.id
                const newName = res?.payload?.name
                const newData = {
                    id: newId,
                    label: newName,
                    value: newId
                }
                const newE = {
                    action: "select-option",
                    name: "packageTypeId",
                    option: undefined
                }

                handleSegmentOnChange( newData, newE, rowId );
                toast.success( 'Package Type Created' )
            } )
    }

    const handleCreateValue = ( inputValue, segmentId, rowId ) => {
        const api = `${generalStoreApi.segment.root}/${segmentId}/values`;
        const submittedData = {
            values: [
                {
                    value: inputValue
                }
            ]
        };
        axios.post( api, submittedData )
            .then( ( res ) => {
                const segmentId = res?.data?.segment?.id
                const newValueId = res?.data?.segment?.values?.at( -1 ).id
                const newValueLabel = res?.data?.segment?.values?.at( -1 ).value

                const newData = {
                    id: newValueId,
                    label: newValueLabel,
                    segmentId: segmentId,
                    value: newValueId
                }
                const newE = {
                    action: "select-option",
                    name: 'value',
                    option: undefined
                }

                handleSegmentValueOnChange( newData, newE, rowId )
            } );
    };


    //delete segment row
    const handleRowDelete = ( id ) => {
        confirmDialog( confirmObj ).then( ( e ) => {
            if ( e.isConfirmed ) {
                const updatedRows = itemBasicInfo?.segments?.filter( ( d ) => d.id ? d.id !== id : d.rowId !== id );
                dispatch( bindItemInfo( { ...itemBasicInfo, segments: updatedRows } ) );
            }
        } );
    };

    const getCountries = () => {
        if ( !countriesData.length ) {
            dispatch( getAllCountriesCm() )
        }
    };


    const calculateDiscountAndVat = () => {
        const {
            salesPrice,
            discountType,
            discountPercentage,
            vatPercentage,
            otherChargeType,
            otherChargePercentage
        } = itemBasicInfo;

        let finalPrice = salesPrice || 0;
        let discount = 0;
        let extraCharge = 0;
        let vat = ( salesPrice * ( vatPercentage?.value || 0 ) ) / 100;

        if ( discountType?.value === "Fixed" ) {
            finalPrice -= discountPercentage || 0;
            discount = discountPercentage || 0;;
        } else if ( discountType?.value === "Percentage" ) {
            finalPrice -= ( salesPrice * ( discountPercentage || 0 ) ) / 100;
            discount = ( salesPrice * ( discountPercentage || 0 ) ) / 100;
        }

        if ( otherChargeType?.value === "Fixed" ) {
            finalPrice += otherChargePercentage || 0;
            extraCharge = otherChargePercentage || 0;;
        } else if ( otherChargeType?.value === "Percentage" ) {
            finalPrice += ( salesPrice * ( otherChargePercentage || 0 ) ) / 100;
            extraCharge = ( salesPrice * ( otherChargePercentage || 0 ) ) / 100;
        }

        finalPrice += ( salesPrice * ( vatPercentage?.value || 0 ) ) / 100;

        dispatch( bindItemInfo( { ...itemBasicInfo, finalPrice, applicableDiscount: discount, otherCharge: extraCharge, vat } ) );
    };

    useEffect( () => {
        calculateDiscountAndVat();
    }, [
        itemBasicInfo.salesPrice,
        itemBasicInfo.discountType,
        itemBasicInfo.discountPercentage,
        itemBasicInfo.vatPercentage,
        itemBasicInfo.otherChargeType,
        itemBasicInfo.otherChargePercentage
    ] );



    const discountTypes = [
        { label: 'Fixed', value: "Fixed" },
        { label: 'Percentage', value: "Percentage" }
    ];
    const vatPercent = [
        { label: '0%', value: 0 },
        { label: '5%', value: 5 },
        { label: '10%', value: 10 },
        { label: '15%', value: 15 }
    ];
    const itemServiceOptions = [
        { label: 'Product', value: 'Product' },
        { label: 'Service', value: 'Service' }
    ];

    return (
        <>
            <ActionMenu
                title='Edit Item'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        // onClick={() => { handleOnSubmit() }}
                        onClick={handleSubmit( handleOnSubmit )}
                    >Update</Button>
                </NavItem>
                <NavItem className="mr-1" >
                    <Button
                        size="sm"
                        color="info"
                        onClick={() => { navigate( '/catalogue/item/list' ) }}

                    >
                        View List
                    </Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>
                <FormLayout>
                    <div >
                        <FormContentLayout title="Item Information">

                            <Col md={9}>
                                <Row>
                                    <Col md={6} xl={12}>
                                        <ErpInput
                                            // classNames="mt-1"
                                            label="Item Name"
                                            placeholder="Write Item Name Here"
                                            name="itemName"
                                            sideBySide={false}
                                            style={{ color: "black", fontWeight: "bold" }}
                                            value={itemBasicInfo.itemName}
                                            onChange={( e ) => { handleOnChange( e ) }}
                                            className={classNames( `erp-dropdown-select ${( errors && errors?.itemName && !itemBasicInfo?.itemName ) && 'is-invalid'}` )}
                                            secondaryOption={
                                                <div className="input-group-append" style={{ zIndex: 0, width: "80%" }}>
                                                    <ErpInput
                                                        sideBySide={false}
                                                        name=""
                                                        style={{ color: "black", fontWeight: "bold" }}
                                                        readOnly
                                                        // value={itemBasicInfo?.brandId?.label + ' ' + itemNameValue}
                                                        value={( itemBasicInfo?.brandId?.label ? itemBasicInfo?.brandId?.label : '' ) + ' ' + itemNameValue}
                                                        onChange={() => { }}
                                                    />
                                                </div>
                                            }
                                        />
                                    </Col>
                                    <Col md={6} xl={4}>
                                        <CreateSelect
                                            sideBySide={false}
                                            classNames="mt-1"
                                            label="Category"
                                            name="categoryId"
                                            isClearable
                                            options={itemCategories}
                                            value={itemBasicInfo.categoryId}
                                            onFocus={() => { handleCategoryOnFocus() }}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                            onCreateOption={( inputValue ) => { handleInstantCategoryCreate( inputValue ) }}
                                            className={classNames( `erp-dropdown-select ${( errors && errors?.category && !itemBasicInfo?.categoryId ) && 'is-invalid'}` )}
                                        />
                                    </Col>
                                    <Col md={6} xl={4}>
                                        <CreateSelect
                                            sideBySide={false}
                                            classNames="mt-1"
                                            label="Brand"
                                            name="brandId"
                                            isClearable
                                            options={brandDataCm}
                                            value={itemBasicInfo.brandId}
                                            onFocus={() => { handleBrandOnFocus() }}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                            onCreateOption={( inputValue ) => { handleInstantBrandCreate( inputValue ) }}
                                            className={classNames( `erp-dropdown-select ${( errors && errors?.brand && !itemBasicInfo?.brandId ) && 'is-invalid'}` )}
                                        />
                                    </Col>
                                    <Col md={6} xl={4}>
                                        <InSelect
                                            label="Item Service"
                                            name="itemService"
                                            isClearable
                                            options={itemServiceOptions}
                                            value={itemBasicInfo.itemService}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                            className={classNames( `erp-dropdown-select ${( errors && errors?.itemService && !itemBasicInfo?.itemService ) && 'is-invalid'}` )}

                                        />
                                    </Col>
                                    <Col md={6} xl={4}>
                                        <CreateSelect
                                            sideBySide={false}
                                            classNames="mt-1"
                                            label="Item Type"
                                            name="itemTypeId"
                                            isClearable
                                            options={itemTypeDataCm}
                                            value={itemBasicInfo.itemTypeId}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                            onFocus={() => { handleItemTypeOnFocus() }}
                                            onCreateOption={( inputValue ) => { handleInstantItemTypeCreate( inputValue ) }}

                                            className={classNames( `erp-dropdown-select ${( errors && errors?.itemType && !itemBasicInfo?.itemTypeId ) && 'is-invalid'}` )}

                                        />
                                    </Col>
                                    <Col md={6} xl={4}>
                                        {/* <CreateSelect
                                            sideBySide={false}
                                            classNames="mt-1"
                                            label="Package Type"
                                            name="packageTypeId"
                                            isClearable
                                            options={packageTypeDataCm}
                                            value={itemBasicInfo.packageTypeId}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                            onFocus={() => { handlePackageTypeOnFocus() }}
                                            onCreateOption={( inputValue ) => { handleInstantPackageTypeCreate( inputValue ) }}
                                            className={classNames( `erp-dropdown-select ${( errors && errors?.packageType && !itemBasicInfo?.packageTypeId ) && 'is-invalid'}` )}

                                        /> */}
                                        <ErpSelect
                                            sideBySide={false}
                                            classNames="mt-1"
                                            label="Package Type"
                                            name="packageTypeId"
                                            isClearable
                                            options={packageTypeDataCm}
                                            value={itemBasicInfo.packageTypeId}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                            onFocus={() => { handlePackageTypeOnFocus() }}
                                            className={classNames( `erp-dropdown-select ${( errors && errors?.packageType && !itemBasicInfo?.packageTypeId ) && 'is-invalid'}` )}

                                        />
                                    </Col>
                                    <Col md={6} xl={4}>

                                        <ErpSelect
                                            sideBySide={false}
                                            classNames="mt-1"
                                            label="Package Size"
                                            name="packageTypeSizeId"
                                            isClearable
                                            options={packageTypeSizes}
                                            value={itemBasicInfo.packageTypeSizeId}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                        // onFocus={() => { handlePackageTypeOnFocus() }}
                                        // onCreateOption={( inputValue ) => { handleInstantPackageTypeCreate( inputValue ) }}


                                        />
                                    </Col>

                                    <Col md={6} xl={4}>
                                        <ErpInput
                                            classNames="mt-1"
                                            label="Variants"
                                            placeholder=""
                                            name=""
                                            sideBySide={false}
                                            readOnly={true}
                                            style={{ fontWeight: 'bold' }}
                                            value={itemNameValue}
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
                                    </Col>
                                    <Col md={6} xl={4}>
                                        <InSelect
                                            label="UOM"
                                            name="unitOfMeasureId"
                                            isClearable
                                            options={unitDataCm}
                                            value={itemBasicInfo.unitOfMeasureId}
                                            onFocus={() => { handleUnitOnFocus() }}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                            className={classNames( `erp-dropdown-select ${( errors && errors?.uom && !itemBasicInfo?.unitOfMeasureId ) && 'is-invalid'}` )}
                                        />
                                    </Col>

                                    <Col md={6} xl={4}>
                                        <InSelect
                                            sideBySide={false}
                                            label="Manufactured Country"
                                            name="manufacturedCountry"
                                            isClearable
                                            options={countriesData}
                                            value={itemBasicInfo.manufacturedCountry}
                                            onFocus={() => { getCountries() }}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                            className={classNames( `erp-dropdown-select ${( errors && errors?.manufacturedCountry && !itemBasicInfo?.manufacturedCountry ) && 'is-invalid'}` )}
                                        />
                                    </Col>

                                    <Col md={6} xl={4}>
                                        <InInput
                                            // classNames="mt-1"
                                            label="SKU / Item No."
                                            placeholder=""
                                            name="sku"
                                            value={itemBasicInfo.sku}
                                            onChange={( e ) => { handleOnChange( e ) }}
                                        />
                                    </Col>


                                    <Col md={6} xl={4}>
                                        <InInput
                                            // classNames="mt-1"
                                            label="HS Code"
                                            placeholder=""
                                            name="hsCode"
                                            value={itemBasicInfo.hsCode}
                                            onChange={( e ) => { handleOnChange( e ) }}
                                        />
                                    </Col>

                                    {/* <Col md={6} xl={4}>
                                        <InInput
                                            label="Reorder Point"
                                            // sideBySide={false}
                                            // classNames="mt-1"
                                            type="number"
                                            name="reorderPoint"
                                            value={itemBasicInfo.reorderPoint ?? 0}
                                            onChange={( e ) => {
                                                handleOnChange( e );
                                            }}
                                            onFocus={( e ) => { e.target.select() }}

                                        />
                                    </Col> */}
                                    <Col md={6} xl={4}>
                                        <InInput
                                            // classNames="mt-1"
                                            label="Part No."
                                            placeholder=""
                                            name="partNo"
                                            value={itemBasicInfo.partNo ?? 0}
                                            onChange={( e ) => { handleOnChange( e ) }}

                                        />
                                    </Col>
                                    {/* <Col md={6} xl={4}>
                                        <Label
                                            className="mt-1"
                                            style={{
                                                fontWeight: 'bold'
                                            }}
                                        >Expiry Date</Label>
                                        <CustomDatePicker
                                            placeholder="Expiry Date"
                                            name="statusExpiryDate"
                                            value={itemBasicInfo.statusExpiryDate}
                                            onChange={( data ) => handleDateChange( data, "statusExpiryDate" )}

                                        />
                                    </Col> */}
                                    <Col md={6} xl={4}>
                                        <InInput
                                            // classNames="mt-1"
                                            label="Item Description ( Will be visible in E-Commerce )"
                                            placeholder=""
                                            name="note"
                                            type="textarea"
                                            value={itemBasicInfo.note}
                                            onChange={( e ) => { handleOnChange( e ) }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3} className="mt-1">
                                <div className='item-image-slider'>
                                    {itemBasicInfo?.images?.length > 0 ?
                                        <Swiper
                                            id='1'
                                            spaceBetween={2}
                                            slidesPerView={1}
                                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                                            navigation
                                            pagination={{ clickable: true }}
                                            scrollbar={{ draggable: true }}

                                        >
                                            {itemBasicInfo?.images?.map( ( img, index ) => (
                                                <div key={index + 1}>
                                                    <SwiperSlide
                                                        key={index + 1}
                                                    >
                                                        <img
                                                            src={img?.data ? img.data || ( img?.image ? `${API}/${img?.image?.replace( 'wwwroot/', '' )}` : '' ) : `${API}/${img?.image?.replace( 'wwwroot/', '' )}`}

                                                            alt=""
                                                            className='w-100 item-image'
                                                            style={{
                                                                height: '250px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        <div className='item-image-overlay'></div>
                                                        <span className='item-image-icons'>
                                                            {
                                                                img.isBase ? (
                                                                    <CheckSquare
                                                                        color='white'
                                                                        size={25}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            marginRight: '5px'
                                                                        }} />
                                                                ) : (
                                                                    <Square
                                                                        onClick={() => { handleDefaultImage( img?.imgId || img.id ) }}
                                                                        color='white'
                                                                        size={25}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            marginRight: '5px'

                                                                        }} />
                                                                )
                                                            }
                                                            <XSquare
                                                                onClick={() => { deleteData( img ) }}
                                                                color='white'
                                                                size={25}
                                                                style={{ cursor: 'pointer', marginRight: '5px' }}

                                                            />

                                                        </span>
                                                    </SwiperSlide>
                                                </div>
                                            ) )}
                                        </Swiper>
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
                                            multiple
                                            hidden
                                            type="file"
                                            accept="image/jpg, image/png, image/jpeg"
                                            placeholder=""
                                            name=""
                                            sideBySide={false}
                                            readOnly={true}
                                            onChange={handleFileUpload}
                                        />
                                    </Label>
                                </div>
                            </Col>

                            <hr className='mt-2' />
                            <Col md={4} xl={3}>
                                <InInput
                                    label="Sales Price"
                                    placeholder=""
                                    type="number"
                                    name="salesPrice"
                                    value={itemBasicInfo.salesPrice}
                                    onChange={( e ) => { handleOnChange( e ) }}
                                    onFocus={( e ) => { e.target.select() }}
                                // className={classNames( `erp-dropdown-select ${( errors && errors?.salesPrice && !itemBasicInfo?.salesPrice ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={4} xl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Purchase Price"
                                    placeholder=""
                                    type="number"
                                    name="purchasePrice"
                                    value={itemBasicInfo.purchasePrice}
                                    onChange={( e ) => { handleOnChange( e ) }}
                                    onFocus={( e ) => { e.target.select() }}
                                />
                            </Col>
                            <Col md={4} xl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Wholesale Price"
                                    placeholder=""
                                    type="number"
                                    name="wholeSalePrice"
                                    value={itemBasicInfo.wholeSalePrice}
                                    onChange={( e ) => { handleOnChange( e ) }}
                                    onFocus={( e ) => { e.target.select() }}
                                />
                            </Col>

                            <Col md={4} xl={3}>
                                <ErpSelect
                                    classNames="mt-1"
                                    label="Discount Type"
                                    name="discountType"
                                    sideBySide={false}
                                    isClearable
                                    options={discountTypes}
                                    value={itemBasicInfo.discountType}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}

                                    secondaryOption={
                                        <div className="input-group-append" style={{ zIndex: 0, width: "50%" }}>
                                            <ErpInput
                                                sideBySide={false}
                                                placeholder="value"
                                                name="discountPercentage"
                                                type="number"
                                                value={itemBasicInfo.discountPercentage ?? 0}
                                                onChange={( e ) => { handleOnChange( e ); }}
                                                onFocus={( e ) => { e.target.select() }}
                                            />
                                        </div>
                                    }
                                />

                            </Col>
                            <Col md={4} xl={3}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames="mt-1"
                                    label="Discount"
                                    placeholder=""
                                    type="number"
                                    readOnly
                                    name="applicableDiscount"
                                    value={itemBasicInfo.applicableDiscount}
                                    onChange={( e ) => { handleOnChange( e ) }}
                                    onFocus={( e ) => { e.target.select() }}
                                />
                            </Col>
                            <Col md={4} xl={3}>
                                <InSelect
                                    label="Tax Percentage"
                                    name="vatPercentage"
                                    isClearable
                                    options={vatPercent}
                                    value={itemBasicInfo.vatPercentage}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                />
                            </Col>
                            <Col md={4} xl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Tax"
                                    placeholder=""
                                    name="vat"
                                    type="number"
                                    readOnly
                                    value={itemBasicInfo.vat}
                                    onChange={( e ) => { handleOnChange( e ) }}
                                    onFocus={( e ) => { e.target.select() }}
                                />
                            </Col>

                            <Col md={4} xl={3}>
                                <ErpSelect
                                    label="Other Charge Type"
                                    name="otherChargeType"
                                    sideBySide={false}
                                    classNames="mt-1"
                                    isClearable
                                    options={discountTypes}
                                    value={itemBasicInfo.otherChargeType}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    secondaryOption={
                                        <div className="input-group-append" style={{ zIndex: 0, width: "50%" }}>
                                            <ErpInput
                                                sideBySide={false}
                                                placeholder="value"
                                                name="otherChargePercentage"
                                                type="number"
                                                value={itemBasicInfo.otherChargePercentage}
                                                onChange={( e ) => { handleOnChange( e ); }}
                                                onFocus={( e ) => { e.target.select() }}
                                            />
                                        </div>
                                    }
                                />
                            </Col>
                            <Col md={4} xl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Other Charge"
                                    placeholder=""
                                    type="number"
                                    readOnly
                                    name="otherCharge"
                                    value={itemBasicInfo.otherCharge}
                                    onChange={( e ) => { handleOnChange( e ) }}
                                    onFocus={( e ) => { e.target.select() }}
                                />
                            </Col>

                            <Col md={4} xl={3}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames="mt-1"
                                    label="Final Price"
                                    placeholder=""
                                    name="finalPrice"
                                    type="number"
                                    disabled={true}
                                    value={itemBasicInfo.finalPrice ?? 0}
                                    onChange={() => { }}
                                />
                            </Col>
                            <hr className='mt-2' />

                            <Col md={4} xl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Stock Adjustment"
                                    placeholder="-/+"
                                    name="stock"
                                    type="number"
                                    value={itemBasicInfo.stock}
                                    onChange={( e ) => { handleOnChange( e ) }}
                                    onFocus={( e ) => { e.target.select() }}

                                />
                            </Col>

                            <Col md={4} xl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Stock Percentage for E-Commerce"
                                    placeholder="Stock Percentage for E-Commerce"
                                    name="eshopStockPercentage"
                                    type="number"
                                    value={itemBasicInfo.eshopStockPercentage}
                                    onChange={( e ) => { handleOnChange( e ) }}
                                    onFocus={( e ) => { e.target.select() }}

                                />
                            </Col>

                            <Col md={4} xl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Out Of Stock Msg ( Outlets )"
                                    placeholder="Write here..."
                                    name="outOfStockMsgOutlets"
                                    value={itemBasicInfo.outOfStockMsgOutlets}
                                    onChange={( e ) => { handleOnChange( e ) }}

                                />
                            </Col>

                            <Col md={4} xl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Out Of Stock Msg ( E-Commerce )"
                                    placeholder="Write here..."
                                    name="outOfStockMsgEcommerce"
                                    value={itemBasicInfo.outOfStockMsgEcommerce}
                                    onChange={( e ) => { handleOnChange( e ) }}

                                />
                            </Col>

                            <Col md={12} className="mt-1">

                                <div className="mt-1 mb-1">
                                    <Row>
                                        <Col md={2}>
                                            <FormGroup check className="mt-1">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="isAvailableOnOutlets"
                                                        checked={itemBasicInfo.isAvailableOnOutlets}
                                                        onChange={( e ) => { handleOnChange( e ) }}
                                                    />{" "}
                                                    Visible In Outlets?
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup check className="mt-1">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="showAvailableQtyOnOutlets"
                                                        checked={itemBasicInfo.showAvailableQtyOnOutlets}
                                                        onChange={( e ) => { handleOnChange( e ) }}
                                                    />{" "}
                                                    Show Available Qty On Outlets?
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                        <Col md={2}>
                                            <FormGroup check className="mt-1">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="isAvailableOnEcommerce"
                                                        checked={itemBasicInfo.isAvailableOnEcommerce}
                                                        onChange={( e ) => { handleOnChange( e ) }}
                                                    />{" "}
                                                    Available On E-Commerce?
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup check className="mt-1">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="showAvailableQtyOnEcommerce"
                                                        checked={itemBasicInfo.isAvailableOnEcommerce && itemBasicInfo.showAvailableQtyOnEcommerce}
                                                        onChange={( e ) => { handleOnChange( e ) }}
                                                    />{" "}
                                                    Show Available Qty On E-Commerce?
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                        <Col md={2}>
                                            <FormGroup check className="mt-1">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="isFeaturedInECommerce"
                                                        checked={itemBasicInfo.isAvailableOnEcommerce && itemBasicInfo.isFeaturedInECommerce}
                                                        onChange={( e ) => { handleOnChange( e ) }}
                                                    />{" "}
                                                    Featured In E-Commerce?
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                        </FormContentLayout>
                    </div>
                </FormLayout >
            </div >



            {/* Modal for adding segment and values according to category */}
            <Modal
                isOpen={openModal}
                onClosed={handleModalClosed}
                toggle={() => setOpenModal( !openModal )}
                className="modal-dialog-centered modal-lg"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={() => setOpenModal( !openModal )}
                >
                    Item Variant
                </ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <Row tag="form">
                        <Col xs={12}></Col>
                        <Col xs={12}>
                            <table className="w-100 text-center border">
                                <thead>
                                    <tr className="" style={{ backgroundColor: "#dadce0" }}>
                                        <th style={{ width: "45%" }}>Variant</th>
                                        <th style={{ width: "45%" }}>Value</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemBasicInfo?.segments &&
                                        itemBasicInfo?.segments.map( ( segRows, segIndex ) => {
                                            console.log( 'segRows', segRows )
                                            return (
                                                <tr className="border" key={segIndex}>
                                                    <td className="border" style={{ padding: '0px' }}>
                                                        <CreateSelect
                                                            sideBySide={false}
                                                            name="segment"
                                                            options={segmentDataCm}
                                                            onCreateOption={( inputValue ) => { handleInstantSegmentCreate( inputValue, segRows?.rowId || segRows?.id ) }}
                                                            value={segRows}
                                                            onFocus={() => { handleSegmentOnFocus() }}
                                                            onChange={( data, e ) => {
                                                                handleSegmentOnChange( data, e, segRows?.rowId || segRows?.id );
                                                            }}
                                                        />
                                                    </td>

                                                    <td className="border" style={{ padding: '0px', marginTop: '0px' }}>
                                                        <CreateSelect
                                                            sideBySide={false}
                                                            name="value"
                                                            options={segmentValuesCm}
                                                            onCreateOption={( inputValue ) => { handleCreateValue( inputValue, segRows?.segmentId, segRows?.rowId || segRows?.id ) }}
                                                            value={segRows?.values}
                                                            onFocus={() => { onFocusValues( segRows?.segmentId ) }}
                                                            onChange={( data, e ) => {
                                                                handleSegmentValueOnChange( data, e, segRows?.rowId || segRows?.id );
                                                            }}
                                                        />

                                                    </td>
                                                    <td className="sl" style={{ padding: '0px', width: "10px" }}>
                                                        <span className="d-flex justify-content-center">
                                                            <Button.Ripple
                                                                disabled={itemBasicInfo?.segments?.length === 1 ?? true}
                                                                id="editRow"
                                                                onClick={() => { handleRowDelete( segRows?.rowId ? segRows?.rowId : segRows?.id ); }}
                                                                className="btn-icon p-0 cursor-pointer"
                                                                color="flat-success"
                                                            >
                                                                <Trash2 size={16} id="editRow" color="red" />
                                                            </Button.Ripple>
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        } )
                                    }





                                </tbody>
                            </table>
                            <Button.Ripple
                                id="AddSegRowId"
                                onClick={() => { addSegmentRows(); }}
                                className="btn-icon cursor-pointer"
                                // disabled={!itemBasicInfo?.segments?.at( -1 )}
                                color="flat-success"
                            >
                                <PlusSquare size={18} id="AddSegRowId" color="green" />
                            </Button.Ripple>
                        </Col>
                        <Col className="text-center mt-2" xs={12}>
                            <Button
                                color="primary"
                                className="float-end"
                                size="sm"
                                onClick={handleModalClosed}
                            >
                                Ok
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

            {sidebarOpen &&
                <AddValues
                    open={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    handleValuesFormOpen={handleValuesFormOpen}
                />}
        </ >
    );
};

export default ItemEditForm;
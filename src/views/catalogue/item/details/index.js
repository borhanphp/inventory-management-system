import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, NavItem, Row } from 'reactstrap';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import '../../../../assets/scss/item/item-style.scss';
import { API } from '../../../../services/api_endpoint';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { breadcrumb } from '../../../../utility/Utils';
import { bindItemInfo, getItemById } from '../store';


const itemDetails = () => {
    const { itemBasicInfo } = useSelector( ( { items } ) => items );
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const itemId = location.state;
    console.log( 'itemBasicInfo', itemBasicInfo );

    useEffect( () => {
        dispatch( getItemById( itemId ) );
        return () => {
            dispatch( bindItemInfo( itemBasicInfo ) )
        }
    }, [itemId] );

    const handleAddNew = () => {
        navigate( '/add-item' )
    }
    const handleEdit = () => {
        navigate( '/edit-item', { state: itemId } );
    };

    return (
        <>
            <ActionMenu
                title='Item Details'
                breadcrumb={breadcrumb}
            >
                {/* <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        // onClick={() => { handleOnSubmit() }}
                        onClick={handleSubmit( handleOnSubmit )}
                    >Save</Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        color='secondary'
                        size='sm'
                        onClick={() => { clearAllField(); }}
                    >Clear</Button>
                </NavItem> */}
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={() => { handleEdit() }}
                    >
                        Edit
                    </Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        className=""
                        color="primary"
                        size="sm"
                        onClick={() => { handleAddNew(); }}
                    >
                        Add New
                    </Button>
                </NavItem>
                <NavItem className="" >
                    <Button
                        size="sm"
                        color="info"
                        onClick={() => { navigate( -1 ); }}
                    >
                        View List
                    </Button>
                </NavItem>
            </ActionMenu>
            <div className='mt-3'>
                <FormLayout >
                    <div style={{ height: "100vh" }}>
                        <FormContentLayout title="Item Information">
                            <Col md={9}>
                                <Row>
                                    <Col md={6}>
                                        <ErpDetails label="Item Name" value={itemBasicInfo.description} />
                                    </Col>
                                    <Col md={6}>
                                        <ErpDetails label="Category" value={itemBasicInfo.categoryId?.label} />
                                    </Col>

                                    <Col md={6}>
                                        <ErpDetails label="Type" value={itemBasicInfo.itemType?.label} />
                                    </Col>

                                    <Col md={6}>
                                        <ErpDetails label="Brand" value={itemBasicInfo.brandId?.label} />
                                    </Col>

                                    <Col md={6}>
                                        <ErpDetails label="UOM" value={itemBasicInfo.unitOfMeasureId?.label} />
                                    </Col>
                                    <Col md={6}>
                                        <ErpDetails label="SKU" value={itemBasicInfo.sku} />
                                    </Col>

                                    <Col md={6}>
                                        <ErpDetails label="Part No." value={itemBasicInfo.partNo} />
                                    </Col>

                                    <Col md={6}>
                                        <ErpDetails label="Reorder Point" value={itemBasicInfo.reorderPoint} />
                                    </Col>
                                    <Col md={6}>
                                        <ErpDetails label="Stock" value={itemBasicInfo.stock} />
                                    </Col>
                                    <Col md={6}>
                                        <ErpDetails label="Discount Type" value={itemBasicInfo.discountType?.label} />
                                    </Col>
                                    <Col md={6}>
                                        <ErpDetails label="Discount" value={itemBasicInfo.discount} />
                                    </Col>

                                    <Col md={6}>
                                        <ErpDetails label="Vat Type" value={itemBasicInfo.vatType?.label} />
                                    </Col>
                                    <Col md={6}>
                                        <ErpDetails label="Vat" value={itemBasicInfo.vat} />

                                    </Col>
                                    <Col md={6}>
                                        <ErpDetails label="Description" value={itemBasicInfo.note} />
                                    </Col>

                                </Row>
                            </Col>

                            {/* image column */}
                            <Col md={3} className="">
                                <div className='item-image-slider'>
                                    {itemBasicInfo?.images?.length > 0 ?
                                        <Swiper
                                            spaceBetween={2}
                                            slidesPerView={1}
                                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                                            navigation
                                            pagination={{ clickable: true }}
                                            scrollbar={{ draggable: true }}
                                        >
                                            {itemBasicInfo?.images?.map( ( img, index ) => (
                                                <div key={index}>
                                                    <SwiperSlide>
                                                        <img
                                                            src={img?.data ? img.data || ( img?.image ? `${API}/${img?.image?.replace( 'wwwroot/', '' )}` : '' ) : `${API}/${img?.image?.replace( 'wwwroot/', '' )}`}
                                                            // src={img?.image ? `${API}/${img?.image?.replace( 'wwwroot/', '' )}` || img.data : img?.data}
                                                            alt=""
                                                            className='w-100'
                                                            style={{
                                                                height: '250px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        {/* <div className='item-image-overlay'></div> */}
                                                        {/* <span className='item-image-icons'>
                                                            <CheckSquare
                                                                onClick={() => { handleDefaultImage( img?.imgId ) }}
                                                                color='white'
                                                                size={25}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    marginRight: '5px',

                                                                }} />
                                                            <XSquare
                                                                onClick={() => { handleImageDelete( img?.imgId ) }}
                                                                color='white'
                                                                size={25}
                                                                style={{ cursor: 'pointer', marginRight: '5px' }}

                                                            />
                                                        </span> */}
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

                                    {/* <Label className='btn btn-light w-100 btn-sm mt-1'>
                                        Choose Images
                                        <ErpInput
                                            multiple
                                            hidden
                                            type="file"
                                            placeholder=""
                                            name=""
                                            sideBySide={false}
                                            readOnly={true}
                                            onChange={handleFileUpload}
                                        />
                                    </Label> */}
                                </div>
                            </Col>



                        </FormContentLayout>
                    </div>
                </FormLayout >
            </div >
        </>
    )
}

export default itemDetails
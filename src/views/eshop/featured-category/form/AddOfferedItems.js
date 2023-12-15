import React from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import { getAllItemsCm } from '../../../../redux/common/store';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import { bindFeaturedCategoryInfo, deleteFeaturedCategoryItem, updateFeaturedCategory } from '../store';
import { itemColumn } from './columns';




const AddOfferedItems = ( { openItemsModal, handleItemsModalClosed, itemsToggle } ) => {
    const { allData, totalItems, loading } = useSelector( ( { items } ) => items );
    const { featuredCategoryBasicInfo } = useSelector( ( { featuredCategories } ) => featuredCategories );
    const { itemsDataCm } = useSelector( ( { commons } ) => commons )
    const dispatch = useDispatch();

    const handleItemChange = ( data, e ) => {
        const { name } = e;
        const newItem = {
            ...data,
            quantity: '',
            price: ''
        };

        const duplicateItems = featuredCategoryBasicInfo?.items?.map( dd => dd.id ).includes( data?.id )
        if ( duplicateItems ) {
            toast.success( 'Item already added!' )
        } else {
            dispatch( bindFeaturedCategoryInfo( {
                ...featuredCategoryBasicInfo,
                items: [...featuredCategoryBasicInfo?.items, newItem]
            } ) )
        }

    }

    const handleModal = () => {
        itemsToggle();
    }

    const handleOnChange = ( itemId, e ) => {
        const { name, value } = e.target;
        const updatedItems = featuredCategoryBasicInfo?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: value } : item
        );
        dispatch( bindFeaturedCategoryInfo( {
            ...featuredCategoryBasicInfo,
            items: updatedItems
        } ) )
    };

    const handleOnSubmit = () => {
        const { id, name, image, comments, imageUrl, isActive, items } = featuredCategoryBasicInfo;

        if ( !items.length ) {
            toast.error( 'There are no items to save' );
            return;
        }
        const submittedData = {
            id: id,
            name: name,
            comments: comments ?? '',
            isActive: isActive,
            imageUrl: imageUrl,
            items: items.map( ( item ) => ( {
                itemId: item.featuredCategoryId ? item.itemId : item.id,
                comments: item.comments ?? ''
            } ) )
        }

        // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( updateFeaturedCategory( submittedData ) )
            .then( () => {
                toast.success( "Items Added" );
                itemsToggle();
            } )
    }

    const deleteData = ( data ) => {
        if ( data?.featuredCategoryId ) {
            dispatch( deleteFeaturedCategoryItem( data ) );
        }
        const filteredItems = featuredCategoryBasicInfo.items.filter( d => d.id !== data.id );
        dispatch( bindFeaturedCategoryInfo( {
            ...featuredCategoryBasicInfo,
            items: filteredItems
        } ) )
    }

    const confirmObj = {
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
    };

    const handleRowsDelete = ( data ) => {
        confirmDialog( {
            ...confirmObj
        } ).then( async e => {
            if ( e.isConfirmed ) {
                deleteData( data )
            }
        } );
    };


    const handleItemsOnFocus = () => {
        if ( !itemsDataCm.length ) {
            dispatch( getAllItemsCm() )
        }
    }

    return (
        <div>
            <Modal
                isOpen={openItemsModal}
                onClosed={handleItemsModalClosed}
                toggle={itemsToggle}
                className="modal-dialog-centered modal-xl"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={itemsToggle}
                >
                    Manage Items for Featured Category: <span style={{ fontWeight: 'bolder' }}>{featuredCategoryBasicInfo?.name}</span>
                </ModalHeader>
                <ModalBody className="px-5 pb-5">

                    <div className='px-2'>
                        <Row>
                            <Col md={8} className="mb-2">
                                <ErpSelect
                                    sideBySide={false}
                                    classNames="mt-1"
                                    // options={productOptions}
                                    placeholder="Type Product Name to Search..."
                                    value={null}
                                    // onInputChange={( data, e ) => { handleItemChange( data, e ); }}
                                    options={itemsDataCm}
                                    onFocus={() => { handleItemsOnFocus() }}
                                    onChange={( data, e ) => { handleItemChange( data, e ); }}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    openMenuOnFocus={false}
                                    openMenuOnClick={false}
                                />
                            </Col>
                            <Col md={4} className="mt-1 text-end">
                                {!featuredCategoryBasicInfo?.id || featuredCategoryBasicInfo?.isEdit ? (
                                    <Button
                                        color="primary"
                                        size='sm'
                                        onClick={() => { handleModal() }}
                                    >Ok</Button>
                                ) : (
                                    <Button
                                        color="primary"
                                        size='sm'
                                        onClick={() => { handleOnSubmit() }}
                                    >Save</Button>
                                )}


                            </Col>
                        </Row>
                        <DataTable
                            noHeader
                            persistTableHead
                            defaultSortAsc
                            sortServer
                            // selectableRows
                            // onSort={handleSort}
                            progressPending={loading}
                            progressComponent={
                                <SpinnerComponent />
                            }
                            dense
                            subHeader={false}
                            highlightOnHover
                            responsive={true}
                            paginationServer
                            // expandableRows={true}
                            // expandOnRowClicked
                            columns={itemColumn( handleRowsDelete, handleOnChange )}
                            sortIcon={<ChevronDown />}
                            // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                            className="react-custom-dataTable"
                            // expandableRowsComponent={<SpinnerComponent />}
                            data={featuredCategoryBasicInfo?.items}

                        />


                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default AddOfferedItems;
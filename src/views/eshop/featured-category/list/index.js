// import React, { useState } from 'react'
import { useEffect, useState } from 'react';
import { ChevronDown } from 'react-feather';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import ErpDataTable from '../../../../utility/custom/ErpDataTable';
import ErpInput from '../../../../utility/custom/ErpInput';
import FeaturedCategoryForm from '../form';
import AddOfferedItems from '../form/AddOfferedItems';
import EditForm from '../form/EditForm';
import { bindFeaturedCategoryInfo, deleteFeaturedCategory, getAllFeaturedCategoryByFilter, getFeaturedCategoryById, updateAllDataWithItems } from '../store';
import { initialFeaturedData } from '../store/model';
import { featuredCategoryColumn } from './column';

const initialState = {
    name: '',
};

const List = () => {
    const { allData, totalItems, loading } = useSelector( ( { featuredCategories } ) => featuredCategories );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sidebarOpen, setSidebarOpen] = useState( false );
    const [editFormOpen, setEditFormOpen] = useState( false );
    const [openItemsModal, setOpenItemsModal] = useState( false )
    const [searchData, setSearchData] = useState( initialState );
    const [sortName, setSortName] = useState( 'name' );
    const dispatch = useDispatch();

    // const handleOpenEditSidebar = ( condition ) => {
    //     setEditFormOpen( condition );

    // };

    const handleEdit = ( row ) => {
        setEditFormOpen( true );
        dispatch( getFeaturedCategoryById( row?.id ) );
    };
    const handleAddItems = ( row ) => {
        setOpenItemsModal( true )
        dispatch( getFeaturedCategoryById( row?.id ) );
    };

    const handleItemsModalClosed = () => {
        setOpenDiscountModal( false );
    };

    const deleteData = ( id ) => {
        dispatch( deleteFeaturedCategory( id ) )
            .then( () => {
                const paramObj = {
                    page: 1,
                    pageSize: 10
                }
                dispatch( getAllFeaturedCategoryByFilter( paramObj ) )
                toast.success( 'Category Deleted' )
            } )
    };


    const confirmObj = {
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
    };

    const handleDelete = ( id ) => {
        confirmDialog( {
            ...confirmObj
        } ).then( async e => {
            if ( e.isConfirmed ) {
                deleteData( id )
            }
        } );
    };


    const handleFormOpen = () => {
        setSidebarOpen( false );
    };

    const toggleSidebar = () => {
        dispatch( bindFeaturedCategoryInfo( initialFeaturedData ) )
        setSidebarOpen( !sidebarOpen );
    }
    const toggleEditSidebar = () => {
        dispatch( bindFeaturedCategoryInfo( initialFeaturedData ) )
        setEditFormOpen( !editFormOpen );
    }

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } );
    };

    //********* pagination, searching and sorting start here  ******** */
    // for getting brands with page and rows per page,
    // also using for pagination
    const getItems = ( page, perPage ) => {
        const submittedData = {
            page: page,
            pageSize: perPage,
            includes: [],
            filters: [],
            sorts: [],
        };

        for ( const key in searchData ) {
            if ( searchData[key] ) {
                let comparision = "eq";
                let fieldValue = searchData[key];

                if ( key === "name" ) {
                    comparision = "like";
                    fieldValue = searchData[key];
                } else if ( key === "countryoforigin" ) {
                    fieldValue = searchData[key].value.toString() || null;
                }

                submittedData.filters.push( {
                    fieldName: key,
                    comparision,
                    fieldValue,
                } );
            }
        }
        // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( getAllFeaturedCategoryByFilter( submittedData ) )
    }

    useEffect( () => {
        getItems( 1, rowsPerPage );
    }, [] )

    const getSortedData = () => {
        const submittedData = {
            page: currentPage,
            pageSize: rowsPerPage,
            includes: [],
            filters: [],
            sorts: [sortName],
        };

        dispatch( getAllFeaturedCategoryByFilter( submittedData ) )
    }



    const handleSort = ( data ) => {
        if ( sortName === 'name' ) {
            setSortName( 'name_desc' );
        } else {
            setSortName( 'name' );
        }
        getSortedData()
    };


    const handleClearField = () => {
        const submittedData = {
            page: 1,
            pageSize: rowsPerPage,
            includes: [],
            filters: [],
            sorts: [],
        };
        dispatch( getAllFeaturedCategoryByFilter( submittedData ) )
        setSearchData( initialState );
    };

    const handleSearch = () => {
        setCurrentPage( 1 )
        getItems( 1, rowsPerPage )
    };

    // ** Function in get data on page change
    const handlePagination = page => {
        getItems( page.selected + 1, rowsPerPage )
        setCurrentPage( page.selected + 1 )
    };

    const handlePerPage = ( selectedRowsPerPage ) => {
        setRowsPerPage( selectedRowsPerPage );
        setCurrentPage( 1 );
        getItems( 1, selectedRowsPerPage );
    };

    /********* pagination, searching and sorting end here  ******** */

    const makeId = ( expend, row ) => {
        dispatch( updateAllDataWithItems( row.id ) )
            .then( ( res ) => {
                // console.log( res )
            } )
    }

    return (
        <>

            <Card className='overflow-hidden'>
                <Row className="px-3">
                    <Col>
                        <CustomHeader
                            handlePerPage={handlePerPage}
                            perPage={rowsPerPage}
                        >
                            <Button
                                className=""
                                color="primary"
                                size="sm"
                                onClick={() => { toggleSidebar(); }}
                            >
                                Add Featured Category
                            </Button>
                        </CustomHeader>
                    </Col>
                </Row>

                <div className="px-3 pb-2">
                    <Row className="border rounded-3 p-2">
                        <Col md="9">
                            <Row>
                                <Col md={4} className="mt-1">
                                    <ErpInput
                                        label="Category"
                                        name="name"
                                        sideBySide={false}
                                        value={searchData.name}
                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                    />
                                </Col>

                            </Row>
                        </Col>
                        <Col md="3">
                            <Row>
                                <Col className="mt-3 float-end">
                                    <Button
                                        className="float-end"
                                        color="secondary"
                                        size="sm"
                                        onClick={() => { handleClearField(); }}
                                    >
                                        Clear
                                    </Button>

                                    <Button
                                        className="me-1 float-end"
                                        color="success"
                                        size="sm"
                                        onClick={() => { handleSearch(); }}
                                    >
                                        Search
                                    </Button>

                                </Col>
                            </Row>
                        </Col>



                    </Row>
                </div>
                <div className='px-2'>
                    <ErpDataTable
                        noHeader
                        persistTableHead
                        defaultSortAsc
                        sortServer
                        onSort={handleSort}
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
                        columns={featuredCategoryColumn( handleAddItems, handleEdit, handleDelete )}
                        sortIcon={<ChevronDown />}
                        // onRowExpandToggled={( row ) => { makeId( row ) }}
                        // onRowExpandToggled={( expend, row ) => { makeId( expend, row ) }}
                        className="react-custom-dataTable"
                        // expandableRowsComponent={ItemList}
                        data={allData}
                    />

                    <CustomPagination
                        onPageChange={page => handlePagination( page )}
                        currentPage={currentPage}
                        count={Number( Math.ceil( totalItems / rowsPerPage ) )}
                        totalItems={totalItems}
                    />
                </div>

                {/* <div className='px-2'>

                    <DataTable
                        noHeader
                        persistTableHead
                        defaultSortAsc
                        sortServer
                        onSort={handleSort}
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
                        columns={featuredCategoryColumn( handleAddItems, handleEdit, handleDelete )}
                        sortIcon={<ChevronDown />}
                        // onRowExpandToggled={( row ) => { makeId( row ) }}
                        // onRowExpandToggled={( expend, row ) => { makeId( expend, row ) }}
                        className="react-custom-dataTable"
                        // expandableRowsComponent={ItemList}
                        data={allData}

                    />

                    <CustomPagination
                        onPageChange={page => handlePagination( page )}
                        currentPage={currentPage}
                        count={Number( Math.ceil( totalItems / rowsPerPage ) )}
                    />
                </div> */}





            </Card>

            {sidebarOpen &&
                <FeaturedCategoryForm
                    itemsToggle={() => setOpenItemsModal( !openItemsModal )}
                    open={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    handleFormOpen={handleFormOpen}
                />}


            {editFormOpen &&
                <EditForm
                    currentPage={currentPage}
                    itemsToggle={() => setOpenItemsModal( !openItemsModal )}
                    editFormOpen={editFormOpen}
                    toggleEditSidebar={toggleEditSidebar}
                />}

            {/* this is discount modal */}
            {openItemsModal && <AddOfferedItems
                openItemsModal={openItemsModal}
                handleItemsModalClosed={handleItemsModalClosed}
                itemsToggle={() => setOpenItemsModal( !openItemsModal )}
            />
            }

        </>
    );
};

export default List;
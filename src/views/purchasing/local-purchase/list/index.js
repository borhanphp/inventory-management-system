// import React, { useState } from 'react'
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SlideDown from 'react-slidedown';
import { Button, Card, Col, NavItem, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { getAllSupplierCm } from '../../../../redux/common/store';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import { typeOptions } from '../../../../utility/enums';
import { deleteLocalPurchase, getLocalPurchaseByFilter, getLocalPurchaseById } from '../store';
import { localPurchaseColumn } from './columns';

const initialState = {
    name: '',
    type: null,
    supplierId: null
};

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const index = () => {
    const { allLocalPurchase, totalItems } = useSelector( ( { localPurchase } ) => localPurchase );
    const { supplierDataCm } = useSelector( ( { commons } ) => commons );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchData, setSearchData] = useState( initialState );
    const [sortName, setSortName] = useState( 'name' );

    const handleEdit = ( row ) => {
        navigate( '/edit-local-purchase', { state: row.id } );
        dispatch( getLocalPurchaseById( row?.id ) );
    };


    const handleAddNew = () => {
        navigate( '/add-local-purchase' )
    }
    const handleDetails = ( row ) => {
        navigate( '/local-purchase-details', { state: row.id } )
    }


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
                dispatch( deleteLocalPurchase( id ) )
                    .then( () => {
                        const paramsObj = {
                            page: currentPage,
                            pageSize: rowsPerPage
                        };
                        dispatch( getLocalPurchaseByFilter( paramsObj ) )
                    } )
            }
        } );
    };


    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } )
    }
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        setSearchData( { ...searchData, [name]: data } )
    }

    const handleSupplierOnFocus = () => {
        if ( !supplierDataCm.length ) {
            dispatch( getAllSupplierCm() )
        }
    }

    // for getting items with page and rows per page,
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
                } else if (
                    key === "type" ||
                    key === "supplierId"

                ) {
                    fieldValue = searchData[key].value.toString() || null;
                }

                submittedData.filters.push( {
                    fieldName: key,
                    comparision,
                    fieldValue,
                } );
            }
        }

        // console.log( "submittedData", JSON.stringify( submittedData, null, 2 ) );
        dispatch( getLocalPurchaseByFilter( submittedData ) )
    }


    useEffect( () => {
        getItems( currentPage, rowsPerPage );
    }, [] )

    const getSortedData = () => {
        const submittedData = {
            page: currentPage,
            pageSize: rowsPerPage,
            includes: [],
            filters: [],
            sorts: [sortName],
        };

        dispatch( getLocalPurchaseByFilter( submittedData ) )
    }



    const handleSort = ( data ) => {
        if ( data.name === 'PO Number' ) {

            if ( sortName === 'name' ) {
                setSortName( 'name_desc' );
            } else {
                setSortName( 'name' );
            }
            // setSortPurchase( null );
            // setSortSales( null );


        }
        // else if ( data.name === 'Purchase Price' ) {

        //     if ( sortPurchase === 'purchaseprice' ) {
        //         setSortPurchase( 'purchaseprice_desc' );
        //     } else {
        //         setSortPurchase( 'purchaseprice' );
        //     }
        //     setSortName( null );
        //     setSortSales( null );

        // } else {

        //     if ( sortSales === 'salesprice' ) {
        //         setSortSales( 'salesprice_desc' );
        //     } else {
        //         setSortSales( 'salesprice' );
        //     }
        //     setSortName( null );
        //     setSortPurchase( null );

        // }

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
        dispatch( getLocalPurchaseByFilter( submittedData ) )
        setSearchData( initialState );
    };

    const handleSearch = () => {
        setCurrentPage( 1 )
        getItems( 1, rowsPerPage )
    };


    // ** Function in get data on page change
    const handlePagination = page => {
        setCurrentPage( page.selected + 1 );
        getItems( page.selected + 1, rowsPerPage );
    };

    const handlePerPage = ( selectedRowsPerPage ) => {
        setRowsPerPage( selectedRowsPerPage );
        setCurrentPage( 1 );
        getItems( 1, selectedRowsPerPage );
    };

    // end of filtering



    return (
        <>

            <ActionMenu
                title='Purchase Invoice'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}
                    >Add Purchase Invoice</Button>
                </NavItem>
            </ActionMenu>

            <Card className='overflow-hidden mt-3'>
                <Row className="px-3">
                    <Col>
                        <CustomHeader
                            handlePerPage={handlePerPage}
                            perPage={rowsPerPage}
                        >

                        </CustomHeader>
                    </Col>
                </Row>

                <SlideDown>
                    <div className="px-3 pb-2">
                        <Row className="border rounded-3 p-2">
                            <Col md={9}>
                                <Row>
                                    <Col md={4} className="mt-1">
                                        <ErpInput
                                            label="Invoice Number"
                                            name="name"
                                            sideBySide={false}
                                            value={searchData.name}
                                            onChange={( e ) => { handleInputOnChange( e ); }}
                                        />
                                    </Col>
                                    <Col md={4} className="mt-1">
                                        <ErpSelect
                                            label="Invoice Type"
                                            name="type"
                                            sideBySide={false}
                                            options={typeOptions}
                                            value={searchData.type}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                        />
                                    </Col>
                                    <Col md={4} className="mt-1">
                                        <ErpSelect
                                            label="Supplier"
                                            name="supplierId"
                                            sideBySide={false}
                                            options={supplierDataCm}
                                            value={searchData.supplierId}
                                            onFocus={() => { handleSupplierOnFocus() }}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                        />
                                    </Col>

                                </Row>
                            </Col>

                            <Col md={3} className="mt-3 text-end">
                                <Row>
                                    <Col xs={12}>

                                        <Button
                                            className="me-1"
                                            color="success"
                                            size="sm"
                                            onClick={() => { handleSearch(); }}
                                        >
                                            Search
                                        </Button>
                                        <Button
                                            className=""
                                            color="secondary"
                                            size="sm"
                                            onClick={() => { handleClearField(); }}
                                        >
                                            Clear
                                        </Button>
                                    </Col>

                                </Row>

                            </Col>
                        </Row>
                    </div>
                </SlideDown>

                <div className='px-2'>
                    <DataTable
                        noHeader
                        persistTableHead
                        defaultSortAsc
                        sortServer
                        onSort={handleSort}
                        // progressPending={isLoading}
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
                        columns={localPurchaseColumn( handleEdit, handleDetails, handleDelete )}
                        sortIcon={<ChevronDown />}
                        // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                        className="react-custom-dataTable"
                        // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                        data={allLocalPurchase}
                    />

                    <CustomPagination
                        onPageChange={page => handlePagination( page )}
                        currentPage={currentPage}
                        count={Number( Math.ceil( totalItems / rowsPerPage ) )}
                        totalItems={totalItems}
                    />
                </div>


            </Card>




        </>
    );
};

export default index;
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
import { getAllCiCm, getAllWarehouseCm } from '../../../../redux/common/store';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import { deleteMrr, fetchAllReceivings } from '../store';
import { receivingColumn } from './columns';

const initialState = {
    warehouseId: null,
    ciId: null,
    name: ''
};

const defaultFilteredArrayValue = [
    {
        column: "itemNo",
        value: ''
    },
    {
        column: "item",
        value: ''
    },
    {
        column: "itemGroup",
        value: ''
    },
    {
        column: "itemSubGroup",
        value: ''
    },
    {
        column: "sku",
        value: ''
    }

];


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
    const { allReceiving, totalItems } = useSelector( ( { receivings } ) => receivings );
    const { warehouseDataCm, ciDataCm } = useSelector( ( { commons } ) => commons )

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchData, setSearchData] = useState( initialState );
    const [sortName, setSortName] = useState( 'name' );


    const handleEdit = ( row ) => {
        navigate( '/edit-receiving', { state: row.id } );
    };

    const handleAddNew = () => {
        navigate( '/add-receiving' )
    }
    const handleDetails = ( row ) => {
        navigate( '/receiving-details', { state: row.id } )
    }

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } )
    }

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        setSearchData( { ...searchData, [name]: data } )
    }

    const confirmObj = {
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
    };

    //delete segment row
    const handleDelete = ( id ) => {
        confirmDialog( confirmObj ).then( ( e ) => {
            if ( e.isConfirmed ) {
                dispatch( deleteMrr( id ) )
                    .then( ( res ) => {
                        if ( res.error ) {
                            return;
                        } else {
                            const paramObj = {
                                page: currentPage,
                                pageSize: rowsPerPage
                            }
                            dispatch( fetchAllReceivings( paramObj ) )
                        }
                    } )

            }
        } );
    };



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
                    key === "warehouseId" ||
                    key === "ciId"

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
        dispatch( fetchAllReceivings( submittedData ) )
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

        dispatch( fetchAllReceivings( submittedData ) )
    }



    const handleSort = ( data ) => {
        if ( data.name === 'MRR Code' ) {

            if ( sortName === 'name' ) {
                setSortName( 'name_desc' );
            } else {
                setSortName( 'name' );
            }
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
        dispatch( fetchAllReceivings( submittedData ) )
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


    const paramObj = {
        page: 1,
        pageSize: 10000000
    }
    const handleWarehouseOnFocus = () => {
        if ( !warehouseDataCm.length ) {
            dispatch( getAllWarehouseCm() )
        }
    }

    const handleCiOnFocus = () => {
        if ( !ciDataCm.length ) {
            dispatch( getAllCiCm( paramObj ) )
        }
    }


    return (
        <>

            <ActionMenu
                title='Goods Receivings'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}
                    >Add Receiving</Button>
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
                                            label="MRR Code"
                                            name="name"
                                            sideBySide={false}
                                            value={searchData.name}
                                            onChange={( e ) => { handleInputOnChange( e ); }}
                                        />
                                    </Col>
                                    <Col md={4} className="mt-1">
                                        <ErpSelect
                                            label="Warehouse"
                                            name="warehouseId"
                                            sideBySide={false}
                                            options={warehouseDataCm}
                                            value={searchData.warehouseId}
                                            onFocus={() => { handleWarehouseOnFocus() }}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                        />
                                    </Col>
                                    <Col md={4} className="mt-1">
                                        <ErpSelect
                                            label="CI Number"
                                            name="ciId"
                                            sideBySide={false}
                                            options={ciDataCm}
                                            value={searchData.ciId}
                                            onFocus={() => { handleCiOnFocus() }}
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
                        columns={receivingColumn( handleEdit, handleDetails, handleDelete )}
                        sortIcon={<ChevronDown />}
                        // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                        className="react-custom-dataTable"
                        // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                        data={allReceiving}
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
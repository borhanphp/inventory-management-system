// import React, { useState } from 'react'
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SlideDown from 'react-slidedown';
import { Button, Col, NavItem, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { getAllBuyersCm, getAllSupplierCm } from '../../../../redux/common/store';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { fetchAllCiByFilter, getCiById } from '../store';
import { ciColumn } from './columns';



const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const initialState = {
    ciCode: ""
};

const index = () => {
    const { allCi, totalItems, loading } = useSelector( ( { ci } ) => ci );
    const { supplierDataCm, buyersDataCm } = useSelector( ( { commons } ) => commons );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchData, setSearchData] = useState( initialState );
    const [sortName, setSortName] = useState( 'cicode' );


    const handleEdit = ( row ) => {
        navigate( '/edit-ci', { state: { ciEditId: row.id, currentPage: currentPage, rowsPerPage: rowsPerPage } } );
        dispatch( getCiById( row?.id ) );
    };

    const handleAddNew = () => {
        navigate( '/create-ci' )
    }
    const handleDetails = ( row ) => {
        navigate( '/ci-details', { state: row.id } )
    }
    const handleCreateSC = ( row ) => {
        navigate( '/create-ci', { state: row.id } )
    }

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } )
    }
    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        setSearchData( { ...searchData, [name]: data } )
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
                    key === "supplierId" ||
                    key === "buyerId" ||
                    key === "consigneeId"
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

        console.log( "submittedData", JSON.stringify( submittedData, null, 2 ) );
        dispatch( fetchAllCiByFilter( submittedData ) )
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

        dispatch( fetchAllCiByFilter( submittedData ) )
    }



    const handleSort = ( data ) => {
        if ( data.name === 'CI Number' ) {

            if ( sortName === 'cicode' ) {
                setSortName( 'cicode_desc' );
            } else {
                setSortName( 'cicode' );
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
        dispatch( fetchAllCiByFilter( submittedData ) )
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


    const paramObj = {
        page: 1,
        pageSize: 100000000
    }

    // loading supplier data from common redux reducer
    const handleSupplierDataOnFocus = () => {
        if ( !supplierDataCm.length ) {
            dispatch( getAllSupplierCm() )
        }
    }

    // loading supplier data from common redux reducer
    const handleBuyersDataOnFocus = () => {
        if ( !buyersDataCm.length ) {
            dispatch( getAllBuyersCm( paramObj ) )
        }
    }


    return (
        <>

            <ActionMenu
                title='Commercial Invoices ( CI )'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}
                    >New CI</Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>


                <div>

                    <FormLayout>
                        <Row className="">
                            <Col>
                                <CustomHeader
                                    handlePerPage={handlePerPage}
                                    perPage={rowsPerPage}
                                    totalItems={totalItems}

                                >

                                </CustomHeader>
                            </Col>
                        </Row>
                        <FormContentLayout>
                            <SlideDown>
                                <div className="px-1 pb-2">
                                    <Row className="">
                                        <Col md={9}>
                                            <Row>
                                                <Col md={3} className="">
                                                    <ErpInput
                                                        label="CI Number"
                                                        name="ciCode"
                                                        sideBySide={false}
                                                        value={searchData.ciCode}
                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                    />
                                                </Col>
                                                {/* <Col md={3} className="">
                                                    <ErpSelect
                                                        label="Supplier"
                                                        name="supplierId"
                                                        sideBySide={false}
                                                        options={supplierDataCm}
                                                        value={searchData.supplierId}
                                                        onFocus={() => { handleSupplierDataOnFocus() }}
                                                        onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                                    />
                                                </Col>
                                                <Col md={3} className="">
                                                    <ErpSelect
                                                        label="Buyer"
                                                        name="buyerId"
                                                        sideBySide={false}
                                                        options={buyersDataCm?.filter( d => d.type !== "Consignee" )}
                                                        value={searchData.buyerId}
                                                        onFocus={() => { handleBuyersDataOnFocus() }}
                                                        onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                                    />
                                                </Col>
                                                <Col md={3} className="">
                                                    <ErpSelect
                                                        label="Consignee"
                                                        name="consigneeId"
                                                        sideBySide={false}
                                                        options={buyersDataCm?.filter( d => d.type !== "Buyer" )}
                                                        value={searchData.consigneeId}
                                                        onFocus={() => { handleBuyersDataOnFocus() }}
                                                        onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                                    />
                                                </Col> */}
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
                                    defaultSortAci
                                    sortServer
                                    // selectableRows
                                    // onSelectedRowsChange={onSelectedRowsChange}
                                    // selectableRowDisabled={rowDisabledCriteria}
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
                                    columns={ciColumn( handleEdit )}
                                    sortIcon={<ChevronDown />}
                                    // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                                    className="react-custom-dataTable"
                                    // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                                    data={allCi}
                                />

                                <CustomPagination
                                    onPageChange={page => handlePagination( page )}
                                    currentPage={currentPage}
                                    count={Number( Math.ceil( totalItems / rowsPerPage ) )}
                                />
                            </div>


                        </FormContentLayout>
                    </FormLayout>
                </div>





            </div>





        </>
    );
};

export default index;
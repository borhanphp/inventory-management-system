// import React, { useState } from 'react'
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SlideDown from "react-slidedown";
import {
    Button,
    Card, Col, Row
} from "reactstrap";
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner";
import CustomHeader from "../../../../utility/custom/CustomeHeader";
import CustomPagination from "../../../../utility/custom/CustomPagination";
import ErpInput from "../../../../utility/custom/ErpInput";
import { getSupplierByFilter, getSupplierById } from "../store";
import { supplierColumn } from "./columns";

const initialState = {
    name: "",
};

const index = () => {
    const { allData, totalItems, loading } = useSelector( ( { suppliers } ) => suppliers );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState( initialState );
    const [sortName, setSortName] = useState( 'name' );


    const handleEdit = ( row ) => {
        dispatch( getSupplierById( row?.id ) );
        navigate( '/editsupplier', { state: row.id } );

    };

    const handleAddNew = () => {
        navigate( "/catalogue/supplier/addnewsupplier" );
        // dispatch( bindSupplierInfo( initialSupplierData ) )
    };

    const handleDetails = ( row ) => {
        // navigate( "/supplier-details", { state: row } );
    };

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } );
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
                    key === "brandId"
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
        // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( getSupplierByFilter( submittedData ) )
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

        dispatch( getSupplierByFilter( submittedData ) )
    }



    const handleSort = ( data ) => {
        if ( data.name === 'Name' ) {
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
        dispatch( getSupplierByFilter( submittedData ) )
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

    return (
        <>
            <Card className="overflow-hidden">
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
                                onClick={() => { handleAddNew(); }}
                            >
                                Add Supplier
                            </Button>
                        </CustomHeader>
                    </Col>
                </Row>
                <SlideDown>
                    <div className="px-3 pb-2">
                        <Row className="border rounded-3 p-2">
                            <Col md={9}>
                                <Row>
                                    <Col lg={4} className="mt-1">
                                        <ErpInput
                                            label="Supplier Name"
                                            name="name"
                                            sideBySide={false}
                                            value={searchData.name}
                                            onChange={( e ) => { handleInputOnChange( e ); }}
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
                        columns={supplierColumn( handleEdit )}
                        sortIcon={<ChevronDown />}
                        // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                        className="react-custom-dataTable"
                        // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                        data={allData}

                    />

                    <CustomPagination
                        onPageChange={page => handlePagination( page )}
                        currentPage={currentPage}
                        count={Number( Math.ceil( totalItems / rowsPerPage ) )}
                        totalItems={totalItems}
                    />
                </div>


            </Card>

            {/* {
                payModalOpen && <PayForm
                    payModalOpen={payModalOpen}
                    handlePayModalClose={handlePayModalClose}
                    togglePay={() => setPayModalOpen( !payModalOpen )}
                    supplierData={supplierData}
                />
            } */}


        </>
    );
};

export default index;

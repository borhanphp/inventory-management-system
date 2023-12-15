// import React, { useState } from 'react'
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SlideDown from "react-slidedown";
import {
    Button,
    Card, Col, FormGroup, Input, Label, NavItem, Row
} from "reactstrap";
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner";
import ActionMenu from "../../../../@core/layouts/components/ActionMenu";
import CustomHeader from "../../../../utility/custom/CustomeHeader";
import CustomPagination from "../../../../utility/custom/CustomPagination";
import ErpInput from "../../../../utility/custom/ErpInput";
import { getPartnerByFilter, getPartnerById } from "../store";
import { partnerColumn } from "./columns";

const initialState = {
    name: "",
    mobileno: "",
    email: "",
    isSupplier: "",
    isCustomer: "",
    isRepresentative: "",
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

const partnerList = () => {
    const { allData, totalItems, loading } = useSelector( ( { partners } ) => partners );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState( initialState );
    const [sortName, setSortName] = useState( 'name' );
    const [sortField, setSortField] = useState( false );


    const handleEdit = ( row ) => {
        dispatch( getPartnerById( row?.id ) );
        navigate( '/edit-partner-form', {
            state: {
                partnerId: row?.id,
                currentPage: currentPage,
                rowsPerPage: rowsPerPage
            }
        } );

    };

    const handleAddNew = () => {
        navigate( "/add-new-partner" );
        // dispatch( bindSupplierInfo( initialSupplierData ) )
    };

    const handleDetails = ( row ) => {
        navigate( "/partner-details", { state: row } );
    };

    const handleInputOnChange = ( e ) => {
        const { name, value, type, checked } = e.target;
        setSearchData( { ...searchData, [name]: type === "checkbox" ? checked : value } );
    };

    // for getting items with page and rows per page,
    // also using for pagination
    const getItems = ( page, perPage ) => {
        const submittedData = {
            page: page,
            pageSize: perPage,
            includes: [],
            filters: [],
            sorts: sortField ? [sortName] : [],
        };

        for ( const key in searchData ) {
            if ( searchData[key] ) {
                let comparision = "eq";
                let fieldValue = searchData[key];

                if ( key === "name" ||
                    key === "code" ||
                    key === "mobileno" ||
                    key === "email"
                ) {
                    comparision = "like";
                    fieldValue = searchData[key];
                } else if (
                    key === "isSupplier" ||
                    key === "isCustomer" ||
                    key === "isRepresentative"
                ) {
                    fieldValue = searchData[key].toString() || null;
                }

                submittedData.filters.push( {
                    fieldName: key,
                    comparision,
                    fieldValue,
                } );
            }
        }
        console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( getPartnerByFilter( submittedData ) )
    }


    useEffect( () => {
        getItems( currentPage, rowsPerPage );
    }, [sortName] )


    const handleSort = () => {
        setSortField( true )
        if ( sortName === 'name' ) {
            setSortName( 'name_desc' );
        } else {
            setSortName( 'name' );
        }
        getItems( currentPage, rowsPerPage )
    };


    const handleClearField = () => {
        const submittedData = {
            page: 1,
            pageSize: rowsPerPage,
            includes: [],
            filters: [],
            sorts: [],
        };
        dispatch( getPartnerByFilter( submittedData ) )
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
            <ActionMenu
                title='Partners'
                breadcrumb={breadcrumb}

            >
                <NavItem className="" >
                    <Button
                        className=""
                        color="primary"
                        size="sm"
                        onClick={() => { handleAddNew(); }}
                    >
                        Add Partner
                    </Button>
                </NavItem>

            </ActionMenu>

            <div className="mt-3">
                <Card className="overflow-hidden">
                    <Row className="px-3">
                        <Col>
                            <CustomHeader
                                handlePerPage={handlePerPage}
                                perPage={rowsPerPage}
                                totalItems={totalItems}

                            >

                            </CustomHeader>
                        </Col>
                    </Row>
                    <SlideDown>
                        <div className="px-3 pb-2">
                            <Row className="border rounded-3 p-2">
                                <Col md={9}>
                                    <Row>
                                        <Col md={4}>
                                            <FormGroup check className="mt-1">
                                                <Label check className="fw-bolder">
                                                    <Input
                                                        type="checkbox"
                                                        name="isSupplier"
                                                        checked={searchData?.isSupplier}
                                                        onChange={( e ) => { handleInputOnChange( e ) }}
                                                    />{" "}
                                                    Supplier
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup check className="mt-1">
                                                <Label check className="fw-bolder">
                                                    <Input
                                                        type="checkbox"
                                                        name="isCustomer"
                                                        checked={searchData?.isCustomer}
                                                        onChange={( e ) => { handleInputOnChange( e ) }}
                                                    />{" "}
                                                    Customer
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup check className="mt-1">
                                                <Label check className="fw-bolder">
                                                    <Input
                                                        type="checkbox"
                                                        name="isRepresentative"
                                                        checked={searchData?.isRepresentative}
                                                        onChange={( e ) => { handleInputOnChange( e ) }}
                                                    />{" "}
                                                    Representative
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={3} className="mt-1">
                                            <ErpInput
                                                label="Partner Name"
                                                name="name"
                                                sideBySide={false}
                                                value={searchData?.name}
                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                            />
                                        </Col>
                                        <Col lg={3} className="mt-1">
                                            <ErpInput
                                                label="Contact No."
                                                name="mobileno"
                                                sideBySide={false}
                                                value={searchData?.mobileno}
                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                            />
                                        </Col>
                                        <Col lg={3} className="mt-1">
                                            <ErpInput
                                                label="Email"
                                                name="email"
                                                sideBySide={false}
                                                value={searchData?.email}
                                                onChange={( e ) => { handleInputOnChange( e ); }}
                                            />
                                        </Col>
                                        <Col lg={3} className="mt-1">
                                            <ErpInput
                                                label="Short Code"
                                                name="code"
                                                sideBySide={false}
                                                value={searchData?.code}
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
                            columns={partnerColumn( handleEdit, handleDetails )}
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
                        />
                    </div>


                </Card>
            </div>

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

export default partnerList;

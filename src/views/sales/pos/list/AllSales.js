// import React, { useState } from 'react'
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Card, Col, Row
} from "reactstrap";
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner";
import CustomHeader from "../../../../utility/custom/CustomeHeader";
import CustomPagination from "../../../../utility/custom/CustomPagination";
import { getAllSalesByQuery } from "../store/actions";
import { salesColumn } from "./columns";

const initialState = {
    itemNo: '',
    item: '',
    itemGroup: null,
    itemSubGroup: null,
    sku: ''
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

const AllSales = () => {
    const { allData, totalItems } = useSelector( ( { posReducer } ) => posReducer );
    const [isLoading, setIsLoading] = useState( false );
    const [filterObj, setFilterObj] = useState( initialState );
    const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [sortedBy, setSortedBy] = useState( 'name' );
    const [orderBy, setOrderBy] = useState( 'asc' );
    const [status, setStatus] = useState( true );


    const [itemData, setItemData] = useState( allData );
    const [editData, setEditData] = useState( '' );
    const [sidebarOpen, setSidebarOpen] = useState( false );
    const [editFormOpen, setEditFormOpen] = useState( false );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState( initialState );
    const { itemNo, item, itemGroup, itemSubGroup, sku } = searchData;

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } );
    };

    const handleDropdownOnChange = ( data, e ) => {
        const { name } = e;
        setSearchData( { ...searchData, [name]: data } );
    };

    const handleOpenEditSidebar = ( condition ) => {
        setEditFormOpen( condition );
    };

    const handleEdit = ( row ) => {
        navigate( '/sales/pos/list', { state: row.id } )
    };
    const handleDelete = ( id ) => {
        const filteredData = itemData.filter( d => d.id !== id );
        setItemData( filteredData );
    };

    const handlePageChange = ( page ) => {
        setCurrentPage( page.selected + 1 );
    };

    const handleClearField = () => {
        setSearchData( initialState );
        setItemData( data );
    };

    const toggleSidebar = () => {
        dispatch( bindItemInfo( initialItemState ) )
        setSidebarOpen( !sidebarOpen );
    }
    const toggleEditSidebar = () => {
        dispatch( bindItemInfo( initialItemState ) )
        setEditFormOpen( !editFormOpen );
    }

    const handleSearch = () => {
        if ( sellDue
            || sellReturnDue
            || advanceBalance
            || openingBalance
            || noSell
            || customerGroup
            || assignTo
            || status ) {
            const filteredData = data?.filter( d =>
                d.sellDue.toLowerCase().includes( sellDue.toLowerCase() )
                && d.sellReturnDue.toLowerCase().includes( sellReturnDue.toLowerCase() )
                && d.advanceBalance.toLowerCase().includes( advanceBalance.toLowerCase() )
                && d.openingBalance.toLowerCase().includes( openingBalance.toLowerCase() )
                && d.noSell.toLowerCase().includes( noSell.toLowerCase() )
                && d.customerGroup.toLowerCase().includes( customerGroup.toLowerCase() )
                && d.assignTo.toLowerCase().includes( assignTo.toLowerCase() )
                && d.status.toLowerCase().includes( status.toLowerCase() )
            );
            setCustomerData( filteredData );
        } else {
            setCustomerData( data );
        }

    };


    const paramsObj = {
        page: currentPage,
        pageSize: rowsPerPage
    };
    const filteredData = filteredArray.filter( filter => filter.value.length );

    //this function handles loading callback of get All data
    const handleLoadingCallback = ( response ) => {
        setIsLoading( response );
    };

    // fetches all Sales data
    const handleGetAllSales = () => {
        dispatch( getAllSalesByQuery( paramsObj ) );
    };

    const handleAddNew = () => {
        console.log( 'add sales' )
    }
    const handleDetails = ( row ) => {
        navigate( '/sales-invoice', { state: row } )
        // navigate( '/apps/invoice/preview', { state: row.id } )
        // navigate( `/apps/invoice/preview/${row?.id}` )
    }

    useEffect( () => {
        handleGetAllSales();
    }, [dispatch, currentPage, rowsPerPage] );

    // ** Function in get data on page change
    const handlePagination = page => {
        dispatch(
            getAllSalesByQuery( {
                page: page.selected + 1,
                pageSize: rowsPerPage,
                // sortedBy,
                // orderBy,
                // status
            }, filteredData, handleLoadingCallback )
        );
        setCurrentPage( page.selected + 1 );
    };

    const handleSort = ( column, direction ) => {
        // const { selector } = column;
        // setSortedBy( selector );
        // setOrderBy( direction );
        dispatch(
            getAllSalesByQuery( {
                page: currentPage,
                pageSize: rowsPerPage,
                // sortedBy: selector,
                // orderBy: direction,
                // status
            }, filteredData, handleLoadingCallback )
        );
    };
    const handlePerPage = ( selectedRowsPerPage ) => {
        setRowsPerPage( selectedRowsPerPage );
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
                            {/* <Button
                                className=""
                                color="primary"
                                size="sm"
                                onClick={() => { handleAddNew(); }}
                            >
                                Add Sale
                            </Button> */}
                        </CustomHeader>
                    </Col>
                </Row>
                {/* <SlideDown>
                    <div className="px-3 pb-2">
                        <Row className="border rounded-3 p-2">
                            <Col md={4} lg={3} xl={3} xxl={3} className="mt-2">
                                <FormGroup check className="">
                                    <Label check style={{ color: 'black', fontWeight: "bold" }}>
                                        <Input
                                            type="checkbox"
                                            name="sellDue"
                                            onChange={handleInputOnChange}
                                        />{" "}
                                        Sell Due
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col md={4} lg={3} xl={3} xxl={3} className="mt-2">
                                <FormGroup check className="">
                                    <Label check style={{ color: 'black', fontWeight: "bold" }}>
                                        <Input
                                            type="checkbox"
                                            name="sellReturnDue"
                                            onChange={handleInputOnChange}
                                        />{" "}
                                        Sell Return
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col md={4} lg={3} xl={3} xxl={3} className="mt-2">
                                <FormGroup check className="">
                                    <Label check style={{ color: 'black', fontWeight: "bold" }}>
                                        <Input
                                            type="checkbox"
                                            name="advanceBalance"
                                            onChange={handleInputOnChange}
                                        />{" "}
                                        Advance Balance
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col md={4} lg={3} xl={3} xxl={3} className="mt-2">
                                <FormGroup check className="">
                                    <Label check style={{ color: 'black', fontWeight: "bold" }}>
                                        <Input
                                            type="checkbox"
                                            name="openingBalance"
                                            onChange={handleInputOnChange}
                                        />{" "}
                                        Opening Balance
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col md={4} lg={3} xl={3} xxl={3} className="mt-2">
                                <ErpSelect
                                    label="Has no sell from"
                                    name="noSell"
                                    sideBySide={false}
                                    value={noSell}
                                    onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                                />
                            </Col>
                            <Col md={4} lg={3} xl={3} xxl={3} className="mt-2">
                                <ErpSelect
                                    label="Customer Group"
                                    name="customerGroup"
                                    sideBySide={false}
                                    value={customerGroup}
                                    onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                                />
                            </Col>
                            <Col md={4} lg={3} xl={3} xxl={3} className="mt-2">
                                <ErpSelect
                                    label="Assigned to"
                                    name="assignTo"
                                    options={assignOptions}
                                    sideBySide={false}
                                    value={assignTo}
                                    onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                                />
                            </Col>
                            <Col md={4} lg={3} xl={3} xxl={3} className="mt-2">
                                <ErpSelect
                                    label="Status"
                                    name="status"
                                    options={statusOptions}
                                    sideBySide={false}
                                    value={status}
                                    onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                                />
                            </Col>
                            <Col md={12} lg={12} xl={12} xxl={12} className="mt-2 text-end">
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
                                    onClick={() => { handleClear(); }}
                                >
                                    Clear
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </SlideDown> */}
                <div className='px-2'>

                    <DataTable
                        noHeader
                        persistTableHead
                        defaultSortAsc
                        sortServer
                        onSort={handleSort}
                        progressPending={isLoading}
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
                        columns={salesColumn( handleDelete, handleDetails )}
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

        </>
    );
};

export default AllSales;

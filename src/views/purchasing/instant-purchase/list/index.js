// import React, { useState } from 'react'
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SlideDown from 'react-slidedown';
import { Button, Card, Col, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { getAllSupplierCm } from '../../../../redux/common/store';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import PurchaseReturn from '../form/PurchaseReturn';
import { bindInstantPurchaseData, getInstantPurchaseByFilter, getInstantPurchaseById } from '../store';
import { purchaseColumn } from './columns';

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

const InstantPurchaseList = () => {
    const { allInstantPurchase, loading, totalItems } = useSelector( ( { instantPurchase } ) => instantPurchase );
    const { supplierDataCm } = useSelector( ( { commons } ) => commons );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchData, setSearchData] = useState( initialState );
    const [sortName, setSortName] = useState( 'name' );
    const [openInstantPurchaseModal, setOpenInstantPurchaseModal] = useState( false );


    const handleReturn = ( row ) => {
        handleInstantPurchaseModalOpen();
        dispatch( getInstantPurchaseById( row?.id ) )
            .then( ( res ) => {
                const updatedInfo = {
                    ...res?.payload,
                    items: res?.payload?.items?.map( dd => ( {
                        ...dd,
                        note: ""
                    } ) )
                }
                dispatch( bindInstantPurchaseData( updatedInfo ) )
            } )

    };

    const handleDetails = ( row ) => {
        navigate( '/instant-purchase-details', { state: row.id } )
        dispatch( getInstantPurchaseById( row?.id ) );

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

    const handleInstantPurchaseModalOpen = () => {
        setOpenInstantPurchaseModal( true );
    };

    const handleInstantPurchaseModalClosed = () => {
        setOpenInstantPurchaseModal( false );
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
        dispatch( getInstantPurchaseByFilter( submittedData ) )
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

        dispatch( getInstantPurchaseByFilter( submittedData ) )
    }



    const handleSort = ( data ) => {
        if ( data.name === 'PO Number' ) {
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
        dispatch( getInstantPurchaseByFilter( submittedData ) )
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
                title='Instant Purchase'
                breadcrumb={breadcrumb}
            >
                {/* <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}
                    >Add Purchase</Button>
                </NavItem> */}
            </ActionMenu>

            <Card className='overflow-hidden mt-3'>
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
                                    {/* <Col md={4} className="mt-1">
                                        <ErpInput
                                            label="PO Number"
                                            name="name"
                                            sideBySide={false}
                                            value={searchData.name}
                                            onChange={( e ) => { handleInputOnChange( e ); }}
                                        />
                                    </Col>
                                    <Col md={4} className="mt-1">
                                        <ErpSelect
                                            label="Type"
                                            name="type"
                                            sideBySide={false}
                                            options={typeOptions}
                                            value={searchData.type}
                                            onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                        />
                                    </Col> */}
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
                        columns={purchaseColumn( handleReturn, handleDetails )}
                        sortIcon={<ChevronDown />}
                        // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                        className="react-custom-dataTable"
                        // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                        data={allInstantPurchase}
                    />

                    <CustomPagination
                        onPageChange={page => handlePagination( page )}
                        currentPage={currentPage}
                        count={Number( Math.ceil( totalItems / rowsPerPage ) )}
                        totalItems={totalItems}
                    />
                </div>
            </Card>



            {
                openInstantPurchaseModal && <PurchaseReturn
                    openInstantPurchaseModal={openInstantPurchaseModal}
                    handleInstantPurchaseModalClosed={handleInstantPurchaseModalClosed}
                    instantPurchaseToggle={() => setOpenInstantPurchaseModal( !openInstantPurchaseModal )}
                />
            }

        </>
    );
};

export default InstantPurchaseList;
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
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { fetchAllScByFilter, getScById } from '../store';
import { scLcColumn } from './columns';



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
    salesContractCode: '',
    supplierId: null,
    buyerId: null,
    consigneeId: null,
};

const index = () => {
    const { allSc, totalItems, loading } = useSelector( ( { sc } ) => sc );
    const { supplierDataCm, buyersDataCm } = useSelector( ( { commons } ) => commons );
    // const scWithoutDraft = allSc?.filter( d => d?.isDraft === false );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [isDraft, setIsDraft] = useState( false );
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchData, setSearchData] = useState( initialState );
    const [sortName, setSortName] = useState( 'salescontractcode' );

    const handleEdit = ( row ) => {
        navigate( '/edit-sc', { state: row.id } );
        dispatch( getScById( row?.id ) );
    };

    const handleAddNew = () => {
        navigate( '/create-sc' )
    }

    const handleDetails = ( row ) => {
        navigate( '/sc-details', { state: row.id } )
    }

    const handleCreateReport = ( row ) => {
        window.open( `http://qtghsreprt-001-site1.mysitepanel.net/reports/generalStore/importPurchase/salesContract?SalesContractId=${row.id}` )
    }

    const handleCreatePI = ( row ) => {
        navigate( '/create-pi', { state: { label: row.label, value: row.value } } )
    }

    const PIDetails = ( row ) => {
        navigate( '/pi-list', { state: { label: row.label, value: row.value } } )
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
        dispatch( fetchAllScByFilter( submittedData ) )
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

        dispatch( fetchAllScByFilter( submittedData ) )
    }



    const handleSort = ( data ) => {
        if ( data.name === 'SC Number' ) {
            if ( sortName === 'salescontractcode' ) {
                setSortName( 'salescontractcode_desc' );
            } else {
                setSortName( 'salescontractcode' );
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
        dispatch( fetchAllScByFilter( submittedData ) )
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




    const tabs = [
        {
            name: 'All SC',
            width: '100'
        },

        {
            name: 'Draft',
            width: '100'
        }


    ];

    const handleTab = ( tab ) => {
        if ( tab.name === 'Drafts' ) {
            setIsDraft( true );
            setCurrentPage( 1 );
        } else {
            setIsDraft( false );
        }

    };

    return (
        <>

            <ActionMenu
                title='SC'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}
                    >New SC</Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>
                {/* <TabContainer tabs={tabs} onClick={handleTab}> */}

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
                                                        label="SC Number"
                                                        name="salesContractCode"
                                                        sideBySide={false}
                                                        value={searchData.salesContractCode}
                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                    />
                                                </Col>
                                                <Col md={3} className="">
                                                    <ErpSelect
                                                        label="Supplier"
                                                        name="supplierId"
                                                        sideBySide={false}
                                                        isClearable
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
                                                        isClearable
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
                                                        isClearable
                                                        sideBySide={false}
                                                        options={buyersDataCm?.filter( d => d.type !== "Buyer" )}
                                                        value={searchData.consigneeId}
                                                        onFocus={() => { handleBuyersDataOnFocus() }}
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
                                    columns={scLcColumn( handleDetails, handleEdit, handleCreatePI, PIDetails, handleCreateReport )}
                                    sortIcon={<ChevronDown />}
                                    // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                                    className="react-custom-dataTable"
                                    // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                                    data={allSc}
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

                {/* <div>
                        <DraftList />
                    </div> */}


                {/* </TabContainer> */}
            </div>





        </>
    );
};

export default index;
// import React, { useState } from 'react'
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SlideDown from 'react-slidedown';
import { Button, Col, NavItem, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { fetchAllScByFilter, getScById } from '../../sc-lc/store';
import { deletePi, fetchAllPiByFilter, getPiById } from '../store';
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
    piCode: "",
    scId: null
};

const PiList = () => {
    const { allPi, totalItems, loading } = useSelector( ( { pi } ) => pi );
    const { allSc } = useSelector( ( { sc } ) => sc );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation();
    const [searchData, setSearchData] = useState( initialState );
    const [sortName, setSortName] = useState( 'name' );
    const scIdFromScList = location.state;



    const handleEdit = ( row ) => {
        navigate( '/pi-edit', { state: row?.id } );
        dispatch( getPiById( row?.id ) )
            .then( res => {
                dispatch( getScById( res.payload.scId.value ) )
            } )
    };

    const handleAddNew = () => {
        navigate( '/create-pi', { state: scIdFromScList } )
    }
    const handleDetails = ( row ) => {
        navigate( '/pi-details', { state: row.id } )
    }
    const handleCreateReport = ( row ) => {
        window.open( `http://qtghsreprt-001-site1.mysitepanel.net/reports/generalStore/importPurchase/piStatement?ProformaInvoiceId=${row.id}` )
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
                dispatch( deletePi( id ) )
                    .then( ( res ) => {
                        const submittedData = {
                            page: currentPage,
                            pageSize: rowsPerPage
                        };
                        dispatch( fetchAllPiByFilter( submittedData ) )
                        toast.success( 'PI deleted successfully' )
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

                if ( key === "piCode" ) {
                    comparision = "like";
                    fieldValue = searchData[key];
                } else if (
                    key === "scId"

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
        dispatch( fetchAllPiByFilter( submittedData ) )
    }

    useEffect( () => {
        getItems( currentPage, rowsPerPage );
    }, [] );


    const getSortedData = () => {
        const submittedData = {
            page: currentPage,
            pageSize: rowsPerPage,
            includes: [],
            filters: [],
            sorts: [sortName],
        };

        dispatch( fetchAllPiByFilter( submittedData ) )
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
        dispatch( fetchAllPiByFilter( submittedData ) )
        setSearchData( initialState );
    };


    const handleSearch = () => {
        setCurrentPage( 1 )
        getItems( 1, rowsPerPage )
    };

    useEffect( () => {
        if ( scIdFromScList ) {
            setSearchData( {
                ...searchData,
                scId: scIdFromScList,
            } );
            getItems( currentPage, rowsPerPage );
        }
    }, [searchData.scId] );


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


    const paramsObj = {
        page: 1,
        pageSize: 100000000
    };
    const handleScOnFocus = () => {
        if ( !allSc.length ) {
            dispatch( fetchAllScByFilter( paramsObj ) );
        }
    }

    return (
        <>

            <ActionMenu
                title='PI'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew(); }}
                    >New PI</Button>
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
                                                <Col md={4} className="">
                                                    <ErpInput
                                                        label="PI Number"
                                                        name="piCode"
                                                        sideBySide={false}
                                                        value={searchData.piCode}
                                                        onChange={( e ) => { handleInputOnChange( e ); }}
                                                    />
                                                </Col>
                                                <Col md={4} className="">
                                                    <ErpSelect
                                                        label="SC Number"
                                                        name="scId"
                                                        isClearable
                                                        sideBySide={false}
                                                        options={allSc}
                                                        value={searchData.scId}
                                                        onFocus={() => { handleScOnFocus() }}
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
                                    columns={scLcColumn( handleDetails, handleDelete, handleEdit, handleCreateReport )}
                                    sortIcon={<ChevronDown />}
                                    // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                                    className="react-custom-dataTable"
                                    // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                                    data={allPi}
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

export default PiList;
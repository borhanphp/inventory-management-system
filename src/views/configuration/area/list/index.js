import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import SlideDown from 'react-slidedown/lib/slidedown';
import { Button, Card, Col, NavItem, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';
import { breadcrumb } from '../../../../utility/Utils';
import AreaForm from '../form';
import AreaEditForm from '../form/Edit';
import { bindAreaInfo, getAllAreaByFilter, getAreaById, initialAreaData } from '../store';
import { areaColumn } from './column';

const initialState = {
    name: "",
};

export default function AreaList() {
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [searchData, setSearchData] = useState( initialState );
    const [sidebarOpen, setSidebarOpen] = useState( false );
    const [editFormOpen, setEditFormOpen] = useState( false );
    const [sortField, setSortField] = useState( false );
    const [sortName, setSortName] = useState( 'name_desc' );



    const { allData, totalItems } = useSelector( ( { area } ) => area );
    const dispatch = useDispatch()

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

        dispatch( getAllAreaByFilter( submittedData ) )
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

    // edit form actions==========
    const handleEdit = ( row ) => {
        setEditFormOpen( true );
        dispatch( getAreaById( row?.id ) );
    };
    const toggleEditSidebar = () => {
        dispatch( bindAreaInfo( initialAreaData ) )
        setEditFormOpen( !editFormOpen );
    }

    // add new form actions========
    const toggleSidebar = () => {
        dispatch( bindAreaInfo( initialAreaData ) )
        setSidebarOpen( !sidebarOpen );
    }
    const handleFormOpen = () => {
        setSidebarOpen( false );
    };

    // search actions============
    const handleSearch = () => {
        setCurrentPage( 1 )
        getItems( 1, rowsPerPage )
    };
    const handleClearField = () => {
        const submittedData = {
            page: 1,
            pageSize: rowsPerPage,
            includes: [],
            filters: [],
            sorts: [],
        };
        dispatch( getAllAreaByFilter( submittedData ) )
        setSearchData( initialState );
    };
    const handlePagination = page => {
        setCurrentPage( page.selected + 1 );
        getItems( page.selected + 1, rowsPerPage );
    };

    const handlePerPage = ( selectedRowsPerPage ) => {
        setRowsPerPage( selectedRowsPerPage );
        setCurrentPage( 1 );
        getItems( 1, selectedRowsPerPage );
    };
    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } );
    };

    return (
        <>
            <ActionMenu
                title='Area'
                breadcrumb={breadcrumb}

            >
                <NavItem className="" >
                    <Button
                        className=""
                        color="primary"
                        size="sm"
                        onClick={() => { toggleSidebar(); }}
                    >
                        New
                    </Button>
                </NavItem>

            </ActionMenu>
            <div className='mt-3'>
                <Card>
                    <Row className='px-3'>
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
                        <div className="px-3 pb-3">
                            <Row className="border rounded-3 p-1">
                                <Col md={9}>
                                    <Row>
                                        <Col lg={4} className="mt-1">
                                            <ErpInput
                                                label="Area Name"
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
                            columns={areaColumn( handleEdit )}
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
            </div>
            {sidebarOpen &&
                <AreaForm
                    open={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    handleFormOpen={handleFormOpen}
                    pageSize={rowsPerPage}
                />}

            {editFormOpen &&
                <AreaEditForm
                    currentPage={currentPage}
                    editFormOpen={editFormOpen}
                    toggleEditSidebar={toggleEditSidebar}
                    pageSize={rowsPerPage}

                />}

        </>
    )
}

import moment from 'moment'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner'
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog'
import CustomDatePicker from '../../../../utility/custom/CustomDatePicker'
import CustomHeader from '../../../../utility/custom/CustomeHeader'
import CustomPagination from '../../../../utility/custom/CustomPagination'
import ErpInput from '../../../../utility/custom/ErpInput'
import FormContentLayout from '../../../../utility/custom/FormContentLayout'
import FormLayout from '../../../../utility/custom/FormLayout'
import { bindOfferedItemInfo, deleteOfferedItem, getAllOfferedItems, getOfferedItemById } from '../store'
import { initialOfferedData } from '../store/model'
import { offeredItemColumn } from './columns'

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
    description: '',
    start_date: '',
    end_date: ''
};

const OfferedItemList = () => {
    const { offeredItems, totalItems, loading } = useSelector( ( { offeredItems } ) => offeredItems );

    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchData, setSearchData] = useState( initialState );


    const handleEdit = ( row ) => {
        dispatch( getOfferedItemById( row.id ) )
    }

    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } )
    }
    const handleDateChange = ( data, name ) => {
        const formattedData = moment( data[0] ).format( 'DD-MM-yyyy' )
        setSearchData( { ...searchData, [name]: data[0] } )
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

                if ( key === "description" ) {
                    comparision = "like";
                    fieldValue = searchData[key];
                } else if (
                    key === "start_date" || key === "end_date"

                ) {
                    fieldValue = moment( searchData[key] ).format( 'DD-MM-yyyy' ) || null;
                }

                submittedData.filters.push( {
                    fieldName: key,
                    comparision,
                    fieldValue,
                } );
            }
        }

        console.log( "submittedData", JSON.stringify( submittedData, null, 2 ) );
        dispatch( getAllOfferedItems( submittedData ) )
    }


    useEffect( () => {
        getItems( currentPage, rowsPerPage );
    }, [] )

    const handleSort = () => {

    };

    const handleClearField = () => {
        const submittedData = {
            page: 1,
            pageSize: 10,
            includes: [],
            filters: [],
            sorts: [],
        };
        dispatch( getAllOfferedItems( submittedData ) )
        setSearchData( initialState );
    };

    const handleSearch = () => {
        setCurrentPage( 1 )
        getItems( 1, rowsPerPage )
    };
    console.log( searchData );

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
                dispatch( deleteOfferedItem( id ) )
                    .then( () => {
                        const paramObj = {
                            page: currentPage,
                            pageSize: rowsPerPage
                        }
                        dispatch( getAllOfferedItems( paramObj ) )
                        dispatch( bindOfferedItemInfo( initialOfferedData ) )
                        toast.success( 'Offer Deleted' );
                    } )
            }
        } );
    };





    return (
        <div>
            <FormLayout>
                <CustomHeader
                    handlePerPage={handlePerPage}
                    perPage={rowsPerPage}
                >

                </CustomHeader>
                <FormContentLayout title="Offered Items">
                    <div className='text-end px-2 mb-1'>
                        <Row className="">
                            {/* <Col>
                                    <CustomHeader
                                        handlePerPage={handlePerPage}
                                        perPage={rowsPerPage}
                                    >
                                    </CustomHeader>
                                </Col> */}

                            <Col lg={3} className="">
                                <ErpInput
                                    sideBySide={false}
                                    placeholder="Search by Item"
                                    name="description"
                                    bsSize="sm"
                                    value={searchData.description}
                                    onChange={( e ) => { handleOnChange( e ); }}
                                />
                            </Col>
                            <Col lg={3} className="">
                                <CustomDatePicker
                                    placeholder="Search by Start Date"
                                    id="start_date"
                                    name="start_date"
                                    value={searchData.start_date}
                                    onChange={( data ) => handleDateChange( data, "start_date" )}
                                />
                            </Col>
                            <Col lg={3} className="">
                                <CustomDatePicker
                                    placeholder="Search by End Date"
                                    id="end_date"
                                    name="end_date"
                                    value={searchData.end_date}
                                    onChange={( data ) => handleDateChange( data, "end_date" )}
                                />
                            </Col>
                            <Col lg={3} className="">
                                <Button
                                    color="success"
                                    className=''
                                    size='sm'
                                    onClick={() => { handleSearch() }}
                                >Search</Button>
                                <Button
                                    color="secondary"
                                    className='ms-1'
                                    size='sm'
                                    onClick={() => { handleClearField() }}
                                >Clear</Button>
                            </Col>


                        </Row>
                    </div>



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
                            columns={offeredItemColumn( handleEdit, handleDelete )}
                            sortIcon={<ChevronDown />}
                            // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                            className="react-custom-dataTable"
                            // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                            data={offeredItems}
                        />

                        <CustomPagination
                            onPageChange={page => handlePagination( page )}
                            currentPage={currentPage}
                            count={Number( Math.ceil( totalItems / rowsPerPage ) )}
                            totalItems={totalItems}
                        />
                    </div>
                </FormContentLayout>
            </FormLayout>

        </div>
    )
}

export default OfferedItemList
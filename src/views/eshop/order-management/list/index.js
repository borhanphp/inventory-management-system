import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SlideDown from 'react-slidedown'
import { Button, Col, Row } from 'reactstrap'
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner'
import ActionMenu from '../../../../@core/layouts/components/ActionMenu'
import CustomPagination from '../../../../utility/custom/CustomPagination'
import ErpInput from '../../../../utility/custom/ErpInput'
import FormContentLayout from '../../../../utility/custom/FormContentLayout'
import FormLayout from '../../../../utility/custom/FormLayout'
import TabContainer from '../../../../utility/custom/TabContainer'
import { getAllOrdersItems } from '../store'
import CancelledItems from './CancelledOrders'
import { ordersColumn } from './columns'
import RefundRequest from './RefundRequest'
import ReplacementRequest from './ReplacementRequest'


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
    stringStartDate: '',
    stringEndDate: ''
};

const ordersList = () => {
    const { ordersItems, totalItems, loading } = useSelector( ( { orders } ) => orders );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchData, setSearchData] = useState( initialState );
    const [isDraft, setIsDraft] = useState( false );


    const handleEdit = ( row ) => {
        dispatch( getOfferedItemById( row.id ) )
    }

    const handleDetails = ( id ) => {
        navigate( '/order-details', { state: id } )
    }

    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } )
    }
    const handleDateChange = () => {

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

        // console.log( "submittedData", JSON.stringify( submittedData, null, 2 ) );
        dispatch( getAllOrdersItems( submittedData ) )
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
        dispatch( getAllOrdersItems( submittedData ) )
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


    // const confirmObj = {
    //     title: 'Are you sure?',
    //     text: "You won't be able to revert this!",
    //     confirmButtonText: 'Yes!',
    //     cancelButtonText: 'No'
    // };

    // const handleDelete = ( id ) => {
    //     confirmDialog( {
    //         ...confirmObj
    //     } ).then( async e => {
    //         if ( e.isConfirmed ) {
    //             dispatch( deleteOfferedItem( id ) )
    //                 .then( () => {
    //                     const paramObj = {
    //                         page: currentPage,
    //                         pageSize: rowsPerPage
    //                     }
    //                     dispatch( getAllOfferedItems( paramObj ) )
    //                     dispatch( bindOfferedItemInfo( initialOfferedData ) )
    //                     toast.success( 'Offer Deleted' );
    //                 } )
    //         }
    //     } );
    // };



    const tabs = [
        {
            name: 'Orders',
            width: '100'
        },
        {
            name: 'Refund Request',
            width: '150'
        },
        {
            name: 'Replacement Request',
            width: '200'
        },
        {
            name: 'Cancelled',
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
        <div>
            <ActionMenu
                title='Order Management'
                // breadcrumb={breadcrumb}
                moreButton={false}
            >
            </ActionMenu>
            <div className='mt-3'>
                <TabContainer tabs={tabs} onClick={handleTab}>

                    <div>
                        <FormLayout>
                            <FormContentLayout>
                                <SlideDown>
                                    <div className="px-1 pb-2">
                                        <Row className="">
                                            <Col md={9}>
                                                <Row>
                                                    <Col md={6} lg={4} xxl={2} className="mt-1">
                                                        <ErpInput
                                                            label="Order Number"
                                                            name="description"
                                                            sideBySide={false}
                                                            value={searchData.description}
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
                                        columns={ordersColumn( handleDetails )}
                                        sortIcon={<ChevronDown />}
                                        // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                                        className="react-custom-dataTable"
                                        // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                                        data={ordersItems}
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
                    <div>
                        <RefundRequest />
                    </div>
                    <div>
                        <ReplacementRequest />
                    </div>
                    <div>
                        <CancelledItems />
                    </div>

                </TabContainer>
            </div>
        </div>


    )
}

export default ordersList
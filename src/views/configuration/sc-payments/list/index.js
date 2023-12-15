// import React, { useState } from 'react'
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, NavItem, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';
import { breadcrumb } from '../../../../utility/Utils';
import ScPaymentForm from '../form';
import ScPaymentEditForm from '../form/ScPaymentEditForm';
import { bindScPaymentInfo, getAllScPaymentByFilter, getScPaymentById } from '../store';
import { initialScPaymentData } from '../store/model';
import { scPaymentColumn } from './columns';

const initialState = {
  scCode: ''
};

const index = () => {
  const { allScPayments, totalItems, loading } = useSelector( ( { scPayments } ) => scPayments );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [sidebarOpen, setSidebarOpen] = useState( false );
  const [editFormOpen, setEditFormOpen] = useState( false );
  const [searchData, setSearchData] = useState( initialState );
  const [sortName, setSortName] = useState( 'scCode' );
  const dispatch = useDispatch();
  console.log( allScPayments )

  const handleOpenEditSidebar = ( condition ) => {
    setEditFormOpen( condition );

  };

  const handleEdit = ( row ) => {
    setEditFormOpen( true );
    dispatch( getScPaymentById( row?.id, handleOpenEditSidebar ) );
  };

  const handleBankFromOpen = () => {
    setSidebarOpen( false );
  };

  const toggleSidebar = () => {
    dispatch( bindScPaymentInfo( initialScPaymentData ) )
    setSidebarOpen( !sidebarOpen );
  }
  const toggleEditSidebar = () => {
    dispatch( bindScPaymentInfo( initialScPaymentData ) )
    setEditFormOpen( !editFormOpen );
  }

  const handleInputOnChange = ( e ) => {
    const { name, value } = e.target;
    setSearchData( { ...searchData, [name]: value } );
  };

  const handleDropdownOnChange = ( data, e ) => {
    const { name } = e;
    setSearchData( { ...searchData, [name]: data } );
  };


  //********* pagination, searching and sorting start here  ******** */
  // for getting banks with page and rows per page,
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

        if ( key === "bankname" || key === "accountno" || key === "swiftcode" ) {
          comparision = "like";
          fieldValue = searchData[key];
        } else if ( key === "countryoforigin" ) {
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
    dispatch( getAllScPaymentByFilter( submittedData ) )
  }

  useEffect( () => {
    getItems( 1, rowsPerPage );
  }, [] )

  const getSortedData = () => {
    const submittedData = {
      page: currentPage,
      pageSize: rowsPerPage,
      includes: [],
      filters: [],
      sorts: [sortName],
    };

    dispatch( getAllScPaymentByFilter( submittedData ) )
  }



  const handleSort = ( data ) => {
    if ( data.name === 'SC Number' ) {
      if ( sortName === 'scCode' ) {
        setSortName( 'scCode_desc' );
      } else {
        setSortName( 'scCode' );
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
    dispatch( getAllScPaymentByFilter( submittedData ) )
    setSearchData( initialState );
  };

  const handleSearch = () => {
    setCurrentPage( 1 )
    getItems( 1, rowsPerPage )
  };

  // ** Function in get data on page change
  const handlePagination = page => {
    getItems( page.selected + 1, rowsPerPage )
    setCurrentPage( page.selected + 1 )
  };

  const handlePerPage = ( selectedRowsPerPage ) => {
    setRowsPerPage( selectedRowsPerPage );
    setCurrentPage( 1 );
    getItems( 1, selectedRowsPerPage );
  };

  /********* pagination, searching and sorting end here  ******** */

  return (
    <>
      <ActionMenu
        title='Payments'
        breadcrumb={breadcrumb}

      >
        <NavItem className="" >
          <Button
            className=""
            color="primary"
            size="sm"
            onClick={() => { toggleSidebar(); }}
          >
            Add Payments
          </Button>
        </NavItem>

      </ActionMenu>
      <div className='mt-3'>
        <Card className='overflow-hidden'>
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

          <div className="px-3 pb-2">
            <Row className="border rounded-3 p-2">
              <Col md="9">
                <Row>
                  <Col md={4} className="mt-1">
                    <ErpInput
                      label="SC Number"
                      name="scCode"
                      sideBySide={false}
                      value={searchData.scCode}
                      onChange={( e ) => { handleInputOnChange( e ); }}
                    />
                  </Col>


                </Row>
              </Col>
              <Col md="3">
                <Row>
                  <Col className="mt-3 float-end">
                    <Button
                      className="float-end"
                      color="secondary"
                      size="sm"
                      onClick={() => { handleClearField(); }}
                    >
                      Clear
                    </Button>

                    <Button
                      className="me-1 float-end"
                      color="success"
                      size="sm"
                      onClick={() => { handleSearch(); }}
                    >
                      Search
                    </Button>

                  </Col>
                </Row>
              </Col>



            </Row>
          </div>

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
              columns={scPaymentColumn( handleEdit )}
              sortIcon={<ChevronDown />}
              // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
              className="react-custom-dataTable"
              // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
              data={allScPayments}

            />

            <CustomPagination
              onPageChange={page => handlePagination( page )}
              currentPage={currentPage}
              count={Number( Math.ceil( totalItems / rowsPerPage ) )}
            />
          </div>
        </Card>
      </div>

      {sidebarOpen &&
        <ScPaymentForm
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleBankFromOpen={handleBankFromOpen}
        />}

      {editFormOpen &&
        <ScPaymentEditForm
          currentPage={currentPage}
          editFormOpen={editFormOpen}
          toggleEditSidebar={toggleEditSidebar}
        />}

    </>
  );
};

export default index;
// import React, { useState } from 'react'
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, NavItem, Row } from 'reactstrap';
import SpinnerComponent from '../../../@core/components/spinner/Fallback-spinner';
import ActionMenu from '../../../@core/layouts/components/ActionMenu';
import CustomHeader from '../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../utility/custom/CustomPagination';
import { breadcrumb } from '../../../utility/Utils';
import UserForm from '../form';
import UserEditForm from '../form/UserEditForm';
import { getAllUserByFilter, getUserById } from '../store';
import { userColumn } from './columns';

const initialState = {
  name: "",
  shortform: ""
};

const UserList = () => {
  const { allUsers, totalItems } = useSelector( ( { userReducer } ) => userReducer )
  const [sidebarOpen, setSidebarOpen] = useState( false );
  const [editSidebarOpen, setEditSidebarOpen] = useState( false );
  const toggleSidebar = () => setSidebarOpen( !sidebarOpen );
  const toggleEditSidebar = () => setEditSidebarOpen( !editSidebarOpen );
  const dispatch = useDispatch();
  const [sortName, setSortName] = useState( 'username_desc' );
  const [sortEmail, setSortEmail] = useState( 'email_desc' );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [searchData, setSearchData] = useState( initialState );



  const handleEdit = ( row ) => {
    setEditSidebarOpen( true )
    dispatch( getUserById( row?.id ) );
  }

  //********* pagination, searching and sorting start here  ******** */
  // for getting brands with page and rows per page,
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

        if ( key === "name" || key === "shortform" ) {
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
    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( getAllUserByFilter( submittedData ) )
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
    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )

    dispatch( getAllUserByFilter( submittedData ) )
  }



  const handleSort = ( data ) => {

    if ( sortName === 'username_desc' ) {
      setSortName( 'username' );
    } else {
      setSortName( 'username_desc' );
    }
    setSortEmail( null );


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
    dispatch( getAllUserByFilter( submittedData ) )
    setSearchData( initialState );
    setCurrentPage( 1 )
    handlePerPage( rowsPerPage )
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
        title='Users'
        breadcrumb={breadcrumb}

      >
        <NavItem className="" >
          <Button
            className=""
            color="primary"
            size="sm"
            onClick={() => { toggleSidebar(); }}
          >
            Add User
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
              columns={userColumn( handleEdit )}
              sortIcon={<ChevronDown />}
              // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
              className="react-custom-dataTable"
              // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
              data={allUsers}

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
        <UserForm
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />}
      {editSidebarOpen &&
        <UserEditForm
          editSidebarOpen={editSidebarOpen}
          toggleEditSidebar={toggleEditSidebar}
        />}

    </>
  );
};

export default UserList;
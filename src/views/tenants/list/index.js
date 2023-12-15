// import React, { useState } from 'react'
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Row } from 'reactstrap';
import SpinnerComponent from '../../../@core/components/spinner/Fallback-spinner';
import CustomHeader from '../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../utility/custom/CustomPagination';
import TenantsForm from '../form';
import TenantsEditForm from '../form/TenantsEditForm';
import { bindTenantsInfo, fetchAllTenants, getTenantsById } from '../store';
import { initialTenantsData } from '../store/model';
import { tenantsColumn } from './columns';

const initialState = {
  name: "",
  note: ""
};


const defaultFilteredArrayValue = [
  {
    column: "name",
    value: ''
  },
  {
    column: "note",
    value: ''
  }

];
const index = () => {
  const { allTenants, totalItems } = useSelector( ( { tenants } ) => tenants );
  // const [isLoading, setIsLoading] = useState( false );
  // const [filteredArray, setFilteredArray] = useState( defaultFilteredArrayValue );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );


  // const [brandData, setBrandData] = useState( allData );
  const [sidebarOpen, setSidebarOpen] = useState( false );
  const [editFormOpen, setEditFormOpen] = useState( false );
  // const [searchData, setSearchData] = useState( initialState );
  // const { name, note } = searchData;
  const dispatch = useDispatch();



  const handleOpenEditSidebar = ( condition ) => {
    setEditFormOpen( condition );
  };

  const handleEdit = ( row ) => {
    setEditFormOpen( true );
    dispatch( getTenantsById( row?.id, handleOpenEditSidebar ) );
  };

  const handleDelete = ( id ) => {
    // console.log( 'delete' )
  };

  const handleFromOpen = () => {
    setSidebarOpen( false );
  };

  // const handlePageChange = ( page ) => {
  //   setCurrentPage( page.selected + 1 );
  // };

  const toggleSidebar = () => {
    dispatch( bindTenantsInfo( initialTenantsData ) )
    setSidebarOpen( !sidebarOpen );
  }
  const toggleEditSidebar = () => {
    dispatch( bindTenantsInfo( initialTenantsData ) )
    setEditFormOpen( !editFormOpen );
  }

  const paramsObj = {
    page: currentPage,
    pageSize: rowsPerPage
  };
  // const filteredData = filteredArray.filter( filter => filter.value.length );

  // //this function handles loading callback of get All data
  // const handleLoadingCallback = ( response ) => {
  //   setIsLoading( response );
  // };

  // fetches all tenants data
  const handleGetAll = () => {
    dispatch( fetchAllTenants( paramsObj ) );
  };

  useEffect( () => {
    handleGetAll();
  }, [dispatch, currentPage, rowsPerPage] );

  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(
      fetchAllTenants( {
        page: page.selected + 1,
        pageSize: rowsPerPage,
        // sortedBy,
        // orderBy,
        // status
      }, filteredData )
    );
    setCurrentPage( page.selected + 1 );
  };

  // const handleSort = ( column, direction ) => {
  //   // const { selector } = column;
  //   // setSortedBy( selector );
  //   // setOrderBy( direction );
  //   dispatch(
  //     getAllBrandsByQuery( {
  //       page: currentPage,
  //       pageSize: rowsPerPage,
  //       // sortedBy: selector,
  //       // orderBy: direction,
  //       // status
  //     }, filteredData, handleLoadingCallback )
  //   );
  // };


  return (
    <>

      <Card className='overflow-hidden'>
        <Row className="px-3">
          <Col>
            <CustomHeader>
              <Button
                className=""
                color="primary"
                size="sm"
                onClick={() => { toggleSidebar(); }}
              >
                Add Tenants
              </Button>
            </CustomHeader>
          </Col>
        </Row>
        {/* <SlideDown>
          <div className="px-3 pb-2">
            <Row className="border rounded-3 p-2">
              <Col md={9} lg={9} xl={9} xxl={9}>
                <Row>
                  <Col md={4} lg={4} xl={4} xxl={4}>
                    <ErpInput
                      label="Name"
                      name="brandName"
                      sideBySide={false}
                    // value={noSell}
                    // onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                    />
                  </Col>
                  <Col md={4} lg={4} xl={4} xxl={4}>
                    <ErpInput
                      label="Description"
                      name="note"
                      sideBySide={false}
                    // value={noSell}
                    // onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                    />
                  </Col>
                </Row>
              </Col>

              <Col md={3} lg={3} xl={3} xxl={3} className="mt-2 text-end">
                <Button
                  className="me-1"
                  color="success"
                  size="sm"
                  onClick={() => { }}
                >
                  Search
                </Button>
                <Button
                  className=""
                  color="secondary"
                  size="sm"
                  onClick={() => { }}
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
            // onSort={handleSort}
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
            columns={tenantsColumn( handleEdit, handleDelete )}
            sortIcon={<ChevronDown />}
            // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
            className="react-custom-dataTable"
            // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
            data={allTenants}

          />
        </div>

        <CustomPagination
          onPageChange={page => handlePagination( page )}
          currentPage={currentPage}
          count={Number( Math.ceil( totalItems / rowsPerPage ) )}
          totalItems={totalItems}
        />
      </Card>
      {sidebarOpen &&
        <TenantsForm
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleFromOpen={handleFromOpen}
        />}


      {editFormOpen &&
        <TenantsEditForm
          editFormOpen={editFormOpen}
          toggleEditSidebar={toggleEditSidebar}
        />}

    </>
  );
};

export default index;
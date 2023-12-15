// import React, { useState } from 'react'
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card, Col, NavItem, Row
} from "reactstrap";
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner";
import ActionMenu from "../../../../@core/layouts/components/ActionMenu";
import CustomHeader from "../../../../utility/custom/CustomeHeader";
import CustomPagination from "../../../../utility/custom/CustomPagination";
import ErpInput from "../../../../utility/custom/ErpInput";
import { breadcrumb } from "../../../../utility/Utils";
import CategoryForm from "../form";
import CategoryEditForm from "../form/CategoryEditForm";
import { bindCategoryInfo, getAllCategoryByFilter, getCategoryById } from "../store";
import { initialCategoryData } from "../store/model";
import { categoryColumn } from "./columns";

const initialState = {
  name: "",
  note: ""
};

const index = () => {
  // const { allData, totalItems } = useSelector( ( { categoryReducer } ) => categoryReducer );
  const { allData, totalItems, loading } = useSelector( ( { categories } ) => categories );
  const [isLoading, setIsLoading] = useState( false );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const [searchData, setSearchData] = useState( initialState );
  const [sortName, setSortName] = useState( 'name_desc' );
  const [sidebarOpen, setSidebarOpen] = useState( false );
  const [editFormOpen, setEditFormOpen] = useState( false );
  const [sortField, setSortField] = useState( false );

  const dispatch = useDispatch();




  const handleOpenEditSidebar = ( condition ) => {
    setEditFormOpen( condition );

  };

  const handleInputOnChange = ( e ) => {
    const { name, value } = e.target;
    setSearchData( { ...searchData, [name]: value } );
  };

  const handleEdit = ( row ) => {
    dispatch( getCategoryById( row?.id ) );
    handleOpenEditSidebar( true )
  };

  const toggleSidebar = () => {
    dispatch( bindCategoryInfo( initialCategoryData ) )
    setSidebarOpen( !sidebarOpen );
  }
  const toggleEditSidebar = () => {
    dispatch( bindCategoryInfo( initialCategoryData ) )
    setEditFormOpen( !editFormOpen );
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
      sorts: sortField ? [sortName] : [],
    };

    for ( const key in searchData ) {
      if ( searchData[key] ) {
        let comparision = "eq";
        let fieldValue = searchData[key];

        if ( key === "name" ) {
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
    dispatch( getAllCategoryByFilter( submittedData ) )
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


  const handleClearField = () => {
    const submittedData = {
      page: 1,
      pageSize: rowsPerPage,
      includes: [],
      filters: [],
      sorts: [],
    };
    dispatch( getAllCategoryByFilter( submittedData ) )
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
        title='Categories'
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
      <div className="mt-3">
        <Card className="overflow-hidden">
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
                      label="Category Name"
                      name="name"
                      sideBySide={false}
                      value={searchData.name}
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
              columns={categoryColumn( handleEdit )}
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

      {sidebarOpen && (
        <CategoryForm open={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      {editFormOpen && (
        <CategoryEditForm currentPage={currentPage} editFormOpen={editFormOpen} toggleEditSidebar={toggleEditSidebar} />
      )}
    </>
  );
};

export default index;

// import React, { useState } from 'react'
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SlideDown from 'react-slidedown';
import { Button, Card, Col, NavItem, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { breadcrumb } from '../../../../utility/Utils';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import ErpInput from '../../../../utility/custom/ErpInput';
import { getSegmentByFilter, getSegmentById } from '../store';
import { segmentColumn } from './columns';
import ValueList from './list-widgets/ValueList';

const initialState = {
  name: "",
};

const SegmentList = () => {
  const { allData, totalItems, loading } = useSelector( ( { segments } ) => segments );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState( initialState );
  const [sortName, setSortName] = useState( 'name' );
  const [sortField, setSortField] = useState( false );



  const handleAddNew = () => {
    navigate( '/segment-add' )
  };
  const handleEdit = ( id ) => {
    // console.log( 'called after editing segment' )
    dispatch( getSegmentById( id ) )
    navigate( '/segment-edit', { state: id } )
  };

  const handleInputOnChange = ( e ) => {
    const { name, value } = e.target;
    setSearchData( { ...searchData, [name]: value } );
  };

  // for getting items with page and rows per page,
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
    // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( getSegmentByFilter( submittedData ) )
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

    getItems( currentPage, rowsPerPage );
  };


  const handleClearField = () => {
    const submittedData = {
      page: 1,
      pageSize: rowsPerPage,
      includes: [],
      filters: [],
      sorts: [],
    };
    dispatch( getSegmentByFilter( submittedData ) )
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





  return (
    <>
      <ActionMenu
        title='Item Variants'
        breadcrumb={breadcrumb}

      >
        <NavItem className="" >
          <Button
            className=""
            color="primary"
            size="sm"
            onClick={() => { handleAddNew() }}
          >
            New
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
          <SlideDown>
            <div className="px-3 pb-2">
              <Row className="border rounded-3 p-2">
                <Col md={9}>
                  <Row>
                    <Col lg={4} className="mt-1">
                      <ErpInput
                        label="Variant Name"
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
              progressPending={loading}
              progressComponent={
                <SpinnerComponent />
              }
              dense
              subHeader={false}
              highlightOnHover
              responsive={true}
              paginationServer
              expandableRows={true}
              // expandOnRowClicked
              columns={segmentColumn( handleEdit )}
              sortIcon={<ChevronDown />}
              // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
              className="react-custom-dataTable"
              expandableRowsComponent={ValueList}
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

    </>
  );
};

export default SegmentList;
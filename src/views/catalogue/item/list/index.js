// import React, { useState } from 'react'
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SlideDown from 'react-slidedown';
import { Button, Card, Col, NavItem, Row } from 'reactstrap';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { allCategoryWithHierarchyCm, getAllBrandCm, getAllCountriesCm, getAllItemTypeCm, getAllUnitCm } from '../../../../redux/common/store';
import CustomHeader from '../../../../utility/custom/CustomeHeader';
import CustomPagination from '../../../../utility/custom/CustomPagination';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import { breadcrumb } from '../../../../utility/Utils';
import { getItemsByFilter } from '../store';
import { itemColumn } from './columns';

const initialState = {
  description: '',
  categoryId: '',
  brandId: '',
  unitOfMeasureId: '',
  manufacturedCountry: '',
  itemType: '',
  hsCode: '',
};


const index = () => {
  const { allData, totalItems, loading } = useSelector( ( { items } ) => items );
  const { unitDataCm, categoryHierarchyCm, itemTypeDataCm, countriesData, brandDataCm } = useSelector( ( { commons } ) => commons );

  const [currentPage, setCurrentPage] = useState( 1 );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState( initialState );
  const [sortName, setSortName] = useState( 'description_desc' );
  const [sortPurchase, setSortPurchase] = useState( 'purchaseprice' );
  const [sortSales, setSortSales] = useState( 'salesprice' );
  const [sortField, setSortField] = useState( false );


  const handleInputOnChange = ( e ) => {
    const { name, value } = e.target;
    setSearchData( { ...searchData, [name]: value } );
  };

  const handleDropdownOnChange = ( data, e ) => {
    const { name } = e;
    setSearchData( { ...searchData, [name]: data } );
  };

  const handleAddNew = () => {
    navigate( '/add-item' )
  }

  const handleEdit = ( row ) => {
    navigate( '/edit-item', { state: row.id } );
  };

  const handleDetails = ( row ) => {
    navigate( '/item-details', { state: row.id } );
  };

  const handleBrandOnFocus = () => {
    if ( !brandDataCm.length ) {
      dispatch( getAllBrandCm() )
    }
  }
  const handleCategoryOnFocus = () => {
    if ( !categoryHierarchyCm.length ) {
      dispatch( allCategoryWithHierarchyCm() )
    }
  }
  const handleUOMOnFocus = () => {
    if ( !unitDataCm.length ) {
      dispatch( getAllUnitCm() )
    }
  }
  const handleCountriesOnFocus = () => {
    if ( !countriesData.length ) {
      dispatch( getAllCountriesCm() )
    }
  }

  const handleItemTypeOnFocus = () => {
    if ( !itemTypeDataCm.length ) {
      const paramObj = {
        page: 1,
        pageSize: 100000
      }
      dispatch( getAllItemTypeCm( paramObj ) )
    }
  }


  // for getting items with page and rows per page,
  // also using for pagination
  const getItems = ( page, perPage ) => {
    const submittedData = {
      page: page,
      pageSize: perPage,
      includes: [],
      filters: [],
      sorts: sortField ? [sortName || sortPurchase || sortSales] : [],
    };

    for ( const key in searchData ) {
      if ( searchData[key] ) {
        let comparision = "eq";
        let fieldValue = searchData[key];

        if ( key === "description" || key === 'hsCode' ) {
          comparision = "like";
          fieldValue = searchData[key];
        } else if (
          key === "brandId" ||
          key === "categoryId" ||
          key === "unitOfMeasureId" ||
          key === "manufacturedCountry" ||
          key === "itemType"

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
    dispatch( getItemsByFilter( submittedData ) )
  }


  useEffect( () => {
    getItems( currentPage, rowsPerPage );
  }, [sortName, sortPurchase, sortSales] )

  const handleSort = ( data ) => {
    setSortField( true )

    if ( data.name === 'Item' ) {

      if ( sortName === 'description_desc' ) {
        setSortName( 'description' );
      } else {
        setSortName( 'description_desc' );
      }
      setSortPurchase( null );
      setSortSales( null );


    } else if ( data.name === 'Purchase Price' ) {

      if ( sortPurchase === 'purchaseprice' ) {
        setSortPurchase( 'purchaseprice_desc' );
      } else {
        setSortPurchase( 'purchaseprice' );
      }
      setSortName( null );
      setSortSales( null );

    } else {

      if ( sortSales === 'salesprice' ) {
        setSortSales( 'salesprice_desc' );
      } else {
        setSortSales( 'salesprice' );
      }
      setSortName( null );
      setSortPurchase( null );

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
    dispatch( getItemsByFilter( submittedData ) )
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
        title='Items'
        breadcrumb={breadcrumb}

      >
        <NavItem className="" >
          <Button
            className=""
            color="primary"
            size="sm"
            onClick={() => { handleAddNew(); }}
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
                <Col md={10}>
                  <Row>
                    <Col md={6} lg={3} className="mt-1">
                      <ErpInput
                        label="Item"
                        name="description"
                        sideBySide={false}
                        value={searchData.description}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                      />
                    </Col>
                    <Col md={6} lg={3} className="mt-1">
                      <ErpInput
                        label="HS Code"
                        name="hsCode"
                        sideBySide={false}
                        value={searchData.hsCode}
                        onChange={( e ) => { handleInputOnChange( e ); }}
                      />
                    </Col>
                    <Col md={6} lg={3} className="mt-1">
                      <ErpSelect
                        label="Category"
                        name="categoryId"
                        isClearable
                        options={categoryHierarchyCm}
                        sideBySide={false}
                        value={searchData.categoryId}
                        onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                        onFocus={() => { handleCategoryOnFocus() }}
                      />
                    </Col>
                    <Col md={6} lg={3} className="mt-1">
                      <ErpSelect
                        label="Brand"
                        name="brandId"
                        isClearable
                        options={brandDataCm}
                        sideBySide={false}
                        value={searchData.brandId}
                        onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                        onFocus={() => { handleBrandOnFocus() }}
                      />
                    </Col>
                    <Col md={6} lg={3} className="mt-1">
                      <ErpSelect
                        label="UOM"
                        name="unitOfMeasureId"
                        isClearable
                        options={unitDataCm}
                        sideBySide={false}
                        value={searchData.unitOfMeasureId}
                        onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                        onFocus={() => { handleUOMOnFocus() }}
                      />
                    </Col>
                    <Col md={6} lg={3} className="mt-1">
                      <ErpSelect
                        label="Manufactured Country"
                        name="manufacturedCountry"
                        isClearable
                        options={countriesData}
                        sideBySide={false}
                        value={searchData.manufacturedCountry}
                        onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                        onFocus={() => { handleCountriesOnFocus() }}
                      />
                    </Col>
                    <Col md={6} lg={3} className="mt-1">
                      <ErpSelect
                        label="Item Type"
                        name="itemType"
                        isClearable={true}
                        options={itemTypeDataCm}
                        sideBySide={false}
                        value={searchData.itemType}
                        onChange={( data, e ) => { handleDropdownOnChange( data, e ); }}
                        onFocus={() => { handleItemTypeOnFocus() }}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col md={2} className="mt-3 text-end">
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
              // expandableRows={true}
              // expandOnRowClicked
              columns={itemColumn( handleDetails, handleEdit )}
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
            // totalItems={totalItems}
            />

          </div>


        </Card>
      </div>



    </>
  );
};

export default index;
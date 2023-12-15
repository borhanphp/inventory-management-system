import "@src/assets/scss/sales/sales.scss";
import ErpSelect from "@src/utility/custom/ErpSelect";
import React, { useEffect, useRef, useState } from "react";
import { CheckCircle } from "react-feather";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card, Col,
  Container, Input,
  InputGroup,
  Row
} from "reactstrap";
import { allCategoryWithHierarchyCm, getAllBrandCm } from "../../../../redux/common/store";
import { API } from "../../../../services/api_endpoint";
import { getItemsByFilter } from "../../../catalogue/item/store";
import { cartProduct, saveProduct } from "../store/actions";


const initialState = {
  categoryId: null,
  brandId: null,
  description: ''
};


const ProductList = ( { salesId } ) => {
  const { brandDataCm, categoryHierarchyCm } = useSelector( ( { commons } ) => commons );
  const { allData, totalItems } = useSelector( ( { items } ) => items );
  const { cartItems } = useSelector( ( { posProducts } ) => posProducts );
  const [rowsPerPage, setRowsPerPage] = useState( 20 )
  const [searchData, setSearchData] = useState( initialState );
  const dispatch = useDispatch();
  const loadingRef = useRef( null );
  const dataSelected = cartItems?.map( d => d?.id );

  const selectedProducts = allData.filter( ( data ) =>
    dataSelected.includes( data.id )
  );
  const unselectedProducts = allData.filter(
    ( data ) => !dataSelected.includes( data.id )
  );

  const allProducts = selectedProducts.concat( unselectedProducts );

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
        } else if ( key === "brandId" || key === "categoryId" ) {
          fieldValue = searchData[key].value.toString() || null;
        }

        submittedData.filters.push( {
          fieldName: key,
          comparision,
          fieldValue,
        } );
      }
    }

    dispatch( getItemsByFilter( submittedData ) )
  };


  useEffect( () => {
    const observer = new IntersectionObserver( handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    } );

    if ( loadingRef.current ) {
      observer.observe( loadingRef.current );
    }
    return () => {
      observer.disconnect()
    }

  }, [] );

  useEffect( () => {
    getItems( 1, rowsPerPage );
  }, [dispatch, searchData, rowsPerPage] );


  const handleObserver = ( entries ) => {
    if ( entries[0].isIntersecting ) {
      setRowsPerPage( ( prev ) => prev + 10 )
    }
  };

  const getProduct = ( data ) => {
    dispatch( saveProduct( data ) );
    dispatch( cartProduct() );
  };


  const handleDropdownChange = ( data, e ) => {
    const { name } = e;
    setSearchData( { ...searchData, [name]: data } );
  };

  const handleClear = () => {
    // getItems( 1, rowsPerPage )
    setSearchData( initialState )
  };

  const handleListSearchInput = ( e ) => {
    const { name, value } = e.target;
    setSearchData( { ...searchData, [name]: value } );
  };

  const handleCategoryOnFocus = () => {
    if ( !categoryHierarchyCm.length ) {
      dispatch( allCategoryWithHierarchyCm() )
    }
  }

  const handleBrandOnFocus = () => {
    if ( !brandDataCm.length ) {
      dispatch( getAllBrandCm() )
    }
  }


  return (
    <>
      <Card className="p-2 product-list">
        <Container>
          <Row>
            <Col md={3}>
              <ErpSelect
                classNames="mt-1"
                placeholder="Category"
                name="categoryId"
                isClearable
                sideBySide={false}
                options={categoryHierarchyCm}
                value={searchData.categoryId}
                onChange={( data, e ) => {
                  handleDropdownChange( data, e );
                }}
                onFocus={() => { handleCategoryOnFocus() }}
              />
            </Col>
            <Col md={3}>
              <ErpSelect
                classNames="mt-1"
                name="brandId"
                sideBySide={false}
                isClearable
                placeholder="Brand"
                options={brandDataCm}
                value={searchData.brandId}
                onChange={( data, e ) => {
                  handleDropdownChange( data, e );
                }}
                onFocus={() => { handleBrandOnFocus() }}

              />
            </Col>
            <Col md={4}>
              <InputGroup className="mt-1">
                <Input
                  id="listSearchId"
                  name="description"
                  type="text"
                  bsSize="sm"
                  placeholder="Type to Search"
                  value={searchData.description}
                  onChange={( e ) => { handleListSearchInput( e ); }}
                />
                {/* <div className="input-group-append" style={{ zIndex: 0 }}>
                  <Button.Ripple
                    // tag={InputGroupText}
                    onClick={() => {
                      handleProductListSearch();
                    }}
                    className="btn-icon pt-0 pb-0 h-100"
                    color="primary"
                  >
                    <Search size={16} />
                  </Button.Ripple>
                </div> */}
              </InputGroup>
            </Col>
            <Col md={2}>
              <Button
                className="mt-1"
                size="sm"
                color="secondary"
                onClick={() => { handleClear(); }}
              >Clear</Button>
            </Col>
          </Row>

          <Row
            className="mt-2"
            style={{ maxHeight: "750px", overflowY: "auto" }}
          >
            {allProducts?.map( ( data, dIndex ) => {

              const isSelected = dataSelected?.includes( data?.id );
              const isZeroStock = data?.stock === 0;

              const handleItemClick = () => {
                if ( data.stock > 0 && data.salesPrice > 1 ) {
                  getProduct( data );
                } else if ( data.salesPrice === 0 ) {
                  toast.error( 'No price found' )
                } else {
                  toast.error( 'This item is Out of Stock' )

                }
              };

              const elementStyle = {
                height: "170px",
                width: "100%",
                // filter: isZeroStock ? "blur(0.5px)" : "none"
              };

              return (
                <Col md={4} key={dIndex} className="">
                  <div
                    className={`cursor-pointer text-center mb-1 ${isSelected ? "selected-design" : "normal-design"}`}
                    // onClick={() => { getProduct( data ); }}
                    style={elementStyle}
                    onClick={() => { handleItemClick() }}
                  >
                    {
                      isZeroStock ? (
                        <div className="text-end">
                          <small
                            className="text-danger text-sm bg-danger text-white"
                            style={{ padding: "0px 4px" }}
                          >Stock Out</small>
                        </div>
                      ) : (
                        <div className="text-end">
                          <small
                            className="text-sm bg-success text-white"
                            style={{ padding: "0px 4px" }}
                          >Stock: <b>{data?.stock}</b></small>
                        </div>
                      )
                    }

                    {/* {
                      isZeroStock ?
                        <div className="text-end">
                          <small
                            className="text-danger text-sm bg-danger text-white"
                            style={{ padding: "0px 4px" }}
                          >Stock Out</small>
                        </div>
                        :
                        <div className="text-end">
                          <small
                            className="text-danger text-sm bg-success text-white"
                            style={{ padding: "0px 4px" }}
                          >Stock: {data?.stock}</small>
                        </div>
                    } */}

                    {isSelected && (
                      <div>
                        <span className="selected-icon2">&#9700;</span>
                        <CheckCircle className="selected-icon" size={18} />
                      </div>
                    )}

                    <img
                      src={data?.baseImage ? `${API}/${data?.baseImage?.replace( 'wwwroot/', '' )}` : "/null-photo.png"}
                      className="mt-1"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        padding: "0px 2px",
                        // textAlign: 'justify'
                        // color: isZeroStock ? "#c7102b" : "black",
                      }}
                      className="mt-1"
                    >
                      {data?.description} <br />

                    </p>


                  </div>
                </Col>
              );
            } )}
            <div className="text-center" ref={loadingRef}>
              <Button color="light" >Load More</Button>
            </div>
          </Row>

        </Container>
      </Card>
    </>
  );
};

export default ProductList;

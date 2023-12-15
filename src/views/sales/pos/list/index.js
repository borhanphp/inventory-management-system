import "@styles/react/libs/charts/apex-charts.scss";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import "../../../../assets/scss/sales/sales.scss";
import { getAllItemsCm } from "../../../../redux/common/store";
import InstantPurchase from "../../../purchasing/instant-purchase/form/InstantPurchase";
import PosForm from "../form";
import { bindSalesInfo, getSalesById } from "../store/actions";
import { initialSalesState } from "../store/model";
import ProductList from "./ProductList";

const PosList = () => {


  const [openInstantPurchaseModal, setOpenInstantPurchaseModal] = useState( false );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()
  const salesId = location?.state

  useEffect( () => {
    if ( salesId ) {
      dispatch( getSalesById( salesId ) )

    }
  }, [salesId] )

  const handleBackButton = () => {
    navigate( '/sales/all-sales' );
    dispatch( bindSalesInfo( initialSalesState ) )
    localStorage.removeItem( "items" );
  };

  useEffect( () => {
    dispatch( getAllItemsCm() )
  }, [] );

  // invoice modal
  const handleInstantPurchaseModalOpen = () => {
    setOpenInstantPurchaseModal( true );
  };

  const handleInstantPurchaseModalClosed = () => {
    setOpenInstantPurchaseModal( false );
  };



  // useEffect( () => {
  //   const beforeUnloadHandler = ( e ) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //     return "Are you sure you want to leave?";
  //   };
  //   window.addEventListener( "beforeunload", beforeUnloadHandler );
  //   return () => {
  //     window.removeEventListener( "beforeunload", beforeUnloadHandler );
  //   };
  // }, [] );

  return (
    <>
      <div id="dashboard-analytics">
        <Row className="match-height px-1">
          <div className="pe-2 bg-white mb-1 text-end">
            <Button
              size="sm"
              className="me-1"
              color="primary"
              onClick={() => { handleInstantPurchaseModalOpen(); }}
            >Instant Purchase</Button>
            <Button
              size="sm"
              className="me-1"
              color="info"
              onClick={() => { handleBackButton(); }}
            >Back</Button>
          </div>

          <Col xs="12" lg="7" className="order-lg-1 order-2">
            <div>
              <PosForm salesId={salesId} />
            </div>
          </Col>

          <Col xs="12" lg="5" className="order-lg-2 order-1">
            <div>
              <ProductList salesId={salesId} />
            </div>
          </Col>

        </Row>
      </div>
      {/* this is customer modal */}

      {/* invoice modal */}
      {
        openInstantPurchaseModal && <InstantPurchase
          openInstantPurchaseModal={openInstantPurchaseModal}
          handleInstantPurchaseModalClosed={handleInstantPurchaseModalClosed}
          instantPurchaseToggle={() => setOpenInstantPurchaseModal( !openInstantPurchaseModal )}
        />
      }

    </>

  );
};

export default PosList;

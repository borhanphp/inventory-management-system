import "@styles/react/libs/charts/apex-charts.scss";
import { useEffect } from "react";
import { ArrowLeftCircle } from "react-feather";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import PosForm from ".";
import "../../../../assets/scss/sales/sales.scss";
import { getAllItemsCm } from "../../../../redux/common/store";
import ProductList from "../list/ProductList";

const VoidForm = () => {
    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate( '/sales/all-sales' );
        localStorage.removeItem( "items" );
    };

    const dispatch = useDispatch();
    useEffect( () => {
        dispatch( getAllItemsCm() )
    }, [] );

    return (
        <div id="dashboard-analytics">
            <Row className="match-height px-1">
                <div className="pe-2 bg-white mb-1 text-end">
                    {/* <Button size="sm" className="me-1" color="primary">Add Expenses</Button> */}
                    <ArrowLeftCircle
                        className="cursor-pointer"
                        size={25}
                        color="red"
                        onClick={() => { handleBackButton(); }}
                    />
                </div>

                <Col xs="12" lg="6" className="order-lg-1 order-2">
                    <div>
                        <PosForm />
                    </div>
                </Col>

                <Col xs="12" lg="6" className="order-lg-2 order-1">
                    <div>
                        <ProductList />
                    </div>
                </Col>

            </Row>
        </div>

    );
};

export default VoidForm;

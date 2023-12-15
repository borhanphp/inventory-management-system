import { Col, Row } from "reactstrap";
import TotalPage from "./TotalPage";

const CustomHeader = ( props ) => {
    const { children, handlePerPage, perPage, totalItems } = props;
    return (
        <>
            <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
                <Row>
                    <Col xs="6" className="d-flex align-items-center p-0">
                        <TotalPage handlePerPage={handlePerPage} perPage={perPage} totalItems={totalItems} />
                    </Col>
                    <Col
                        xs="6"
                        className=""
                    >
                        <div className="d-flex align-items-end justify-content-end table-header-actions">
                            {children}
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default CustomHeader;
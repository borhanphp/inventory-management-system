
import React from 'react';
import { Col, Row } from 'reactstrap';

const FormContentLayout = ( props ) => {
    const { marginTop, title, border = true, children } = props;
    return (
        <>
            <Row className={`p-0 mt-0 ${marginTop ? 'mt-1' : 'mt-0'}`} >
                {title && <Col className="title-container  p-0">
                    <p>{title}</p>
                    <div />
                </Col>}
            </Row>
            <Row className={`${border && 'border pt-1 pb-1 rounded'}`}>
                {children}
            </Row>
        </>
    );
};

export default FormContentLayout;

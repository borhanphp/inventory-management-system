import '@src/assets/scss/basic/formLayout.scss';
import React from 'react';
import { Card, CardBody } from 'reactstrap';

export default function FormLayout( props ) {

    return (
        <Card className='card-layout-container'>
            <CardBody className='card-body-container'>
                {props.children}
            </CardBody>
        </Card>
    );
}

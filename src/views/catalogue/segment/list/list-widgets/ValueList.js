import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Table } from 'reactstrap';
import { getSegmentById } from '../../store';

export const ValueList = ( props ) => {
    const { data } = props;
    const [allData, setAllData] = useState( [] )
    const dispatch = useDispatch()
    const getValues = async () => {
        try {
            const res = await dispatch( getSegmentById( data.id ) )
            setAllData( res?.payload?.values )
        } catch ( error ) {
            console.error( 'Error fetching segment by ID:', error );
        }
    };

    useEffect( () => {
        getValues()
    }, [] )
    return (
        <div className='my-2'>
            {
                !!allData.length ? <Table bordered>
                    <thead>
                        <tr>
                            <th >SL No.</th>
                            <th>Values</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allData?.map( ( value, index ) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{value.value}</td>
                            </tr>
                        ) )}
                    </tbody>
                </Table> : <div>
                    <p>No values available</p>
                </div>
            }
        </div>
    );
};

export default ValueList;

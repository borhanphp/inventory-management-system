import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Table } from 'reactstrap';
import { getPackageTypeById } from '../../store';

export const SizeList = ( props ) => {
    const { data } = props;
    const [allData, setAllData] = useState( [] )
    const dispatch = useDispatch()
    const getValues = async () => {
        try {
            const res = await dispatch( getPackageTypeById( data.id ) )
            setAllData( res?.payload?.sizes )
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
                !!allData.length ? <Table responsive bordered className='w-50'>
                    <thead className="text-center" >
                        <tr >
                            <th className="px-1 text-nowrap" style={{ padding: "0", width: "50px" }}>SL No.</th>
                            <th className="px-1" style={{ padding: "0" }}>Sizes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allData?.map( ( value, index ) => (
                            <tr key={index}>
                                <td className='text-center' style={{ padding: "0" }}>{index + 1}</td>
                                <td className='ps-1' style={{ padding: "0" }}>{value.size}</td>
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

export default SizeList;

import React from 'react';
import { useSelector } from 'react-redux';

const ItemList = ( props ) => {
    const { featuredCategoryBasicInfo } = useSelector( ( { featuredCategories } ) => featuredCategories );
    const { allData, totalItems, loading } = useSelector( ( { featuredCategories } ) => featuredCategories );


    return (
        <table className='table w-75 float-center table-bordered m-1'>
            {/* <thead className='bg-light'>
                <tr>
                    <td>Item Name</td>
                </tr>
            </thead>
            <tbody>
                {featuredCategoryBasicInfo.items.map( ( item, index ) => {
                    return (
                        <tr key={index}>
                            <td>{item.description}</td>
                        </tr>
                    )
                } )}
            </tbody> */}
        </table>
    )
}

export default ItemList
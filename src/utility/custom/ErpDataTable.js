import React from 'react';
import DataTable from 'react-data-table-component';


const ErpDataTable = ( props ) => {
    const { columns, data, isFixed = false, ...rest } = props;

    const column1 = columns.filter( c => c.isFixed );
    const column2 = columns.filter( c => !c.isFixed );
    return (
        <>
            {
                isFixed ?
                    <div className='d-flex flex-items-center'>
                        <div className=''>
                            <DataTable
                                columns={column1}
                                data={data}
                                {...rest}
                            />
                        </div>

                        <div className='pe-5'>
                            <DataTable
                                columns={column2}
                                data={data}
                                {...rest}
                            />
                        </div>
                    </div>

                    :
                    <div className='px-2'>
                        <DataTable columns={columns} data={data} {...rest} />
                    </div>
            }
        </>

    )
}

export default ErpDataTable
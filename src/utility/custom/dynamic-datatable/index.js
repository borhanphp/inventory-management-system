import PropTypes from 'prop-types';
import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { randomIdGenerator } from 'utility/Utils';
import Pagination from '../custom-pagination';
import TH from './dynamic-table-widgets/TH';
import ResizableTable from './resizable-table';
import './table.scss';


export const TableRows = ( props ) => {
    const { expandableRows, expandIcon, column, index, mergedColumns, getLeftDistanceOfFixedColumn, ExpandedComponent } = props;
    const [expand, setExpand] = useState( false );

    const handleExpandedRow = () => {
        setExpand( prev => !prev );
    };
    return (
        <>
            <tr>
                {expandableRows && <td
                    className='fixed-cell'
                    style={{ textAlign: 'center', left: 0, cursor: 'pointer', position: 'sticky' }}
                    onClick={() => handleExpandedRow( column, index )}
                >
                    {expandIcon ? expandIcon : column.expanded ? <span style={{ fontSize: '1.5rem' }}>&#8722;</span> : <span
                        style={{ fontSize: '1.5rem' }}>&#43;</span>}
                </td>}
                {
                    mergedColumns?.map( ( c, indx ) => (
                        <Fragment key={c.id}>
                            <td
                                className={`${c.isFixed ? 'fixed-cell' : ''}`}
                                id={`${c.id}${column.rowId?.toString()}d`}
                                style={{
                                    width: c.width ?? '',
                                    textAlign: c.type === 'action' || c.center ? 'center' : c.type === 'number' ? 'right' : 'left',
                                    left: c.isFixed && getLeftDistanceOfFixedColumn( expandableRows ? indx + 1 : indx ),
                                    whiteSpace: 'pre-wrap'

                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: c.type === 'action' || c.center ? 'center' : 'flex-start',
                                    textAlign: c.type === 'action' || c.center ? 'center' : c.type === 'number' ? 'right' : 'left'
                                }}>
                                    {c?.cell ? c.cell( column, index ) : column[c.selector]}
                                </div>

                            </td>
                        </Fragment>
                    ) )
                }
            </tr>

            {/* expandable component ========================*/}
            {expand ? <tr
                key={`${column.id}${index}`}
            >
                <td
                    style={{ position: 'sticky', left: 0 }}
                    colSpan={mergedColumns.length + 1} >
                    <div className='expandable-component'>
                        {ExpandedComponent ? <ExpandedComponent data={column} /> : <p>Add a custom component in ExpandedComponent prop</p>}
                    </div>
                </td>
            </tr> : null}
        </>
    );
};


function DynamicDataTable( props ) {
    const {
        tableId,
        columns = [],
        data,
        expandableRows = false,
        expandIcon,
        onSort,
        sortServer = false,
        paginationServer = false,
        className,
        filter = false,
        filterArray = [],
        columnCache = false,
        rowPerPage = 10,
        progressPending,
        ExpandedComponent } = props;
    // const totalPages = Math.ceil( data.length / rowPerPage );

    const isData = !!data.length;


    const allData = data?.map( d => (
        { ...d, rowId: randomIdGenerator() }
    ) );
    const firstRow = allData[0];
    const cachedCols = JSON.parse( localStorage.getItem( tableId ) ) ?? [];
    const columnsModified = columns.map( c => ( { ...c, sortingOrder: 'asc' } ) );

    //states
    const [allColumns, setAllColumns] = useState( cachedCols?.length ? cachedCols : [...columnsModified] );
    const fixedColumns = allColumns?.filter( el => el.isFixed );
    const resizeColumns = allColumns?.filter( el => !el.isFixed );

    const [columnsData, setColumnsData] = useState( allData ); //states for table data
    console.log( { columnsData } );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [fixedWidthArr, setFixedWidthArr] = useState( [] ); //stores fixed column widths


    //gets widths of all fixed columns and stores it in an array
    const getWidthOfFixedColumns = () => {
        const tableContainer = document.getElementById( tableId );
        const fixedColumnElementsWidth = [];
        const fixed = tableContainer?.querySelectorAll( '.fixed-table-column' );
        fixed.forEach( element => {
            const clientWidth = element.getBoundingClientRect().width;
            fixedColumnElementsWidth.push( clientWidth );
        } );
        setFixedWidthArr( fixedColumnElementsWidth );
    };

    useLayoutEffect( () => {
        getWidthOfFixedColumns();
    }, [fixedColumns?.length] );
    useEffect( () => {
        if ( columnCache && !cachedCols?.length ) {
            localStorage.setItem( tableId, JSON.stringify( [...fixedColumns, ...resizeColumns] ) );
        } else if ( columnCache && cachedCols?.length ) {
            setAllColumns( cachedCols );
        }
    }, [] );
    useEffect( () => {
        setColumnsData( allData );
        console.log( 'set data' );
    }, [allData.length] );

    console.log( 'dynamic table render', columnsData );

    const mergedColumns = [...fixedColumns, ...resizeColumns]; // table columns

    // handles pagination
    const handlePage = ( page ) => {
        setCurrentPage( page );
    };


    // sorts tabele data
    const direction = 'asc';
    const handleSort = ( column ) => {
        if ( sortServer ) {
            onSort( column, column.sortingOrder );
            column.sortingOrder = column.sortingOrder === 'asc' ? 'desc' : 'asc';
        } else {
            if ( column.sortable ) {
                if ( column.type === 'number' ) {
                    allData.sort( ( a, b ) => {
                        // if sorting order is true it will sort in ascending order
                        return column.sortingOrder ? a[column.selector] - b[column.selector] : b[column.selector] - a[column.selector];
                    } );
                } else if ( column.type === 'date' ) {
                    allData.sort( ( a, b ) => {
                        return column.sortingOrder ? new Date( a[column.selector] ) - new Date( b[column.selector] ) : new Date( b[column.selector] ) - new Date( a[column.selector] );
                    } );
                } else {
                    allData.sort( ( a, b ) => {
                        // console.log( a[column.selector] );
                        return column.sortingOrder ? a[column.selector].localeCompare( b[column.selector] ) : b[column.selector].localeCompare( a[column.selector] );
                    } );
                }
            }
            // const updatedData = allColumns.map( d => {
            //     if ( d.id === column.id ) {
            //         if ( d?.sortingOrder ) {
            //             d['sortingOrder'] = false;
            //         } else {
            //             d['sortingOrder'] = true;
            //         }
            //     }
            //     return d;
            // } );
            // setAllColumns( updatedData );
        }

    };


    //returns sum of it's previous array elements to get the distance of sticky left property
    const getLeftDistanceOfFixedColumn = ( n = 0 ) => {
        if ( n === 0 ) {
            return 0;
        } else if ( n === 1 ) {
            const value = fixedWidthArr[0] ?? 0;
            return value;
        } else {
            let value = 0;
            for ( let i = 0; i < n; i++ ) {
                if ( typeof fixedWidthArr[i] === 'number' ) {
                    value += fixedWidthArr[i];
                }

            }
            return value;
        }
    };
    const indexOfLastData = currentPage * rowPerPage;
    const indexOfFirstData = indexOfLastData - rowPerPage;
    const dataSlice = data.length > rowPerPage ? [...columnsData].slice( indexOfFirstData, indexOfLastData ) : [...columnsData];
    console.log( { progressPending } );
    return (
        <>
            <div
                className={`fixed-and-resize-table-container ${className ? className : ''}`}
                id={tableId}
                style={
                    {
                        overflowX: 'scroll',
                        overflowY: 'hidden',
                        height: 'max-content',
                        minHeight: '200px'
                    }
                }
            >
                <ResizableTable
                    fixed={expandableRows ? fixedColumns?.length + 1 : fixedColumns.length}
                    responsive={true}
                    bordered
                    mainClass={`resizebom-${randomIdGenerator().toString()}`}
                    tableId={`bomTable-${randomIdGenerator().toString()}`}
                    className="">
                    <thead>
                        <tr>
                            {expandableRows ? <th
                                style={{
                                    width: '40px',
                                    left: 0,
                                    position: 'sticky',
                                    zIndex: 1
                                }}
                                className='fixed-table-column fixed-cell table-header ' >
                                <div className='empty-container'></div>
                            </th> : null}
                            {mergedColumns?.map( ( column, i ) => (
                                <TH key={column.id}
                                    column={column}
                                    index={i}
                                    getLeftDistanceOfFixedColumn={getLeftDistanceOfFixedColumn}
                                    expandableRows={expandableRows}
                                    handleSort={handleSort}
                                    setAllColumns={setAllColumns}
                                    allColumns={allColumns}
                                    tableId={tableId}
                                    columnCache={columnCache}
                                />
                            ) )}
                        </tr>
                    </thead>
                    <tbody >
                        {/* filtering row ========================*/}
                        <tr hidden={!filter} >
                            {expandableRows ? <td className='fixed-cell' style={{ left: 0 }}></td> : null}
                            {
                                mergedColumns?.map( ( c, indx ) => (
                                    <td key={indx + 1} id={indx + 1}
                                        style={{
                                            padding: '2px',
                                            left: c.isFixed && getLeftDistanceOfFixedColumn( expandableRows ? indx + 1 : indx )
                                        }}
                                        className={`${c.isFixed ? 'fixed-cell' : ''}`}
                                    >
                                        {filterArray.find( f => f[c?.selector] )?.[c.selector] ?? null}
                                    </td>
                                ) )
                            }

                        </tr>
                        {/* table data========================== */}
                        {progressPending ? <tr>
                            <td colSpan={expandableRows ? columns.length + 1 : columns.length} >
                                <p>loading...</p></td>
                        </tr> : data.length ? dataSlice?.map( ( column, index ) => (

                            <Fragment key={column.rowId}>
                                <TableRows
                                    expandableRows={expandableRows}
                                    expandIcon={expandIcon}
                                    column={column}
                                    index={index}
                                    mergedColumns={mergedColumns}
                                    getLeftDistanceOfFixedColumn={getLeftDistanceOfFixedColumn}
                                    ExpandedComponent={ExpandedComponent}
                                />

                            </Fragment>
                        ) ) : <tr >
                            <td colSpan={expandableRows ? columns.length + 1 : columns.length} style={{ textAlign: 'center', paddingTop: '40px' }}>
                                There is no data to show
                            </td>
                        </tr>}


                    </tbody>
                </ResizableTable>
            </div>

            {!paginationServer && !!data.length ? <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={data.length}
                pageSize={rowPerPage}
                // onPageChange={page => setCurrentPage( page )}
                onPageChange={handlePage}
            /> : null}
        </>
    );
}

export default DynamicDataTable;

DynamicDataTable.propTypes = {
    tableId: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf( PropTypes.shape( {
        id: PropTypes.string.isRequired

    } ) ),
    data: PropTypes.array.isRequired,
    expandableRows: PropTypes.bool,
    onSort: PropTypes.func,
    sortServer: PropTypes.bool,
    paginationServer: PropTypes.bool,
    className: PropTypes.string,
    filter: PropTypes.bool,
    filterArray: PropTypes.array,
    ExpandedComponent: PropTypes.elementType,
    columnCache: PropTypes.bool,
    rowPerPage: PropTypes.number
};
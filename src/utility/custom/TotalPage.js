import React from 'react';
import { Input } from 'reactstrap';

const TotalPage = ( props ) => {
  const { handlePerPage, rowsPerPage, totalItems } = props;

  const handleChangeRowsPerPage = ( e ) => {
    const selectedRowsPerPage = parseInt( e.target.value, 10 );
    handlePerPage( selectedRowsPerPage );
  };

  return (
    <div>
      <div className='d-flex align-items-center w-100'>
        <label htmlFor='rows-per-page'>Show</label>
        <Input
          className='mx-50'
          type='select'
          bsSize='sm'
          id='rows-per-page'
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          style={{ width: '5rem' }}
        >
          <option value='10'>10</option>
          <option value='25'>25</option>
          <option value='50'>50</option>
        </Input>
        <label htmlFor='rows-per-page'>Per Page</label>

        <div className='mx-2'>|</div>
        <div className='me-2'>Total Records: <span className='fw-bolder'>{totalItems ? totalItems : ''}</span></div>


      </div>
    </div>
  );
};

export default TotalPage;

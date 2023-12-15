/*
   Title: Custom Date Picker
   Description: Custom Date Picker
   Author: Iqbal Hossain
   Date: 06-February-2022
   Modified: 06-February-2022
*/

import '@styles/react/libs/flatpickr/flatpickr.scss';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import Flatpickr from 'react-flatpickr';
import { Label } from 'reactstrap';

const CustomDatePicker = props => {
  const { name, title, value, onChange, minDate, maxDate, placeholder, invalid = false, ...rest } = props;
  return (
    <Fragment>
      {title && <Label for={title}>{title}</Label>}
      <div className={`${invalid ? 'border-danger rounded w-100' : 'w-100'}`}>
        <Flatpickr
          name={name}
          value={value}
          placeholder={placeholder}
          id="hf-picker"
          className="form-control-sm form-control "
          onChange={onChange}
          options={{
            altInput: true,
            dateFormat: "YYYY-MM-DD",
            altFormat: "DD-MMM-YYYY",
            maxDate,
            minDate,
            parseDate: ( datestr, format ) => {
              return moment( datestr, format, true ).toDate();
            },
            formatDate: ( date, format, locale ) => {
              return moment( date ).format( format );
            }

          }}
          {...rest}
        />
      </div>

    </Fragment>
  );
};

CustomDatePicker.defaultProps = {
  placeholder: 'Pick a date'
};

CustomDatePicker.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default CustomDatePicker;

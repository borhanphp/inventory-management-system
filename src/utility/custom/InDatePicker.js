// ** React Imports
import { Fragment, useState } from 'react'
// ** Third Party Components
import Flatpickr from 'react-flatpickr'
// ** Reactstrap Imports
import { Label } from 'reactstrap'



const InDatePicker = () => {
    // ** State
    const [picker, setPicker] = useState( new Date() )
    return (
        <Fragment>
            <Label className='form-label' for='default-picker'>
                Default
            </Label>
            <Flatpickr className='form-control' value={picker} onChange={date => setPicker( date )} id='default-picker' />
        </Fragment>
    )
}

export default InDatePicker

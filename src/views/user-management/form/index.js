import Sidebar from "@components/sidebar"
import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { Button } from "reactstrap"
import InInput from "../../../utility/custom/InInput"
import InSelect from "../../../utility/custom/InSelect"
import { addNewUser, getAllUserByFilter } from "../store"
import { initialUserData } from "../store/model"
// import classnames from 'classnames'

const UserForm = ( { open, toggleSidebar } ) => {

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Guest", value: "guest" }
  ]
  const dispatch = useDispatch();
  const [formData, setFormData] = useState( initialUserData )

  const handleOnChange = ( e ) => {
    const { type, checked, name, value } = e.target;
    setFormData( { ...formData, [name]: type === "checkbox" ? checked : value } )
  }

  const handleDropDownChange = ( data, e ) => {
    const { name } = e;
    setFormData( { ...formData, [name]: data } )
  }

  const handleOnSubmit = () => {
    const submittedData = {
      ...formData,
      tenantId: 'Main',
      roles: [formData.roles.value]
    }
    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    dispatch( addNewUser( submittedData ) )
      .then( ( res ) => {
        if ( res.error ) {
          return;
        } else {
          const paramsObj = {
            page: 1,
            pageSize: 10
          };
          toast.success( 'New User Created' )
          dispatch( getAllUserByFilter( paramsObj ) )
          toggleSidebar()
        }

      } )

  }

  const handleCancelButton = () => {
    toggleSidebar();
  }

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New User"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClose={toggleSidebar}

    >
      <div>
        <InInput
          label="First Name"
          name="firstName"
          bsSize="sm"
          id="nameId"
          value={formData.firstName}
          onChange={( e ) => { handleOnChange( e ); }}
        // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
        />
        {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}
        <InInput
          label="Last Name"
          name="lastName"
          bsSize="sm"
          id="nameId"
          value={formData.lastName}
          onChange={( e ) => { handleOnChange( e ); }}
        // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
        />
        {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}
        <InInput
          label="Username"
          name="userName"
          bsSize="sm"
          id="usernameId"
          value={formData.userName}
          onChange={( e ) => { handleOnChange( e ); }}
        // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
        />
        {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}
        <InInput
          label="Email"
          name="email"
          bsSize="sm"
          id="emailId"
          value={formData.email}
          onChange={( e ) => { handleOnChange( e ); }}
        // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
        />
        {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}

        <InInput
          label="Password"
          name="password"
          bsSize="sm"
          id="passwordId"
          type="password"
          value={formData.password}
          onChange={( e ) => { handleOnChange( e ); }}
        // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
        />
        {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}
        <InInput
          label="Confirm Password"
          name="confirmPassword"
          bsSize="sm"
          id="confirmPasswordId"
          type="password"
          value={formData.confirmPassword}
          onChange={( e ) => { handleOnChange( e ); }}
        // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
        />
        {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}

        <InSelect
          label="Role"
          name="roles"
          isClearable
          options={roles}
          value={formData.roles}
          // onFocus={() => { handleBrandOnFocus() }}
          onChange={( data, e ) => { handleDropDownChange( data, e ); }}
        // className={classNames( `erp-dropdown-select ${( errors && errors?.brand && !itemBasicInfo?.brandId ) && 'is-invalid'}` )}
        />
        {/* {errors?.brand && !itemBasicInfo?.brandId && <small className="text-danger">Brand is required.</small>} */}

      </div>
      <div className="mt-2">
        <Button type="submit" className="me-1" color="primary" size="sm" onClick={() => { handleOnSubmit() }}>
          Submit
        </Button>
        <Button
          type="reset"
          color="secondary"
          outline
          size="sm"
          onClick={() => { handleCancelButton() }}
        >
          Cancel
        </Button>
      </div>
    </Sidebar>
  )
}

export default UserForm

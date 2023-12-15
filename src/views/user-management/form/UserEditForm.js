import Sidebar from "@components/sidebar"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "reactstrap"
import InInput from "../../../utility/custom/InInput"
import InSelect from "../../../utility/custom/InSelect"
import { bindUserInfo, getAllUserByFilter, updateUser } from "../store"
// import classnames from 'classnames'

const UserEditForm = ( { editSidebarOpen, toggleEditSidebar } ) => {
    const { userData } = useSelector( ( { userReducer } ) => userReducer );
    console.log( 'roles', userData )



    const roles = [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Guest", value: "guest" }
    ]
    const dispatch = useDispatch();

    const handleOnChange = ( e ) => {
        const { type, checked, name, value } = e.target;
        dispatch( bindUserInfo( { ...userData, [name]: type === "checkbox" ? checked : value } ) )
    }

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        dispatch( bindUserInfo( { ...userData, [name]: data } ) )
    }

    const handleOnSubmit = () => {
        const submittedData = {
            ...userData,
            tenantId: 'Main',
            roles: [userData?.roles?.value]
        }
        console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( updateUser( submittedData ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    const paramsObj = {
                        page: 1,
                        pageSize: 10
                    };
                    toast.success( 'User Updated' )
                    dispatch( getAllUserByFilter( paramsObj ) )
                    toggleEditSidebar()
                }

            } )

    }

    const handleCancelButton = () => {
        toggleEditSidebar();
    }

    return (
        <Sidebar
            size="lg"
            open={editSidebarOpen}
            title="Edit User"
            headerClassName="mb-1"
            contentClassName="pt-0"
            toggleSidebar={toggleEditSidebar}
            onClose={toggleEditSidebar}
        >
            <div>
                <InInput
                    label="First Name"
                    name="firstName"
                    bsSize="sm"
                    id="nameId"
                    value={userData.firstName}
                    onChange={( e ) => { handleOnChange( e ); }}
                // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
                />
                {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}
                <InInput
                    label="Last Name"
                    name="lastName"
                    bsSize="sm"
                    id="nameId"
                    value={userData.lastName}
                    onChange={( e ) => { handleOnChange( e ); }}
                // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
                />
                {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}
                <InInput
                    label="Username"
                    name="userName"
                    bsSize="sm"
                    id="usernameId"
                    value={userData.userName}
                    onChange={( e ) => { handleOnChange( e ); }}
                // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
                />
                {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}
                <InInput
                    label="Email"
                    name="email"
                    bsSize="sm"
                    id="emailId"
                    value={userData.email}
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
                    value={userData.password}
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
                    value={userData.confirmPassword}
                    onChange={( e ) => { handleOnChange( e ); }}
                // className={classNames( `erp-dropdown-select ${( errors && errors?.name && !brandBasicInfo?.name ) && 'is-invalid'}` )}
                />
                {/* {errors?.name && !brandBasicInfo?.name && <small className="text-danger">Name is required.</small>} */}

                <InSelect
                    label="Role"
                    name="roles"
                    isClearable
                    options={roles}
                    value={userData.roles}
                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                // className={classNames( `erp-dropdown-select ${( errors && errors?.brand && !itemBasicInfo?.brandId ) && 'is-invalid'}` )}
                />
                {/* {errors?.brand && !itemBasicInfo?.brandId && <small className="text-danger">Brand is required.</small>} */}

            </div>
            <div className="mt-2">
                <Button type="submit" className="me-1" color="primary" size="sm" onClick={() => { handleOnSubmit() }}>
                    Update
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

export default UserEditForm

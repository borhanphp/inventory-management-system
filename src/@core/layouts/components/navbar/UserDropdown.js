// ** React Imports
// ** Custom Components
import Avatar from '@components/avatar';
// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg';
import { handleLogout } from '@store/authentication';
// ** Utils
import { isUserLoggedIn } from '@utils';
import { useEffect, useState } from 'react';
// ** Third Party Components
import { Power } from 'react-feather';
// ** Store & Actions
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** State
  const [userData, setUserData] = useState( null );

  //** ComponentDidMount
  useEffect( () => {
    if ( isUserLoggedIn() !== null ) {
      setUserData( JSON.parse( localStorage.getItem( 'userData' ) ) );
    }
  }, [] );

  //** Vars
  const userAvatar = ( userData && userData.avatar ) || defaultAvatar;

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{( userData && userData?.name ) || ''}</span>
          <span className='user-status'>{( userData && userData.role ) || 'Admin'}</span>
        </div>
        <Avatar img={userAvatar} imgHeight='32' imgWidth='32' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        {/* <DropdownItem tag={Link} to='/pages/profile'>
          <User size={14} className='me-75' />
          <span className='align-middle'>Profile</span>
        </DropdownItem> */}
        <DropdownItem tag={Link} to='/login' onClick={() => dispatch( handleLogout() )}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>

      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;

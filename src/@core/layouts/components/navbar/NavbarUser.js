// ** Dropdowns Imports
// ** Third Party Components
import { Moon, Sun } from 'react-feather';
import UserDropdown from './UserDropdown';


const NavbarUser = props => {
  // ** Props
  const { skin, setSkin } = props;

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if ( skin === 'dark' ) {
      return <Sun className='ficon' onClick={() => setSkin( 'light' )} />;
    } else {
      return <Moon className='ficon' onClick={() => setSkin( 'dark' )} />;
    }
  };

  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      {/* <NavItem className='d-none d-lg-block'>
        <NavLink className='nav-link-style'>
          <ThemeToggler />
        </NavLink>
      </NavItem> */}
      <UserDropdown />
    </ul>
  );
};
export default NavbarUser;

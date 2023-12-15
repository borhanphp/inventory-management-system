import '@custom-styles/basic/action-bar-menu.scss';
import '@styles/base/core/menu/menu-types/vertical-menu.scss';
import '@styles/base/core/menu/menu-types/vertical-overlay-menu.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavbarBrand } from 'reactstrap';


const ActionMenu = ( { children, breadcrumb, title, middleNavButton, moreButton = true, onClick } ) => {
    const { menuCollapsedCm } = useSelector( ( { commons } ) => commons )
    const [windowWidth, setWindowWidth] = useState( window.innerWidth )
    const handleWindowWidth = () => {
        setWindowWidth( window.innerWidth )
    }

    useEffect( () => {
        if ( window !== undefined ) {
            window.addEventListener( 'resize', handleWindowWidth )
        }
    }, [windowWidth] )
    return (
        <Navbar
            color="white"
            expand="xs"
            className={classNames(
                `action-bar border border-gray-50`,
                {
                    'mlMargin': !menuCollapsedCm && windowWidth > 1200,
                    'mlMargin-collapsed': menuCollapsedCm,
                }
            )}
        // style={{ marginLeft: ``}}
        >
            <NavbarBrand  >
                {title} {moreButton && ( <span>|</span> )}
            </NavbarBrand>
            <Nav className="mr-auto d-flex " navbar>
                {children}
            </Nav>
            <Nav className="m-auto" navbar>
                {/* {middleNavButton} */}
            </Nav>

            <Nav className="ml-auto" navbar>
                <ul id="breadcrumb" className="d-flex justify-content-center">
                    {breadcrumb?.filter( b => !b?.hidden )?.map( bc => (
                        <li key={bc.id} hidden={bc?.hidden} disabled={bc.isActive}>
                            <Link
                                // onClick={() => handleOnClick()}
                                className={bc.isActive ? `active` : ''}
                                tag={bc.isActive ? 'span' : 'a'}
                                to={{
                                    pathname: `${bc.link}`,
                                    state: bc?.state
                                }}
                            >
                                {bc?.icon} {bc.name}
                            </Link>
                        </li>
                    ) )}
                </ul>

            </Nav>
        </Navbar>
    );
};

export default ActionMenu;

// ** React Imports
// ** Icons Imports
import { Lock, User } from 'react-feather';
// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Activities from './Activities';
import DocumentDetails from './DocumentDetails';
import LedgerDetails from './LedgerDetails';
import PaymentDetails from './PaymentDetails';
import SalesDetails from './SalesDetails';


const CustomerTab = ( { active, toggleTab, state } ) => {
    return (
        <div className="">
            <Nav pills className='mb-2 bg-light'>
                <NavItem>
                    <NavLink active={active === '1'} onClick={() => toggleTab( '1' )}>
                        <User className='font-medium-3 me-50' />
                        <span className='fw-bold'>Ledger</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '2'} onClick={() => toggleTab( '2' )}>
                        <Lock className='font-medium-3 me-50' />
                        <span className='fw-bold'>Sales</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '4'} onClick={() => toggleTab( '4' )}>
                        <Lock className='font-medium-3 me-50' />
                        <span className='fw-bold'>Documents & Notes</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '5'} onClick={() => toggleTab( '5' )}>
                        <Lock className='font-medium-3 me-50' />
                        <span className='fw-bold'>Payments</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '6'} onClick={() => toggleTab( '6' )}>
                        <Lock className='font-medium-3 me-50' />
                        <span className='fw-bold'>Activities</span>
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={active} className="">
                <TabPane tabId='1'>
                    <LedgerDetails state={state} />
                </TabPane>
                <TabPane tabId='2'>
                    <SalesDetails state={state} />
                </TabPane>
                <TabPane tabId='4'>
                    <DocumentDetails />
                </TabPane>
                <TabPane tabId='5'>
                    <PaymentDetails />
                </TabPane>
                <TabPane tabId='6'>
                    <Activities />
                </TabPane>
            </TabContent>
        </div>
    );
};
export default CustomerTab;

// ** Navigation imports
import apps from './apps';
import charts from './charts';
import dashboards from './dashboards';
import formsAndTables from './forms-tables';
import others from './others';
import pages from './pages';
import uiElements from './ui-elements';

// ** Merge & Export
export default [...dashboards, ...apps, ...uiElements, ...formsAndTables, ...pages, ...charts, ...others];

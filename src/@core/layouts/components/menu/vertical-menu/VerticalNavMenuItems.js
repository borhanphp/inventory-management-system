// ** Vertical Menu Components
// ** Utils
import {
  canViewMenuGroup, canViewMenuItem, resolveVerticalNavMenuItemComponent as resolveNavItemComponent
} from '@layouts/utils';
import VerticalNavMenuGroup from './VerticalNavMenuGroup';
import VerticalNavMenuLink from './VerticalNavMenuLink';
import VerticalNavMenuSectionHeader from './VerticalNavMenuSectionHeader';


const VerticalMenuNavItems = props => {
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader
  };

  // ** Render Nav Menu Items
  const RenderNavItems = props.items.map( ( item, index ) => {
    const TagName = Components[resolveNavItemComponent( item )];
    if ( item.children ) {
      return canViewMenuGroup( item ) && <TagName item={item} index={index} key={item.id} {...props} />;
    }
    return canViewMenuItem( item ) && <TagName key={item.id || item.header} item={item} {...props} />;
  } );

  return RenderNavItems;
};

export default VerticalMenuNavItems;

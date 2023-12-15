// ** Menu Components Imports
import {
  canViewMenuGroup,
  canViewMenuItem, resolveHorizontalNavMenuItemComponent as resolveNavItemComponent
} from '@layouts/utils';
import HorizontalNavMenuGroup from './HorizontalNavMenuGroup';
import HorizontalNavMenuLink from './HorizontalNavMenuLink';

const HorizontalNavMenuItems = props => {
  // ** Components Object
  const Components = {
    HorizontalNavMenuGroup,
    HorizontalNavMenuLink
  };

  // ** Render Nav Items
  const RenderNavItems = props.items.map( ( item, index ) => {
    const TagName = Components[resolveNavItemComponent( item )];
    if ( item.children ) {
      return canViewMenuGroup( item ) && <TagName item={item} index={index} key={item.id} {...props} />;
    }
    return canViewMenuItem( item ) && <TagName item={item} index={index} key={item.id} {...props} />;
  } );

  return RenderNavItems;
};

export default HorizontalNavMenuItems;

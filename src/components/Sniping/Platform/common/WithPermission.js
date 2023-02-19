import React, { useContext } from 'react';
import { Context as AuthContext } from 'context/AuthContext';
import CustomTooltip from 'components/common/CustomTooltip';

const permissionsMapping = {
  apex: ['apex'],
  predator: ['apex', 'predator'],
  hunter: ['apex', 'predator', 'hunter'],
  public: ['public'],
};

const WithPermissions = ({
  children,
  requiredPermissions = 'hunter',
  hide = false,
  tooltipPlacement = 'top',
  boxStyle = { width: '100%' },
  accessRequired,
}) => {
  const {
    state: { user },
  } = useContext(AuthContext);

  const capitalizedPersmission =
    requiredPermissions.charAt(0).toUpperCase() + requiredPermissions.slice(1);

  if (
    !permissionsMapping[requiredPermissions].includes(user.snipeTier) &&
    requiredPermissions !== 'public'
  ) {
    if (hide) {
      return null;
    }

    return React.Children.map(children, (child) => {
      // checking isValidElement is the safe way and avoids a typescript error too
      if (React.isValidElement(child)) {
        const childElement = React.cloneElement(child, {
          disabled: true,
        });

        return (
          <CustomTooltip
            title={`Only available for the ${capitalizedPersmission} Tier`}
            placement={tooltipPlacement}
          >
            <span style={boxStyle}>{childElement}</span>
          </CustomTooltip>
        );
      }
      return (
        <CustomTooltip
          title={`Only available for the ${capitalizedPersmission} Tier`}
          placement={tooltipPlacement}
        >
          <span style={boxStyle}>{child}</span>
        </CustomTooltip>
      );
    });
  }

  return children;
};

export default WithPermissions;

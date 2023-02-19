import { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useAuth } from 'hooks/useAuth';
import { CircularProgress } from '@mui/material';
import { Check } from 'components/Sniping/Platform/common';
import { editWalletSnipeSettings } from 'apiProvider';
import Select from 'components/common/Select';
import { useAppContext } from 'context/AppContext';
import Input from 'components/common/Input';
import CustomTooltip from 'components/common/CustomTooltip';
import { Context as FeedbackContext } from 'context/FeedbackContext';

const HuntSettings = () => {
  const { showFeedback } = useContext(FeedbackContext);
  const { user, loading, setAuth, setLoading, setExtensionAuthState } =
    useAuth();
  const {
    state: { walletInfo },
  } = useAppContext();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    setSettings(
      { ...user.snipeSettings, email: user.notifications?.email } || {}
    );
  }, [user]);

  const onChange = (label, value) => {
    console.log(label, value);
    setSettings({
      ...settings,
      [label]: value,
    });
  };

  const saveSettings = async () => {
    setLoading(true);
    const response = await editWalletSnipeSettings({ settings });

    console.log(response.user);

    setAuth({ user: response.user });
    setLoading(false);
    setExtensionAuthState(response.user);
    showFeedback({ message: 'Settings saved' });
  };

  if (loading || walletInfo.loading || !settings) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress sx={{ fontSize: 26 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1400,
        mx: 5,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 1.5,
        mt: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
          Hunt Settings
        </span>
        <CustomTooltip
          title="Manage your alert settings. You can change your alert destinations and hunt behaviour."
          placement="right"
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 300,
          mb: 3,
        }}
      >
        <Check
          checked={settings?.openTabIfFound}
          title="Open Snipe Tab on Success"
          onChange={(checked) => onChange('openTabIfFound', checked)}
          sx={{ width: 300 }}
        />
        <Check
          checked={settings?.continueIfFound}
          title="Continue on Success"
          onChange={(checked) => onChange('continueIfFound', checked)}
          sx={{ width: 300 }}
        />
        <Check
          checked={settings?.pushIfFound}
          title="Enable Mobile Notifications"
          onChange={(checked) => onChange('pushIfFound', checked)}
          sx={{ width: 300 }}
        />
        <Check
          checked={settings?.emailOnFound}
          title="Enable Email Notifications"
          onChange={(checked) => onChange('emailOnFound', checked)}
          sx={{ width: 300 }}
        />
        <Check
          checked={settings?.soundOnFound}
          title="Enable Sound on Success"
          onChange={(checked) => onChange('soundOnFound', checked)}
          sx={{ width: 300 }}
        />
        <Check
          checked={settings?.focusOnFound}
          title="Focus on tab on Success"
          onChange={(checked) => onChange('focusOnFound', checked)}
          sx={{ width: 300 }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
          Snipe Wallet
        </span>
        <CustomTooltip
          title="Select the wallet you want to snipe from, it can be different from your wallet that holds the access NFT."
          placement="right"
        />
      </Box>

      <Select
        options={[
          { label: 'nami', value: 'nami' },
          { label: 'flint', value: 'flint' },
          { label: 'eternl', value: 'eternl' },
          { label: 'gerowallet', value: 'gerowallet' },
          { label: 'typhon', value: 'typhon' },
          { label: 'nufi', value: 'nufi' },
          { label: 'begin', value: 'begin' },
        ]}
        onChange={(e) => onChange('selectedWallet', e.target.value)}
        sx={{ my: 1, maxWidth: 300 }}
        value={settings.selectedWallet || 'nami'}
        name="selectedWallet"
      />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <span style={{ fontFamily: 'newgilroymedium', fontSize: 14 }}>
          * Auto-buy uses the dedicated sniping wallet by default, no need to
          select it here.
        </span>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
          Email Address
        </span>
        <CustomTooltip
          title="To receive email notifications, please enter your email address."
          placement="right"
        />
      </Box>

      <Input
        placeholder="Enter your email (optional)"
        value={settings.email || user.notifications?.email}
        onChange={(e) => onChange('email', e.target.value)}
        sx={{ my: 1, maxWidth: 300 }}
      />

      <Box
        sx={{
          display: 'flex',
          columnGap: 1,
          justifyContent: 'flex-start',
        }}
      >
        <Box
          sx={{
            p: '10px 15px',
            borderRadius: 2,
            cursor: 'pointer',
            color: 'white',
            backgroundColor: 'var(--logoColor)',
            '&:hover': {
              color: 'white',
              opacity: 0.9,
            },
          }}
          onClick={saveSettings}
        >
          Save Changes
        </Box>
      </Box>
    </Box>
  );
};

export default HuntSettings;

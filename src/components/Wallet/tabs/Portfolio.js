import React from 'react';
import CustomTooltip from 'components/common/CustomTooltip';

const Portfolio = () => {
  return <div>Portfolio</div>;
};

{
  /* <aside className={styles.sidebar}>
        <Scrollbars autoHide>
          <Box className={styles.sidebarWrapper}>
            <Box className={styles.currentProject}>
              <img
                className={styles.projectLogo}
                src={walletImage}
                alt="Wallet svg"
              />
              {wallets.length > 0 && (
                <Box className={styles.walletNumber}>
                  <span className={styles.projectName}>
                    {wallets.length > 1 ? 'My wallets' : localWallet}
                  </span>
                </Box>
              )}
              <Box sx={{ width: '100%', bgcolor: 'transparent', mt: 2 }}>
                {wallets.length > 0 && (
                  <List
                    component="nav"
                    aria-label="main mailbox folders"
                    sx={{
                      display: 'flex',
                      justifyConent: 'space-between',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    {wallets.map((addr, i) => {
                      const shortened =
                        addr.substring(0, 10) +
                        '...' +
                        addr.substring(90, addr.length);
                      return (
                        <ListItem
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          key={i}
                        >
                          {shortened}
                          <CustomTooltip title="Remove wallet">
                            <IconButton
                              key={i}
                              onClick={() => handleRemoveWallet(addr)}
                              sx={{ ml: 1 }}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </CustomTooltip>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
                {wallets.length > 0 && <Divider sx={{ my: 2 }} />}
                <TextField
                  id="standard-basic"
                  value={inputWallet}
                  onChange={(e) => setInputWallet(e.target.value)}
                  sx={{ width: '100%' }}
                  variant="standard"
                  placeholder="Paste addr.. here"
                />
                <List component="nav" aria-label="secondary mailbox folder">
                  <ListItemButton onClick={handleAddWallet}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add new wallet" />
                  </ListItemButton>
                </List>
              </Box>
            </Box>
            <span className={styles.report} onClick={handleWalletLogout}>
              Wallet logout
            </span>

            <Box className={styles.footer}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  my: 1,
                }}
              >
                <Link
                  sx={{ mr: 1, color: 'var(--fontColor)' }}
                  href="https://storage.googleapis.com/predator-maya-images/Terms_and_Conditions_CNFT_Jungle%20(1).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  T&C
                </Link>
                <Link
                  sx={{ color: 'var(--fontColor)' }}
                  href="https://storage.googleapis.com/predator-maya-images/CNFT_Jungle_Privacy_Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
              </Box>
              <img src={logoUrl} alt="logo" width="30px" />
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  fontFamily: 'Rafale',
                  textTransform: 'uppercase',
                  color: 'var(--logoColor)',
                }}
              >
                CNFT Predator
              </span>
            </Box>
          </Box>
        </Scrollbars>
      </aside> */
}

export default Portfolio;

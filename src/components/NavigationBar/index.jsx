/* eslint-disable react/prop-types */

/**
 * Module dependencies.
 */

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  Divider,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { Brightness4, Brightness7, Adb as AdbIcon, Menu as MenuIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

/**
 * Function `NavigationBar`.
 */

function NavigationBar({ theme }) {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const { productList } = useSelector((state) => state.productList);
  const numberOfProducts = () => productList.reduce((acc, prod) => acc + prod.quantity, 0);
  const logo = '/logo.png';

  const selectedLanguage = () => {
    if (lang !== 'pt-PT' && lang !== 'en-GB') {
      setLang('en-GB');

      return 'en-GB';
    }

    return lang;
  };

  const { darkMode, setDarkMode } = theme;

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const changeLanguage = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    localStorage.setItem('site-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  return (

    // <AppBar position="static">
    //   <Container maxWidth="xl">
    //     <Toolbar disableGutters>
    //       <Link to={'/'}>
    //         <img
    //           alt={''}
    //           className={'d-inline-block'}
    //           height={40}
    //           src={logo}
    //           width={40}
    //         />
    //       </Link>
    //       <Typography
    //         component={Link}
    //         noWrap
    //         sx={{
    //           color: 'inherit',
    //           display: { md: 'flex' },
    //           fontWeight: 700,
    //           ml: 1
    //         }}
    //         to={'/'}
    //         variant={'h6'}
    //       >
    //         {t('title.base')}
    //       </Typography>

    //       <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
    //         <IconButton
    //           size="large"
    //           aria-label="account of current user"
    //           aria-controls="menu-appbar"
    //           aria-haspopup="true"
    //           onClick={handleMenuOpen}
    //           color="inherit"
    //         >
    //           <MenuIcon />
    //         </IconButton>
    //         <Menu
    //           id="menu-appbar"
    //           anchorEl={anchorEl}
    //           anchorOrigin={{
    //             vertical: 'bottom',
    //             horizontal: 'left',
    //           }}
    //           keepMounted
    //           transformOrigin={{
    //             vertical: 'top',
    //             horizontal: 'left',
    //           }}
    //           open={Boolean(anchorEl)}
    //           onClose={handleMenuClose}
    //           sx={{ display: { xs: 'block', md: 'none' } }}
    //         >
    //           {/* {pages.map((page) => (
    //             <MenuItem key={page} onClick={handleMenuClose}>
    //               <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
    //             </MenuItem>
    //           ))} */}
    //         </Menu>
    //       </Box>
    //       <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
    //         {/* {pages.map((page) => (
    //           <Button
    //             key={page}
    //             onClick={handleMenuClose}
    //             sx={{ my: 2, color: 'white', display: 'block' }}
    //           >
    //             {page}
    //           </Button>
    //         ))} */}
    //       </Box>
    //       <Box sx={{ flexGrow: 0 }}>
    //         <Tooltip title="Open settings">
    //           <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
    //             <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
    //           </IconButton>
    //         </Tooltip>
    //         {/* <Menu
    //           sx={{ mt: '45px' }}
    //           id="menu-appbar"
    //           anchorEl={anchorElUser}
    //           anchorOrigin={{
    //             vertical: 'top',
    //             horizontal: 'right',
    //           }}
    //           keepMounted
    //           transformOrigin={{
    //             vertical: 'top',
    //             horizontal: 'right',
    //           }}
    //           open={Boolean(anchorElUser)}
    //           onClose={handleCloseUserMenu}
    //         >
    //           {settings.map((setting) => (
    //             <MenuItem key={setting} onClick={handleCloseUserMenu}>
    //               <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
    //             </MenuItem>
    //           ))}
    //         </Menu> */}
    //       </Box>
    //     </Toolbar>
    //   </Container>
    // </AppBar>

    //OLD
    <>
      <AppBar
        position={'static'}
        sx={{ backgroundColor: '#212529' }}
      >
        <Container
          maxWidth={false}
          sx={{ maxWidth: '100%' }}
        >
          <Toolbar
            disableGutters
            sx={{ marginLeft: 'auto' }}
          >
            <Link to={'/'}>
              <img
                alt={''}
                className={'d-inline-block'}
                height={40}
                src={logo}
                width={40}
              />
            </Link>
            <Typography
              component={Link}
              noWrap
              sx={{
                color: 'inherit',
                display: { md: 'flex' },
                fontWeight: 700,
                ml: 1
              }}
              to={'/'}
              variant={'h6'}
            >
              {t('title.base')}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Hidden mdDown>
              <Typography
                component={Link}
                noWrap
                sx={{
                  color: 'inherit',
                  mr: 3
                }}
                to={'/'}
              >
                {t('menu.home')}
              </Typography>
              <Typography
                component={Link}
                sx={{
                  alignItems: 'center',
                  color: 'inherit',
                  display: 'flex',
                  mr: 3
                }}
                to={'/product/list'}
              >
                {t('menu.product-list')} &nbsp;&nbsp;
                <Badge
                  badgeContent={numberOfProducts().toString()}
                  color={'error'}
                />
              </Typography>
              <Select
                id={'language'}
                onChange={(event) => changeLanguage(event.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    paddingBlock: '6px'
                  },
                  '& .MuiSelect-icon': {
                    color: 'common.white'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  color: 'common.white'
                }}
                value={selectedLanguage()}
              >
                <MenuItem value={'pt-PT'}>🇵🇹 PT</MenuItem>
                <MenuItem value={'en-GB'}>🇬🇧 EN</MenuItem>
              </Select>

              <IconButton
                color={'inherit'}
                onClick={toggleDarkMode}
                size={'small'}
                sx={{
                  '&:hover': { backgroundColor: '#000000' },
                  backgroundColor: '#495057'
                }}
              >
                {darkMode ? (
                  <Brightness7
                    fontSize={'inherit'}
                    sx={{ color: 'common.white' }}
                  />
                ) : (
                  <Brightness4
                    fontSize={'inherit'}
                    sx={{ color: 'common.white' }}
                  />
                )}
              </IconButton>
            </Hidden>

            <Hidden mdUp>
              <IconButton
                aria-label={'menu'}
                color={'inherit'}
                edge={'end'}
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
          </Toolbar>
        </Container>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        open={Boolean(anchorEl)}
        sx={{ textAlign: 'center' }}
      >
        <MenuItem
          button
          component={Link}
          onClick={handleMenuClose}
          to={'/'}
        >
          {t('menu.home')}
        </MenuItem>
        <Divider />
        <MenuItem
          button
          component={Link}
          onClick={handleMenuClose}
          to={'/product/list'}
        >
          {t('menu.product-list')} &nbsp;&nbsp;
          <Badge
            badgeContent={numberOfProducts().toString()}
            color={'error'}
          />
        </MenuItem>
        <Divider />
        <MenuItem disableGutters>
          <Select
            id={'language'}
            onChange={(event) => changeLanguage(event.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiSelect-select': {
                paddingBlock: '0.6rem'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            }}
            value={selectedLanguage()}
          >
            <MenuItem value={'pt-PT'}>🇵🇹 PT</MenuItem>
            <MenuItem value={'en-GB'}>🇬🇧 EN</MenuItem>
          </Select>
        </MenuItem>
        <Divider />
        <MenuItem>
          <IconButton
            color={'inherit'}
            onClick={toggleDarkMode}
            size={'small'}
            sx={{
              '&:hover': { backgroundColor: '#000000' },
              backgroundColor: '#495057'
            }}
          >
            {darkMode ? (
              <Brightness7
                fontSize={'inherit'}
                sx={{ color: 'common.white' }}
              />
            ) : (
              <Brightness4
                fontSize={'inherit'}
                sx={{ color: 'common.white' }}
              />
            )}
          </IconButton>
        </MenuItem>
      </Menu>
    </>
  );
}

export default NavigationBar;

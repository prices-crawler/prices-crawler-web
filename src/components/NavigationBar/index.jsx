/* eslint-disable react/prop-types */

/**
 * Module dependencies.
 */

import {
  AppBar,
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
  Typography
} from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material';
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
  const numberOfProducts = () => {
    return productList.reduce((total, list) => {
      return total + list.products.reduce((acc, prod) => acc + prod.quantity, 0);
    }, 0);
  };
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

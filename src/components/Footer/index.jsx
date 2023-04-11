/**
 * Module dependencies.
 */

import './index.scss';
import { Link } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Function `Footer`.
 */

function Footer() {
  const { t } = useTranslation();

  return (
    <div className={'nav-footer-container'}>
      <div className={'nav-footer'}>
        <Link
          className={'nav-footer-link me-3'}
          to={'/about'}
        >
          {t('menu.about')}
        </Link>
        <Link
          className={'nav-footer-link'}
          to={'/privacy-terms'}
        >
          {t('menu.privacy-terms')}
        </Link>
      </div>
    </div>
  );
}

/**
 * Export `Footer`.
 */

export default Footer;

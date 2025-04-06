/* eslint-disable react/prop-types */
/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from 'react-router-dom';
import { MAX_LISTS } from '@services/store/products/productsReducer';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductCard`.
 */

function ProductCard({ catalog, historyEnabled, locale, productData }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.productList);
  const renderText = (value) => (value.length > 35 ? `${value.substring(0, 35)}...` : value);

  /**
   * Add to List.
   */

  const addToList = (listName) => {
    const productKey = `${locale}.${catalog}.${productData.reference}`;

    const product = productList
      .filter((list) => {
        return list.name === listName;
      })
      .find((prod) => prod.products.some((product) => product.key === productKey));

    if (product) {
      productList
        .filter((list) => {
          return list.name === listName;
        })
        .map((list) => {
          if (list.products.some((product) => product.key === productKey)) {
            return {
              ...list,
              products: list.products.map((product) => {
                if (product.key === productKey) {
                  dispatch(
                    productsActions.addToProductList(
                      { ...product, quantity: product.quantity + 1 },
                      listName
                    )
                  );
                }
              })
            };
          }
        });
    } else {
      const newProduct = {
        catalog,
        historyEnabled,
        key: productKey,
        locale,
        product: productData,
        quantity: 1
      };

      dispatch(productsActions.addToProductList(newProduct, listName));
      setMenuAnchor(null);
    }
  };

  /**
   * Create new List.
   */

  const handleCreateNewList = () => {
    if (productList.length >= MAX_LISTS) {
      return;
    }

    const newList = {
      name: `List ${productList.length + 1}`,
      products: []
    };

    dispatch(productsActions.createNewList(newList));
  };

  return (
    <div className={'product-card mb-2 mt-2 position-relative'}>
      <center>
        <img
          alt={''}
          className={'product-card-image'}
          referrerPolicy={'no-referrer'}
          src={productData.imageUrl ? productData.imageUrl : '-'}
        />
      </center>

      <div className={'product-card-info'}>
        <span className={'product-card-span'}>{t('data.product-fields.name')}</span>
        <p className={'product-card-text'}>
          {renderText(productData.name ? productData.name : '-')}
        </p>
      </div>

      <div className={'product-card-info'}>
        <span className={'product-card-span'}>{t('data.product-fields.regular-price')}</span>

        {productData.campaignPrice ? (
          <p className={'product-card-text'}>
            <s>{productData.regularPrice}</s> &nbsp; {productData.campaignPrice}
          </p>
        ) : (
          <p className={'product-card-text'}>
            {productData.regularPrice ? productData.regularPrice : '-'}
          </p>
        )}
      </div>

      <div className={'product-card-info'}>
        <span className={'product-card-span'}>{t('data.product-fields.price-per-quantity')}</span>
        <p className={'product-card-text'}>
          {renderText(productData.pricePerQuantity ? productData.pricePerQuantity : '-')}
        </p>
      </div>

      <div className={'product-card-info'}>
        <span className={'product-card-span'}>{t('data.product-fields.quantity')}</span>
        <p className={'product-card-text'}>
          {renderText(productData.quantity ? productData.quantity : '-')}
        </p>
      </div>

      <div className={'product-card-info'}>
        <span className={'product-card-span'}>{t('data.product-fields.brand')}</span>
        <p className={'product-card-text'}>
          {renderText(productData.brand ? productData.brand : '-')}
        </p>
      </div>

      <div className={'product-card-info'}>
        <span className={'product-card-span'}>{t('data.product-fields.description')}</span>
        <p className={'product-card-text'}>
          {renderText(productData.description ? productData.description : '-')}
        </p>
      </div>

      <center>
        <a
          href={productData.productUrl}
          rel={'noopener noreferrer'}
          target={'_blank'}
        >
          <Button
            className={'product-card-button'}
            size={'small'}
            style={{ textTransform: 'capitalize' }}
            variant={'contained'}
          >
            {t('data.product-fields.store-page')}
          </Button>
        </a>
        &nbsp;
        {historyEnabled ? (
          <Link
            target={'_self'}
            to={`/product/${locale}/${catalog}/${productData.reference}`}
          >
            <Button
              className={'product-card-button'}
              size={'small'}
              style={{ textTransform: 'capitalize' }}
              variant={'contained'}
            >
              {t('data.product-fields.details')}
            </Button>
          </Link>
        ) : (
          <></>
        )}
        &nbsp;
        <ButtonGroup variant={'contained'}>
          <Button
            className={'product-card-button'}
            onClick={() => addToList('menu.product-list 1')}
            size={'small'}
            style={{ textTransform: 'capitalize' }}
          >
            {t('data.product-fields.add-to-list')}
          </Button>
          <Button
            aria-expanded={menuAnchor ? 'true' : undefined}
            aria-haspopup={'menu'}
            aria-label={'split button'}
            className={'product-card-button'}
            endIcon={<ArrowDropDownIcon />}
            onClick={(event) => setMenuAnchor(event.currentTarget)}
            size={'small'}
            style={{ width: '1rem' }}
          />
        </ButtonGroup>
        <Menu
          MenuListProps={{
            'aria-labelledby': 'split-button-menu'
          }}
          anchorEl={menuAnchor}
          onClose={() => setMenuAnchor(null)}
          open={Boolean(menuAnchor)}
        >
          {productList.map((list) => (
            <MenuItem
              key={list.name}
              onClick={() => addToList(list.name)}
            >
              {list.name}
            </MenuItem>
          ))}
          {productList.length < MAX_LISTS && (
            <MenuItem onClick={handleCreateNewList}>
              {t('general.new-list')}
              <AddIcon sx={{ fontSize: '1.4rem', marginInlineStart: '0.3rem' }} />
            </MenuItem>
          )}
        </Menu>
      </center>

      {productData.campaignPrice ? (
        <span
          className={
            'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
          }
        >
          <br />
          <br />
          %
          <br />
          <br />
        </span>
      ) : (
        <></>
      )}
    </div>
  );
}

/**
 * Export `ProductCard`.
 */

export default ProductCard;

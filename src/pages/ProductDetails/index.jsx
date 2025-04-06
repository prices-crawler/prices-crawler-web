/* eslint-disable operator-linebreak */
/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Loader from '@components/Loader';
import { MAX_LISTS } from '../../services/store/products/productsReducer';
import PricesChart from '@components/PricesChart';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductDetails`.
 */

function ProductDetails() {
  const { t } = useTranslation();
  const { catalog, locale, reference } = useParams();
  const { isLoadingData, product } = useSelector((state) => state.product);
  const { products } = useSelector((state) => state.products);
  const { productList } = useSelector((state) => state.productList);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productsActions.getProduct({ catalog, locale, reference }));
  }, [dispatch, locale, catalog, reference]);

  const isProductLoaded = () => !!product.prices;

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

  /**
   * Add to List.
   */

  const addToList = (listName = t('menu.product-list')) => {
    const productKey = `${locale}.${catalog}.${reference}`;

    const productListItem = productList
      .filter((list) => {
        return list.name === listName;
      })
      .find((prod) => prod.products.some((item) => item.key === productKey));

    if (productListItem) {
      productList
        .filter((list) => {
          return list.name === listName;
        })
        .map((list) => {
          if (list.products.some((item) => item.key === productKey)) {
            return {
              ...list,
              products: list.products.map((listItem) => {
                if (listItem.key === productKey) {
                  dispatch(
                    productsActions.addToProductList(
                      { ...listItem, quantity: listItem.quantity + 1 },
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
        historyEnabled: true,
        key: productKey,
        locale,
        product,
        quantity: 1
      };

      dispatch(productsActions.addToProductList(newProduct, listName));
      setMenuAnchor(null);
    }
  };

  /**
   * Render Statistics.
   */

  const renderStatistics = () => {
    if (product.prices) {
      const maxPrice = Math.max(
        ...product.prices.map((price) => parseFloat(utils.getFormattedPrice(price)))
      );
      const minPrice = Math.min(
        ...product.prices.map((price) => parseFloat(utils.getFormattedPrice(price)))
      );

      return (
        <Stack
          alignItems={'center'}
          direction={{ md: 'row', xs: 'column' }}
          divider={
            <Divider
              flexItem
              orientation={'vertical'}
            />
          }
          justifyContent={'center'}
          spacing={{ md: 2, xs: 0 }}
        >
          <div>
            <strong>{t('data.product-titles.price-min')}</strong>&nbsp;{minPrice}
          </div>
          <div>
            <strong>{t('data.product-titles.price-max')}</strong>&nbsp;{maxPrice}
          </div>
          <div>
            <strong>{t('data.product-titles.price-avg')}:</strong>&nbsp;
            {utils.getAveragePrice(product.prices)}
          </div>
          <div>
            <strong>{t('data.product-titles.price-last')}</strong>&nbsp;
            {utils.getLastPrice(product)}
          </div>
        </Stack>
      );
    }
  };

  /**
   * Render EanUpc.
   */

  const renderEanUpc = (eanUpc) => {
    if (eanUpc) {
      if (eanUpc.length === 1) {
        return eanUpc[0];
      }

      return eanUpc.map((eanUpc, index) => (
        <span key={index}>
          <br />
          {eanUpc}
        </span>
      ));
    }
  };

  /**
   * Render Price Indicator.
   */

  const renderPriceIndicator = (prices, currentPrice) => {
    const averagePrice = utils.getAveragePrice(prices);
    const productPrice = parseFloat(utils.convertToFloat(currentPrice));

    if (productPrice === averagePrice) {
      return (
        <Tooltip title={t('data.product-titles.price-indicator-info')}>
          <div>
            <strong>{t('data.product-titles.price-indicator')}:</strong>
            &nbsp;
            <span className={'badge-orange'}>{productPrice}€</span>
          </div>
        </Tooltip>
      );
    }

    if (productPrice > averagePrice) {
      return (
        <Tooltip title={t('data.product-titles.price-indicator-info')}>
          <div>
            <strong>{t('data.product-titles.price-indicator')}:</strong>
            &nbsp;
            <span className={'badge-red'}>{productPrice}€</span>
          </div>
        </Tooltip>
      );
    }

    if (productPrice < averagePrice) {
      return (
        <Tooltip title={t('data.product-titles.price-indicator-info')}>
          <div>
            <strong>{t('data.product-titles.price-indicator')}:</strong>
            &nbsp;
            <span className={'badge-green'}>{productPrice}€</span>
          </div>
        </Tooltip>
      );
    }
  };

  /**
   * Render Product Prices.
   */

  const renderProductPrices = () => {
    const productFiltered = products.filter(
      (cat) => cat.locale === locale && cat.catalog === catalog
    );

    if (productFiltered.length > 0) {
      const prod = productFiltered[0];
      // eslint-disable-next-line id-length
      const p = prod.products.filter((prod) => prod.reference === reference);

      if (p.length > 0) {
        const { campaignPrice, pricePerQuantity, regularPrice } = p[0];
        const price = campaignPrice || regularPrice;

        return (
          <Stack
            direction={'column'}
            spacing={1}
          >
            {campaignPrice ? (
              <div>
                <strong>{t('data.product-fields.regular-price')}:</strong>
                &nbsp;
                <s>{regularPrice}</s>
                &nbsp;
                {campaignPrice}
              </div>
            ) : (
              <div>
                <strong>{t('data.product-fields.regular-price')}:</strong>
                &nbsp;
                {regularPrice}
              </div>
            )}
            <div>
              <strong>{t('data.product-fields.price-per-quantity')}:</strong>
              &nbsp;
              {pricePerQuantity}
            </div>
            {renderPriceIndicator(product.prices, price)}
          </Stack>
        );
      }
    }
  };

  /**
   * Render Table.
   */

  const renderTable = () => {
    const prices = Object.assign([], product.prices);

    if (prices && !isLoadingData) {
      prices.sort((first, second) => {
        const firstDate = new Date(first.date);
        const secondDate = new Date(second.date);

        return secondDate - firstDate;
      });

      return (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 500, maxWidth: 1000, overflowX: 'scroll' }}
        >
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.regular-price')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.campaign-price')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.price-per-quantity')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.quantity')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('general.date')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prices.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align={'center'}>{row.regularPrice}</TableCell>
                  <TableCell align={'center'}>{row.campaignPrice}</TableCell>
                  <TableCell align={'center'}>{row.pricePerQuantity}</TableCell>
                  <TableCell align={'center'}>{row.quantity ? row.quantity : row.name}</TableCell>
                  <TableCell align={'center'}>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  /**
   * Render Add to List Button.
   */

  const renderAddToListButton = () => {
    const productFiltered = products.filter(
      (cat) => cat.locale === locale && cat.catalog === catalog
    );

    if (productFiltered.length > 0) {
      const firstProduct = productFiltered[0];
      const prod = firstProduct.products.filter((prod) => prod.reference === reference);

      if (prod.length > 0) {
        return (
          <>
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
          </>
        );
      }
    }
  };

  const renderProductDataContainer = () => {
    return (
      <>
        <Box justify={'center'}>
          <Grid
            alignItems={'center'}
            container
            justify={'center'}
            spacing={{ md: 10, xs: 1 }}
          >
            <Grid
              item
              md={5}
              style={{ display: 'flex', justifyContent: 'center' }}
              xs={12}
            >
              <img
                alt={product.name}
                className={'product-img'}
                loading={'lazy'}
                referrerPolicy={'no-referrer'}
                src={product.imageUrl}
              />
            </Grid>
            <Grid
              item
              md={7}
              style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}
              xs={12}
            >
              <Stack
                direction={'column'}
                spacing={1}
              >
                <Stack
                  direction={{ md: 'row', xs: 'column' }}
                  divider={
                    <Divider
                      flexItem
                      orientation={'vertical'}
                    />
                  }
                  spacing={{ md: 1, xs: 0.5 }}
                >
                  <div>
                    <strong>{t('data.product-fields.locale')}:</strong>&nbsp;{product.locale}
                  </div>
                  <div>
                    <strong>{t('data.product-fields.catalog')}:</strong>&nbsp;{product.catalog}
                  </div>
                  <div>
                    <strong>{t('data.product-fields.reference')}:</strong>&nbsp;{product.reference}
                  </div>
                </Stack>
                <div>
                  <strong>{t('data.product-fields.name')}:</strong>
                  &nbsp;
                  {product.name ? product.name : '-'}
                </div>
                <div>
                  <strong>{t('data.product-fields.brand')}:</strong>
                  &nbsp;
                  {product.brand ? product.brand : '-'}
                </div>
                <div>
                  <strong>{t('data.product-fields.quantity')}:</strong>
                  &nbsp;
                  {product.quantity ? product.quantity : '-'}
                </div>
                <div>
                  <strong>{t('data.product-fields.description')}:</strong>
                  &nbsp;
                  {product.description ? product.description : '-'}
                </div>
                <div>
                  <strong>EAN/UPC:</strong>
                  &nbsp;
                  {product.eanUpc ? renderEanUpc(product.eanUpc) : '-'}
                </div>
                <div>{renderProductPrices()}</div>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Stack>
          <center>
            <a
              href={product.productUrl}
              rel={'noopener noreferrer'}
              target={'_blank'}
            >
              <Button
                size={'small'}
                style={{ textTransform: 'capitalize' }}
                variant={'contained'}
              >
                {t('data.product-fields.store-page')}
              </Button>
            </a>
            &nbsp;&nbsp;
            {renderAddToListButton()}
          </center>
        </Stack>
      </>
    );
  };

  const renderProductOutdatedAlert = () => {
    if (product.prices.length > 0) {
      const lastPrice = product.prices[product.prices.length - 1];

      const now = new Date();
      const lastPriceDate = new Date(lastPrice.date);

      if (
        now.getFullYear() !== lastPriceDate.getFullYear() ||
        now.getMonth() !== lastPriceDate.getMonth() ||
        now.getDate() !== lastPriceDate.getDate()
      ) {
        return <Alert severity={'warning'}>{t('data.error.product-outdated')}</Alert>;
      }
    }
  };

  return (
    <>
      {!isLoadingData && isProductLoaded() ? (
        <div className={'product'}>
          <div className={'product__container'}>
            <h2 className={'product__heading h2'}>{t('title.product-details')}</h2>

            <Stack
              alignItems={'center'}
              direction={'column'}
              justify={'center'}
              spacing={2}
            >
              {renderProductDataContainer()}
              <Typography variant={'h5'}>
                <strong>{t('general.price-evolution')}</strong>
              </Typography>
              {renderProductOutdatedAlert()}
              {renderStatistics()}
              <PricesChart data={product.prices} />
              <Typography
                style={{ marginBottom: '1rem' }}
                variant={'h5'}
              >
                <strong>{t('general.prices-history')}</strong>
              </Typography>
            </Stack>
            {renderTable()}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default ProductDetails;

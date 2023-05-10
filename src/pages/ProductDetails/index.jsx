/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import {
  Box,
  Button,
  Divider,
  Grid,
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
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@components/Loader';
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

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productsActions.getProduct({ catalog, locale, reference }));
  }, [dispatch, locale, catalog, reference]);

  const isProductLoaded = () => !!product.prices;

  /**
   * Get Avarage Price.
   */

  const getAveragePrice = (prices) => {
    let sum = 0;

    // eslint-disable-next-line id-length, no-plusplus
    for (let i = 0; i < prices.length; i++) {
      const price = parseFloat(utils.getFormattedPrice(prices[i]));

      sum += price;
    }

    return (sum / prices.length).toFixed(2);
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
            <strong>{t('data.product-titles.price-avg')}</strong>&nbsp;
            {getAveragePrice(product.prices)}
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
    const averagePrice = prices.reduce(
      (acc, curr) => acc + (parseFloat(utils.getFormattedPrice(curr)), 0) / prices.length
    );
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

    return (
      <Tooltip title={t('data.product-titles.price-indicator-info')}>
        <div>
          <strong>{t('data.product-titles.price-indicator')}:</strong>
          &nbsp;
          <span className={'badge-green'}>{productPrice}€</span>
        </div>
      </Tooltip>
    );
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
          <>
            <Stack
              direction={'column'}
              spacing={1}
            >
              {campaignPrice ? (
                <div>
                  <strong>{t('data.product-fields.regular-price')}:</strong>
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
          </>
        );
      }
    }
  };

  /**
   * Render Table.
   */

  const renderTable = () => {
    const prices = Object.assign([], product.prices);

    if (prices) {
      prices.sort((first, second) => {
        const firstDate = new Date(first.date);
        const secondDate = new Date(second.date);

        return secondDate - firstDate;
      });

      return (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 1000, overflowX: 'scroll' }}
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
   * Create Chart Data.
   */

  const createChartData = (prices) => {
    const chartData = [];

    if (prices) {
      prices.forEach((value) => {
        chartData.push({
          date: value.date,
          price: utils.getFormattedPrice(value),
          pricePerQuantity: value.pricePerQuantity,
          quantity: value.quantity
        });
      });
    }

    return chartData;
  };

  /**
   * Render Add to List Button.
   */

  const renderAddToListButton = () => {
    const productFiltered = products.filter(
      (cat) => cat.locale === locale && cat.catalog === catalog
    );

    if (productFiltered.length > 0) {
      const prod = productFiltered[0];
      // eslint-disable-next-line id-length
      const p = prod.products.filter((prod) => prod.reference === reference);

      if (p.length > 0) {
        return (
          <Button
            onClick={() => {
              const productData = p[0];
              const prodInfo = productList.find(
                (prod) => prod.key === `${locale}.${catalog}.${productData.reference}`
              );

              if (prodInfo) {
                prodInfo.quantity += 1;
                dispatch(productsActions.addToProductList(prodInfo));
              } else {
                dispatch(
                  productsActions.addToProductList({
                    catalog,
                    historyEnabled: true,
                    key: `${locale}.${catalog}.${productData.reference}`,
                    locale,
                    product: productData,
                    quantity: 1
                  })
                );
              }
            }}
            size={'small'}
            sx={{
              '&:hover': {
                backgroundColor: '#000000'
              },
              backgroundColor: '#495057'
            }}
            variant={'contained'}
          >
            {t('data.product-fields.add-to-list')}
          </Button>
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
                sx={{
                  '&:hover': {
                    backgroundColor: '#000000'
                  },
                  backgroundColor: '#495057'
                }}
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

  return (
    <>
      {!isLoadingData && isProductLoaded() ? (
        <Stack
          alignItems={'center'}
          direction={'column'}
          justify={'center'}
          spacing={2}
        >
          <Typography variant={'h4'}>
            <strong>{t('title.product-details')}</strong>
          </Typography>
          {renderProductDataContainer()}
          <Typography variant={'h5'}>
            <strong>{t('general.price-evolution')}</strong>
          </Typography>
          <div>
            {renderStatistics()}
            <PricesChart data={createChartData(product.prices)} />
          </div>
          <Typography variant={'h5'}>
            <strong>{t('general.prices-history')}</strong>
          </Typography>
          {renderTable()}
        </Stack>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default ProductDetails;

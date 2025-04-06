/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExpandMore } from '@mui/icons-material';
import Loader from '@components/Loader';
import Maintenance from '@components/Maintenance';
import ProductCard from '@components/ProductCard';
import SearchContainer from '../../components/SearchContainer';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductSearch`.
 */

function ProductSearch() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [orderBy, setOrderBy] = useState(t('menu.order.default'));
  const [isMaintenanceMode] = useState(import.meta.env.VITE_MAINTENANCE_MODE);

  const { isLoadingData, products } = useSelector((state) => state.products);
  const currentProducts = Object.assign([], products);

  /**
   * `orderBy functionality.
   */

  const handleSortChanges = (event) => {
    event.preventDefault();
    setOrderBy(event.target.value);

    let sortingFunction;

    switch (event.target.value) {
      case t('menu.order.asc'):
        sortingFunction = (a1, b1) => utils.getFormattedPrice(a1) - utils.getFormattedPrice(b1);
        break;

      case t('menu.order.desc'):
        sortingFunction = (a1, b1) => utils.getFormattedPrice(b1) - utils.getFormattedPrice(a1);
        break;

      case t('menu.order.asc-price-per-quantity'):
        sortingFunction = (a1, b1) =>
          utils.convertToFloat(a1.pricePerQuantity) - utils.convertToFloat(b1.pricePerQuantity);
        break;

      case t('menu.order.desc-price-per-quantity'):
        sortingFunction = (a1, b1) =>
          utils.convertToFloat(b1.pricePerQuantity) - utils.convertToFloat(a1.pricePerQuantity);
        break;

      default:
        sortingFunction = (a1, b1) => utils.getFormattedPrice(a1) - utils.getFormattedPrice(b1);
    }

    const updatedProducts = currentProducts.map((element) => ({
      ...element,
      products: [...element.products].sort(sortingFunction)
    }));

    dispatch(productsActions.getProductsSuccess(updatedProducts));
  };

  /**
   * `renderFilterOptions`.
   */

  const renderFilterOptions = () => {
    if (currentProducts.length > 0) {
      return (
        <div className={'sort-by-container'}>
          <FormControl>
            <InputLabel id={'sort-by'}>{t('menu.order.default')}</InputLabel>
            <Select
              autoWidth
              defaultValue={t('menu.order.default')}
              id={'sort-by-select'}
              label={'Sort By'}
              labelId={'sort-by'}
              onChange={(ev) => handleSortChanges(ev)}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>{t('menu.order.default')}</em>;
                }

                return selected;
              }}
              value={orderBy}
            >
              <MenuItem
                disabled
                value={t('menu.order.default')}
              >
                {t('menu.order.default')}
              </MenuItem>
              <MenuItem value={t('menu.order.asc')}>{t('menu.order.asc')}</MenuItem>
              <MenuItem value={t('menu.order.desc')}>{t('menu.order.desc')}</MenuItem>
              <MenuItem value={t('menu.order.asc-price-per-quantity')}>
                {t('menu.order.asc-price-per-quantity')}
              </MenuItem>
              <MenuItem value={t('menu.order.desc-price-per-quantity')}>
                {t('menu.order.desc-price-per-quantity')}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      );
    }
  };

  /**
   * `renderProductSearchResults`.
   */

  const renderProductSearchResults = () => (
    <Box className={'homepage__results'}>
      {currentProducts.map((productCatalogs, index) => (
        <Accordion
          defaultExpanded
          key={index}
          sx={{
            marginBottom: '5px'
          }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>
              <strong>{utils.renderCatalogName(productCatalogs)}</strong>
            </Typography>
          </AccordionSummary>
          <Divider sx={{ borderTop: '1px solid' }} />
          <AccordionDetails>
            <Box className={'catalog-grid'}>
              {productCatalogs.products.map((product, index) => (
                <ProductCard
                  catalog={productCatalogs.catalog}
                  historyEnabled={productCatalogs.data.historyEnabled}
                  key={index}
                  locale={productCatalogs.locale}
                  productData={product}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <div className={'homepage'}>
      <h2 className={'homepage__heading h2'}>{t('menu.home')}</h2>
      {isMaintenanceMode === 'true' ? (
        <Maintenance />
      ) : (
        <>
          <SearchContainer />
          {renderFilterOptions()}
          {!isLoadingData ? renderProductSearchResults() : <Loader />}
        </>
      )}
    </div>
  );
}

/**
 * Export `ProductSearch`.
 */

export default ProductSearch;

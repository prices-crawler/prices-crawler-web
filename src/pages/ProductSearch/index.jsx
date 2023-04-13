/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import { Accordion, Button, ButtonGroup, Form, FormControl } from 'react-bootstrap';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@components/Loader';
import Maintenance from '@components/Maintenance';
import { MultiSelect } from 'react-multi-select-component';
import ProductCard from '@components/ProductCard';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductSearch`.
 */

function ProductSearch() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [catalogs] = useState(JSON.parse(import.meta.env.VITE_CATALOGS_JSON));
  const [isMaintenanceMode] = useState(import.meta.env.VITE_MAINTENANCE_MODE);

  const [selectedCatalogs, setSelectedCatalogs] = useState(
    catalogs.filter((catalog) => catalog.selected)
  );

  const { isLoadingData, products } = useSelector((state) => state.products);

  const currentProducts = Object.assign([], products);

  /**
   * `handleProductSearch`.
   */

  const handleProductSearch = (event) => {
    event.preventDefault();

    if (searchValue !== '' && selectedCatalogs.length > 0) {
      dispatch(productsActions.search({ selectedCatalogs, stringValue: searchValue }));
    } else {
      Swal.fire({
        confirmButtonColor: '#6c757d',
        icon: 'info',
        text: 'Catalogs or search query missing.',
        title: 'Info'
      });
    }
  };

  /**
   * `renderSearchContainer`.
   */

  const renderSearchContainer = () => (
    <center>
      <div className={'search-container'}>
        <MultiSelect
          className={'search-text mb-1'}
          labelledBy={'Select'}
          onChange={setSelectedCatalogs}
          options={catalogs}
          value={selectedCatalogs}
        />
        <Form
          className={'d-flex'}
          onSubmit={handleProductSearch}
        >
          <FormControl
            className={'me-1'}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t('general.search-for-some-product')}
            type={'search'}
          />
          <Button
            type={'submit'}
            variant={'secondary'}
          >
            {t('general.search')}
          </Button>
        </Form>
      </div>
    </center>
  );

  /**
   * `orderByPriceASC`.
   */

  const orderByPriceASC = (event) => {
    event.preventDefault();

    currentProducts.map((element) =>
      element.products.sort((a1, b1) => utils.getFormattedPrice(a1) - utils.getFormattedPrice(b1))
    );

    dispatch(productsActions.getProductsSuccess(currentProducts));
  };

  /**
   * `orderByPriceDESC`.
   */

  const orderByPriceDESC = (event) => {
    event.preventDefault();

    currentProducts.map((element) =>
      element.products.sort((a1, b1) => utils.getFormattedPrice(b1) - utils.getFormattedPrice(a1))
    );

    dispatch(productsActions.getProductsSuccess(currentProducts));
  };

  /**
   * `orderByPriceASCPricePerQuantity`.
   */

  const orderByPriceASCPricePerQuantity = (event) => {
    event.preventDefault();

    currentProducts.map((element) =>
      element.products.sort(
        (a1, b1) =>
          utils.convertToFloat(b1.pricePerQuantity) - utils.convertToFloat(a1.pricePerQuantity)
      )
    );

    dispatch(productsActions.getProductsSuccess(currentProducts));
  };

  /**
   * `orderByPriceDESCPricePerQuantity`.
   */

  const orderByPriceDESCPricePerQuantity = (event) => {
    event.preventDefault();

    currentProducts.map((element) =>
      element.products.sort(
        (a1, b1) =>
          utils.convertToFloat(a1.pricePerQuantity) - utils.convertToFloat(b1.pricePerQuantity)
      )
    );

    dispatch(productsActions.getProductsSuccess(currentProducts));
  };

  /**
   * `renderFilterOptions`.
   */

  const renderFilterOptions = () => {
    if (currentProducts.length > 0) {
      return (
        <div className={'d-flex justify-content-end mt-3 mb-3 me-1 flex-wrap flex-md-nowrap'}>
          <ButtonGroup>
            <Button
              onClick={orderByPriceASC}
              variant={'outline-secondary'}
            >
              {t('menu.order.asc')}
            </Button>
            <Button
              onClick={orderByPriceDESC}
              variant={'outline-secondary'}
            >
              {t('menu.order.desc')}
            </Button>
          </ButtonGroup>
          <ButtonGroup className={'ms-1'}>
            <Button
              onClick={orderByPriceASCPricePerQuantity}
              variant={'outline-secondary'}
            >
              {t('menu.order.asc-price-per-quantity')}
            </Button>
            <Button
              onClick={orderByPriceDESCPricePerQuantity}
              variant={'outline-secondary'}
            >
              {t('menu.order.desc-price-per-quantity')}
            </Button>
          </ButtonGroup>
        </div>
      );
    }
  };

  /**
   * `renderProductSearchResults`.
   */

  const renderProductSearchResults = () => (
    <div>
      {currentProducts.map((productCatalogs, index) => (
        <Accordion
          alwaysOpen
          className={'m-1'}
          defaultActiveKey={['0']}
          key={index}
        >
          <Accordion.Item eventKey={'0'}>
            <Accordion.Header>
              <strong>{utils.renderCatalogName(productCatalogs)}</strong>
            </Accordion.Header>
            <Accordion.Body>
              <div className={'catalog-grid'}>
                {productCatalogs.products.map((product, index) => (
                  <ProductCard
                    catalog={productCatalogs.catalog}
                    historyEnabled={productCatalogs.data.historyEnabled}
                    key={index}
                    locale={productCatalogs.locale}
                    productData={product}
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}
    </div>
  );

  return (
    <>
      <div
        className={'h2'}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <strong>{t('menu.home')}</strong>
      </div>
      <br />
      {isMaintenanceMode === 'true' ? (
        <Maintenance />
      ) : (
        <>
          {renderSearchContainer()}
          {renderFilterOptions()}
          {!isLoadingData ? renderProductSearchResults() : <Loader />}
        </>
      )}
    </>
  );
}

/**
 * Export `ProductSearch`.
 */

export default ProductSearch;

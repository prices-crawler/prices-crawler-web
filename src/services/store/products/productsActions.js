/**
 * Module dependencies.
 */

import * as actionTypes from './productsActionTypes';
import api from '@services/api';

/**
 * Get Product Start.
 */

export const getProductStart = () => ({ type: actionTypes.GET_PRODUCT_START });

/**
 * Get Product Success.
 */

export const getProductSuccess = (product) => ({
  payload: product,
  type: actionTypes.GET_PRODUCT_SUCCESS
});

/**
 * Get Product Fail.
 */

export const getProductFail = (error) => ({
  payload: error,
  type: actionTypes.GET_PRODUCT_FAIL
});

/**
 * Get Products Start.
 */

export const getProductsStart = () => ({
  type: actionTypes.GET_PRODUCTS_START
});

/**
 * Get Products Success.
 */

export const getProductsSuccess = (products) => ({
  payload: products,
  type: actionTypes.GET_PRODUCTS_SUCCESS
});

/**
 *Get Products Fail.
 */

export const getProductsFail = (error) => ({
  payload: error,
  type: actionTypes.GET_PRODUCTS_FAIL
});

/**
 * Search Products Start.
 */

export const searchProductsStart = () => ({
  type: actionTypes.SEARCH_PRODUCTS_START
});

/**
 * Search Products Success.
 */

export const searchProductsSuccess = () => ({
  type: actionTypes.SEARCH_PRODUCTS_SUCCESS
});

/**
 * Get Search Products.
 */

export const getSearchProducts = (products, searchParam) => ({
  payload: { products, searchParam },
  type: actionTypes.GET_SEARCHED_PRODUCTS
});

/**
 * Create new List.
 */

export const createNewList = (newList) => ({
  payload: newList,
  type: actionTypes.CREATE_NEW_LIST
});

/**
 * Add to Product List.
 */

export const addToProductList = (newProduct, listName) => ({
  payload: { listName, newProduct },
  type: actionTypes.ADD_PRODUCT_TO_LIST
});

/**
 * Update Product List.
 */

export const updateProductList = (product) => ({
  payload: product,
  type: actionTypes.UPDATE_PRODUCT_LIST
});

/**
 * Upload Product List.
 */

export const uploadProductList = (product) => ({
  payload: product,
  type: actionTypes.UPLOAD_PRODUCT_LIST
});

/**
 * Remove from Product List.
 */

export const removeFromProductList = (product, listName) => ({
  payload: { listName, product },
  type: actionTypes.REMOVE_PRODUCT_FROM_LIST
});

/**
 * Search.
 */

export const search = (searchParam) => {
  const { selectedCatalogs = [], stringValue = '' } = searchParam;
  const request = {
    catalogs: selectedCatalogs.map((catalog) => catalog.value),
    query: stringValue
  };

  return (dispatch) => {
    dispatch(getProductsStart());
    api
      .post('/api/v1/products/search', request)
      .then((response) => {
        const reorderedResponse = selectedCatalogs.map((catalog) => {
          return response.data.find((item) => item.catalog === catalog.value.split('.').pop());
        });

        dispatch(getSearchProducts(reorderedResponse, searchParam));
      })
      .catch((error) => dispatch(getProductsFail(error)));
  };
};

/**
 * Get Updated Product List.
 */

export const getUpdatedProductList = (searchParam) => (dispatch) => {
  dispatch(getProductsStart());
  api
    .post('/api/v1/products/list/update', searchParam)
    .then((response) => {
      dispatch(updateProductList(response.data));
    })
    .catch((error) => dispatch(getProductsFail(error)));
};

/**
 * Get Product.
 */

export const getProduct = (searchParam) => {
  const { catalog, locale, reference } = searchParam;

  return (dispatch) => {
    dispatch(getProductStart());
    api
      .get(`/api/v1/products/history/${locale}/${catalog}/${reference}`)
      .then((response) => {
        dispatch(getProductSuccess(response.data));
      })
      .catch((error) => dispatch(getProductsFail(error)));
  };
};

export const saveProductList = (searchParam) => (dispatch) => {
  dispatch(getProductStart());
  api
    .post('/api/v1/products/list/store', searchParam)
    .then((response) => {
      dispatch(uploadProductList(response));
    })
    .catch((error) => dispatch(getProductsFail(error)));
};

export const retrieveProductList = (searchParam) => (dispatch) => {
  dispatch(getProductStart());
  api
    .get(`/api/v1/products/list?id=${searchParam}`)
    .then((response) => {
      dispatch(updateProductList(response.data));
    })
    .catch((error) => dispatch(getProductsFail(error)));
};

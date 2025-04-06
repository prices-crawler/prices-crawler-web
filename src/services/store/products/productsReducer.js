/* eslint-disable no-confusing-arrow */

/**
 * Module dependencies.
 */

import * as actionTypes from './productsActionTypes';
import Swal from 'sweetalert2';
import { combineReducers } from '@reduxjs/toolkit';
import initialState from './productsInitialState';
import { t } from 'i18next';

/**
 *  Local Storage with Products List.
 */

const localStorageproductsList = 'productsList';

/**
 *  Maximum number of lists a user is able to create
 */

export const MAX_LISTS = 5;

/**
 *  `isLoadingData`.
 */

export const isLoadingData = (state = initialState.isLoadingData, action) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT_START:
    case actionTypes.GET_PRODUCTS_START:
    case actionTypes.SEARCH_PRODUCTS_START:
      return true;

    case actionTypes.GET_PRODUCTS_FAIL:
    case actionTypes.GET_PRODUCT_SUCCESS:
    case actionTypes.GET_PRODUCTS_SUCCESS:
    case actionTypes.SEARCH_PRODUCTS_SUCCESS:
    case actionTypes.GET_SEARCHED_PRODUCTS:
    case actionTypes.UPDATE_PRODUCT_LIST:
    case actionTypes.UPLOAD_PRODUCT_LIST:
      return false;

    default:
      return state;
  }
};

/**
 *  Products.
 */
// FIXME: Replace function name

export const products = (state = initialState.products, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCTS_SUCCESS:
      return action.payload;

    case actionTypes.GET_SEARCHED_PRODUCTS: {
      // eslint-disable-next-line no-shadow
      const { products } = action.payload;

      return products;
    }

    case actionTypes.GET_PRODUCTS_FAIL: {
      Swal.fire({
        confirmButtonColor: '#6c757d',
        icon: 'error',
        text: `${action.payload} - ${action.payload.response.statusText}`,
        title: `Error`
      });

      return {};
    }

    default:
      return state;
  }
};

/**
 *  Product.
 */

export const product = (state = initialState.product, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT_SUCCESS: {
      return action.payload;
    }

    case actionTypes.GET_PRODUCT_FAIL: {
      Swal.fire({
        confirmButtonColor: '#6c757d',
        icon: 'error',
        text: `${action.payload} - ${action.payload.response.statusText}`,
        title: `Error`
      });

      return {};
    }

    default:
      return state;
  }
};

/**
 *  Product List.
 */

export const productList = (state = initialState.productList, action = {}) => {
  switch (action.type) {
    case actionTypes.CREATE_NEW_LIST: {
      if (state.length === MAX_LISTS) {
        return state;
      }

      const newList = {
        name: `${t('menu.product-list')} ${state.length + 1}`,
        products: []
      };

      const updatedState = [...state, newList];

      localStorage.setItem(localStorageproductsList, JSON.stringify(updatedState));

      return updatedState;
    }

    case actionTypes.ADD_PRODUCT_TO_LIST: {
      const { listName, newProduct } = action.payload;

      const updatedState = state.map((list) => {
        if (list.name === listName) {
          const existingProduct = list.products.find((prod) => prod.key === newProduct.key);

          if (existingProduct) {
            return {
              ...list,
              products: list.products.map((prod) =>
                prod.key === newProduct.key ? { ...prod, quantity: newProduct.quantity } : prod
              )
            };
          }

          return {
            ...list,
            products: [...list.products, newProduct]
          };
        }

        return list;
      });

      localStorage.setItem(localStorageproductsList, JSON.stringify(updatedState));

      return updatedState;
    }

    case actionTypes.REMOVE_PRODUCT_FROM_LIST: {
      const { listName, product } = action.payload;
      const { key, quantity } = product;

      const updatedState = state.map((list) => {
        if (list.name === listName) {
          if (quantity === 0) {
            list.products = list.products.filter((product) => product.key !== key);
          } else {
            list.products = list.products.map((product) =>
              product.key === key ? { ...product, quantity } : product
            );
          }
        }

        return list;
      });

      localStorage.setItem(localStorageproductsList, JSON.stringify(updatedState));

      return updatedState;
    }

    default: {
      const storedLists = JSON.parse(localStorage.getItem(localStorageproductsList));

      if (!storedLists || storedLists.length === 0) {
        const defaultList = {
          name: `${t('menu.product-list')} ${state.length + 1}`,
          products: []
        };

        localStorage.setItem(localStorageproductsList, JSON.stringify([defaultList]));

        return [defaultList];
      }

      return storedLists;
    }
  }
};

/**
 *  Product List Upload.
 */

export const productListUpload = (state = initialState.productListId, action = {}) => {
  switch (action.type) {
    case actionTypes.UPLOAD_PRODUCT_LIST: {
      return action.payload;
    }

    default:
      return state;
  }
};

/**
 *  Search Query.
 */

export const searchQuery = (state = initialState.searchQuery, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_SEARCHED_PRODUCTS: {
      return action.payload.searchParam;
    }

    default:
      return state;
  }
};

/**
 * Export
 */

export default combineReducers({
  isLoadingData,
  product,
  productList,
  productListUpload,
  products,
  searchQuery
});

/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import { Add, ArrowDownward, ArrowUpward, FileCopy, Launch, Remove } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '@components/Loader';
import { QRCode } from 'antd';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductList.
 */

function ProductList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isLoadingData, productList, productListUpload } = useSelector(
    (state) => state.productList
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [isListUpdated, setIsListUpdated] = useState(true);
  const [showFormControl, setShowFormControl] = useState(false);
  const [showReorderControl, setShowReorderControl] = useState(false);
  const [isMaintenanceMode] = useState(import.meta.env.VITE_MAINTENANCE_MODE);

  useEffect(() => {
    if (productList && productList.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const isAnyProductOutdated = productList.some((list) => {
        list.products?.forEach((prod) => {
          const productDate = new Date(prod.product.date);
          const productParseDate = new Date(
            productDate.getFullYear(),
            productDate.getMonth(),
            productDate.getDate()
          );

          return productParseDate < today;
        });
      });

      setIsListUpdated(!isAnyProductOutdated);
    }
  }, [productList]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams.has('id')) {
      const id = queryParams.get('id');

      Swal.fire({
        cancelButtonColor: '#6c757d',
        cancelButtonText: t('general.no'),
        confirmButtonColor: '#6c757d',
        confirmButtonText: t('general.yes'),
        icon: 'warning',
        showCancelButton: true,
        text: t('general.product-list-replace'),
        title: `${id}`
      }).then((result) => {
        if (result.value) {
          dispatch(productsActions.retrieveProductList(id));
        }
      });
    }
  }, [dispatch, t]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReorder = () => {
    setShowReorderControl(!showReorderControl);
    handleClose();
  };

  /**
   *  `removeFromProductList.
   */

  const removeFromProductList = (event, prod, listName) => {
    event.preventDefault();

    const updatedProduct = {
      ...prod,
      quantity: prod.quantity - 1
    };

    dispatch(productsActions.removeFromProductList(updatedProduct, listName));
  };

  /**
   *  `addToProductList.
   */

  const addToProductList = (event, prod, listName) => {
    event.preventDefault();

    const updatedProduct = {
      ...prod,
      quantity: prod.quantity + 1
    };

    dispatch(productsActions.addToProductList(updatedProduct, listName));
  };

  /**
   *  `updateList.
   */

  const updateList = (event) => {
    event.preventDefault();
    dispatch(productsActions.getUpdatedProductList(productList));
  };

  /**
   *  `uploadList.
   */

  const uploadList = (event) => {
    event.preventDefault();
    dispatch(productsActions.saveProductList(productList));
    setShowFormControl(!showFormControl);
  };

  /**
   *  `moveItemUp.
   */

  const moveItemUp = (index) => {
    if (index > 0) {
      const updatedList = [...productList];
      const temp = updatedList[index];

      updatedList[index] = updatedList[index - 1];
      updatedList[index - 1] = temp;
      dispatch(productsActions.updateProductList(updatedList));
    }
  };

  /**
   *  `moveItemDown.
   */

  const moveItemDown = (index) => {
    if (index < productList.length - 1) {
      const updatedList = [...productList];
      const temp = updatedList[index];

      updatedList[index] = updatedList[index + 1];
      updatedList[index + 1] = temp;
      dispatch(productsActions.updateProductList(updatedList));
    }
  };

  /**
   *  `renderTotalPrice.
   */

  const renderTotalPrice = () => {
    if (productList) {
      let totalPrice = 0;

      for (const list of productList) {
        for (const product of list.products) {
          totalPrice += utils.getFormattedPrice(product.product) * product.quantity;
        }
      }

      return totalPrice.toFixed(2);
    }

    return '0.00';
  };

  /**
   *  `renderTotalPriceByCatalog.
   */

  const renderTotalPriceByCatalog = () => {
    if (productList) {
      const catalogTotals = {};

      for (const list of productList) {
        for (const product of list.products) {
          if (product && product.product) {
            const { catalog } = product;
            const price = utils.getFormattedPrice(product.product) * product.quantity;

            // eslint-disable-next-line max-depth
            if (!catalogTotals[catalog]) {
              catalogTotals[catalog] = 0;
            }

            catalogTotals[catalog] += price;
          }
        }
      }

      return Object.keys(catalogTotals).map((catalog) => {
        const totalPrice = catalogTotals[catalog];

        return `${catalog}: ${totalPrice.toFixed(2)}€; `;
      });
    }
  };

  /**
   *  `renderTable.
   */

  const renderTable = () => {
    if (productList) {
      return (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 1200, overflowX: 'scroll' }}
        >
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.image')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.catalog')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.reference')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.name')}
                </TableCell>
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
                  {t('data.product-fields.price-per-quantity')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.list')}
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
                  {t('data.product-fields.history-page')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.store-page')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.remove-add')}
                </TableCell>
                {showReorderControl && (
                  <TableCell
                    align={'center'}
                    style={{ color: 'white' }}
                  >
                    {t('data.product-fields.move')}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((list) => {
                const { name: listName } = list;

                return list.products.map((prod, index) => {
                  const { catalog, historyEnabled, locale, product, quantity } = prod;
                  // eslint-disable-next-line operator-linebreak
                  const { campaignPrice, name, pricePerQuantity, reference, regularPrice } =
                    product;

                  return (
                    <TableRow key={index}>
                      <TableCell align={'center'}>
                        <img
                          alt={''}
                          className={'product-list-img'}
                          referrerPolicy={'no-referrer'}
                          src={product.imageUrl}
                        />
                      </TableCell>
                      <TableCell align={'center'}>
                        {locale}.{catalog}
                      </TableCell>
                      <TableCell align={'center'}>{reference}</TableCell>
                      <TableCell align={'center'}>{name}</TableCell>
                      <TableCell align={'center'}>
                        {campaignPrice ? (
                          <div>
                            <s>{regularPrice}</s> &nbsp; {campaignPrice}
                          </div>
                        ) : (
                          regularPrice
                        )}
                      </TableCell>
                      <TableCell align={'center'}>{pricePerQuantity}</TableCell>
                      <TableCell align={'center'}>{listName}</TableCell>
                      <TableCell align={'center'}>{quantity}</TableCell>
                      <TableCell align={'center'}>
                        {historyEnabled ? (
                          <Link
                            target={'_self'}
                            to={`/product/${locale}/${catalog}/${reference}`}
                          >
                            <IconButton
                              size={'small'}
                              sx={{
                                '&:hover': {
                                  backgroundColor: '#000000'
                                },
                                backgroundColor: '#495057'
                              }}
                              variant={'contained'}
                            >
                              <Launch
                                fontSize={'inherit'}
                                style={{ color: 'white' }}
                              />
                            </IconButton>
                          </Link>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell align={'center'}>
                        <a
                          href={product.productUrl}
                          rel={'noopener noreferrer'}
                          target={'_blank'}
                        >
                          <IconButton
                            size={'small'}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#000000'
                              },
                              backgroundColor: '#495057'
                            }}
                            variant={'contained'}
                          >
                            <Launch
                              fontSize={'inherit'}
                              style={{ color: 'white' }}
                            />
                          </IconButton>
                        </a>
                      </TableCell>
                      <TableCell align={'center'}>
                        <Stack
                          alignItems={'center'}
                          direction={'row'}
                          justifyContent={'center'}
                          spacing={1}
                        >
                          <IconButton
                            onClick={(event) => removeFromProductList(event, prod, listName)}
                            size={'small'}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#000000'
                              },
                              backgroundColor: '#495057'
                            }}
                            variant={'contained'}
                          >
                            <Remove
                              fontSize={'inherit'}
                              style={{ color: 'white' }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={(event) => addToProductList(event, prod, listName)}
                            size={'small'}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#000000'
                              },
                              backgroundColor: '#495057'
                            }}
                            variant={'contained'}
                          >
                            <Add
                              fontSize={'inherit'}
                              style={{ color: 'white' }}
                            />
                          </IconButton>
                        </Stack>
                      </TableCell>
                      {showReorderControl && (
                        <TableCell align={'center'}>
                          <Stack
                            alignItems={'center'}
                            direction={'row'}
                            justifyContent={'center'}
                            spacing={1}
                          >
                            <IconButton
                              disabled={index === 0}
                              onClick={() => moveItemUp(index)}
                              size={'small'}
                              sx={{
                                '&:hover': {
                                  backgroundColor: '#000000'
                                },
                                backgroundColor: '#495057'
                              }}
                              variant={'contained'}
                            >
                              <ArrowUpward
                                fontSize={'inherit'}
                                style={{ color: 'white' }}
                              />
                            </IconButton>
                            <IconButton
                              disabled={index === productList.length - 1}
                              onClick={() => moveItemDown(index)}
                              size={'small'}
                              sx={{
                                '&:hover': {
                                  backgroundColor: '#000000'
                                },
                                backgroundColor: '#495057'
                              }}
                              variant={'contained'}
                            >
                              <ArrowDownward
                                fontSize={'inherit'}
                                style={{ color: 'white' }}
                              />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  const renderProductListUploadUrl = () => {
    if (productListUpload.data) {
      return `${window.location.origin}/product/list?id=${productListUpload.data.id}`;
    }
  };

  const renderProductListExpirationDate = () => {
    if (productListUpload.data) {
      return productListUpload.data.expirationDate;
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(renderProductListUploadUrl());
  };

  const renderListUpload = () => (
    <>
      <Button
        onClick={uploadList}
        sx={{ textTransform: 'capitalize' }}
        variant={'contained'}
      >
        {t('general.list-upload')}
      </Button>
      <br />
      {showFormControl && (
        <>
          <br />
          <OutlinedInput
            endAdornment={
              <InputAdornment position={'end'}>
                <IconButton
                  onClick={copyToClipboard}
                  size={'small'}
                  style={{ color: 'white' }}
                  sx={{
                    '&:hover': { backgroundColor: '#000000' },
                    backgroundColor: '#495057'
                  }}
                >
                  <FileCopy />
                </IconButton>
              </InputAdornment>
            }
            placeholder={'Link'}
            value={renderProductListUploadUrl()}
          />
          <br />
          <center>
            <QRCode
              errorLevel={'H'}
              icon={'/logo.png'}
              value={renderProductListUploadUrl()}
            />
          </center>

          <Typography
            color={'textSecondary'}
            variant={'body2'}
          >
            <p>{t('general.expiration-text-1')}</p>
            <p>
              {t('general.expiration-text-2')} {renderProductListExpirationDate()}
            </p>
          </Typography>
        </>
      )}
    </>
  );

  return (
    <center>
      <div className={'product-list'}>
        <div className={'product-list__container'}>
          <h2 className={'product-list__heading h2'}>{t('title.products-list')}</h2>
        </div>

        {!isLoadingData ? (
          <>
            <div className={'options-container'}>
              <ButtonGroup
                aria-label={'options dropdown'}
                onClick={handleClick}
                variant={'contained'}
              >
                <Button sx={{ textTransform: 'capitalize' }}>
                  {t('pages.product-list.options.tooltip')}
                </Button>
              </ButtonGroup>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  horizontal: 'left',
                  vertical: 'bottom'
                }}
                id={'options-menu'}
                onClose={handleClose}
                open={Boolean(anchorEl)}
                transformOrigin={{
                  horizontal: 'left',
                  vertical: 'top'
                }}
              >
                <MenuItem onClick={handleReorder}>
                  {t('pages.product-list.options.redorder')}
                </MenuItem>
              </Menu>
            </div>
            {renderTable()}
            <br />
            <div>
              <div className={'h5'}>
                <strong>{t('general.total-price')}:</strong> {renderTotalPrice()}€
              </div>
              <br />
              <div className={'h6'}>
                <strong>{t('general.total-price-by-catalog')}:</strong>
              </div>
              <p>{renderTotalPriceByCatalog()}</p>
            </div>
            <br />
            <center>
              <div className={'product-list-upload d-grid gap-2'}>
                {isMaintenanceMode === 'true' ? (
                  <></>
                ) : (
                  <>
                    {!isListUpdated ? (
                      <Button
                        onClick={updateList}
                        sx={{ textTransform: 'capitalize' }}
                        variant={'contained'}
                      >
                        {t('general.refresh-prices')}
                      </Button>
                    ) : (
                      <> </>
                    )}
                    <div>{renderListUpload()}</div>
                  </>
                )}
              </div>
            </center>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </center>
  );
}

/**
 *  Export `ProductList.
 */

export default ProductList;

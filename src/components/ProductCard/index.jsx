/* eslint-disable react/prop-types */
/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, Grid2 as Grid, Divider, CardContent, CardMedia, CardActions, Button, Typography, CardActionArea, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { LineChart } from '@mui/x-charts/LineChart';
//import { Divider } from 'antd';

/**
 * Function `ProductCard`.
 */

function ProductCard({ catalog, historyEnabled, locale, productData }) {
  let expanded = false;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.productList);

  const renderText = (value) => (value.length > 35 ? `${value.substring(0, 35)}...` : value);

  /**
   * Add to List.
   */

  const addToList = (event) => {
    event.preventDefault();
    const product = productList.find(
      (prod) => prod.key === `${locale}.${catalog}.${productData.reference}`
    );

    if (product) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity + 1
      };

      dispatch(productsActions.addToProductList(updatedProduct));
    } else {
      dispatch(
        productsActions.addToProductList({
          catalog,
          historyEnabled,
          key: `${locale}.${catalog}.${productData.reference}`,
          locale,
          product: productData,
          quantity: 1
        })
      );
    }
  };
  
  const Separator = () => {
    return (
    <Divider sx={{ 
      borderColor: theme => theme.palette.mode === 'light' 
        ? 'rgba(0, 0, 0, 0.5)' : 'inherit'
      }}
    />
    );
  };

  const handleExpandClick = () => {
    expanded = !expanded;
  };

  return (
    <Card sx={{ 
      width: 300, 
      margin: '8px', 
      flex: '1 0 auto', 
      backgroundColor: theme =>
        theme.palette.mode === 'light' 
          ? 'rgb(250, 250, 250)'
          : 'inherit',
      boxShadow: theme => theme.palette.mode === 'dark' 
        ? '0 0px 1px rgba(255, 255, 255, 0.3), 0 0px 5px rgba(255, 255, 255, 0.3)' 
        : '0 0px 1px rgba(0, 0, 0, 0.2), 0 0px 5px rgba(0, 0, 0, 0.2)', }}>
      <CardActionArea>

        <CardContent>
          <Typography>
            <b>{productData.name}</b>
          </Typography>
        </CardContent>

        <Separator/>
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 , backgroundColor: 'white'}}>
          <CardMedia component="img" sx={{ height: 100, width: 'auto', margin: '0 auto' }} image={productData.imageUrl} />
        </Box>
        <Separator/>

        <CardContent>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            <b>Price: </b>{productData.regularPrice}
          </Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            <b>Quantity: </b>{productData.quantity}
          </Typography>
        </CardContent>
        
        <Separator/>
          <LineChart 
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            height={130}
          />

          <IconButton aria-label="share" onClick={handleExpandClick}>
          <ExpandMoreIcon />
          </IconButton>
          
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {Object.entries(productData).map(([key, value]) => (
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              <b>{key}:</b> {value}
            </Typography>
          ))}
        </CardContent>
      </Collapse>
      
    </Card>

    // <div className={'product-card mb-2 mt-2 position-relative'}>
    //   <center>
    //     <img
    //       alt={''}
    //       className={'product-card-image'}
    //       referrerPolicy={'no-referrer'}
    //       src={productData.imageUrl ? productData.imageUrl : '-'}
    //     />
    //   </center>

    //   <div className={'product-card-info'}>
    //     <span className={'product-card-span'}>{t('data.product-fields.name')}</span>
    //     <p className={'product-card-text'}>
    //       {renderText(productData.name ? productData.name : '-')}
    //     </p>
    //   </div>

    //   <div className={'product-card-info'}>
    //     <span className={'product-card-span'}>{t('data.product-fields.regular-price')}</span>

    //     {productData.campaignPrice ? (
    //       <p className={'product-card-text'}>
    //         <s>{productData.regularPrice}</s> &nbsp; {productData.campaignPrice}
    //       </p>
    //     ) : (
    //       <p className={'product-card-text'}>
    //         {productData.regularPrice ? productData.regularPrice : '-'}
    //       </p>
    //     )}
    //   </div>

    //   <div className={'product-card-info'}>
    //     <span className={'product-card-span'}>{t('data.product-fields.price-per-quantity')}</span>
    //     <p className={'product-card-text'}>
    //       {renderText(productData.pricePerQuantity ? productData.pricePerQuantity : '-')}
    //     </p>
    //   </div>

    //   <div className={'product-card-info'}>
    //     <span className={'product-card-span'}>{t('data.product-fields.quantity')}</span>
    //     <p className={'product-card-text'}>
    //       {renderText(productData.quantity ? productData.quantity : '-')}
    //     </p>
    //   </div>

    //   <div className={'product-card-info'}>
    //     <span className={'product-card-span'}>{t('data.product-fields.brand')}</span>
    //     <p className={'product-card-text'}>
    //       {renderText(productData.brand ? productData.brand : '-')}
    //     </p>
    //   </div>

    //   <div className={'product-card-info'}>
    //     <span className={'product-card-span'}>{t('data.product-fields.description')}</span>
    //     <p className={'product-card-text'}>
    //       {renderText(productData.description ? productData.description : '-')}
    //     </p>
    //   </div>

    //   <center>
    //     <a
    //       href={productData.productUrl}
    //       rel={'noopener noreferrer'}
    //       target={'_blank'}
    //     >
    //       <button className={'product-card-button'}>{t('data.product-fields.store-page')}</button>
    //     </a>
    //     &nbsp;&nbsp;
    //     {historyEnabled ? (
    //       <Link
    //         target={'_self'}
    //         to={`/product/${locale}/${catalog}/${productData.reference}`}
    //       >
    //         <button className={'product-card-button'}>{t('data.product-fields.details')}</button>
    //       </Link>
    //     ) : (
    //       <></>
    //     )}
    //     &nbsp;&nbsp;
    //     <button
    //       className={'product-card-button'}
    //       onClick={addToList}
    //     >
    //       {t('data.product-fields.add-to-list')}
    //     </button>
    //   </center>

    //   {productData.campaignPrice ? (
    //     <span
    //       className={
    //         'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
    //       }
    //     >
    //       <br />
    //       <br />
    //       %
    //       <br />
    //       <br />
    //     </span>
    //   ) : (
    //     <></>
    //   )}
    // </div>
  );
}

/**
 * Export `ProductCard`.
 */

export default ProductCard;

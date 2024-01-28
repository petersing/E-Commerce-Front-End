import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Menu,  SvgIcon, Typography} from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import FilterNestedMenu from './FilterNestedMenu';
import { Categories_Data } from '../../../Public_Data/Categories_List';
import { Categories_List } from "../../../Public_Data/Categories_List";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ProductFilterItem = (props: {open: boolean, setopen: Dispatch<SetStateAction<boolean>>, 
                           setProductCategories: Dispatch<SetStateAction<string>>, ProductCategories: string,
                           setProductStatus: React.Dispatch<React.SetStateAction<string>>, ProductStatus: string,
                           setProductStock: React.Dispatch<React.SetStateAction<string>>, ProductStock: string}) => {
    const [ProductCategories, setProductCategories] = useState<string>(props.ProductCategories)
    const [ProductStatus, setProductStatus] = useState<string>(props.ProductStatus)
    const [ProductStock, setProductStock] = useState<string>(props.ProductStock)
    const CategoriesList =  Categories_List();
    const {t} = useTranslation()


    function Check_Icon(key: string){
        return(
            <>
            <Box sx={{display: 'flex', flexDirection: 'row'}}>
                {CategoriesList.map((item) => {
                    if (item.Category === key){
                        return(
                        <SvgIcon key={item.Category + 'image'} component={item.Image}/>
                        )
                    }else{return null}
                })}
                <Typography sx={{ml: '10px'}}>{t(`SellProduct.CategoriesType.${key}`)}</Typography>
            </Box>
            {<ChevronRightIcon/>}
          </>

        )
      }

    function SetProductStatusMethod(key: string){
        setProductStatus(key)
    
}
    function ApplyFilter(){
        props.setProductCategories(ProductCategories)
        props.setProductStatus(ProductStatus)
        props.setProductStock(ProductStock)
        props.setopen(false)
    }
    
  return (
    <Dialog open={props.open} onClose={() => props.setopen(false)}>
        <DialogTitle>Filter</DialogTitle>
        <DialogContent>
            <FilterNestedMenu Title="Product Categories" Value={ProductCategories} setValueFunction={setProductCategories} DataList={["All"].concat(Object.keys(Categories_Data))} ResponseFunction={Check_Icon}/>
            <FilterNestedMenu Title= "Product Status" Value={ProductStatus} setValueFunction={SetProductStatusMethod} DataList={['Normal', "Non-Normal", "All"]}/>
            <FilterNestedMenu Title= "Product Stock" Value={ProductStock} setValueFunction={setProductStock} DataList={["All", 'Enough', "SellOut", "Small"]}/>
        </DialogContent>
        <DialogActions>
            <Button  variant='contained' onClick={() => ApplyFilter()}>Apply</Button>
        </DialogActions>
    </Dialog>
  )
}

export default ProductFilterItem
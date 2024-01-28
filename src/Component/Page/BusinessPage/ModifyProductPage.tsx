import React, { Dispatch, SetStateAction, useReducer, useRef, useState } from 'react'
import { Grid, Box, Typography, Paper, TextField, InputAdornment, Menu, ListItemText, List, TableRow, Button, ListItem, Avatar, ListItemAvatar, IconButton, Fab, TableContainer, Table, TableHead, TableCell, Collapse, TableBody, FormControl, FormControlLabel, FormGroup, Checkbox, FormHelperText, Divider, FormLabel } from '@mui/material'
import { Management_Product_Object, SubItem_Object, User_Object } from '../../Public_Data/Interfaces'
import { useTranslation } from 'react-i18next'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Categories_Data } from '../../Public_Data/Categories_List';
import NestedMenu from '../../Dialog/SellProduct/NestedMenu';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import ChildrenProduct from '../../Dialog/SellProduct/ChildrenProduct';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import DescriptionVideoDialog from '../../Dialog/SellProduct/DescriptionVideoDialog';
import { Product_API } from '../../../API/Request';
import { useCookies } from 'react-cookie';
import { VideoGrid, ImageGrid, SubProductRow } from './CommonItem/CommonProductElement';


const ModifyProductPage = (props: {item: Management_Product_Object, setOpenModifyItem: Dispatch<SetStateAction<number | undefined>>}) => {
    const CategoriesSplit: string[] = props.item.Category.split('/')
    const [cookies] = useCookies()

    ///New Data
    const [RemoveSubItem] = useState<number[]>([])
    const [ProductType, setProductType] = useState<string>(CategoriesSplit.splice(CategoriesSplit.length - 1, 1)[0])
    const [Categories, setCategories] = useState<Array<string>>(CategoriesSplit)
    const [MainName, setMainName] = useState<string>(props.item.ProductName)
    const [Shipping, setShipping] = useState<string>(props.item.ShippingLocation)
    const [Children_Product] = useState<SubItem_Object[]>(props.item.SubItem)
    const [AboutProduct, setAboutProduct] = useState<string>(props.item.Description.join('\n'))
    const [DisableProduct, setDisableProduct] = useState<boolean>(props.item.ProductStatus)
    const [ProductVisibility, setProductVisibility] = useState<boolean>(true)


    ///Interface Item
    const [AnchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const [Open, setOpen] = useState<boolean>(false);

    ///Images
    const [Images] = useState<File[]>([])
    const [RemoveImages] = useState<string[]>([])
    const [RenderList] = useState<string[]>([])

    ///Description Images
    const [DescriptionImages] = useState<File[]>([])
    const [RemoveDescriptionImages] = useState<string[]>([])

    ///Video
    const [Video, setVideo] = useState<string[]>(props.item.DescriptionVideos)
    const [OpenDescriptionVideo, setOpenDescriptionVideo] = useState<boolean>(false);

    ///Children Item
    const [DisplayAdd, setDisplayAdd] = useState<boolean>(false)
    const [EditKey, setEditKey] = useState<number>()

    ///Input Function
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    const {t} = useTranslation()

    function OpenEditChildren(key: number): void{
        setEditKey(key)
        setDisplayAdd(true)
    }

    function remove(key: number){
        if (RemoveSubItem){
            RemoveSubItem.push(Children_Product[key].id)
        }
        Children_Product.splice(key, 1)
        forceUpdate()
    }

    function ModifyProductFunction(){
        Product_API.ModifyProduct({Description: AboutProduct, ProductName: MainName, ShippingLocation: Shipping, id: props.item.id,
                                   SubItem: Children_Product, Category: Categories.join('/') + '/'+ ProductType, Access_Token: cookies['access'], 
                                   RemoveImages: RemoveImages, RemoveSubItem: RemoveSubItem, RemoveDescriptionImages: RemoveDescriptionImages,
                                   DescriptionImages: DescriptionImages, Images: Images, ProductStatus: DisableProduct}).then((res) =>{
            if(res.status === 200){
                window.location.reload()
            }
        })
    }

    return (
        <Grid item md={14}> 
            <Grid container spacing={2}>
                <Grid item md={2.5}/>
                <Grid item md={4.5}>
                    <Typography variant="h5" sx={{mt: '15px', mb: '15px'}}>Modify Product</Typography>
                    <Paper variant="elevation" sx={{padding: '5px 20px 5px 20px', display: 'flex', flexDirection: 'column'}}>
                        <Typography variant="h6" sx={{mt: '10px'}}>Product Information</Typography>

                        <TextField size="small" disabled label={"ID"} sx={{mt: '20px'}} value={props.item.id}/>

                        <TextField size="small" error={MainName.length > 30 || MainName.length === 0? true: false} 
                                    label={t("SellProduct.ProductName")} sx={{mt: '10px'}} value={MainName} 
                                    onChange={(e) => {setMainName(e.target.value)}}/>

                        <TextField size="small" error={Shipping.length > 50 || Shipping.length === 0? true: false} 
                                label={t("SellProduct.ShippingLocation")} sx={{mt: '10px',mb: '10px'}} value={Shipping} onChange={(e) => {setShipping(e.target.value)}}/>
                        <div style={{display: 'flex'}}>
                            <TextField size='small' value={Categories.map((i) => t(`SellProduct.CategoriesType.${i}`)).join(' > ')} sx={{width: '50%', mr: '5px'}} label={t("SellProduct.Categories")} color="success"  InputProps={{readOnly: true}} focused />
                            <TextField size='small' value={t(`SellProduct.CategoriesType.${ProductType}`)} sx={{width: '50%'}}inputProps={{ style: {cursor: 'pointer'}}} autoFocus label={t("SellProduct.ProductType")} focused 
                                                onClick={(event) => {setAnchorElement(event.currentTarget); setOpen(true)}} 
                                                InputProps={{endAdornment: (
                                                <InputAdornment position='start'>
                                                <ArrowDropDownIcon />
                                                </InputAdornment>), readOnly: true}}/>
                            <Menu anchorEl={AnchorElement} open={Open} onClose={() => setOpen(false)} MenuListProps={{sx: { width: AnchorElement && AnchorElement.offsetWidth } }} >
                                {Object.keys(Categories_Data).map((key: string) => (
                                    <NestedMenu key={key} Nested_Data={Categories_Data[key]} Item_Key={key} ml={0} setCategories={setCategories} setProductType={setProductType} setClose={setOpen}/>
                                ))}
                            </Menu>
                        </div>
                        <TextField label={t("SellProduct.AboutProduct")} sx={{mt: '10px',mb: '10px'}} value={AboutProduct} multiline rows={4} 
                                        onChange={(e) => {setAboutProduct(e.target.value)}}/>


                        
                    </Paper>
                    <Paper variant="elevation" sx={{padding: '5px 20px 5px 20px', display: 'flex', flexDirection: 'column', mt: '20px'}}>
                        <Typography variant="h6" sx={{mt: '10px'}}>Children Product</Typography>
                        <TableContainer sx={{mb: '10px'}}>
                            <Table size={'medium'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding='none'/>
                                        <TableCell align='left' padding="none">Product Name</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Sell</TableCell>
                                        <TableCell padding='none'/>
                                        <TableCell padding='none'/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Children_Product.map((item, index) => {
                                        return(
                                            <SubProductRow key={"SubProductRow" + index} SubItem={item} index={index} openChildrenEdit={OpenEditChildren} remove={remove}/>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>       
                        <div style={{display: 'flex', flexFlow: "row-reverse", marginBottom: '10px', marginTop: '25px'}} onClick={() => setDisplayAdd(true)}>
                            <Fab color="primary" aria-label="add" size="small" >
                                <AddIcon/>
                            </Fab>
                        </div>
                    </Paper>
                    <Paper variant="elevation" sx={{padding: '5px 20px 5px 20px', display: 'flex', flexDirection: 'column', mt: '20px'}}>
                        <Typography variant="h6" sx={{mt: '10px'}}>Description Media</Typography>
                        <ImageGrid Name={"Image"} PreviousImages={props.item.Images} Images={Images} RenderList={RenderList} RemoveList={RemoveImages} forceUpdate={forceUpdate}/>
                        <ImageGrid Name={"Description Image"} PreviousImages={props.item.DescriptionImages} Images={DescriptionImages} RenderList={RenderList} RemoveList={RemoveDescriptionImages} forceUpdate={forceUpdate}/>
                    </Paper>
                    <Paper variant="elevation" sx={{padding: '5px 20px 5px 20px', display: 'flex', flexDirection: 'column', mt: '20px'}}>
                        <Typography variant="h6" sx={{mt: '10px'}}>Description Video</Typography>
                        <VideoGrid VideoList={Video} setVideo={setVideo} Addvideo = {() => setOpenDescriptionVideo(true)}/>
                    </Paper>
                </Grid>
                <Grid item md={2}>
                    <Paper variant="elevation" sx={{padding: '5px 20px 5px 20px', display: 'flex', flexDirection: 'column', mt: '63px'}}>
                        <Typography variant="h6" sx={{mt: '10px', fontSize: "18px"}}>Product Status</Typography>
                        <FormGroup sx={{mt: '10px'}}>
                            <FormControlLabel control={<Checkbox icon={<PanoramaFishEyeIcon/>} checkedIcon={<RadioButtonCheckedIcon/>}/>} label="Enabled" checked={DisableProduct} onClick={(e) => setDisableProduct(true)}/>
                            <FormControlLabel control={<Checkbox icon={<PanoramaFishEyeIcon/>} checkedIcon={<RadioButtonCheckedIcon/>}/>} label="Disable" checked={!DisableProduct} onClick={(e) => setDisableProduct(false)} />
                            <FormHelperText>Note: If you disable the product, it does not mean that the product is deleted, its functions are just not visible to the public.</FormHelperText>
                        </FormGroup>
                    </Paper>
                    <Paper variant="elevation" sx={{padding: '5px 20px 5px 20px', display: 'flex', flexDirection: 'column', mt: '25px'}}>
                        <Typography variant="h6" sx={{mt: '10px', fontSize: "18px"}}>Product Visibility</Typography>
                        <FormGroup sx={{mt: '10px'}}>
                            <FormControlLabel control={<Checkbox icon={<PanoramaFishEyeIcon/>} checkedIcon={<RadioButtonCheckedIcon/>}/>} label="Enabled" checked={ProductVisibility} onClick={(e) => setProductVisibility(true)}/>
                            <FormControlLabel control={<Checkbox icon={<PanoramaFishEyeIcon/>} checkedIcon={<RadioButtonCheckedIcon/>}/>} label="Disable" checked={!ProductVisibility} onClick={(e) => setProductVisibility(false)} />
                            <FormHelperText>Note: This feature determines whether other users can search for your product through search engines. If you disable this feature, it does not mean that the product cannot be accessed.</FormHelperText>
                        </FormGroup>
                    </Paper>
                </Grid>
                <Grid item md={3}/>
            </Grid>
            <Grid container spacing={2} sx={{mt: '10px'}}>
                <Grid item md={2.5}/>
                <Grid item md={6.5}>
                    <Divider/>
                    <div style={{display: 'flex', justifyContent: "space-between"}}>
                        <Button variant="contained" sx={{mt: '10px', mb: '10px', backgroundColor: 'red'}} onClick={() => {props.setOpenModifyItem(undefined)}}>Cancel</Button>
                        <Button variant="contained" sx={{mt: '10px', mb: '10px'}} onClick={() => {ModifyProductFunction()}}>Save</Button>
                    </div>
                </Grid>
                <Grid item md={3}/>
            </Grid>
            
            <ChildrenProduct Product={Children_Product} setDisplay={setDisplayAdd} Display={DisplayAdd} subkey={EditKey} setsubkey={setEditKey} RemoveList={RemoveSubItem}/>
            <DescriptionVideoDialog open={OpenDescriptionVideo} onclose={setOpenDescriptionVideo} forceUpdate={forceUpdate} VideoList={Video} setVideoList ={setVideo}/>
        </Grid>
    )
}

export default ModifyProductPage
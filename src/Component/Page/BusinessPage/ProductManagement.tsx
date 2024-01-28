import { Grid, Box, Collapse, Typography , Paper, TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Toolbar, Tooltip, IconButton, TableContainer, Table, TableBody, TablePagination} from '@mui/material'
import { alpha} from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Dispatch, SetStateAction, useEffect,useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client'
import { ParseGraphQLData } from '../../Public_Data/Public_Application';
import { Management_Product_Object, User_Object } from '../../Public_Data/Interfaces';
import NotFound from '../../../assets/NotFound.png'
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ManagementLeftNavBar from '../../AddComponect/Management/ManagementLeftNavBar';
import ModifyProductPage from './ModifyProductPage';
import EditIcon from '@mui/icons-material/Edit';
import ProductFilterItem from './CommonItem/ProductFilter';

const GetUserProduct = gql`
query UserProduct($start: Int!, $end: Int!, $StockType: String, $StatusType: String, $CategoriesType: String) {
    PersonalProductManagement(Start: $start, End: $end, StockType: $StockType, CategoryType: $CategoriesType, Status: $StatusType) {,
        Product{
          Description,
          id,
          Author,
          ProductName,
          ShippingLocation,
          Images,
          DescriptionImages,
          DescriptionVideos,
          Category,
          SubItem,
          ProductStatus
        },
        Count
    },
}
`


const headCells: readonly any[] = [
{
    id: 'Image',
    numeric: false,
    disablePadding: true,
    label: '',
},
{
    id: 'ProductName',
    numeric: false,
    disablePadding: true,
    label: 'Product Name',
},
{
    id: 'Stock',
    numeric: true,
    disablePadding: false,
    label: 'Stock',
},
{
    id: 'Sell',
    numeric: true,
    disablePadding: false,
    label: 'Sell',
},
{
    id: 'Catalogy',
    numeric: true,
    disablePadding: false,
    label: 'Catalogy',
},
{
    id: 'Status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
},
{
    id : "Edit",
    numeric: true,
    disablePadding: false,
    label: '',
}

];

function EnhancedTableHead(props: {SelectAll: () => void, rowCount: number, numSelected: number}) {
    return (
      <TableHead>
        <TableRow>
            <TableCell padding='none'/>
          {headCells.map((headCell) => (
            <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} padding={headCell.disablePadding ? 'none' : 'normal'}>
              <TableSortLabel direction={'asc'} onClick={() => {}}>
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell padding="checkbox">
            <Checkbox color="primary" inputProps={{'aria-label': 'select all desserts',}} onClick={() => props.SelectAll()}/>
          </TableCell>
        </TableRow>
      </TableHead>
    );
}

function EnhancedTableToolbar(props: {numSelected: number, setOpenFilter: Dispatch<SetStateAction<boolean>>}) {
    const { numSelected } = props;
    return (
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && {bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3)})}}>
        {numSelected > 0 ? (
            <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                {numSelected} selected
            </Typography>
        ) : (
            <Typography  sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                Products
            </Typography>
        )}
        {numSelected > 0 ? (
            <Tooltip title="Delete">
                <IconButton>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        ) : (
            <Tooltip title="Filter list">
                <IconButton onClick={() => props.setOpenFilter(true)}>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        )}
        </Toolbar>
    );
}

function Row(props: {setOpenModifyItem: Dispatch<SetStateAction<number | undefined>> , setSelect: (id: number) => void, isSelected: (id: number) => boolean,  index: number, row: Management_Product_Object} ){
    const isItemSelected = props.isSelected(props.row.id);
    const labelId = `enhanced-table-checkbox-${props.index}`;
    const [open, setOpen] = useState<boolean>(false)
    return (
        <>
            <TableRow hover role="checkbox" aria-checked={isItemSelected} 
                    tabIndex={-1} key={props.row.id} selected={isItemSelected} sx={{ cursor: 'pointer' }}
                    >
                <TableCell padding='checkbox'>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell width="5%">
                    <img src={props.row.Images[0] ? props.row.Images[0] : NotFound} alt="order" style={{maxHeight: '50px', width: '50px', objectFit: 'contain'}}/>
                </TableCell>
                <TableCell component="th" id={labelId} scope="row" padding="none">
                    {props.row.ProductName}
                </TableCell>
                <TableCell align="right">{props.row.SubItem.reduce((pre, item) => pre+ item.Quantity, 0)}</TableCell>
                <TableCell align="right">{props.row.SubItem.reduce((pre, item) => pre+ item.Sell, 0)}</TableCell>
                <TableCell align="right">{props.row.Category}</TableCell>
                <TableCell align="right">{props.row.ProductStatus ? <CircleIcon sx={{scale: '0.5', color: 'green'}}/>: <CircleIcon sx={{scale: '0.5', color: "reb"}}/>}</TableCell>
                <TableCell align="right" onClick={() => props.setOpenModifyItem(props.row.id)}>
                    {<IconButton>
                        <EditIcon/>
                    </IconButton>}
                </TableCell>
                <TableCell padding="checkbox">
                    <Checkbox color="primary" checked={isItemSelected} inputProps={{'aria-labelledby': labelId,}} onClick={(event) => props.setSelect(props.row.id)}/>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Sub-Product
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Type</TableCell>
                                        <TableCell>price ($)</TableCell>
                                        <TableCell align="right">Stock</TableCell>
                                        <TableCell align="right">Sell</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.row.SubItem.map((SubRow, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {SubRow.Name}
                                            </TableCell>
                                            <TableCell>{SubRow.Price}</TableCell>
                                            <TableCell align="right">{SubRow.Quantity}</TableCell>
                                            <TableCell align="right">{SubRow.Sell}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
        
    );
}

const ProductManagement = (props: {User: User_Object|undefined}) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [ProductData , setProductData] = useState<Management_Product_Object[]>([])
    const [ProductCount, setProductCount] = useState<number>(0)
    const [StockType, setStockType] = useState<string>('All')
    const [StatusType, setStatusType] = useState<string>("All")
    const [CategoriesType, setCategoriesType] = useState<string>('All')
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [ProductDataFunction] = useLazyQuery<{PersonalProductManagement: {Product: any, Count: number}}>(GetUserProduct,{fetchPolicy: 'no-cache'})
    const [SelectAllItem, setSelectAllItem] = useState<boolean>(false)
    const [openModifyItem, setOpenModifyItem] = useState<number|undefined>()
    const [openFilter, setOpenFilter] = useState<boolean>(false)

    document.body.style.backgroundColor = "rgb(246, 246, 247)";
    

    useEffect(() =>{
        ProductDataFunction({variables: {start: (page)*rowsPerPage, end: rowsPerPage*(page+1), StockType: StockType, StatusType: StatusType, CategoriesType: CategoriesType}}).then((res) =>{
            if (res.data){
            const DataList : Management_Product_Object[] = res.data.PersonalProductManagement.Product.map((item:any) => {
              return(
                ParseGraphQLData(item)
              )     
            })
            setProductData(DataList)
            setProductCount(res.data.PersonalProductManagement.Count)
            if (SelectAllItem){
                setSelected((pre) => pre.concat(DataList.map((item) => item.id)))
            }
          }  
        })
    },[ProductDataFunction, props.User, page, StatusType, CategoriesType, StockType, SelectAllItem, rowsPerPage])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const SelectItem = (id: number) => {
        if (selected.indexOf(id) === -1){
            setSelected((pre) => pre.concat(id))
        }else{
            setSelected((pre) => pre.filter((item) => item !== id))
        }

    }

    const SelectAll = () => {
        if (SelectAllItem){
            setSelected([])
            setSelectAllItem(false)
        }else{
            setSelectAllItem(true)
            setSelected(ProductData.map((item) => item.id))
        }
    }
    
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    
      // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = Math.max(0, rowsPerPage - ProductData.length)
    
  return (
    <>
        <Box sx={{width: '100%', mt: '130px', left: '0',position: 'relative'}}>
            <Grid container spacing={2} columns={16}>
                <ManagementLeftNavBar/>
                <Grid item md={14} display={openModifyItem ? "none" : "flex"}>
                    <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <EnhancedTableToolbar numSelected={SelectAllItem ? ProductCount : selected.length} setOpenFilter={setOpenFilter} />
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                                    <EnhancedTableHead numSelected={selected.length} rowCount={ProductCount} SelectAll={SelectAll}/>
                                    <TableBody>
                                        {ProductData.map((row, index) => {
                                            return (
                                                <Row setOpenModifyItem={setOpenModifyItem} setSelect={SelectItem} key={index} index={index} row={row} isSelected={isSelected}/>
                                            )                     
                                        })}
                                        {emptyRows > 0 && (
                                            <TableRow style={{height: 53 * emptyRows,}}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={ProductCount} rowsPerPage={rowsPerPage} 
                                            page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Box>
                </Grid>
                {openModifyItem ? <ModifyProductPage item={ProductData.filter((item) => item.id === openModifyItem)[0]} setOpenModifyItem={setOpenModifyItem}/>: <></>}
                <ProductFilterItem open={openFilter} setopen={setOpenFilter} 
                            setProductCategories={setCategoriesType} ProductCategories={CategoriesType}
                            setProductStatus={setStatusType} ProductStatus={StatusType}
                            setProductStock={setStockType} ProductStock={StockType}/>
            </Grid>
        </Box>
    </>
    
  )
}

export default ProductManagement
import { Grid, Box, Collapse, Typography , Paper, TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Toolbar, Tooltip, IconButton, TableContainer, Table, TableBody, TablePagination, ListItemText, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions, Button} from '@mui/material'
import { alpha} from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Dispatch, SetStateAction, useEffect,useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { Management_Product_Object, User_Object } from '../../Public_Data/Interfaces';
import NotFound from '../../../assets/NotFound.png'
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ManagementLeftNavBar from '../../AddComponect/Management/ManagementLeftNavBar';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddModifyCategories from './AddModifyCategories';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';


const GetCategoriesData = gql`
query Categories {
    Categories {
        Category
        TotalSell
        Status
        id
        Product {
            id
            ProductName
            FirstImage
            ProductStatus
        }
        
    }
}

`

const ChangeCategoriesProperties = gql`
mutation ChangeCategoriesProperties($id: Int!, $status: Boolean!) {
    ChangeCategoriesProperties(ID: $id, Status: $status){
        status
    }
}
`

const headCells: readonly any[] = [
    {
        id: 'Category',
        numeric: false,
        disablePadding: true,
        label: 'Category',
    },
    {
        id: 'TotalSell',
        numeric: true,
        disablePadding: false,
        label: 'Total Sell',
    },
    {
        id: 'Status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    }
    ];

interface EnhancedTableHeadProps {
    SelectAll: () => void, rowCount: number, numSelected: number
    setOpenAddOrModifyCategory: Dispatch<SetStateAction<number|undefined>>
}

interface CategoriesProps {
    id: number, 
    Category: string, 
    TotalSell: number, 
    Status : boolean,
    Product: {id: string, ProductName: string, FirstImage: string, ProductStatus: boolean}[]
}

interface RowProp{
    setSelect: (id: number) => void, isSelected: (id: number) => boolean,  index: number, 
    row: CategoriesProps
    setOpenAddOrModifyCategory: Dispatch<SetStateAction<number|undefined>>

}

function EnhancedTableHead({SelectAll, setOpenAddOrModifyCategory}: EnhancedTableHeadProps) {
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
          <TableCell align={"right"} padding="normal">
            <IconButton onClick={() => setOpenAddOrModifyCategory(-1)}>
                <AddIcon/>
            </IconButton>
          </TableCell>
          <TableCell padding="checkbox">
            <Checkbox color="primary" inputProps={{'aria-label': 'select all desserts',}} onClick={() => SelectAll()}/>
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
                Categories
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

function ApplyPropertiesToCategories(props:{Categories: CategoriesProps|undefined, setClose: Dispatch<SetStateAction<CategoriesProps | undefined>>}){
    const [Status, setStatus] = useState<boolean>(props.Categories?.Status ? true : false)
    const [GetCategoriesPropertiesChange] = useMutation<{ChangeCategoriesProperties: {status: boolean}}>(ChangeCategoriesProperties)

    useEffect(() => {
        if (props.Categories){
            setStatus(props.Categories.Status)
        }
    }, [props.Categories])

    function CheckStatusChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        if (e.target.value === "Disable"){
            setStatus(false)
        }else{
            setStatus(true)
        }
    }

    return(
        <Dialog open={props.Categories ? true: false} onClose={() => props.setClose(undefined)}>
            <DialogTitle>
                <Typography variant="h6" gutterBottom component="div">
                    Categories Properties
                </Typography>
            </DialogTitle>
            <DialogContent>
                <TextField label="id" value={props.Categories?.id || ''} disabled fullWidth sx={{mt: '8px'}}/>
                <TextField label="Category" value={props.Categories?.Category || ''} disabled fullWidth sx={{mt: '8px'}}/>
                <TextField label="Status" select fullWidth sx={{mt: '8px'}} value={Status? "Able": "Disable"} onChange={(e) => CheckStatusChange(e)}>
                    {["Able", "Disable"].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setClose(undefined)}>Cancel</Button>
                <Button onClick={() => {
                    GetCategoriesPropertiesChange({variables: {id: props.Categories?.id, status: Status}}).then((res) => {
                        if (res.data?.ChangeCategoriesProperties.status){
                            props.setClose(undefined)
                            window.location.reload()
                        }
                    })
                }}>Apply</Button>
            </DialogActions>
        </Dialog>
    )
}

function Row(props: RowProp){
    const isItemSelected = props.isSelected(props.row.id);
    const labelId = `enhanced-table-checkbox-${props.index}`;
    const [open, setOpen] = useState<boolean>(false)
    const [openModify, setOpenModify] = useState<CategoriesProps>()
    return (
        <>
            <TableRow hover role="checkbox" aria-checked={isItemSelected} 
                    tabIndex={-1} key={props.row.id} selected={isItemSelected} sx={{ cursor: 'pointer' }}>
                <TableCell padding='checkbox'>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" id={labelId} scope="row" padding="none">
                    {props.row.Category}
                </TableCell>
                <TableCell align="right">{props.row.TotalSell}</TableCell>
                <TableCell align="right">{props.row.Status ? <CircleIcon sx={{scale: '0.5', color: 'green'}}/>: <CircleIcon sx={{scale: '0.5', color: "reb"}}/>}</TableCell>
                <TableCell align="right">
                    {<IconButton onClick={() => props.setOpenAddOrModifyCategory(props.row.id)}>
                        <EditIcon/>
                    </IconButton>}
                </TableCell>
                <TableCell align="right">
                    {<AssignmentIcon onClick={() => setOpenModify(props.row)}>
                        <EditIcon/>
                    </AssignmentIcon>}
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
                                Product Information
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding={'none'}></TableCell>
                                        <TableCell component="th" scope="row">Product Name</TableCell>
                                        <TableCell scope="row" padding="normal" align="center">Product Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.row.Product.map((SubRow, index) => {
                                        return(
                                            <TableRow key={index}>
                                                <TableCell width="5%">
                                                    <img src={SubRow.FirstImage ? SubRow.FirstImage : NotFound} alt="order" style={{maxHeight: '50px', width: '50px', objectFit: 'contain'}}/>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <ListItemText primary={SubRow.ProductName} secondary={SubRow.id}/>
                                                </TableCell>
                                                <TableCell scope="row" padding="normal" align="center">{SubRow.ProductStatus ? <CircleIcon sx={{scale: '0.5', color: 'green'}}/>: <CircleIcon sx={{scale: '0.5', color: "reb"}}/>}</TableCell>
                                            </TableRow>
                                        )
          
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <ApplyPropertiesToCategories Categories={openModify} setClose={setOpenModify}/>
        </>
        
    );
}

const CategoriesPage = (props: {User: User_Object|undefined}) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [ProductData , setProductData] = useState<Management_Product_Object[]>([])
    const [ProductCount, setProductCount] = useState<number>(0)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [SelectAllItem, setSelectAllItem] = useState<boolean>(false)
    const [openFilter, setOpenFilter] = useState<boolean>(false)
    const [openAddOrModifyCategory, setOpenAddOrModifyCategory] = useState<number>()
    const [ProductDataFunction] = useLazyQuery<{Categories: CategoriesProps[]}>(GetCategoriesData, {fetchPolicy: 'no-cache'})
    const [Data, setData] = useState<CategoriesProps[]>([])

    document.body.style.backgroundColor = "rgb(246, 246, 247)";
    

    useEffect(() => {
        ProductDataFunction().then((res) => {
            if (res.data){
                setData(res.data.Categories)
            }
        })
    }, [])


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

    function FilterTargetData(){
        return Data.find((item) => {
            if (item.id == openAddOrModifyCategory){
                return true
            }
        })
    }

    
  return (
    <>
        <Box sx={{width: '100%', mt: '130px', left: '0',position: 'relative'}}>
            <Grid container spacing={2} columns={16}>
                <ManagementLeftNavBar/>
                <Grid item md={14}>
                    <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <EnhancedTableToolbar numSelected={SelectAllItem ? ProductCount : selected.length} setOpenFilter={setOpenFilter} />
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                                    <EnhancedTableHead setOpenAddOrModifyCategory={setOpenAddOrModifyCategory} numSelected={selected.length} rowCount={ProductCount} SelectAll={SelectAll}/>
                                    <TableBody>
                                        {Data.map((row, index) => {
                                            return (
                                                <Row setOpenAddOrModifyCategory={setOpenAddOrModifyCategory} setSelect={SelectItem} key={index} index={index} row={row} isSelected={isSelected}/>
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
            </Grid>
        </Box>
        <AddModifyCategories User={props.User} Open={openAddOrModifyCategory !== undefined} setOpenAddOrModifyCategory={setOpenAddOrModifyCategory} ModifyTargetData={FilterTargetData()}/>
    </>
    
  )
}

export default CategoriesPage
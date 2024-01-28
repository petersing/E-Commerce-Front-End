import { Grid, Box, Collapse, Typography , Paper, TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Toolbar, Tooltip, IconButton, TableContainer, Table, TableBody, TablePagination, ListItemText} from '@mui/material'
import { alpha} from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import React, { Dispatch, SetStateAction, useEffect,useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { User_Object } from '../../Public_Data/Interfaces';
import NotFound from '../../../assets/NotFound.png'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ManagementLeftNavBar from '../../AddComponect/Management/ManagementLeftNavBar';
import { useTranslation } from 'react-i18next'
import OrderFilter from './CommonItem/OrderFilter';
import { ReturnItem } from "../../Public_Data/Interfaces";
import CheckIcon from '@mui/icons-material/Check';
import ConfirmDialog from './CommonItem/ConfirmDialog';

const GetReturnData = gql`
query ReturnProduct($Start: Int!, $End: Int!, $Filter: String!) {
    ReturnProduct(Start: $Start, End: $End, Filter: $Filter, Identity: "Seller") {
        ReturnProduct{
            BuyerName, ReturnStatus, ReturnStatusState, id, ReturnTransportCode, ErrorReason
            SubItem {
                Name, Price, Count
            },
            Order{
                ProductTitle, OrderImage
            }
        }
        Count
    }
}
`

const headCells: readonly any[] = [
{
    id: 'Return ID',
    numeric: false,
    disablePadding: true,
    label: 'Return ID',
},
{
    id: 'BuyerName',
    numeric: false,
    disablePadding: false,
    label: 'Buyer Name',
},
{
    id: 'Status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
},
{
    id: "ReturnReason",
    numeric: false,
    disablePadding: false,
    label: 'Return Reason',
},
{
    id: 'TransportCode',
    numeric: true,
    disablePadding: false,
    label: 'Transport Code',
},
{
    id: "Confirm",
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
            <Checkbox color="primary" inputProps={{'aria-label': 'select all items',}} onClick={() => props.SelectAll()}/>
          </TableCell>
        </TableRow>
      </TableHead>
    );
}

function EnhancedTableToolbar(props: {numSelected: number, setOpenFilter: React.Dispatch<React.SetStateAction<boolean>>}) {
    const { numSelected } = props;
    return (
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && {bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3)})}}>
        {numSelected > 0 ? (
            <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                {numSelected} selected
            </Typography>
        ) : (
            <Typography  sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                Return Orders
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

function Row(props: {setSelect: (id: number) => void, isSelected: (id: number) => boolean,  index: number, row: ReturnItem, SetID: React.Dispatch<React.SetStateAction<number | undefined>>}){
    const isItemSelected = props.isSelected(props.row.id);
    const labelId = `enhanced-table-checkbox-${props.index}`;
    const [open, setOpen] = useState<boolean>(false)
    const {t} = useTranslation()

    function CheckStatusColor(Status: string){
        if (Status === 'Wait for Process'){
            return 'orange'
        }else if (Status === 'Returning'){
            return 'blue'
        }else if (Status === 'Finish'){
            return 'green'
        }else if (Status === 'Rejected'){
            return 'red'
        }else{
            return 'black'
        }
    }

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
                <TableCell component="th" id={labelId} scope="row" padding="none">
                    {props.row.id}
                </TableCell>
                <TableCell align="left">{props.row.BuyerName}</TableCell>
                <TableCell align="left" sx={{color: CheckStatusColor(props.row.ReturnStatusState)}}>{props.row.ReturnStatusState}</TableCell>
                <TableCell align="left">{props.row.ErrorReason}</TableCell>
                <TableCell align="right">{props.row.ReturnTransportCode}</TableCell>
                <TableCell align="right">
                    {props.row.ReturnStatusState === 'Wait for Process' || props.row.ReturnStatusState === 'Returning' ?
                        <IconButton onClick={() => props.SetID(props.row.id)}>
                            <CheckIcon/>
                        </IconButton>
                    : null}
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
                                        <TableCell>Product Information</TableCell>
                                        <TableCell>Product Properties</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell width="5%">
                                            <img src={props.row.Order.OrderImage ? props.row.Order.OrderImage : NotFound} alt="order" style={{maxHeight: '50px', width: '50px', objectFit: 'contain'}}/>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                        <ListItemText primary={props.row.Order.ProductTitle} secondary={props.row.SubItem.Name}/>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <ListItemText primary={`${props.row.SubItem.Count} ${t("Business.Units")}`} secondary={`HKD$${props.row.SubItem.Price}`}  sx={{ml: '5px'}}/>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}


const NewReturnPage = (props: {User: User_Object|undefined}) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [ReturnData , setReturnData] = useState<ReturnItem[]>([])
    const [Count, setCount] = useState<number>(0)
    const [Type, setType] = useState<string>('All')
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [GetReturnDataFunction] = useLazyQuery<{ReturnProduct: {ReturnProduct: ReturnItem[], Count: number}}>(GetReturnData, {fetchPolicy: 'no-cache'}) 
    const [SelectAllItem, setSelectAllItem] = useState<boolean>(false)
    const [openFilter, setOpenFilter] = useState<boolean>(false)
    const [Status, setStatus] = useState<string>("All")
    const [TransportStatus, setTransportStatus] = useState<string>("All")
    const [OrderStatus, setOrderStatus] = useState<string>("All")
    const [ConfirmID, setConfirmID] = useState<number| undefined>()

    document.body.style.backgroundColor = "rgb(246, 246, 247)";

    useEffect(() =>{
        GetReturnDataFunction({variables: {Start: (page)*rowsPerPage, End: rowsPerPage*(page+1), Filter: "All"}}).then((res) =>{
          if (res.data){
            setReturnData(res.data.ReturnProduct.ReturnProduct)
            setCount(res.data.ReturnProduct.Count)
          }  
        })
    },[GetReturnDataFunction, props.User, page, Type, SelectAllItem, rowsPerPage, Status, OrderStatus, TransportStatus])



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
            setSelected(ReturnData.map((item) => item.id))
        }
    }
    
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    
      // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = Math.max(0, rowsPerPage - ReturnData.length)
    
  return (
    <>
        <Box sx={{width: '100%', mt: '130px', left: '0',position: 'relative'}}>
            <Grid container spacing={2} columns={16}>
                <ManagementLeftNavBar/>
                <Grid item md={14}>
                    <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <EnhancedTableToolbar numSelected={SelectAllItem ? Count : selected.length} setOpenFilter={setOpenFilter}/>
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                                    <EnhancedTableHead numSelected={selected.length} rowCount={Count} SelectAll={SelectAll}/>
                                    <TableBody>
                                        {ReturnData.map((row, index) => {
                                            return (
                                                <Row  setSelect={SelectItem} key={index} index={index} row={row} isSelected={isSelected} SetID={setConfirmID}/>
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
                            <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={Count} rowsPerPage={rowsPerPage} 
                                            page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        <OrderFilter open={openFilter} setopen={setOpenFilter} 
                     Status={Status} setStatus={setStatus}
                     TransportStatus={TransportStatus} setTransportStatus={setTransportStatus} 
                     OrderStatus={OrderStatus} setOrderStatus={setOrderStatus}/>
        {ConfirmID ? <ConfirmDialog open={ConfirmID ? true : false} setOpen={setConfirmID} id={ConfirmID}/> : null}
</>

)
}


export default NewReturnPage
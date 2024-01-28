import { Grid, Box, Collapse, Typography , Paper, TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Toolbar, Tooltip, IconButton, TableContainer, Table, TableBody, TablePagination, ListItemText} from '@mui/material'
import { alpha} from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import React, { Dispatch, SetStateAction, useEffect,useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client'
import { Management_Product_Object, Seller_Order_List_Object, User_Object } from '../../Public_Data/Interfaces';
import NotFound from '../../../assets/NotFound.png'
import NoCrashIcon from '@mui/icons-material/NoCrash';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ManagementLeftNavBar from '../../AddComponect/Management/ManagementLeftNavBar';
import { useTranslation } from 'react-i18next'
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AddTransportCodeDialog from '../../Dialog/Order/AddTransportCodeDialog';
import ReturnPaymentDialog from '../../Dialog/Payment/ReturnPaymentDialog';
import OrderFilter from './CommonItem/OrderFilter';

const GetOrderData = gql`
query OrderListSeller($Start: Int!, $End: Int!,$Status: String, $TransportStatus: String, $OrderStatus: String) {
    OrderListSeller(Start:$Start, End:$End, Status: $Status, TransportStatus: $TransportStatus, OrderStatus: $OrderStatus) {
        Orders{
            id, BuyerName, DateCreate, OrderProcess, Phone, Address, DeliveryMethod, Status, TransportCode, PaymentStatus, isComplete,
            OrderList{
                ProductTitle, OrderImage, id,
                SubItem{
                    Name, Status, Price, Count, id
                }
            }  
        }
        Count
    }
}
`


const headCells: readonly any[] = [
{
    id: 'OrderID',
    numeric: false,
    disablePadding: true,
    label: 'Order ID',
},
{
    id: 'BuyerName',
    numeric: true,
    disablePadding: false,
    label: 'Buyer Name',
},
{
    id: 'Address',
    numeric: true,
    disablePadding: false,
    label: 'Address',
},
{
    id: 'PhotoNumber',
    numeric: true,
    disablePadding: false,
    label: 'Photo Number',
},
{
    id: 'Status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
},
{
    id: 'TransportStatus',
    numeric: true,
    disablePadding: false,
    label: 'Transport Status',
},
{
    id: 'Payment Status',
    numeric: true,
    disablePadding: false,
    label: 'Payment Status',
},
{
    id : "Order Status",
    numeric: true,
    disablePadding: false,
    label: 'Order Status',
},
{
    id : "AddTransportCode",
    numeric: true,
    disablePadding: false,
    label: '',
},
{
    id : "ReturnPayment",
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
                Orders
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

function Row(props: {setSelect: (id: number) => void, isSelected: (id: number) => boolean,  index: number, row: Seller_Order_List_Object,
                     setAddTransportCodeKey: React.Dispatch<React.SetStateAction<{CodeKey: number, Change: Boolean} | null>>,
                     setReturnPaymentOrder: React.Dispatch<React.SetStateAction<Seller_Order_List_Object | null>>}){
    const isItemSelected = props.isSelected(props.row.id);
    const labelId = `enhanced-table-checkbox-${props.index}`;
    const [open, setOpen] = useState<boolean>(false)
    const {t} = useTranslation()
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
                <TableCell align="right">{props.row.BuyerName}</TableCell>
                <TableCell align="right">{props.row.Address}</TableCell>
                <TableCell align="right">{props.row.Phone}</TableCell>
                <TableCell align="right" sx={{color: (props.row.Status === "normal"? "green": props.row.Status === "cancel"? "red": "yellow")}}>{props.row.Status}</TableCell>
                <TableCell align="right">{props.row.TransportCode}</TableCell>
                <TableCell align="right" >{props.row.PaymentStatus}</TableCell>
                <TableCell align='right'>{props.row.isComplete ? "Finish" : "Process"}</TableCell>
                <TableCell align="right">
                    {<IconButton disabled={props.row.isComplete} onClick={() => props.setAddTransportCodeKey({CodeKey: props.row.id, Change: props.row.OrderProcess >= 3})}>
                        <NoCrashIcon/>
                    </IconButton>}
                </TableCell>
                    <TableCell align="right" sx={{display: (props.row.isComplete? "": '')}}>
                    {<IconButton disabled={props.row.Status === "cancel"} onClick={() => props.setReturnPaymentOrder(props.row)}>
                        <MoneyOffIcon/>
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
                                Order Information
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding={'none'}></TableCell>
                                        <TableCell>Product Information</TableCell>
                                        <TableCell>Product Properties</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.row.OrderList.map((SubRow, index) => {
                                        return(
                                            <React.Fragment key={index}>
                                                {SubRow.SubItem.map((SubItem, index) => {
                                                    return(
                                                        <TableRow key={index}>
                                                            <TableCell width="5%">
                                                                <img src={SubRow.OrderImage ? SubRow.OrderImage : NotFound} alt="order" style={{maxHeight: '50px', width: '50px', objectFit: 'contain'}}/>
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                            <ListItemText primary={SubRow.ProductTitle} secondary={SubItem.Name}/>
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                <ListItemText primary={`${SubItem.Count} ${t("Business.Units")}`} secondary={`HKD$${SubItem.Price}`}  sx={{ml: '5px'}}/>
                                                            </TableCell>
                                                            <TableCell sx={{color: (SubItem.Status === "normal"? "green": SubItem.Status === "cancel"? "red": "yellow")}}>{SubItem.Status}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </React.Fragment>
                                        )
          
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}


const NewOrderPage = (props: {User: User_Object|undefined}) => {
    const [selected, setSelected] = useState<number[]>([]);
    const [OrderData , setOrderData] = useState<Seller_Order_List_Object[]>([])
    const [ProductCount, setProductCount] = useState<number>(0)
    const [Type, setType] = useState<string>('All')
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [OrderDataFunction] = useLazyQuery<{OrderListSeller: {Orders: Seller_Order_List_Object[], Count: number}}>(GetOrderData,{fetchPolicy: 'no-cache'})
    const [SelectAllItem, setSelectAllItem] = useState<boolean>(false)
    const [AddTransportCodeKey, setAddTransportCodeKey] = useState<{CodeKey: number, Change: Boolean}|null>(null);
    const [ReturnPaymentOrder, setReturnPaymentOrder] = useState<Seller_Order_List_Object|null>(null)
    const [openFilter, setOpenFilter] = useState<boolean>(false)
    const [Status, setStatus] = useState<string>("All")
    const [TransportStatus, setTransportStatus] = useState<string>("All")
    const [OrderStatus, setOrderStatus] = useState<string>("All")

    document.body.style.backgroundColor = "rgb(246, 246, 247)";
    

    useEffect(() =>{
        OrderDataFunction({variables: {Start: (page)*rowsPerPage, End: rowsPerPage*(page+1), 
                                       Status: Status, TransportStatus: TransportStatus, 
                                       OrderStatus: OrderStatus}}).then((res) =>{
          if (res.data){
            setOrderData(res.data.OrderListSeller.Orders )
            setProductCount(res.data.OrderListSeller.Count)
          }  
        })
    },[OrderDataFunction, props.User, page, Type, SelectAllItem, rowsPerPage, Status, OrderStatus, TransportStatus])



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
            setSelected(OrderData.map((item) => item.id))
        }
    }

    function RefreshOrderData(){
        OrderDataFunction({variables: {Start: (page)*rowsPerPage, End: rowsPerPage*(page+1)}}).then((res) =>{
            if (res.data){
                setOrderData(res.data.OrderListSeller.Orders )
              }        
        })
    }
    
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    
      // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = Math.max(0, rowsPerPage - OrderData.length)
    
  return (
    <>
        <Box sx={{width: '100%', mt: '130px', left: '0',position: 'relative'}}>
            <Grid container spacing={2} columns={16}>
                <ManagementLeftNavBar/>
                <Grid item md={14}>
                    <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <EnhancedTableToolbar numSelected={SelectAllItem ? ProductCount : selected.length} setOpenFilter={setOpenFilter}/>
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                                    <EnhancedTableHead numSelected={selected.length} rowCount={ProductCount} SelectAll={SelectAll}/>
                                    <TableBody>
                                        {OrderData.map((row, index) => {
                                            return (
                                                <Row setReturnPaymentOrder={setReturnPaymentOrder} setAddTransportCodeKey={setAddTransportCodeKey} setSelect={SelectItem} key={index} index={index} row={row} isSelected={isSelected}/>
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
        <OrderFilter open={openFilter} setopen={setOpenFilter} 
                     Status={Status} setStatus={setStatus}
                     TransportStatus={TransportStatus} setTransportStatus={setTransportStatus} 
                     OrderStatus={OrderStatus} setOrderStatus={setOrderStatus}/>
        {AddTransportCodeKey && <AddTransportCodeDialog ItemKey={AddTransportCodeKey} onClose={setAddTransportCodeKey} Refresh={RefreshOrderData}/>}
        {ReturnPaymentOrder && <ReturnPaymentDialog Open={Boolean(ReturnPaymentOrder)} setOpen={setReturnPaymentOrder} OrderDetail={ReturnPaymentOrder} Refresh={RefreshOrderData}/>}
    </>
)
}

export default NewOrderPage
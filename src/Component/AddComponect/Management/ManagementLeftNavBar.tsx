import { Button, Grid, List, ListItem, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import InventoryIcon from '@mui/icons-material/Inventory';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import CollectionsIcon from '@mui/icons-material/Collections';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatIcon from '@mui/icons-material/Chat';
import MoneyIcon from '@mui/icons-material/Money';
import SettingsIcon from '@mui/icons-material/Settings';

const ManagementLeftNavBar = () => {
  return (
    <Grid item md={2} borderRight={"solid 1px rgba(128, 128, 128, .6)"}>
        <List sx={{ width: '100%'}}
                subheader={
                    <Typography variant="subtitle1" fontWeight='bold' sx={{ml: '10px', mt: '10px', fontSize: "7px"}}>
                        QUICK LINKS
                    </Typography>
                }>
            <ListItem disablePadding>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<DashboardIcon sx={{ml: '25px', mr: "10px"}} />} onClick={() => window.location.assign("/Business/Dashboard")}>
                    Dashboard
                </Button>
            </ListItem>
            <ListItem disablePadding onClick={() => window.location.assign("/Business/NewProduct")}>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<Inventory2Icon sx={{ml: '25px', mr: "10px"}} />}>
                    New Product
                </Button>
            </ListItem>
            <ListItem disablePadding>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<ShoppingCartCheckoutIcon sx={{ml: '25px', mr: "10px"}} />}>
                    New Coupons
                </Button>
            </ListItem>
        </List>
        <List sx={{ width: '100%'}}
                subheader={
                    <Typography variant="subtitle1" fontWeight='bold' sx={{ml: '10px', mt: '10px', fontSize: "7px"}}>
                        CATALOGS
                    </Typography>
                }>
            <ListItem disablePadding>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<InventoryIcon sx={{ml: '25px', mr: "10px"}}/>} onClick={() => window.location.assign("/Business/Product")}>
                    Products
                </Button>
            </ListItem>
            <ListItem disablePadding>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<LineWeightIcon sx={{ml: '25px', mr: "10px"}}/>} onClick={() => window.location.assign("/Business/Categories")}>
                    Catagories
                </Button>
            </ListItem>
            <ListItem disablePadding>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<CollectionsIcon sx={{ml: '25px', mr: "10px"}} />}>
                    Collection
                </Button>
            </ListItem>
        </List>
        <List sx={{ width: '100%'}}
                subheader={
                    <Typography variant="subtitle1" fontWeight='bold' sx={{ml: '10px', mt: '10px', fontSize: "7px"}}>
                        SALES
                    </Typography>
                }>
            <ListItem disablePadding onClick={() => window.location.assign("/Business/NewOrders")}>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<ViewModuleIcon sx={{ml: '25px', mr: "10px"}} />}>
                    Orders
                </Button>
            </ListItem>
            <ListItem disablePadding onClick={() => window.location.assign("/Business/NewReturns")}>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<AssignmentReturnIcon sx={{ml: '25px', mr: "10px"}} />}>
                    Return or Exchange
                </Button>
            </ListItem>
            <ListItem disablePadding onClick={() => window.location.assign("/Business/Analysis")}>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<AnalyticsIcon sx={{ml: '25px', mr: "10px"}} />}>
                    Analysis
                </Button>
            </ListItem>
        </List>
        <List sx={{ width: '100%'}}
                subheader={
                    <Typography variant="subtitle1" fontWeight='bold' sx={{ml: '10px', mt: '10px', fontSize: "7px"}}>
                        CUSTOMERS
                    </Typography>
                }>
            <ListItem disablePadding>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<SupportAgentIcon sx={{ml: '25px', mr: "10px"}} />}>
                    Customers
                </Button>
            </ListItem>
            <ListItem disablePadding>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<ChatIcon sx={{ml: '25px', mr: "10px"}} />} onClick={() => window.location.assign("/ChatBox")}>
                    Chatroom
                </Button>
            </ListItem>
        </List>
        <List sx={{ width: '100%'}}
                subheader={
                    <Typography variant="subtitle1" fontWeight='bold' sx={{ml: '10px', mt: '10px', fontSize: "7px"}}>
                        PROMOTION
                    </Typography>
                }>
            <ListItem disablePadding>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<MoneyIcon sx={{ml: '25px', mr: "10px"}} />}>
                    Coupons
                </Button>
            </ListItem>
        </List>
        <List sx={{ width: '100%'}}
                subheader={
                    <Typography variant="subtitle1" fontWeight='bold' sx={{ml: '10px', mt: '10px', fontSize: "7px"}}>
                        SETTINGS
                    </Typography>
                }>
            <ListItem disablePadding>
                <Button variant="text" sx={{width: "100%", justifyContent: 'flex-start', color: "black", textTransform: "none", fontWeight: "bold", opacity: '0.8'}} startIcon={<SettingsIcon sx={{ml: '25px', mr: "10px"}} />}>
                    Settings
                </Button>
            </ListItem>
        </List>
    </Grid>
  )
}

export default ManagementLeftNavBar
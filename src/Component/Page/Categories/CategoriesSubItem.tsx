import { Grid, Box, Collapse, Typography , Paper, TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Toolbar, Tooltip, IconButton, TableContainer, Table, TableBody, TablePagination} from '@mui/material'
import ManagementLeftNavBar from '../../AddComponect/Management/ManagementLeftNavBar';
import ModifyProductPage from '../BusinessPage/ModifyProductPage';
import EditIcon from '@mui/icons-material/Edit';
import ProductFilterItem from '../BusinessPage/CommonItem/ProductFilter';
import { useParams } from 'react-router-dom';

const CategoriesSubItem = () => {
    const {Category} = useParams()
    return (
        <>
            <Box sx={{width: '100%', mt: '130px', left: '0',position: 'relative'}}>
                <Grid container spacing={2} columns={16}>
                    <ManagementLeftNavBar/>
                    <Grid item md={14}>
                        <Box sx={{ width: '100%' }}>
                            <Paper sx={{ width: '100%', mb: 2 }}>

                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
        
      )
}

export default CategoriesSubItem
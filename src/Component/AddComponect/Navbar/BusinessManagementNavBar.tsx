import { Box, Button, Typography } from '@mui/material'
import ManagementImage from '../../../assets/Management.png'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useTranslation } from 'react-i18next';

const BusinessManagementNavBar = () => {
  const {t} = useTranslation()
  return (
    <>
      <Box position='absolute' sx={{width: '100%',backgroundColor: 'rgb(200,200,150)', height: '60px', left: '0', top: '0', zIndex: 5, minWidth: '1200px', mt: '40px'}}>
        <div style={{position: 'relative' , display: 'flex', flexDirection: 'row', marginLeft: 'auto', width: '70%', marginRight: 'auto'}}>
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '80%', mt: '10px'}}>
            <Typography variant='body1' sx={{color: 'rgb(50,50,50)', display: 'flex', flexDirection: 'row', alignItems: 'center',
                                                        ':hover': {opacity: 0.8, cursor: 'pointer'}}} onClick={() => window.location.replace('/Business/Dashboard')}>
              <img src={ManagementImage} alt='logo' style={{maxHeight: '35px' , objectFit: 'contain', marginRight: '10px'}}/>
              {t("Business.MainTitle")}
            </Typography>
          </Box>  
        </div>  
      </Box>
    </>
  )
}

export default BusinessManagementNavBar
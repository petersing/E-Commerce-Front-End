import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import successImage from '../../../assets/Success-logo.png'
import { useParams, useSearchParams } from 'react-router-dom'

const SuccessPaymentPage = () => {
  const [searchParams]= useSearchParams()
  return (
    <Box sx={{display: "flex", justifyContent: 'center', flexFlow: 'column', alignItems: 'center'}}>
      <img src={successImage} style={{width: '150px', height: '150px'}}/>
      <Typography variant="h5" gutterBottom sx={{ color: "rgb(87, 179, 89)"}}>Congratulations! Your Stripe payment has been accepted</Typography>
      <Typography variant="body1" gutterBottom >We will send an email to confirm your order details and payment.</Typography>
      <Typography variant="caption" gutterBottom sx={{opacity: '50%'}}>{`Ref code : ${searchParams.get("session_id")}`}</Typography>
      <Button variant="contained" color="primary" sx={{marginTop: '20px'}} onClick={() => window.location.assign("/")}>Back to Home</Button>
    </Box>
  )
}

export default SuccessPaymentPage
import { Box, Button, Chip, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useState } from 'react'
import { User_Object } from '../../Public_Data/Interfaces'
import { useTranslation } from 'react-i18next'
import ChangeAdsStatusDialog from '../../Dialog/Setting/ChangeAdsStatusDialog'


const PrivacyCenter = (props: {UserData: User_Object|undefined, RefetchUserFunction: Function}) => {
    const [OpenAdsDialog, setOpenAdsDialog] = useState<boolean>(false)
    const {t} = useTranslation()

    return (
        <>
            <Box sx={{mt: '120px', width: '50%', ml: 'auto', mr: 'auto'}}>
                <Typography variant='h6'>{t("AccountInformation.SellerCenter")}</Typography>
                <List sx={{border: '1px solid rgb(220,220,220)', borderRadius: '8px', mt: '10px'}}>
                    <ListItem>
                        <ListItemText primary={t("AccountInformation.AdsID")} secondary={props.UserData?.Ads.id}/>
                    </ListItem>
                    <ListItem secondaryAction={<Button variant='contained' onClick={() => setOpenAdsDialog(true)}>{t("AccountInformation.ChangeStatus")}</Button>}>
                        <ListItemText primary={t("AccountInformation.AdsStatus")} secondary={"Consent to collect search and purchase data to enhance the shopping experience"}/>
                    </ListItem>
                    <ListItem>             
                        <ListItemText disableTypography={true} primary={<Typography>{t("AccountInformation.Prefernece")}</Typography>} secondary={props.UserData?.Preference.map((item, K) => <Chip key={`Ads${K}`} label={item} sx={{mr: '5px', mt: '5px'}}/>)}/>
                    </ListItem>
                    
                </List>
            </Box>
            {props.UserData && OpenAdsDialog !== false && <ChangeAdsStatusDialog Open={OpenAdsDialog} Onclose={setOpenAdsDialog} AdsDb={props.UserData.Ads} RefetchUserFunction={props.RefetchUserFunction}/>}
        </>
    )
}

export default PrivacyCenter
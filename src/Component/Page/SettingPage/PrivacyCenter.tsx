import { Box, Button, Chip, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useState } from 'react'
import SubscribeDialog from '../../Dialog/Setting/SubscribeDialog'
import { User_Object } from '../../Public_Data/Interfaces'
import { useTranslation } from 'react-i18next'


const PrivacyCenter = (props: {UserData: User_Object|undefined, RefetchUserFunction: Function}) => {
    const [OpenSubscribe, setOpenSubscribe] = useState<number|null>(null)
    const {t} = useTranslation()

    return (
        <>
            <Box sx={{mt: '120px', width: '50%', ml: 'auto', mr: 'auto'}}>
                <Typography variant='h6'>{t("AccountInformation.SellerCenter")}</Typography>
                <List sx={{border: '1px solid rgb(220,220,220)', borderRadius: '8px', mt: '10px'}}>
                    <ListItem>
                        <ListItemText primary={t("AccountInformation.AdsID")} secondary={props.UserData?.AdsToken}/>
                    </ListItem>
                    <ListItem secondaryAction={<Button variant='contained' onClick={() => setOpenSubscribe(0)}>{props.UserData?.isSubscriber ? t("AccountInformation.RenewSubscribe"): t("AccountInformation.SubscribeNow")}</Button>}>
                        <ListItemText primary={t("AccountInformation.AdsStatus")} secondary={"Consent to collect search and purchase data to enhance the shopping experience"}/>
                    </ListItem>
                    <ListItem>             
                        <ListItemText primary={t("AccountInformation.Prefernece")} 
                                      secondary={props.UserData?.Preference.map((item) => <Chip label={item} sx={{mr: '5px'}}/>)}/>
                    </ListItem>
                </List>
            </Box>
            {OpenSubscribe !== null && <SubscribeDialog Open={OpenSubscribe} Onclose={setOpenSubscribe} SubscribeData={props.UserData?.Subscribe} RefetchUserFunction={props.RefetchUserFunction}/>}
        </>
    )
}

export default PrivacyCenter
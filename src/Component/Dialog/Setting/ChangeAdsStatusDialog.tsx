import { gql, useMutation } from '@apollo/client'
import { Alert, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const UpdateUserAds = gql`
mutation UpdateUserAds($Agreement: Boolean!, $ConsentGlobalAds: Boolean!, $ConsentThirdPartyAds: Boolean!){
    UpdateUserAds(Agreement: $Agreement, ConsentGlobalAds: $ConsentGlobalAds, ConsentThirdPartyAds: $ConsentThirdPartyAds){status}
}
`

const ChangeAdsStatusDialog = (props: {Open: boolean, Onclose: Function, RefetchUserFunction: Function, AdsDb: {id: string, Agreement: boolean, ConsentGlobalAds: boolean, ConsentPersonalAds: boolean, ConsentThirdPartyAds: boolean}}) => {
    const [AgreeAds, setAgreeAds] = React.useState<boolean>(props.AdsDb.Agreement)
    const [ConsentAds, setConsentAds] = React.useState<boolean>(props.AdsDb.ConsentGlobalAds)
    const [ConsentAdsThirdParty, setConsentAdsThirdParty] = React.useState<boolean>(props.AdsDb.ConsentThirdPartyAds)
    const [UpdateUserAdsMutation] = useMutation(UpdateUserAds)
    const {t} = useTranslation()

    function UpdateUserAdsMutationCallback(AgreeAds: boolean, ConsentAds: boolean, ConsentAdsThirdParty: boolean){
        if (AgreeAds === false){
            ConsentAds = false
            ConsentAdsThirdParty = false
        }
        UpdateUserAdsMutation({variables: {Agreement: AgreeAds, ConsentGlobalAds: ConsentAds, ConsentThirdPartyAds: ConsentAdsThirdParty}}).then((res) => {
            if(res.data.UpdateUserAds.status){
                props.RefetchUserFunction()
                props.Onclose(false)
            }
        })
    }

    return (
        <>
            <Dialog open={props.Open} onClose={() => props.Onclose(false)} fullWidth>
                <DialogTitle>Change Advertisement Status</DialogTitle>
                <DialogContent>
                    <FormControlLabel labelPlacement="start" label="Do you agree to use your search history to enhance your shopping experience?" control={<Switch color="primary" defaultChecked={AgreeAds} onChange={(i) => setAgreeAds(i.target.checked)}/>}/>
                    <Box sx={{ display: ( AgreeAds? "flex": "none") , flexDirection: 'column', ml: 3 }}>
                        <FormControlLabel labelPlacement="start" control={<Switch color="primary" defaultChecked={ConsentAds} onChange={(i) => setConsentAds(i.target.checked)}/>} label="Consent to use search history for further analysis (global analysis)" key="Child1"/>
                        <FormControlLabel labelPlacement="start" control={<Switch color="primary"defaultChecked={ConsentAdsThirdParty}  onChange={(i) => setConsentAdsThirdParty(i.target.checked)}/>} label="Consent to sending your search history to third parties for further analysis" key="Child2"/>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => UpdateUserAdsMutationCallback(AgreeAds, ConsentAds, ConsentAdsThirdParty)} variant='contained'>{t("AccountInformation.Apply")}</Button>
                    <Button onClick={() => props.Onclose(null)} variant='contained'>{t("AccountInformation.Cancel")}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ChangeAdsStatusDialog
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Menu,  SvgIcon, Typography} from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import FilterNestedMenu from './FilterNestedMenu';
import { useTranslation } from "react-i18next";

const db: {[key: string]: string} = {"All": "All", "normal": "Normal", "cancel": "Cancel", "waiting": "Waiting For Transport", "transport": "Already Transport", "finish": "Finish", "process": "Process"}
const Reversedb: {[key: string]: string} = {"All": "All", "Normal": "normal", "Cancel": "cancel", "Waiting For Transport": "waiting", "Already Transport": "transport", "Finish": "finish", "Process": "process"}


const OrderFilter = (props: {open: boolean, setopen: Dispatch<SetStateAction<boolean>>
                             Status: string, setStatus: React.Dispatch<React.SetStateAction<string>>,
                             TransportStatus: string, setTransportStatus: React.Dispatch<React.SetStateAction<string>>,
                             OrderStatus: string, setOrderStatus: React.Dispatch<React.SetStateAction<string>>}) => {

    const [Status, setStatus] = useState<keyof typeof db>(db[props.Status])
    const [TransportStatus, setTransportStatus] = useState<keyof typeof db>(db[props.TransportStatus])
    const [OrderStatus, setOrderStatus] = useState<keyof typeof db>(db[props.OrderStatus])
    const { t } = useTranslation()

    function ApplyFilter(){
        props.setopen(false)
        props.setStatus(Reversedb[Status])
        props.setTransportStatus(Reversedb[TransportStatus])
        props.setOrderStatus(Reversedb[OrderStatus])
    }

    
  return (
    <Dialog open={props.open} onClose={() => props.setopen(false)}>
        <DialogTitle>Filter</DialogTitle>
        <DialogContent>
            <FilterNestedMenu Title= "Order Status" Value={Status} setValueFunction={setStatus} DataList={['All', 'Normal', "Cancel"]}/>
            <FilterNestedMenu Title= "Transport Status" Value={TransportStatus} setValueFunction={setTransportStatus} DataList={['All', "Waiting For Transport", "Already Transport"]}/>
            <FilterNestedMenu Title= "Order Status" Value={OrderStatus} setValueFunction={setOrderStatus} DataList={['All', "Finish", "Process"]}/>
        </DialogContent>
        <DialogActions>
            <Button  variant='contained' onClick={() => ApplyFilter()}>Apply</Button>
        </DialogActions>
    </Dialog>
  )
}

export default OrderFilter
import { gql, useMutation } from '@apollo/client';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<number | undefined>>
  id: number;
}

const ConfirmReturn = gql`
mutation RefundItem($ReturnID: Int!) {
    RefundItem(ReturnID: $ReturnID){
        Result
    }
}
`

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, setOpen, id }) => {
    const [ConfrimReturnFunction] = useMutation<{RefundItem: string}>(ConfirmReturn, {onCompleted: ()=> {window.location.reload()}});
    
    const handleClose = () => {
        setOpen(undefined);
    };

    const handleConfirm = () => {
        // Handle the confirmation action here
        ConfrimReturnFunction({variables: {ReturnID: id}});
        console.log(`Confirmed payback for customer with id: ${id}`);
        setOpen(undefined);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Confirm Payback"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Are you sure you want to confirm the payback for customer with id: {id}?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
            Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
            </Button>
        </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
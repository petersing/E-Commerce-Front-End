import {useState } from "react";
import { MenuItem,TextField, InputAdornment, Menu } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const FilterNestedMenu = (props: {Value: any, setValueFunction: Function, ResponseFunction?: Function, DataList: any[], Title: string}) => {
  const [AnchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  const [Open, setOpen] = useState<boolean>(false);

  return(
    <>
      <TextField value={props.Value} fullWidth sx={{mt: '10px'}}inputProps={{ style: {cursor: 'pointer'}}} autoFocus label={props.Title} focused 
                                                              onClick={(event) => {setAnchorElement(event.currentTarget); setOpen(true)}} 
                                                              InputProps={{endAdornment: (
                                                              <InputAdornment position='start'>
                                                              <ArrowDropDownIcon />
                                                              </InputAdornment>), readOnly: true}}/>
      <Menu anchorEl={AnchorElement} open={Open} onClose={() => setOpen(false)} MenuListProps={{sx: { width:AnchorElement && AnchorElement.offsetWidth } }} >
          {props.DataList.map((key: string) => (
              <MenuItem key={key} onClick={()=> {props.setValueFunction(key); setOpen(false);}} 
                sx={{justifyContent: 'space-between'}} >
                {props.ResponseFunction? props.ResponseFunction(key): key}
              </MenuItem>
          ))}
      </Menu>

    
    </>
  )
}

export default FilterNestedMenu
import { Avatar, Box, Collapse, Fab, IconButton, List, ListItem, ListItemAvatar, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { useRef, useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { SubItem_Object } from "../../../Public_Data/Interfaces";

const VideoGrid = (props: {VideoList: string[], setVideo: React.Dispatch<React.SetStateAction<string[]>>, Addvideo: () => void}) =>{
    ///https://img.youtube.com/vi/BBmz-B5kSO8/0.jpg
    return(
        <>
            <List>
                {props.VideoList.map((video, index) => {
                    return(
                        <ListItem key={Math.random()}>
                            <ListItemAvatar>
                                <Avatar sx={{backgroundColor: "green"}}>
                                    <OndemandVideoIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`Video ${index}`} sx={{overflow: 'clip'}}/>
                            <img src={`https://img.youtube.com/vi/${video}/0.jpg`} alt={'Not Found'} style={{width: '100px', marginLeft: '15px', pointerEvents: 'none'}}/>
                            <IconButton onClick={() => {props.setVideo((pre) => pre.filter((item, key) => {if (key !== index){return item}}))}}>
                                <DeleteIcon/>
                            </IconButton>
                        </ListItem>
                    )
                })}
            </List>
            <div style={{display: 'flex', flexFlow: "row-reverse", marginBottom: '10px'}}>
                <Fab color="primary" aria-label="add" size="small" onClick={() => props.Addvideo()} >
                    <AddIcon/>
                </Fab>
            </div>
        </>
    )
}

const PreviousImages = (props: {Images: string[], RemoveList: string[], forceUpdate: Function}) => {
    const ImageList = props.Images.map((image, index) =>{
        if (props.RemoveList.indexOf(image) !== -1){return null}
        else{
            return(
                <ListItem key={Math.random()}>
                    <ListItemAvatar>
                    <Avatar sx={{backgroundColor: "green"}}>
                        <CloudDoneIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`Previous Image ${index}`} sx={{overflow: 'clip'}}/>
                    <img src={image} alt={'Not Found'} style={{width: '50px', marginLeft: '15px', pointerEvents: 'none'}}/>
                    <IconButton onClick={() => {props.RemoveList.push(image); props.forceUpdate()}}>
                        <DeleteIcon/>
                    </IconButton>
              </ListItem>
            )
        }
        
    })
    return ImageList
}

const NoPreviousImages =() =>{

    return(
        <ListItem key={Math.random()}>
            <ListItemAvatar>
                <Avatar sx={{backgroundColor: "green"}}>
                    <QuestionMarkIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"No Any Previous Image !!"} sx={{overflow: 'clip'}}/>
        </ListItem>
    )
}

const NewImage = (props: {Images: File[], RenderList: String[], forceUpdate: Function}) =>{
    const ImageList = props.Images.map((image, index) =>{
        const objectUrl = URL.createObjectURL(image)
        props.RenderList.push(objectUrl) // This Function is to make sure that the image is deleted when the component is unmounted
        return(
            <ListItem key={image.name+ Math.random()}>
                <ListItemAvatar>
                <Avatar sx={{backgroundColor: "orange"}}>
                    <CloudUploadIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`Upload Image ${index}`} sx={{overflow: 'clip'}}/>
                <img src={objectUrl} alt={'Not Found'} style={{width: '100px', marginLeft: '15px', pointerEvents: 'none'}}/>
                <IconButton onClick={() => {props.Images.splice(index, 1); props.forceUpdate();}}>
                    <DeleteIcon/>
                </IconButton>
            </ListItem>
        )
    })
    return ImageList
}

const ImageGrid = (props: {Name: string, PreviousImages?: string[], Images: File[], RenderList: string[], RemoveList?: string[], forceUpdate: Function}) => {

    const inputImageRef = useRef<HTMLInputElement>(null)

    return(
        <>
            <ListItemText primary={props.Name}/>
            {props.PreviousImages && props.RemoveList && 
                <List>
                    {props.PreviousImages.length !== 0 ?
                        PreviousImages({Images: props.PreviousImages, RemoveList: props.RemoveList, forceUpdate: props.forceUpdate}):
                        NoPreviousImages()   
                    }
                </List>
            }
            <List>
                {NewImage({Images: props.Images, RenderList: props.RenderList, forceUpdate: props.forceUpdate})}
            </List>
            <input type="file" ref={inputImageRef} style={{display: 'none'}} onChange={(e) => {if (e.target.files) {props.Images.push(e.target.files[0]); props.forceUpdate()}}}/>
            <div style={{display: 'flex', flexFlow: "row-reverse", marginBottom: '10px'}} onClick={() => {inputImageRef.current?.click()}}>
                <Fab color="primary" aria-label="add" size="small" >
                    <AddIcon/>
                </Fab>
            </div>
        </>
    )
}

const SubProductRow= (props: {SubItem: SubItem_Object, index: number, openChildrenEdit: (key: number) => void, remove: (key: number) => void}) =>{
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <TableRow hover role="checkbox" tabIndex={-1} key={"SubItemObject" + props.SubItem.Name+ props.SubItem.id}sx={{ cursor: 'pointer' }}>
                <TableCell padding='checkbox'>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" id={"SubProduct"+props.SubItem.Name} scope="row" padding="none">
                    {props.SubItem.Name}
                </TableCell>
                <TableCell align="right">{props.SubItem.Price}</TableCell>
                <TableCell align="right">{props.SubItem.Quantity}</TableCell>
                <TableCell align="right">{props.SubItem.Sell}</TableCell>
                <TableCell padding='none' sx={{cursor: 'pointer' }}>
                    {
                    <IconButton onClick={() => props.openChildrenEdit(props.index)}>
                        <EditIcon/>
                    </IconButton>
                    }
                </TableCell>
                <TableCell padding='none' sx={{cursor: 'pointer' }}>
                    {
                    <IconButton onClick={() => props.remove(props.index)}>
                        <DeleteIcon/>
                    </IconButton>
                    }
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Properties
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Key</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(props.SubItem.Properties).map((SubPro, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {SubPro[0]}
                                            </TableCell>
                                            <TableCell>{SubPro[1]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
        
    );
}

export {VideoGrid, ImageGrid, SubProductRow}
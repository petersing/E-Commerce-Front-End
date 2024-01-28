import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogTitle, Grid, IconButton, Paper, TextField, Typography, makeStyles, styled } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { User_Object } from '../../Public_Data/Interfaces';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';


const rowsPerPage = 5

const GetUserProduct = gql`
query UserProduct($start: Int!, $end: Int!, $Target: Int) {
  CategoriesProduct(Start: $start, End: $end, ListFilter: $Target) {,
        Product{
          id,
          ProductName,
          FirstImage
        },
    },
}
`

const GetProductCount = gql`
query UserProduct{
    CategoriesProduct{,
        Count
    },
}
`

const CreateOrUpdateCategories = gql`
mutation CreateOrUpdateCategory($CategoryName: String!, $ProductList: [Int]!, $Target: Int){
    CreateOrUpdateCategory(CategoryName: $CategoryName, ProductList: $ProductList, PreID: $Target) {
        status
    }
}
`



interface Product_Categories_Object{
    id: string,
    ProductName: string,
    FirstImage: string
}


interface SelectionListItemProps{
    User?: User_Object,
    DroppableID: string,
    Title: string,
    IntegratedData: {id: string, title: string, items: Product_Categories_Object[]}[],
    TotalDataCount: number,
    TargetID?: number,
    setIntegratedData: React.Dispatch<React.SetStateAction<{
        id: string;
        title: string;
        items: Product_Categories_Object[];
    }[]>>

}

interface DroppableItemProps{
    DroppableID: string,
    Title: string,
    IntegratedData: {id: string, title: string, items: Product_Categories_Object[]}[]
    setIntegratedData: React.Dispatch<React.SetStateAction<{
      id: string;
      title: string;
      items: Product_Categories_Object[];
    }[]>>
}


const SelectionListItem = React.memo((props: SelectionListItemProps) =>{
    const [page, setPage] = useState(0);
    const [ReferencePage, setReferencePage] = useState<number[]>([])
    const [Data, setData] = useState<Product_Categories_Object[]>(props.IntegratedData[0].items)
    const [ItemCount, setItemCount] = useState<number>(props.TotalDataCount)
    const [TransferCount, setTransferCount] = useState<number>(0)
    const [ProductDataFunction] = useLazyQuery<{CategoriesProduct: {Product: any}}>(GetUserProduct,{fetchPolicy: 'no-cache'})

    useEffect(() => {
      setItemCount(props.TotalDataCount)
    }, [props.TotalDataCount])
  
    useEffect(() => {
      if (props.IntegratedData[0].items.length < rowsPerPage*(page+1) && Math.floor((ItemCount-TransferCount) / rowsPerPage) >= 1){
        var LastPage = Math.max(...ReferencePage, -1) + 1
        setReferencePage((pre) => [...pre, LastPage])

          ProductDataFunction({ variables: { start: (LastPage) * rowsPerPage, end: rowsPerPage * (LastPage + 1), Target: props.TargetID } }).then((res) => {
            if (res.data && res.data.CategoriesProduct.Product.length > 0){
              var DataList : Product_Categories_Object[] = res.data.CategoriesProduct.Product.map((item: {id: number, ProductName: string, FirstImage: string}) => {
                var {id, ...other} = item
                if (props.IntegratedData[1].items.find((item) => item.id === "Item"+item.id)) return null
                return(
                  {id: "Item"+item.id, ...other}
                )     
              })
              props.setIntegratedData((pre) => {
                const newList = [...pre]
                
                newList[0].items.push(...DataList)
                
                return newList
              })
              setData(DataList)
            }
          }).finally(() =>{
            setTransferCount((pre) => pre + rowsPerPage);
          })
    }
  }, [props.User, ProductDataFunction, page, props.IntegratedData])
    
    useEffect(() => {
      setReferencePage((pre) => [...pre, page]);
    }, [page]);

    useEffect(() =>{
      setData(props.IntegratedData[0].items) 
    }, [props.IntegratedData])


    useEffect(() =>{
      if ((page)*rowsPerPage === ItemCount- props.IntegratedData[1].items.length ){
  
        setPage((pre) => pre-1)
      }
    }, [props.IntegratedData])

    return(
        <Grid item xs={6} key={props.DroppableID}>
          <Typography variant="h6" sx={{marginLeft: '25px'}}>{props.Title}</Typography>
          <Droppable droppableId={props.DroppableID} direction="vertical">
            {(provided) => (
              <Box display="flex" overflow="hidden" padding="8px" margin="8px 0px 0px 16px" sx={{background: '#f7f7f7', borderRadius: '4px', flexFlow: 'column', maxWidth: '350px'}} ref={provided.innerRef} {...provided.droppableProps}>
                {Data.map((item, index) => {
                  if (index < page*rowsPerPage || index >= (page+1)*rowsPerPage) return null;
                  return(
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <Card sx={{margin: "8px", display: 'flex', alignItems: 'center'}} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <CardMedia sx={{margin: '3px -8px 3px 3px'}}>
                                <img src={item.FirstImage + "?Width=50"} alt={item.ProductName}/>
                            </CardMedia>
                            <CardContent>
                                <Typography variant="body1">{item.ProductName}</Typography>
                                <Typography variant="body2">{item.id}</Typography>
                            </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
                <Box display="flex" justifyContent="center">
                  <IconButton onClick={() => setPage((pre) => pre-1)} sx={{display: (page === 0? "none": '')}}>
                    <ArrowLeftIcon/>
                  </IconButton>
                  <IconButton onClick={() => setPage((pre) => pre+1)} sx={{display: ((page+1)*rowsPerPage >= ItemCount- props.IntegratedData[1].items.length? "none": '')}}>
                    <ArrowRightIcon/>
                  </IconButton>
                </Box>
              </Box>
            )}
          </Droppable>
        </Grid>
    )
})

const DroppableItem = React.memo((props: DroppableItemProps) =>{
  const [page, setPage] = useState(0);
  const [Data, setData] = useState<Product_Categories_Object[]>(props.IntegratedData[1].items)

  useEffect(() => {
    setData(props.IntegratedData[1].items)
  }, [props.IntegratedData])


  return(
      <Grid item xs={6} key={props.DroppableID}>
        <Typography variant="h6" sx={{marginLeft: '25px'}}>{props.Title}</Typography>
        <Droppable droppableId={props.DroppableID} direction="vertical">
          {(provided) => (
            <Box display="flex" overflow="hidden" padding="8px" margin="8px 16px 0px 8px" sx={{background: '#f7f7f7', borderRadius: '4px', flexFlow: 'column', maxWidth: '350px'}} ref={provided.innerRef} {...provided.droppableProps}>
              {Data.map((item, index) => {
                if (index < page*rowsPerPage || index >= (page+1)*rowsPerPage) return null;
                return(
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <Card sx={{margin: "8px", display: 'flex', alignItems: 'center'}} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <CardMedia sx={{margin: '3px -8px 3px 3px'}}>
                              <img src={item.FirstImage + "?Width=50"} alt={item.ProductName}/>
                          </CardMedia>
                          <CardContent>
                              <Typography variant="body1">{item.ProductName}</Typography>
                              <Typography variant="body2">{item.id}</Typography>
                          </CardContent>
                      </Card>
                    )}
                  </Draggable>
                )
            })}
              {provided.placeholder}
              <Box display="flex" justifyContent="center">
                <IconButton onClick={() => setPage((pre) => pre-1)} sx={{display: (page === 0? "none": '')}}>
                  <ArrowLeftIcon/>
                </IconButton>
                <IconButton onClick={() => setPage((pre) => pre+1)} sx={{display: ((page+1)*rowsPerPage >= Data.length? "none": '')}}>
                  <ArrowRightIcon/>
                </IconButton>
              </Box>
            </Box>
          )}
        </Droppable>
      </Grid>
  )
})

interface CategoriesProps {
  id: number, 
  Category: string, 
  TotalSell: number, 
  Status : boolean,
  Product: {id: string, ProductName: string, FirstImage: string}[]
}

interface AddModifyCategoriesProps{
    User: User_Object|undefined,
    ModifyTargetData?: CategoriesProps
    Open: boolean
    setOpenAddOrModifyCategory: Dispatch<SetStateAction<number| undefined>>

}


const AddModifyCategories = ({User, setOpenAddOrModifyCategory, Open, ModifyTargetData}: AddModifyCategoriesProps) => {
    
    const [data, setData] = useState<{id: string, title: string, items: Product_Categories_Object[]}[]>([]);
    const [TotalDataCount, setTotalDataCount] = useState<number>(0)
    const [ProductDataFunction] = useLazyQuery<{CategoriesProduct: {Count: number}}>(GetProductCount)
    const [CreateOrUpdateCategoriesFunction] = useMutation<{CreateOrUpdateCategory: {status: boolean}}>(CreateOrUpdateCategories,{fetchPolicy: 'no-cache'})

    useEffect(() => {
      ProductDataFunction({variables: {username: User?.username}}).then((res) =>{
        if (res.data){
          setTotalDataCount(res.data.CategoriesProduct.Count)
        }
      })
    }, [User])

    useEffect(() =>{
      if (ModifyTargetData === undefined){
        setData([{id: "Selection", title: "Selection", items:[]}, {id: "Category", title: "New",items:[]}])
      }else{
        setData([{id: "Selection", title: "Selection", items:[]}, {id: ModifyTargetData.Category, title: ModifyTargetData.Category,items: Array.from(ModifyTargetData.Product)}]) /// The Product on here is read-only object to prevent it, deep copy is needed
      }
    }, [ModifyTargetData])

    function AssignChange(){
      var TargetData = data[1].items.map((item) => {
        var {id, ...other} = item
        return parseInt(id.slice(4))
      })
      var TargetCategoriesName = data[1].title
      var TargetCategoriesID = ModifyTargetData?.id
      if (TargetCategoriesID === undefined){
        CreateOrUpdateCategoriesFunction({variables: {CategoryName: TargetCategoriesName, ProductList: TargetData}}).then((res) => {
          if (res.data?.CreateOrUpdateCategory.status){
            setOpenAddOrModifyCategory(undefined)
            window.location.reload()
          }
        })
      }else{
        CreateOrUpdateCategoriesFunction({variables: {CategoryName: TargetCategoriesName, ProductList: TargetData, Target: TargetCategoriesID}}).then((res) => {
          if (res.data?.CreateOrUpdateCategory.status){
            setOpenAddOrModifyCategory(undefined)
            window.location.reload()
          }
        })
      }
    }

    const handleDragEnd = (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      var start = data.find((list) => list.id === source.droppableId);
      var end = data.find((list) => list.id === destination.droppableId);


      if (start && end) {
        if (start === end) {
          var newList = { ...start };
          const [removed] = newList.items.splice(source.index, 1);
          newList.items.splice(destination.index, 0, removed);
          setData(data.map((list) => (list.id === newList.id ? newList : list)));
        } else {
          var startList = { ...start };
          var endList = { ...end };
          const [removed] = startList.items.splice(source.index, 1);
          const newItems = [...endList.items];
          newItems.splice(destination.index, 0, removed);
          endList.items = newItems;
          setData(data.map((list) => (list.id === startList.id ? startList : (list.id === endList.id ? endList : list))));
        }
      }
    };

    function HandleTextChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
      setData((prev) => {
        const newList = [...prev]
        newList[1].title = e.target.value
        return newList
      })
    }

    if (data.length <= 0 || data[1].id === "") return null
    return (
      <div>
        <Dialog open={Open} onClose={() => {setData([]);setOpenAddOrModifyCategory(undefined)}} fullWidth maxWidth="sm">
          <DialogTitle>Add or Modify Product Category</DialogTitle>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{margin: '6px 12px'}}>
                <TextField label="Category Name" variant="outlined" fullWidth autoFocus sx={{marginTop: '5px'}} value={data[1].title|| ""} onChange={(e) => HandleTextChange(e)}/>
              </Grid>
              <SelectionListItem TargetID={ModifyTargetData?.id} User={User} DroppableID="Selection" Title="Selection" IntegratedData={data} setIntegratedData={setData} TotalDataCount={TotalDataCount}/>
              <DroppableItem DroppableID={data[1].id} Title={data[1].title} IntegratedData={data} setIntegratedData={setData}/>
            </Grid>
          </DragDropContext>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => AssignChange()}>Save</Button>
            <Button variant="contained" color="error" onClick={() => {setData([]);setOpenAddOrModifyCategory(undefined)}}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
};

export default AddModifyCategories;
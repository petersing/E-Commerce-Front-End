import { Box, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import ManagementLeftNavBar from '../../AddComponect/Management/ManagementLeftNavBar'
import { gql, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import NotFound from '../../../assets/NotFound.png'
import CircleIcon from '@mui/icons-material/Circle';

const GetAnalysisData = gql`
query SellCountByDate($startDate: String!, $endDate: String!) {
    SellCountByDate(startDate: $startDate, endDate: $endDate) {
        day
        count
    },
    PopularProduct {
        ProductName
        Count
        FirstImage
        Stock
    }
    IntegratedAnalysis {
        Sell
        Return
        Profit
        Order
        Cancel
    }
}
`

function InitDate(){
    const End = new Date().toLocaleString("sv-SE").substring(0, 10)
    var Begin : Date| string= new Date()
    Begin.setTime(Begin.getTime() - 1000*60*60*24*7)
    Begin = Begin.toLocaleString("sv-SE").substring(0, 10)
    return {Begin, End}
}

const ChartData = (props: {AnalysisData: {day: string, count: number}[]}) => {
    if (Object.keys(props.AnalysisData).length === 0){
        return <></>
    }

    return (
        <LineChart width={550} height={400} 
        series={[{label: 'Total', area: true, data: props.AnalysisData.map((t) => {return t.count})}]}
        xAxis={[{ scaleType: 'point', data: props.AnalysisData.map((t) => {return t.day.slice(-5)}) }]}
    />
    )
}

const Dashboard = () => {
    const [ProductDataFunction] = useLazyQuery<{SellCountByDate: {day: string, count: number}[], 
                                                                  PopularProduct: {ProductName: string, Count: number, FirstImage: string, Stock: string}[],
                                                                  IntegratedAnalysis: {Cancel: number, Sell: number, Return: number, Profit: number, Order: number}}>(GetAnalysisData,{fetchPolicy: 'no-cache'})
    const [Date, setDate] = useState<{Begin: string, End: string}>({Begin: InitDate().Begin, End: InitDate().End})
    const [AnalysisData, setAnalysisData] = useState<{day: string, count: number}[]>([])
    const [PopularProduct, setPopularProduct] = useState<{ProductName: string, Count: number, FirstImage: string, Stock: string}[]>([])
    const [SellRecord, setSellRecord] = useState<{Sell: number, Return: number, Profit: number, Order: number, Cancel: number}>({Cancel: 0, Sell: 0, Return: 0, Profit: 0, Order: 0})

    useEffect(() => {
        ProductDataFunction({variables: {startDate: Date.Begin, endDate: Date.End}}).then((res)=>{
            if (res.data){
                setAnalysisData(res.data.SellCountByDate)
                setPopularProduct(res.data.PopularProduct)
                setSellRecord(res.data.IntegratedAnalysis)
            }
        })
    }, [ProductDataFunction, Date])

    return (
        <>
            <Box sx={{width: '100%', mt: '130px', left: '0',position: 'relative'}}>
                <Grid container spacing={2} columns={16}>
                    <ManagementLeftNavBar/>
                    <Grid item md={14}> 
                        <Grid container spacing={2}>
                            <Grid item md={2.5}/>
                            <Grid item md={4.5}>
                                <Typography variant="h5" sx={{mt: '15px', mb: '15px'}}>Dashboard</Typography>
                                <Paper variant="elevation" sx={{padding: '5px 20px 5px 20px', display: 'flex', flexDirection: 'column', minWidth: '500px'}}>
                                    <Typography variant="h6" sx={{mt: '10px'}}>Sell Analysis</Typography>
                                    <ChartData AnalysisData={AnalysisData}/>
                                </Paper>
                                <Paper variant="elevation" sx={{mt: '25px', padding: '5px 20px 5px 20px', display: 'flex', flexDirection: 'column', minWidth: '500px'}}>
                                    <Typography variant="h6" sx={{mt: '10px'}}>Popular Products </Typography>
                                    <Table aria-label="Popular Products Table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="5%"/>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell align="right">Sold</TableCell>
                                                <TableCell align="right">Stock</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {PopularProduct.map((row) => (
                                            <TableRow key={row.ProductName} sx={{cursor: 'pointer'}}>
                                                <TableCell width="5%">
                                                    <img src={row.FirstImage ? row.FirstImage : NotFound} alt="order" style={{maxHeight: '50px', width: '50px', objectFit: 'contain'}}/>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.ProductName}
                                                </TableCell>
                                                <TableCell align="right">{row.Count}</TableCell>
                                                <TableCell align="right">{row.Stock}</TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                            <Grid item md={2}>
                                <Paper variant="elevation" sx={{mt: '62px', padding: '5px 20px 15px 20px', display: 'flex', flexDirection: 'column'}}>
                                    <Typography variant="h6" sx={{mt: '10px'}}>Overall Sell Result</Typography>
                                    <Typography variant="body2" sx={{mt: '10px', display: 'flex', alignItems: 'center'}}>
                                        <CircleIcon sx={{scale : "0.4", color: "green"}}/>
                                        {`Total ${SellRecord.Order} Orders`}
                                    </Typography>
                                    <Typography variant="body2" sx={{mt: '10px', display: 'flex', alignItems: 'center'}}>
                                        <CircleIcon sx={{scale : "0.4", color: 'greenyellow'}}/>
                                        {`Total $${SellRecord.Sell} Sells`}
                                    </Typography>
                                    <Typography variant="body2" sx={{mt: '10px', display: 'flex', alignItems: 'center'}}>
                                        <CircleIcon sx={{scale : "0.4", color: "yellow"}}/>
                                        {`Total $${SellRecord.Return} Returns`}
                                    </Typography>
                                    <Typography variant="body2" sx={{mt: '10px', display: 'flex', alignItems: 'center'}}>
                                        <CircleIcon sx={{scale : "0.4", color: "red"}}/>
                                        {`Total $${SellRecord.Cancel} Cancels`}
                                    </Typography>
                                    <Typography variant="body2" sx={{mt: '10px', display: 'flex', alignItems: 'center'}}>
                                        <CircleIcon sx={{scale : "0.4", color: 'purple'}}/>
                                        {`Total $${SellRecord.Profit} Profit`}
                                    </Typography>
                                </Paper>
                                <Paper variant='elevation' sx={{mt: '20px', padding: '25px 20px 15px 10px', display: 'flex', flexDirection: 'column'}}>
                                <PieChart
                                    series={[
                                        {
                                        arcLabel: (item) => `$${item.value}`,
                                        arcLabelMinAngle: 20,
                                        data: [
                                            { id: 0, value: SellRecord.Profit, label: 'Sell ($)' },
                                            { id: 1, value: SellRecord.Return, label: 'Return ($)' },
                                            { id: 2, value: SellRecord.Cancel, label: 'Cancel ($)' },
                                        ],
                                        },
                                    ]}
                                    width={window.innerWidth /8}
                                    height={window.innerHeight /8}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
)}

export default Dashboard
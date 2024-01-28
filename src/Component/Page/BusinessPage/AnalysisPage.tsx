import { Box, Grid, Paper, TableContainer, TablePagination, Typography } from '@mui/material'
import ManagementLeftNavBar from '../../AddComponect/Management/ManagementLeftNavBar';
import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts'
import { LineChart } from '@mui/x-charts/LineChart';

const GetAnalysisData = gql`
query AnalysisProduct($Start: Int!, $End: Int!, $StartDate: String!, $EndDate: String!) {
    AnalysisProduct(Start: $Start, End: $End) {,
      Series(Start: $StartDate, End: $EndDate)
    },
}
`

const GetProductCount = gql`
query ProductCountUser {
    ProductCountUser
}
`

function InitialDate(){
    const End = new Date().toLocaleString("sv-SE").substring(0, 10)
    var Begin : Date| string= new Date()
    Begin.setTime(Begin.getTime() - 1000*60*60*24*7)
    Begin = Begin.toLocaleString("sv-SE").substring(0, 10)
    return {Begin, End}
}

const AnalysisPage = () => {
    const [Type, setType] = useState<string>("All");
    const [Page, setPage] = useState<number>(1);
    const [GetAnalysisFunction] = useLazyQuery<{AnalysisProduct: {Series: string}[]}>(GetAnalysisData);
    const [AnalysisData, setAnalysisData] = useState<{[Title: string]: {[Sub: string]: {[Date: string]: number}}}[]>([]);
    const [GetProductCountFunction] = useLazyQuery(GetProductCount)
    const [ProductCount, setProductCount] = useState<number>(0)
    const [OpenFilter, setOpenFilter] = useState<boolean>(false)
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {Begin, End} = InitialDate()
    const [StartDate, setStartDate] = useState<string>(Begin)
    const [EndDate, setEndDate] = useState<string>(End)
    const {t} = useTranslation()


    useEffect(() => {
        GetAnalysisFunction({variables: {Start: (Page)*rowsPerPage, End: rowsPerPage*(Page+1), StartDate: StartDate, EndDate: EndDate}}).then((res)=>{
            if (res.data){
                setAnalysisData(res.data.AnalysisProduct.map((item)=> JSON.parse(item.Series)))
            }
            
        })
    }, [GetAnalysisFunction, Page, StartDate, EndDate])

    useEffect(() =>{
        GetProductCountFunction().then((res)=>{
            if (res.data){
                setProductCount(res.data.ProductCountUser)
            }
        })
    }, [GetProductCountFunction])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
  return (
    <>
        <Box sx={{width: '100%', mt: '130px', left: '0',position: 'relative'}}>
            <Grid container spacing={2} columns={16}>
                <ManagementLeftNavBar/>
                <Grid item md={14}>
                    <Paper sx={{padding: '10px'}}>
                        <Typography variant="h6" sx={{mt: '20px', ml: '20px'}}>Analysis</Typography>
                        <Grid container>
                            {AnalysisData?.map((item)=> {
                                const Title = Object.keys(item)[0]
                                if (Title === undefined){return(null)}
                                const Sub = Object.keys(item[Title])
                                const DateTime = Object.keys(item[Title][Sub[0]])
                                const ChartData = Sub.map((sub) =>{return({name: sub, data: Object.values(item[Title][sub])})})
                                return(
                                    <Grid item xs={4} key={Math.random()}>
                                        <Paper sx={{margin: "15px", padding: '15px', backgroundColor: "rgb(227, 255, 227)"}}>
                                            <Chart options={{chart: {id: "basic-bar"}, xaxis: {categories: DateTime}, title: {text: Title}}} series={ChartData} type="line" width="500" />
                                        </Paper>
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={ProductCount} rowsPerPage={rowsPerPage} 
                                                page={Page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
                                />

                    </Paper>
                </Grid>
            </Grid>
        </Box>
    </>
  )
}

export default AnalysisPage
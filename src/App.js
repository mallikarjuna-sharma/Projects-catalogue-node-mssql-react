import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {Typography,TextField} from '@material-ui/core';
import GenerateTableComponent from './table.js'
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import './App.css';

const axios = require('axios');


function App() {


  const [dbConn , setdbConn] = useState('');
  const [serviceURL , setserviceURL ] = useState('localhost:5000');
  const [ userName , setUserName ] = useState({});


  const [openserviePopUp, setopenserviePopUp] = useState(false);
  const [openDBPopUp, setopenDBPopUp] = useState(false);
  const [openLoginPopUp, setopenLoginPopUp] = useState(false);
  
  const [isServiceConnected , setisServiceConnected] = useState(-1);
  const [isDBConnected , setisDBConnected] = useState(-1);
  const [isTableCreated , setisTableCreated ] = useState(-1);
  const [isTableInserted , setisTableInserted] = useState(-1);
  const [ userId , setuserId ] = useState(0);

  const [tableData , settableData] = useState([]);

  const [opensnack , setopensnack ] = useState(true);



const checkConnection = () => {
  axios.get('http://'+serviceURL+'/check')
    .then(function (response) {
      setisServiceConnected(1);
      setopenserviePopUp(false);
    })
    .catch(function (error) {
      setisServiceConnected(0)
    })
}


const checkDBConnection = (dbDetails) => {

  setopenDBPopUp(false)
 
  axios.post('http://'+serviceURL+'/connectDB',{dbDetails})
    .then(function (response) {
      if(response.data) setisDBConnected(1);
    })
    .catch(function (error) {
      setisDBConnected(0);
    })
}

const fetchUserDatils = (userDetails) => {

  setopenLoginPopUp(false)

  axios.post('http://'+serviceURL+'/fetchUserDetails',userDetails)
    .then(function (response) {
      console.log(response.data.recordset ,'fetchUserDetails')
      if(response && response.data.recordset && response.data.recordset.length){
          setuserId(response.data.recordset[0].userid);
          getTableUserData(response.data.recordset[0].userid);
      }
    })
    .catch(function (error) {
    })
} 


const getTableUserData = (userDetails) => {

  axios.get('http://'+serviceURL+'/fetchUserIdDetails/'+userDetails)
    .then(function (response) {
      console.log(response.data.recordset ,'fetchUserDetails')
      if(response.data && response.data.recordset ){
        settableData(response.data.recordset);
      }
    })
    .catch(function (error) {
    })
} 


const createTable = () => {

  if(isTableCreated == -1 || !isTableCreated)
  axios.get('http://'+serviceURL+'/createTable')
    .then(function (response) {
      if(response.data) setisTableCreated(1);
    })
    .catch(function (error) {
      setisTableCreated(0);
    })

} 


const fetchAllUserDetails = () => {

  axios.get('http://'+serviceURL+'/fetchAllUserDetails')
    .then(function (response) {
      console.log(response.data.recordset ,'fetchUserDetails')
      if(response.data && response.data.recordset ){
        settableData(response.data.recordset);
      }
    })
    .catch(function (error) {
      // setisTableInserted(0);
    })
}


const insertTable = () => {

  if(isTableInserted == -1 || !isTableInserted)
  axios.get('http://'+serviceURL+'/insertTable')
    .then(function (response) {
      console.log(response,'response')
      if(response && response.data.rowsAffected && response.data.rowsAffected.length  ){
        setisTableInserted(1);
        fetchAllUserDetails();
      }
     
    })
    .catch(function (error) {
      setisTableInserted(0);
    })
} 

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}



const classessnack = useStylesSnack();
  return (
    <div className="App">


      <Grid container spacing={6} direction="row" justify="center" alignItems="center" style={{padding:"1%",paddingTop:"10%"}}>

        <Grid item md={2} xs={12} sm={12} >
          {(isServiceConnected == -1 || !isServiceConnected) ? < StyledButtonRed onClick={() => setopenserviePopUp(true)} > Connect Service </ StyledButtonRed>
           :  <StyledButtonBlue onClick={() => setopenserviePopUp(true)} > Connect Service </ StyledButtonBlue >  }
        </Grid>

        <Grid item md={2} xs={12} sm={12} >
           { (isDBConnected == -1 || !isDBConnected) ? < StyledButtonRed  onClick={() => setopenDBPopUp(true)}  > Connect Database </ StyledButtonRed>
           : <StyledButtonBlue  onClick={() => setopenDBPopUp(true)}  > Connect Database </ StyledButtonBlue > }
        </Grid>

        <Grid item md={2} xs={12} sm={12} >
        { (isTableCreated == -1 || !isTableCreated) ?  <StyledButtonRed onClick={() => createTable() } > Create Tables </ StyledButtonRed>
        : <StyledButtonBlue onClick={() => createTable() } > Create Tables </ StyledButtonBlue> }
        </Grid>

        <Grid item md={2} xs={12} sm={12} >
        { (isTableInserted == -1 || !isTableInserted) ? < StyledButtonRed onClick={() => insertTable() } > Insert into Tables </ StyledButtonRed>
        : < StyledButtonBlue onClick={() => insertTable() } > Insert into Tables </ StyledButtonBlue> }
        </Grid>
        
        <Grid item md={2} xs={12} sm={12} >
        { (!userId) ? < StyledButtonRed onClick={() => setopenLoginPopUp(true)} > Login </ StyledButtonRed>
        :  < StyledButtonBlue onClick={() => setopenLoginPopUp(true)} > Login </ StyledButtonBlue>}
        </Grid>


        {openserviePopUp && <ServiePopUp  
        setopenserviePopUp = {e => setopenserviePopUp(e)}
        sentServiceURL = { e => {setserviceURL(e); checkConnection(e) } } 
        />} 
        {openDBPopUp && <DbPopUp
        setopenDBPopUp = {e => setopenDBPopUp(e) }
        sentDbConn = { e => { setdbConn(e);  checkDBConnection(e) } } 
        /> }
        {openLoginPopUp && <LoginPopUp
        setopenLoginPopUp = {e => setopenLoginPopUp(e) }
        sentUser = { e => { setUserName(e);  fetchUserDatils(e) } } 
        /> }


        {tableData && tableData.length ? <Grid item md={11} xs={11} sm={11} >
            <GenerateTableComponent
            columns={ [{id:"project title",label:'Project Title'},
                        {id:'category_name',label:'Catgory Name'},
                        {id:'username',label:'User Name'}] }
            tableData = {tableData}
            />
        </Grid> :
         <Grid item >
         <p className="header" > Create Connection and Login !  </p>
     </Grid> }



      </Grid>

    </div>
  );
}



const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useForm = makeStyles((theme) => ({
  formfields: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));



const  StyledButtonRed = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

const  StyledButtonBlue = withStyles({
  root: {
    background: 'linear-gradient(45deg, #93CFC2 30%, #136F7E 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


const ServiePopUp = (props) => {

const classesForm = useForm();

  const {setopenserviePopUp, sentServiceURL }  = props;

  const [serviceURL , setserviceURL ] = useState('localhost:5000');

  return <Dialog
    onClose={() => setopenserviePopUp(false)} open={1} >
    <DialogTitle id="customized-dialog-title" onClose={() => setopenserviePopUp(false)} style={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
      Enter Service Url
      </DialogTitle>
    <DialogContent dividers>
      <Grid container>
        <TextField
        id={'service'} 
        type={'string'} 
        // error={ 0} 
        key= {100}
          required label={"Enter service URL "}
          value= {serviceURL}
          // helperText={index === errorfield ? 'Enter Field value' : ''}
          color="primary" 
          onChange={(e) =>  {setserviceURL(e.target.value)}
          } />
      </Grid>
    </DialogContent>
    <DialogActions>
      < StyledButtonRed onClick={e => sentServiceURL(serviceURL) } >
        Check Connection
        </ StyledButtonRed>
    </DialogActions>
  </Dialog>
}

const DbPopUp = (props) => {

const classesForm = useForm();

  const { setopenDBPopUp  , sentDbConn }  = props;

  const [dbUser , setdbUser] = useState('');
  const [dbPassword , setdbPassword] = useState('');
  const [dbServer , setdbServer] = useState('');
  const [dbDatabase , setdbDatabase] = useState('');

  return <Dialog
    onClose={() => setopenDBPopUp(false)} open={1} >
    <DialogTitle id="customized-dialog-title" onClose={() => setopenDBPopUp(false)} style={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
      Connection with DB
      </DialogTitle>
    <DialogContent dividers>
      <Grid container>
      <form className={classesForm.formfields} noValidate autoComplete="off">
        <TextField
          required label={"Enter db  user "}
          // helperText={index === errorfield ? 'Enter Field value' : ''}
          color="primary" onChange={(e) => setdbUser(e.target.value)} />

        <TextField
          required label={"Enter db  password "}
          type="password"
          // helperText={index === errorfield ? 'Enter Field value' : ''}
          color="primary" onChange={(e) => setdbPassword(e.target.value)} />

        <TextField
          required label={"Enter db  server "}
          // helperText={index === errorfield ? 'Enter Field value' : ''}
          color="primary" onChange={(e) => setdbServer(e.target.value)} />
        <TextField
          required label={"Enter db  name "}
          // helperText={index === errorfield ? 'Enter Field value' : ''}
          color="primary" onChange={(e) => setdbDatabase(e.target.value)} />
          </form>
      </Grid>
    </DialogContent>
    <DialogActions>
      < StyledButtonRed onClick={e =>   {

        const dbDetails = {
          user: dbUser,
          password: dbPassword,
          server: dbServer,
          database: dbDatabase,
        }

        sentDbConn( dbDetails )
        
        } } >
        Check Connection
        </ StyledButtonRed>
    </DialogActions>
  </Dialog>
}


const LoginPopUp = (props) => {


  const {setopenLoginPopUp, sentUser }  = props;

  const [ username , setusername ] = useState('');
  const [ password , setpassword] = useState('');

  return <Dialog
    onClose={() => setopenLoginPopUp(false)} open={1} >
    <DialogTitle id="customized-dialog-title" onClose={() => setopenLoginPopUp(false)} style={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
      Enter Username
      </DialogTitle>
    <DialogContent dividers>
      <Grid container>
        <TextField
          id={'Username'}
          type={'string'}
          key={100}
          required label={"Enter Username"}
          value={username}
          color="primary"
          onChange={(e) => { setusername(e.target.value) }
          } />
        <Grid container>
          <TextField
            id={'password'}
            type={'password'}
            key={100}
            required label={"Enter password"}
            value={password}
            color="primary"
            onChange={(e) => { setpassword(e.target.value) }
            } />
      </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      < StyledButtonRed onClick={e => sentUser( { username:username,password:password } ) } >
        Fetch User Details
        </ StyledButtonRed>
    </DialogActions>
  </Dialog>
}



const useStylesSnack = makeStyles((theme) => ({
  rootsnack: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


export default App;

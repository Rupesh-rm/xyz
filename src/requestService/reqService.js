import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, ListItemButton, useTheme, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TableContainer, Table, TableBody, TableCell, TableRow, Paper, DialogContentText, MenuItem, Select, FormControl, InputLabel, Badge, } from '@mui/material';
import app from '../firebase/config';
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { tokens } from "../theme";
import SourceIcon from '@mui/icons-material/Source';
import Favorite from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ShowAlert from '../components/ShowAlert';

const db = getDatabase(app);

const RequestServices = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate()
    const [dilogData, setDilogData] = useState([]);
    const [openSelectDilog, setSelectDilog] = useState(false);
    const [select, setSelect] = useState(2);
    const [open, setOpen] = useState(false);
    const [openRequestServiceDilogBox, setOpenRequestServiceDilogBox] = useState(false)

    const [userData, setUserData] = useState([])
    const [requsestServicesData, setrequsestServicesData] = useState([]);

    const [userName, setUSerName] = useState(null)
    const [userUid, setUserUid] = useState(null)
    const [userSeq, setUserSeq] = useState(null)
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    // console.log(`Mysrc/${userUid}/${userSeq}`);

    useEffect(() => {
        const dbRef = ref(db);
        get(child(dbRef, `User/`))
            .then((snapshot) => {
                const data = snapshot.val();
                setUserData([])
                if (snapshot.exists()) {
                    Object.values(data).map((users) => {
                        return setUserData((oldusers) => [...oldusers, users])
                    })
                }
            })
            .catch((error) => {
                console.log("data is not avilable", error.message);
            });
    }, [userData]);

    //handdle Open Select DilogBox
    const handdleOpenSelectDilogBox = (uid, name, seq) => {
        // open dilog when click user profile
        setSelectDilog(true)

        // get user details data 
        const dbRef = ref(db);
        get(child(dbRef, `User/${uid}`))
            .then((snapshot) => {
                const data = snapshot.val();
                setDilogData([])
                if (snapshot.exists()) {
                    setDilogData(data)
                }
            })
            .catch((error) => {
                console.log("data is not avilable", error.message);
            });


        // get request services data 
        get(child(dbRef, `Mysrc/${uid}`))
            .then((snapshot) => {
                const data = snapshot.val();
                setrequsestServicesData([])
                if (snapshot.exists()) {
                    Object.values(data).map((reqServiceData) => {
                        // console.log("reqServiceData", reqServiceData)
                        return setrequsestServicesData((oldreqServiceData) => [...oldreqServiceData, reqServiceData])
                    })
                }
            })
            .catch((error) => {
                console.log("data is not avilable", error.message);
            });

       
       // set user name as a global variable
            setUSerName(name);


        //update request seen
 
      
        update(child(dbRef, `Mysrc/${uid}/${seq}`), {
            seen: true
        }).then(() => {
            console.log("Updated")
        }).catch(err => console.log("not updated ",err.message))
    }
    //handdle Open Select DilogBox
    const handdlColseSelectDilogBox = () => {
        setSelectDilog(false)
    }

    //close user details dilog box
    const handleClose = () => {
        setOpen(false);
    };

    // select your choice 
    const handdleAdminSelection = (e) => {
        setSelect(e.target.value)
        if (e.target.value === 1) {
            setOpen(true)
        }
        if (e.target.value === 2) {
            setOpenRequestServiceDilogBox(true);
       
        }
    }






    //Close service request dilog box 
    const handdleCloseReqServiceDilog = () => {
        setOpenRequestServiceDilogBox(false)
    }
    // add fav client
    const addFavClient = (uid, seen) => {
        const dbRef = ref(db);
        if (seen === false) {
            update(child(dbRef, `User/${uid}`), {
                seen: true
            }).then(() => {
                // alert("User added in Favorite List")
                setOpenAlert(true)
                setAlertMessage("User added in Favorite List")

            }).catch(err => alert(err.message))
        } else {
            update(child(dbRef, `User/${uid}`), {
                seen: false
            }).then(() => {
                // alert("User removed from Favorite List")
                setOpenAlert(true)
                setAlertMessage("User removed from Favorite List")

            }).catch(err => alert(err.message))
        }
    }

    //view the client documents

    const viewDocument = (uid) => {
        navigate(`/documents/${uid}`);
        setTimeout(() => {
            set(ref(db, `/temp/`), {
                uid
            });
        }, 1000);
    }

    // dilog title bar
    function BootstrapDialogTitle(props) {
        const { children, onClose, ...other } = props;
        return (
            <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: colors.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    }

    return (
        <Box m="20px">
            <Header title="Users" subtitle="User Request Service" />
            <ShowAlert
                sx={{ display: "none" }}
                message={alertMessage}
                show={openAlert}
                hide={() => { setOpenAlert(false) }}
            />
            {/* user list  */}
            {/*========================================== all user   =======================================================  */}
            <List  >
                <Grid container item xs={12}  >
                    {userData.map((user, index) => {

                        return (
                            <Grid key={index} item xs={3} sx={{ width: '100%', borderColor: colors.primary[500], borderWidth: "2px", borderStyle: "solid", maxWidth: 400, background: colors.blueAccent[900] }} >
                                <ListItem   >
                                    <ListItemAvatar>

                                        {/*  */}
                                        <Badge color="primary" badgeContent={requsestServicesData.length}>

                                            <Avatar alt={user.name} src={user.profile} onClick={() => { handdleOpenSelectDilogBox(user.uid, user.name, user.seq) }} />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.name}
                                        sx={{
                                            "& 	.MuiListItemText-primary": {
                                                color: colors.greenAccent[400],
                                                fontSize: "18px"
                                            }
                                        }}

                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color={"text.primary"}
                                                >
                                                    {user.lastseen}
                                                </Typography>

                                            </React.Fragment>
                                        }
                                    />
                                    <ListItemButton edge="end" aria-label="like" >
                                        {
                                            user.seen ? <Favorite sx={{ color: colors.redAccent[600] }} onClick={() => addFavClient(user.uid, user.seen)} /> : <Favorite sx={{ color: "white" }} onClick={() => addFavClient(user.uid, user.seen)} />
                                        }

                                    </ListItemButton>
                                </ListItem>

                            </Grid>
                        )

                    })}
                </Grid>
            </List>

            {/*==================================Dilog box : select see details  ==================================================  */}
            <div>

                <Dialog
                    open={openSelectDilog}
                    onClose={handdlColseSelectDilogBox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Select Your Choice?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <FormControl sx={{ margin: "12px 20px", minWidth: 150, color: colors.greenAccent[500], }}>
                                <InputLabel id="demo-simple-select-autowidth-label " sx={{ color: colors.greenAccent[500] }} >Select your choice</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={select}
                                    onChange={handdleAdminSelection}
                                    autoWidth
                                    label="Select your choice"
                                >
                                    <MenuItem value={1}>See user details </MenuItem>
                                    <MenuItem value={2}>See user service Request</MenuItem>

                                </Select>
                            </FormControl>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {select && <Button onClick={() => { setOpenRequestServiceDilogBox(true) }} color="secondary" variant="outlined" > Open </Button>}
                        <Button onClick={handdlColseSelectDilogBox} color="secondary" variant="outlined" > Close </Button>
                    </DialogActions>
                </Dialog>
            </div>


            {/*==================================Dilog box : Request service user  ==================================================  */}
            <div>
                <Dialog
                    open={openRequestServiceDilogBox}
                    onClose={handdleCloseReqServiceDilog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {`${userName} Request These Services....`}
                    </DialogTitle>
                    <DialogContent>

                        <DialogContentText id="alert-dialog-description">

                            {requsestServicesData.map((userRequsestServices, index) => {
                                return (
                                    <Grid key={index} item xs={3} sx={{ width: '100%', maxWidth: 400, background: colors.blueAccent[900] }} >
                                        <ListItem   >
                                            <ListItemAvatar>
                                                <Avatar alt={userRequsestServices.name} src={userRequsestServices.img} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={userRequsestServices.srcname}
                                                sx={{
                                                    "& 	.MuiListItemText-primary": {
                                                        color: colors.greenAccent[400],
                                                        fontSize: "18px"
                                                    }
                                                }}

                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color={"text.primary"}
                                                        >
                                                            {userRequsestServices.date}
                                                        </Typography>

                                                    </React.Fragment>
                                                }
                                            />
                                            <ListItemButton edge="end" aria-label="like" >
                                            </ListItemButton>
                                        </ListItem>

                                    </Grid>
                                )

                            })}

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handdleCloseReqServiceDilog} color="secondary" variant="outlined" > Close </Button>
                    </DialogActions>
                </Dialog>
            </div>


            {/*==================================Dilog box : user all details  ==================================================  */}
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                sx={{
                    '& .MuiDialogContent-root': {
                        width: "500px",
                        background: colors.blueAccent[800]
                    },
                    '& .MuiDialogActions-root': {
                        padding: "5px",
                    },
                }}
            >
                <BootstrapDialogTitle id="customized-dialog-title" sx={{ background: colors.blueAccent[900] }} onClose={handleClose}>
                    {dilogData.name}
                </BootstrapDialogTitle>
                <DialogContent dividers  >
                    <Grid container spacing={2} >
                        <Grid item xs={3}  >
                            <Avatar
                                alt={dilogData.name}
                                src={dilogData.profile}
                                sx={{ width: 70, height: 70 }}
                            />
                        </Grid>
                        <Grid item xs={9}  >
                            <ListItemText
                                primary={dilogData.name}

                                sx={{
                                    "& 	.MuiListItemText-primary": {
                                        color: colors.greenAccent[400],
                                        fontSize: "18px"
                                    }
                                }}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color={"text.primary"}
                                        >
                                            {dilogData.lastseen}
                                        </Typography>

                                    </React.Fragment>
                                }
                            />
                        </Grid>
                    </Grid>

                    <TableContainer sx={{ marginTop: "10px" }} component={Paper}>
                        <Table sx={{ minWidth: 300 }} aria-label="simple table">
                            <TableBody>
                                <TableRow
                                    key={1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Name</TableCell>
                                    <TableCell align="center">{dilogData.name}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={2}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">About</TableCell>
                                    <TableCell align="center">{dilogData.about}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={3}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Phone No.</TableCell>
                                    <TableCell align="center">{dilogData.phone}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={4}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Email</TableCell>
                                    <TableCell align="center">{dilogData.email}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={5}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Password</TableCell>
                                    <TableCell align="center">{dilogData.passwrd}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={6}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Acopen</TableCell>
                                    <TableCell align="center">{dilogData.acopen}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={7}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Address</TableCell>
                                    <TableCell align="center">{dilogData.adress}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={8}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Age</TableCell>
                                    <TableCell align="center">{dilogData.age}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={9}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Corration</TableCell>
                                    <TableCell align="center">{dilogData.corration}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={10}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Last Address</TableCell>
                                    <TableCell align="center">{dilogData.lastadres}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={11}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Last Active Address</TableCell>
                                    <TableCell align="center">{dilogData.lastloginadres}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={12}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Last Active Date</TableCell>
                                    <TableCell align="center">{dilogData.lastlogindate}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={13}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Lastseen</TableCell>
                                    <TableCell align="center">{dilogData.lastseen}</TableCell>
                                </TableRow>
                                <TableRow
                                    key={14}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">Seen</TableCell>
                                    <TableCell align="center">{dilogData.seen}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                </DialogContent>
                <DialogActions sx={{ background: colors.blueAccent[900] }}>
                    <IconButton onClick={() => { viewDocument(dilogData.uid) }} >
                        <SourceIcon />
                    </IconButton>

                    <Button variant="contained" sx={{ background: colors.greenAccent[500], }} onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default RequestServices;
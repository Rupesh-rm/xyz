import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, ListItemButton, useTheme, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TableContainer, Table, TableBody, TableCell, TableRow, Paper, } from '@mui/material';
import app from '../../firebase/config';
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { tokens } from "../../theme";
import SourceIcon from '@mui/icons-material/Source';

import Favorite from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import ShowAlert from '../../components/ShowAlert';

const db = getDatabase(app);

const AllUserList = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dilogData, setDilogData] = useState([]);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState([]);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  // open user details dilogbox
  const handleClickOpen = (uid) => {
    setOpen(true);
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

  };

  //close user details dilog box
  const handleClose = () => {
    setOpen(false);
  };


  // read user data
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


  // add fav client
  const addFavClient = (uid, seen, name) => {
    const dbRef = ref(db);
    if (seen === false) {
      update(child(dbRef, `User/${uid}`), {
        seen: true
      }).then(() => {
        setOpenAlert(true);
        let msg = `<h2> ${name} </h2> Added In Favorite List`;
        setAlertMessage(msg)
        // setAlertMessage(` Added In Favorite List`)
      }).catch(err => alert(err.message))
    } else {
      update(child(dbRef, `User/${uid}`), {
        seen: false
      }).then(() => {
        setOpenAlert(true);
        setAlertMessage(` <h2> ${name} </h2> Removed from Favorite List`)
        // setAlertMessage(`  Removed from Favorite List`)

      }).catch(err => console.log(err.message))
    }
  }

  //view the client documents
  const navigate = useNavigate()
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
      <Header title="Users" subtitle="Your All Users" />
      <ShowAlert
        sx={{ display: "none" }}
        message={alertMessage}
        show={openAlert}
        hide={() => { setOpenAlert(false) }}
      />
      {/* user list  */}
      <List  >
        <Grid container item xs={12}  >
          {userData.map((user, index) => {

            return (
              <Grid key={index} item xs={3} sx={{ width: '100%', borderColor: colors.primary[500], borderWidth: "2px", borderStyle: "solid", maxWidth: 400, background: colors.blueAccent[900] }} >
                <ListItem   >
                  <ListItemAvatar>
                    <Avatar alt={user.name} src={user.profile} onClick={() => handleClickOpen(user.uid)} />
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
                      user.seen ? <Favorite sx={{ color: colors.redAccent[600] }} onClick={() => addFavClient(user.uid, user.seen, user.name)} /> : <Favorite sx={{ color: "white" }} onClick={() => addFavClient(user.uid, user.seen, user.name)} />
                    }

                  </ListItemButton>
                </ListItem>
              </Grid>
            )
            //bol 
          })}
        </Grid>
      </List>

      {/* dilog box : user all details */}
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

export default AllUserList;
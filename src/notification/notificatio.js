import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  ListItemButton,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import app from '../firebase/config';
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { tokens } from "../theme";
import Favorite from '@mui/icons-material/Favorite';
import Header from '../components/Header';
import ShowAlert from '../components/ShowAlert';

const db = getDatabase(app);

const Notifications = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openSelectDilog, setSelectDilog] = useState(false);
  const [select, setSelect] = useState(1);
  const [openAllNotificationDilogBox, setOpenAllNotificationDilogBox] = useState(false)
  const [openSendNotificationDilogBox, setOpenSendNotificationDilogBox] = useState(false)
  const [openRecevedNotificationDilogBox, setOpenRecevedNotificationDilogBox] = useState(false)
  const [userData, setUserData] = useState([]);
  // console.log(userData)
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("");
  const [notificationNameTitle, SetNotificationNameTitle] = useState("")
  const [notificationNameSublect, SetNotificationNameSublect] = useState("")
  const [notificationNameMessage, SetNotificationNameMessage] = useState("")
  const [userUid, setUserUid] = useState("")
  const [receveNotificationData, setReceveNotificationData] = useState([])
  const [sendNotificationData, setSendNotificationData] = useState([])
  console.log("sendNotificationData", "   : ", sendNotificationData)

  //read all user data
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
  const handdleOpenSelectDilogBox = (uid, seq) => {
    setSelectDilog(true);
    setUserUid(uid);
  }
  //handdle Open Select DilogBox
  const handdlColseSelectDilogBox = () => {
    setSelectDilog(false)
  }

  // select your choice 
  const handdleAdminSelection = (e) => {
    setSelect(e.target.value);
    if (e.target.value === 1) {
      setOpenAllNotificationDilogBox(true)
    }
    if (e.target.value === 2) {
      setOpenSendNotificationDilogBox(true)
    }
    if (e.target.value === 3) {
      setOpenRecevedNotificationDilogBox(true)
    }

  }

  //Close service request dilog box 
  const handdleCloseReqServiceDilog = () => {
    setOpenAllNotificationDilogBox(false)
  }

  // add fav client
  const addFavClient = (uid, seen, id) => {
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
        setOpenAlert(true)
        setAlertMessage("User removed from Favorite List")

      }).catch(err => alert(err.message))
    }
  }


  // send notification
  const handdleSendNotification = (e) => {
    e.preventDefault();
    console.log(`Notification Sanded title is ${notificationNameTitle}, subject is ${notificationNameSublect}, message is ${notificationNameMessage}`)
    const uid = new Date().getTime();
    set(ref(db, `NotificationSends/`), {
      tittle: notificationNameTitle,
      subject: notificationNameSublect,
      message: notificationNameMessage,
      uid
    }).then(() => {
      setOpenAlert(true)
      setAlertMessage("Notifiaction Sand SuccessFully ")
    })
  }

  // read notification
  useEffect(() => {
    const dbRef = ref(db);
    console.log("path is ", `Enq/${userUid}`)
    get(child(dbRef, `Enq/${userUid}`))
      .then((snapshot) => {
        const data = snapshot.val();
        setReceveNotificationData([]);
        setSendNotificationData([])
        if (snapshot.exists()) {

          Object.values(data).map((receveNotification) => {
            if (receveNotification.who === true) {
              return setSendNotificationData((oldSendNotification) => [...oldSendNotification, receveNotification])
            }
            return setReceveNotificationData((oldReceveNotification) => [...oldReceveNotification, receveNotification])
          })
          // setuserUid(data)
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userUid])
  return (
    <Box m="20px">
      <Header title="Notifications" subtitle="Menage Your All User Notification" />
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
                    <Avatar alt={user.name} src={user.profile} onClick={() => { handdleOpenSelectDilogBox(user.uid, user.seq) }} />
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
                      user.seen ? <Favorite sx={{ color: colors.redAccent[600] }} onClick={() => addFavClient(user.uid, user.seen, user.seq)} /> : <Favorite sx={{ color: "white" }} onClick={() => addFavClient(user.uid, user.seen)} />
                    }

                  </ListItemButton>
                </ListItem>

              </Grid>
            )
          })}
        </Grid>
      </List>

      {/*==========================================================Dilog box : select Notification type ==================================================  */}
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
                  <MenuItem value={1}>All Notifications </MenuItem>
                  <MenuItem value={2}>Send Notification</MenuItem>
                  <MenuItem value={3}>Receved Notification</MenuItem>
                </Select>
              </FormControl>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {select && <Button onClick={() => { setOpenAllNotificationDilogBox(true) }} color="secondary" variant="outlined" > Open </Button>}
            <Button onClick={handdlColseSelectDilogBox} color="secondary" variant="outlined" > Close </Button>
          </DialogActions>
        </Dialog>
      </div>


      {/*================================================== Dilog box : All Notification  ==================================================  */}
      <div>
        <Dialog
          open={openAllNotificationDilogBox}
          onClose={() => { setOpenAllNotificationDilogBox(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {` All Notification`}
          </DialogTitle>
          <DialogContent>

            <DialogContentText id="alert-dialog-description">
              this is All notification dilog box container
            </DialogContentText>


          </DialogContent>
          <DialogActions>
            <Button onClick={handdleCloseReqServiceDilog} color="secondary" variant="outlined" > Close </Button>
          </DialogActions>
        </Dialog>
      </div>


      {/*================================================== Dilog box : Send Notification  ==================================================  */}
      <div>
        <Dialog
          open={openSendNotificationDilogBox}
          onClose={() => { setOpenSendNotificationDilogBox(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {` Sended Notification 5`}
          </DialogTitle>
          <DialogContent>

            <Box m="20px" sx={{ display: "flex" }} >
              <form onSubmit={handdleSendNotification} style={{ display: "flex", flexDirection: "column" }} >
                <TextField
                  id="title"
                  label="Notification Title"
                  placeholder="Enter Your Notification Title"
                  multiline
                  variant="standard"
                  onChange={(e) => SetNotificationNameTitle(e.target.value)}
                  value={notificationNameTitle}
                  name="notificationNameTitle"
                  sx={{ width: "250px", marginTop: "5px" }}
                />
                <TextField
                  id="subject"
                  label="Notification Subject"
                  placeholder="Enter Your Notification Subject"
                  multiline
                  variant="standard"
                  onChange={(e) => SetNotificationNameSublect(e.target.value)}
                  value={notificationNameSublect}
                  name="notificationNameSublect"
                  sx={{ width: "250px", marginTop: "5px" }}
                />
                <TextField
                  id="message"
                  label="Notification Message"
                  placeholder="Enter Your Notification Message"
                  multiline
                  variant="standard"
                  onChange={(e) => SetNotificationNameMessage(e.target.value)}
                  value={notificationNameMessage}
                  name="notificationNameMessage"
                  sx={{ width: "250px", marginTop: "5px" }}
                />
                <Box display="flex" justifyContent="center" ml="20px" mt="20px" mb="10px">
                  <Button type="submit" color="secondary" variant="outlined">
                    Send Notification
                  </Button>

                </Box>
              </form>
            </Box>

            <DialogContentText id="alert-dialog-description">
              {sendNotificationData.length === 0 ? <Typography variant='h4' >Yet! ,  Not any notification</Typography> :

                sendNotificationData.map((sendNotificaion) => {
                  return (
                    <Box sx={{ width: '100%', maxWidth: 500 }}>
                      <Typography variant="h5" gutterBottom>
                        Tittle  is {sendNotificaion.titl}
                      </Typography>
                      <Typography variant="h5" gutterBottom>
                        Subject   is {sendNotificaion.sub}
                      </Typography>
                      <Typography variant="h5" gutterBottom>
                        Description   is {sendNotificaion.desc}
                      </Typography>
                      <Typography variant="h5" gutterBottom>
                        Date   is {sendNotificaion.date}
                      </Typography>
                    </Box>
                  )
                })

              }
            </DialogContentText>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenSendNotificationDilogBox(false) }} color="secondary" variant="outlined" > Close </Button>
          </DialogActions>
        </Dialog>
      </div>


      {/*================================================== Dilog box : Receved Notification  ==================================================  */}
      <div>
        <Dialog
          open={openRecevedNotificationDilogBox}
          onClose={() => { setOpenRecevedNotificationDilogBox(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {` Receved Notifications 5`}
          </DialogTitle>
          <DialogContent>

            <DialogContentText id="alert-dialog-description">
              {receveNotificationData.map((receveNotificaion) => {
                return (
                  <Box sx={{ width: '100%', maxWidth: 500 }}>
                    <Typography variant="h5" gutterBottom>
                      Tittle  is {receveNotificaion.titl}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Subject   is {receveNotificaion.sub}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Description   is {receveNotificaion.desc}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Date   is {receveNotificaion.date}
                    </Typography>
                  </Box>
                )
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenRecevedNotificationDilogBox(false) }} color="secondary" variant="outlined" > Close </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  )
}

export default Notifications;
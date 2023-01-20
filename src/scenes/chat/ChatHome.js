import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, ListItemButton, useTheme, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Dialog, DialogContent, DialogActions, IconButton, TextField, } from '@mui/material';
import app from '../../firebase/config';
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { tokens } from "../../theme";
import SourceIcon from '@mui/icons-material/Source';
import Favorite from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import currentDate from '../../utils/date';



const db = getDatabase(app);
const dbRef = ref(db);
const AllUserList = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dilogData, setDilogData] = useState([]);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState([])
  const [messageContainer, setmessageContainer] = useState([])
  // console.log("messageContainer", messageContainer)
  const [textMessage, setTextMessage] = useState("");
  const [messageUid, setmessageUid] = useState("");
  // console.log("messageUid1", messageUid);

  // get all users 
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

  // open chat box
  const handleClickOpen = (uid) => {
    setOpen(true);
    setmessageUid(uid)
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

  // close chat box 
  const handleClose = () => {
    setOpen(false);
  };

  // add fav client
  const addFavClient = (uid, seen) => {
    const dbRef = ref(db);
    if (seen === false) {
      update(child(dbRef, `User/${uid}`), {
        seen: true
      }).then(() => {
        alert("User added in Favorite List")
      }).catch(err => alert(err.message))
    } else {
      update(child(dbRef, `User/${uid}`), {
        seen: false
      }).then(() => {
        alert("User removed from Favorite List")
      }).catch(err => alert(err.message))
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


  //handdle message text state
  const handdleChangeMessage = (e) => {
    setTextMessage(e.target.value)
  }


  // send message : Adnin to user
  const handdleSendMessage = (uid) => {
    const id = new Date().getTime()
    set(ref(db, `/Chat/${uid}/${id}`), {
      admin: false,
      client: false,
      date: currentDate,
      id: `${id}`,
      text: textMessage,
      uid: `${uid}`,
      who: true,
    }).then(() => {
      setTextMessage("")
      console.log("message send SuccessFully")
    }).catch((err) => alert(err.message));
  }

  //read user messages
  useEffect(() => {
    const dbRef = ref(db);
    get(child(dbRef, `/Chat/${messageUid}/`))
      .then((snapshot) => {
        const data = snapshot.val();
        setmessageContainer([])
        if (snapshot.exists()) {
          Object.values(data).map((usersMessages) => {
            // console.log(usersMessages);
            return setmessageContainer((oldMessages) => [...oldMessages, usersMessages])
          })
        }
      })
      .catch((error) => {
        console.log("data is not avilable", error.message);
      });
  });

  // update seen if user see the messages
  const updateSeen = () => {
    messageContainer.map((message) => {
      // console.log(message.who)
      if (message.who === false) {
        update(child(dbRef, `Chat/${message.uid}/${message.id}/`), {
          client: true
        }).then(() => {
          console("updated client")
        }).catch(err => console(err.message))
      }
    })
  }
  useEffect(() => {
    updateSeen()
  })
  return (
    <Box m="20px">
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
                      user.seen ? <Favorite sx={{ color: colors.redAccent[600] }} onClick={() => addFavClient(user.uid, user.seen)} /> : <Favorite sx={{ color: "white" }} onClick={() => addFavClient(user.uid, user.seen)} />
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

          <Box sx={{ width: "100%", maxHeight: "330px", overflowY: "scroll", marginTop: "10px" }} >
            {
              messageContainer.map((message) => {
                // console.log("uid is ", message.uid, "and  id is ", message.id)
                if (message.who === true) {
                  return (
                    <Box sx={{ marginTop: "5px", marginRight: "10px", color: colors.greenAccent[500] }} textAlign="right">{message.text}</Box>
                  )
                }
                if (message.who === false) {
                  return (
                    <Box sx={{ marginTop: "5px", marginLeft: "10px", color: "white" }} textAlign="left">{message.text}</Box>
                  )
                }
              })
            }
          </Box>

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }} >

              <TextField name='textMessage' value={textMessage} variant='standard' fullWidth placeholder="Type something....." onChange={handdleChangeMessage} />
              <IconButton onClick={() => { handdleSendMessage(dilogData.uid) }} >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>

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
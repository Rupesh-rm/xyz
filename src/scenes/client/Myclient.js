import React, { useState, useEffect } from "react";
import { Favorite } from "@mui/icons-material";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system"
import Header from "../../components/Header";
import { tokens } from "../../theme";
import app from "../../firebase/config";
import { child, get, getDatabase, ref as rdbf } from "firebase/database";


const db = getDatabase(app);
const MyClient = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [datas, setDatas] = useState([]);
  
    const handleClickOpen = () => { }

    useEffect(() => {
        const dbRef = rdbf(db);
        get(child(dbRef, `User/`))
            .then((snapshot) => {
                const data = snapshot.val();
                setDatas([])
                if (snapshot.exists()) {
                    Object.values(data).map((favUsers) => {
                        if (favUsers.seen === true) {
                            return setDatas((oldfavUsers) => [...oldfavUsers, favUsers])
                        }
                        // console.log("fff",favUsers)
                    })
                }
            })
            .catch((error) => {
                console.log("data is not avilable", error.message);
            });
    }, [datas]);
    return (
        <Box m="20px">
            <Header title="My Client" subtitle="Menage your Favorite client" />
            <Box m="20px">
                {/* user list  */}
                <List  >
                    <Grid container item xs={12}  >
                        {datas.map((user, index) => {
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
                                            {/* {user.seen ? <Favorite sx={{ color: colors.redAccent[600] }} onClick={() => addFavClient(user.uid, user.seen)} /> : <Favorite sx={{ color: "white" }} onClick={() => addFavClient(user.uid, user.seen)} />} */}
                                            <Favorite sx={{ color: colors.redAccent[600] }} />
                                        </ListItemButton>
                                    </ListItem>
                                </Grid>
                            )
                            //bol 
                        })}
                    </Grid>
                </List>
            </Box>
        </Box>
    )
}

export default MyClient;
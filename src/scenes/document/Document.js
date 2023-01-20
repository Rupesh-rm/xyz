

import { Box, Button, IconButton, TextField, useTheme } from "@mui/material"
import {  useState } from "react"
import { tokens } from "../../theme";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternate"
import Header from "../../components/Header";
import { child, get, getDatabase, ref, set } from "firebase/database";
import app from "../../firebase/config";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Cards from "../../components/Card";
import { getDownloadURL, getStorage, uploadBytesResumable, ref as storageRef } from "firebase/storage";
import currentDate from "../../utils/date";





const db = getDatabase(app);

const Document = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [documentName, setDocumentName] = useState("")

    const [userUid, setuserUid] = useState("")
    // window.uidD = userUid;
    // console.log("userUid", userUid);
    const [userDoc, setUserDoc] = useState([])
    // console.log(userDoc.length);
    const [age, setAge] = useState('');

    // send doc
    const storageForImg = getStorage(app);
    const [img, setImg] = useState();
    const storageRefForImage = storageRef(storageForImg, `Document/${userUid}`)
    const [percent, setPercent] = useState(0);

    const tempUid = () => {
        const dbRef = ref(db);
        get(child(dbRef, `temp/`))
            .then((snapshot) => {
                const data = snapshot.val();
                if (snapshot.exists()) {
                    // console.log("uid", data)
                    setuserUid(data)
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }
    tempUid()

    const handleChangeText = async (event) => {
        setAge(event.target.value);


        if (event.target.value === 2) {
            const dbRef = ref(db);
            get(child(dbRef, `/Docu/${userUid.uid}/`))
                .then((snapshot) => {
                    const data = snapshot.val();
                    setUserDoc([])
                    if (snapshot.exists()) {
                        // console.log(data);

                        Object.values(data).map((userDocs) => {
                            console.log("who", userDocs.who);
                            if (userDocs.who === true) {
                                return setUserDoc((oldDoc) => [...oldDoc, userDocs])
                            }

                            // console.log("user doc is ...........", userDocs)
                        })

                    } else {
                        console.log("No data available");
                        alert("this user have not any document")
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            console.log("2")
        } else {
            if (event.target.value === 3) {
                const dbRef = ref(db);
                get(child(dbRef, `/Docu/${userUid.uid}/`))
                    .then((snapshot) => {
                        const data = snapshot.val();
                        setUserDoc([])
                        if (snapshot.exists()) {
                            // console.log(data);
                            Object.values(data).map((userDocs) => {
                                console.log("who", userDocs.who);
                                if (userDocs.who === false) {
                                    return setUserDoc((oldDoc) => [...oldDoc, userDocs])
                                }
                                // console.log("user doc is ...........", userDocs)
                            })

                        } else {
                            console.log("No data available");
                            alert("this user have not any document")
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            } else {
                console.log("uid2", userUid.uid,);

                const dbRef = ref(db);
                get(child(dbRef, `/Docu/${userUid.uid}/`))
                    .then((snapshot) => {
                        const data = snapshot.val();
                        setUserDoc([])
                        if (snapshot.exists()) {
                            console.log(data);

                            Object.values(data).map((userDocs) => {
                                return setUserDoc((oldDoc) => [...oldDoc, userDocs])
                                // console.log("user doc is ...........", userDocs)
                            })

                        } else {
                            console.log("No data available");
                            alert("this user have not any document")
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            }
        }
    }
    const handleChangeImage = (e) => {
        setImg(e.target.files[0])
    }
    const handleUploadImage = (e) => {
        e.preventDefault()
        if (!img) {
            alert("Select your image first")
        } else {
            const uploadImg = uploadBytesResumable(storageRefForImage, img);
            uploadImg.on("state_changed", (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100);

                // update progress
                setPercent(percent);
            },
                (err) => alert(err.message),
                () => {
                    getDownloadURL(uploadImg.snapshot.ref).then((url) => {
                        console.log(url)
                        const uid = new Date().getTime();
                        set(ref(db, `/Docu/${userUid.uid}/${uid}`), {
                            date: currentDate,
                            url,
                            id: `${uid}`,
                            name: documentName,
                            seen: false,
                            type: "pdf",
                            uid: `${userUid.uid}`,
                            who: true
                        })
                    })
                }
            )
        }
    }
    return (
        <Box m="20px" >
            <Header title="Documents" subtitle="User document" />
            <Box m="20px" sx={{ display: "flex", width: "100%" }} >
                <IconButton color="primary" aria-label="upload picture" component="label">
                    <input onChange={handleChangeImage} hidden accept=".pdf" type="file" />
                    <AddPhotoAlternateOutlinedIcon
                        sx={{
                            color: colors.greenAccent[400],
                            fontSize: "60px",
                            marginRight: "30px"
                        }} />
                </IconButton>
                <form onSubmit={handleUploadImage} style={{ display: "flex" }} >
                    <TextField
                        id="standard-textarea"
                        label="Document Title"
                        placeholder="Enter Your Document Title"
                        multiline
                        variant="standard"

                        onChange={(e) => setDocumentName(e.target.value)}
                        value={documentName}
                        name="documentName"
                        sx={{ width: "250px", marginTop: "5px" }}

                    />
                    <Box display="flex" justifyContent="center" ml="20px" mt="20px" mb="10px">
                        <Button type="submit" color="secondary" variant="outlined">
                            Add Document
                        </Button>

                    </Box>
                </form>
                <div>
                    <FormControl sx={{ margin: "12px 20px", minWidth: 80 }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Document</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={age}
                            onChange={handleChangeText}
                            autoWidth
                            label="Documents"
                        >
                            <MenuItem value={1}>All </MenuItem>
                            <MenuItem value={2}>Send</MenuItem>
                            <MenuItem value={3}>Receved</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </Box>
            <Box sx={{ display: "flex", gap: "30px", flexWrap: "wrap" }} >

                {

                    userDoc.map((doc, index) => {
                        // console.log("allUserDoc",doc)

                        return (
                            <Cards
                                key={index}
                                img={doc.url}
                                date={doc.date}

                            />
                        );
                    })
                }
            </Box>
        </Box>
    )
}


export default Document
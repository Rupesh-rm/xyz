import { forwardRef, useEffect, useState, createContext } from "react";
import app from "../../firebase/config";
import Header from "../../components/Header";
import Cards from "../../components/Card";
import Card from '@mui/material/Card';
import { useTheme, IconButton, Box, Button, TextField, useMediaQuery, Typography, Toolbar, AppBar, Dialog, Slide, Grid, Stack, ImageList, ImageListItem, Accordion, AccordionSummary, AccordionDetails, AccordionActions } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { tokens } from "../../theme";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getDatabase, ref as rdbf, set, child, get, remove, update, } from "firebase/database";
import currentDate from "../../utils/date";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/DeleteForever";

const UserContext = createContext()


const db = getDatabase(app);
const storage = getStorage(app);
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddServices = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
    const [imageAsFile, setImageAsFile] = useState('')
    const [allImages, setAllImages] = useState([])
    const [allTexts, setAllTexts] = useState([])
    // console.log("all images", allImages);
    const [imagePercent, setimagePercent] = useState(0);
    const [header, setHeader] = useState("");
    const [textField, setTextField] = useState("");
    const [textFieldTitle, setTextFieldTitle] = useState("");
    const [suid_, setSuid] = useState("")
    const [cards, setCards] = useState([]);

    // console.log(cards)
    const [open, setOpen] = useState(false);
    const allInputs = { imgUrl: '' }
    const [imageAsUrl, setImageAsUrl] = useState(allInputs)
    const storageRef = ref(storage, `/Src/${file.name}`);
    const storageRefimg = ref(storage, `/SrcSource/${imageAsFile.name}`);


    const FavoritUserContext = createContext();










    //    dilogbox start 
    const handleClose = () => {
        setOpen(false);
    };
    // open dilog box 
    const openDilog = (suid) => {
        setOpen(true);
        setSuid(suid)
    }
    //    dilogbox end 

    // Handle file upload event and update state
    function handleChange(event) {
        setFile(event.target.files[0]);
    }
    // write data : Add services
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            alert("Insert Your Image Before Insert")
        }
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setPercent(percent);
            },
            (err) => alert(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    const uid = new Date().getTime();
                    set(rdbf(db, `/Src/${uid}/`), {
                        date: currentDate,
                        uid: `${uid}`,
                        img: url,
                        name: header,
                        top: true
                    });
                });
            }
        );
        // alert("clicked")
    }
    // read data : rander services
    useEffect(() => {
        const dbRef = rdbf(db);
        get(child(dbRef, 'Src/'))
            .then((snapshort) => {
                const data = snapshort.val();
                if (snapshort.exists()) {
                    setCards([]);
                    Object.values(data).map((cards) => {
                        return setCards((oldCard) => [...oldCard, cards])
                    })
                } else {
                    console.log("Data is not available")
                }
            }).catch((err) => {
                console.error(err.message);
            })
    });
    // delete data 
    const deleteCardItems = (id) => {
        // delete image url


        deleteObject(storageRef)
            .then(() => {
                alert("Url has been deleted");
            })
            .catch((error) => {
                alert("Url has been not deleted", error.message);

            });


        setTimeout(() => {
            // delete header text and other
            remove(rdbf(db, `Src/${cards[id].uid}`));
        }, 500);
    }
    //insert at top
    const insrtTop = (uid, top, index) => {
        // alert(index)
        const dbRef = rdbf(db)
        if (top === true) {
            update(child(dbRef, `/Src/${uid}`), {
                top: false,
            }).then(() => {
                alert("Top cancle")
            }).catch(err => alert("Not Added top", err.message))
        }

        if (top === false) {
            update(child(dbRef, `/Src/${uid}`), {
                top: true,
            }).then(() => {
                alert("Add top")
            }).catch(err => alert("Not cancled top", err.message))

        }

    }
    // change state of image
    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        setImageAsFile(imageFile => (image))
    }
    // upload image : dilogbox images
    const addImage = (e) => {
        e.preventDefault()
        if (imageAsFile === '') {
            console.error(`not an image, the image file is a ${typeof (imageAsFile)}`)
        }
        const uploadTask = uploadBytesResumable(storageRefimg, imageAsFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const imagePercent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setimagePercent(imagePercent);
            },
            (err) => alert(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setImageAsUrl(prevObject => ({ ...prevObject, imgUrl: url }))
                    const uid = new Date().getTime();
                    set(rdbf(db, `SrcSource/${suid_}/simg/${uid}/`), {
                        img: url,
                        uid: `${uid}`,
                        suid: `${suid_}`
                    });
                });

            }
        );
    }
    //read data : dilog box - image
    const readServiceImages = () => {
        const dbRef = rdbf(db);
        get(child(dbRef, `SrcSource/${suid_}/simg/`))
            .then((snapshort) => {
                const data = snapshort.val();
                if (snapshort.exists()) {
                    setAllImages([])
                    Object.values(data).map((serviceData) => {
                        return setAllImages((oldImages) => [...oldImages, { image: serviceData.img, uid: serviceData.uid, suid: serviceData.suid }])
                    })
                } else {
                    console.log("Data is not available")
                }
            }).catch((err) => {
                console.info(err.message);
            })
    }
    //delete : dilog box - image
    const deleteServiceImagesOfDilogBox = (uid, suid_) => {
        alert(uid, suid_)
    }
    useEffect(() => {
        readServiceImages()
        readServiceText()
    })

    // upload text : dilogbox text
    const handleSubmitText = (e) => {
        e.preventDefault()
        const uid = new Date().getTime();
        if (!textFieldTitle && !textField) {
            alert("Please enter your texts")
        }
        set(rdbf(db, `SrcSource/${suid_}/stext/${uid}/`), {
            tittle: textFieldTitle,
            text: textField,
            uid: `${uid}`,
            suid: `${suid_}`
        });

    }
    //read data : dilog box - text
    const readServiceText = () => {
        const dbRef = rdbf(db);
        get(child(dbRef, `SrcSource/${suid_}/stext/`))
            .then((snapshort) => {
                const data = snapshort.val();
                if (snapshort.exists()) {
                    setAllTexts([])
                    Object.values(data).map((serviceData) => {
                        return setAllTexts((oldTexts) => [...oldTexts, { tittle: serviceData.tittle, paragraph: serviceData.text, uid: serviceData.uid, suid: serviceData.suid }])
                    })
                } else {
                    console.log("Data is not available")
                }
            }).catch((err) => {
                console.info(err.message);
            })
    }
    // delete accordians 
    const deleteAccordions = (uid, suid_, index) => {
        alert(uid, ":", index)
        // delete header text and other
        remove(rdbf(db, `SrcSource/${suid_}/stext/${uid}`))
            .then(() => alert("Deleted"))
            .catch((err) => alert("Not deleted", err.message))
    }

    return (
        <Box m="20px" width="98%">
            <Header title="Service" subtitle="Add your services here" />

            <Box display="flex" flexWrap="wrap" gap="30px" >
                <Card sx={{ minWidth: 310, marginBottom: "30px", padding: "20px" }} >
                    <Box display="flex" justifyContent="end" marginBottom="15px" >
                        <Typography >{percent}  % done </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" marginBottom="45px">
                        <IconButton color="primary" aria-label="upload picture" component="label">
                            <input onChange={handleChange} hidden accept="/image/*" type="file" />
                            <AddPhotoAlternateOutlinedIcon
                                sx={{
                                    color: colors.greenAccent[400],
                                    fontSize: "120px",
                                    margin: "auto"
                                }} />
                        </IconButton>

                    </Box>

                    <form onSubmit={handleFormSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >

                            <TextField
                                id="standard-textarea"
                                label="Header"
                                placeholder="Enter your header"
                                multiline
                                variant="standard"
                                fullWidth
                                onChange={(e) => setHeader(e.target.value)}
                                value={header}
                                name="header"
                                sx={{ gridColumn: "span 4", }}
                                margin="dense"
                            />
                        </Box>
                        <Box display="flex" justifyContent="center" mt="20px" mb="10px">
                            <Button type="submit" color="secondary" variant="outlined">
                                Add Service
                            </Button>

                        </Box>
                    </form>

                </Card>

                <Box sx={{ display: "flex", gap: "30px", flexWrap: "wrap" }} >
                    {cards.map((card, index) => {

                        return (
                            <Cards
                                img={card.img}
                                date={card.date}
                                header={card.name}
                                deleteItem={() => {
                                    deleteCardItems(index)
                                }}
                                favoritUser={() => insrtTop(card.uid, card.top, index)}
                                serviceAddSource={() => openDilog(card.uid)}
                            />
                        );
                    })}
                </Box>
            </Box>

            {/* dilog box start  */}
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', bgcolor: colors.primary[400] }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Sound
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button>


                    </Toolbar>
                </AppBar>

                <Grid container xs={12} spacing={2} sx={{
                    bgcolor: colors.primary[500]
                }} >
                    <Grid item xs={6} sx={{ borderRight: "3px solid white", marginTop: "20px" }} >
                        <Stack direction="column"
                            justifyContent="flex-start"
                            alignItems="baseline"
                            spacing={2}>
                            <form onSubmit={addImage}>
                                <IconButton color="primary" aria-label="upload picture" component="label">
                                    <input hidden onChange={handleImageAsFile} accept="/image/*" type="file" />
                                    <AddPhotoAlternateOutlinedIcon
                                        sx={{
                                            color: colors.greenAccent[400],
                                            fontSize: "50px"
                                        }} />
                                </IconButton>
                                <Button color="secondary" sx={{ textAlign: "right" }} variant="outlined" type="submit" disabled={!imageAsFile} >
                                    Add Image
                                    <button type="submit" hidden />
                                </Button>
                                <Typography variant="h5" alignItems="end" >{imagePercent} "% done"</Typography>
                            </form>
                        </Stack>
                        <ImageList sx={{ width: 600, height: 450, margin: "10px auto" }} cols={3} rowHeight={164}>
                            {allImages.map((allImagesData) => (
                                <ImageListItem key={allImagesData.uid}>
                                    <img className="myServiceImages"
                                        src={allImagesData.image}
                                        alt={allImagesData.uid}
                                    />
                                    <div class="hide">
                                        <IconButton>
                                            <DeleteIcon sx={{
                                                color: colors.greenAccent[500],
                                                fontSize: "28px"
                                            }} onClick={() => { deleteServiceImagesOfDilogBox(allImagesData.uid, allImagesData.uid) }} />
                                        </IconButton>
                                    </div>

                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Grid>

                    <Grid item xs={6} sx={{ marginTop: "20px" }} >
                        <Box
                            sx={{
                                width: 500,
                                maxWidth: '100%',
                            }}
                        >
                            <form onSubmit={handleSubmitText} >
                                <TextField
                                    id="standard-textarea"
                                    label="Title"
                                    placeholder="Enter your title"
                                    multiline
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setTextFieldTitle(e.target.value)}
                                    value={textFieldTitle}
                                    name="textFieldTitle"
                                    sx={{ gridColumn: "span 3", }}
                                    margin="dense"
                                />

                                <TextField
                                    id="standard-textarea"
                                    label="Your text "
                                    placeholder="Enter your text"
                                    multiline
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setTextField(e.target.value)}
                                    value={textField}
                                    name="textField"
                                    sx={{ gridColumn: "span 3", }}
                                    margin="dense"
                                />
                                <Button sx={{ marginTop: "10px", marginBottom: "10px", textAlign: "right" }} color="secondary" variant="outlined" type="submit">
                                    Add Text
                                </Button>
                            </form>

                        </Box>
                        <Box sx={{ width: 600, height: 450, margin: "10px auto", overflowY: "scroll" }}  >
                            {allTexts.map((text, index) => {
                                return (
                                    <Accordion key={index}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography color={colors.greenAccent[500]} variant="h5">
                                                {index} - {text.tittle}
                                            </Typography>

                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {text.paragraph}
                                            </Typography>
                                        </AccordionDetails>
                                        <AccordionActions  >
                                            <IconButton>
                                                <DeleteIcon onClick={() => { deleteAccordions(text.uid, text.suid, index) }} />
                                            </IconButton>
                                        </AccordionActions>
                                    </Accordion>
                                )
                            })}
                        </Box>
                    </Grid>
                </Grid>

            </Dialog>
            {/* dilog box end  */}
        </Box >
    )
}

export default AddServices
// export  FavoritUserData; 
import { forwardRef, useEffect, useState } from "react";
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
import ShowAlert from "../../components/ShowAlert";





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
    const [imagePercent, setImagePercent] = useState(0)
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




    // alert variables
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    // console.log("alertMessage", alertMessage);







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
    const handleFormSubmit = (e, resolve, reject) => {
        e.preventDefault();

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
                    }).then(() => {

                        setOpenAlert(true)
                        setAlertMessage(` Service Added Successfully! `)
                        setPercent(0)
                        setFile("")
                        setHeader("")
                        resolve()

                    }).catch((err) => {
                        reject()
                        setOpenAlert(true)
                        setAlertMessage(` Service Not Added Some Error Occurred ${err.message} `)
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
                setOpenAlert(true)
                setAlertMessage(`Added Top!`)
            })
    });


///
    // delete services
    const deleteCardItems = (uid, url) => {

        deleteObject(ref(storage, `${url}`));
        
        remove(rdbf(db, `Src/${uid}`))
        .then(() => {
            setOpenAlert(true)
            setAlertMessage("Url has been deleted")
            
        }).catch((err) => {

            setOpenAlert(true)
            setAlertMessage(`Photo has been not deleted ${err.message}`);
            console.log("Error message", err.message)
        });








    }

    //insert at top
    const insrtTop = (uid, top) => {
        // alert(index)
        const dbRef = rdbf(db)
        if (top === true) {
            update(child(dbRef, `/Src/${uid}`), {
                top: false,
            }).then(() => {
                setOpenAlert(true)
                setAlertMessage(`Added Top!`)
            }).catch(err => {
                setOpenAlert(true)
                setAlertMessage(`Added Top Cancled!, ${err.message}`)
            })
        }

        if (top === false) {
            update(child(dbRef, `/Src/${uid}`), {
                top: true,
            }).then(() => {

                setOpenAlert(true)
                setAlertMessage(` Added Top Cancled!`)
            }).catch(err => {
                setOpenAlert(true)
                setAlertMessage(`Top Cancled!, ${err.message}`)
            })

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

                setAlertMessage(`upload Phhoto - ${imagePercent} %`)
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
                    }).then(() => {

                        setFile("");
                        setImagePercent(0)

                        setOpenAlert(true)
                        setAlertMessage(`Photos Added Successfully!`)
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
                    return;
                }
            }).catch((err) => {
                console.info(err.message);
            })
    }
    //delete : dilog box - image
    const deleteServiceImagesOfDilogBox = (uid, suid_) => {
        // alert(uid, suid_);
        console.log(storageRefimg)
        deleteObject(storageRefimg)
            .then(() => {
                setOpenAlert(true)
                setAlertMessage(`Url has been  deleted!`)
            })
            .catch((error) => {

                setOpenAlert(true)
                setAlertMessage(`Url has been not deleted!  ${error.message}.`)
            });
    }
    useEffect(() => {
        readServiceImages()
        readServiceText()
    })

    // upload text : dilogbox text
    const handleSubmitText = (e) => {
        e.preventDefault()
        const uid = new Date().getTime();
        if (!textFieldTitle || !textField) {

            setOpenAlert(true)
            setAlertMessage(`Please enter your texts.`)


        }
        set(rdbf(db, `SrcSource/${suid_}/stext/${uid}/`), {
            tittle: textFieldTitle,
            text: textField,
            uid: `${uid}`,
            suid: `${suid_}`
        }).then(() => {

            setTextField("");
            setTextFieldTitle("")


            setOpenAlert(true)
            setAlertMessage(`Texts add In Your Application.`)

        }).catch((err) => {
            // alert("Text Not Inserted, Some Error Occurred!", err.message)
            setOpenAlert(true)
            setAlertMessage(`Text Not Inserted, Some Error Occurred! ${err.message}.`)
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
                    return;
                }
            }).catch((err) => {
                console.info(err.message);
            })
    }
    // delete accordians 
    const deleteAccordions = (uid, suid_) => {
        // alert(uid, ":", index)
        // delete header text and other
        remove(rdbf(db, `SrcSource/${suid_}/stext/${uid}`))
            .then(() => {
                setOpenAlert(true)
                setAlertMessage(`Text deleted`)
            })
            .catch((err) => {
                setOpenAlert(true)
                setAlertMessage(`Text Not deleted  ${err.message}`)
            })
    }

    return (
        <Box m="20px" width="98%">
            <Header title="Service" subtitle="Add your services here" />
            <ShowAlert
                sx={{ display: "none" }}
                message={alertMessage}
                show={openAlert}
                hide={() => { setOpenAlert(false) }}
            />
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
                            <Button disabled={!file || !header} type="submit" color="secondary" variant="outlined">
                                Add Service
                            </Button>

                        </Box>
                    </form>

                </Card>

                <Box sx={{ display: "flex", gap: "30px", flexWrap: "wrap" }} >
                    {cards.map((card, index) => {

                        return (
                            <Cards
                                key={index}
                                img={card.img}
                                date={card.date}
                                header={card.name}
                                deleteItem={() => {
                                    deleteCardItems(card.uid, card.img)
                                }}
                                favoritUser={() => insrtTop(card.uid, card.top)}
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
                            Close
                        </Typography>



                    </Toolbar>
                </AppBar>

                <Grid container spacing={2} sx={{
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

                            </form>
                        </Stack>
                        <ImageList sx={{ width: 600, height: 450, margin: "10px auto" }} cols={3} rowHeight={164}>
                            {allImages.map((allImagesData) => (
                                <ImageListItem key={allImagesData.uid}>
                                    <img className="myServiceImages"
                                        src={allImagesData.image}
                                        alt={allImagesData.uid}
                                    />
                                    <div className="hide">
                                        <IconButton onClick={() => { deleteServiceImagesOfDilogBox(allImagesData.uid, allImagesData.uid) }}>
                                            <DeleteIcon sx={{
                                                color: colors.greenAccent[500],
                                                fontSize: "28px"
                                            }} />
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
                            <form onSubmit={handleSubmitText} style={{ position: "relative" }} >
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
                                <Box style={{ position: "relative", top: "10px", right: "10px" }} >

                                    <Button sx={{ marginTop: "10px", marginBottom: "10px", textAlign: "right", }} color="secondary" variant="outlined" type="submit">
                                        Add Text
                                    </Button>
                                </Box>
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
                                                <DeleteIcon onClick={() => { deleteAccordions(text.uid, text.suid) }} />
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
import * as React from 'react';
import { useEffect, useState } from "react";
import app from "../../firebase/config";
import {
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  ref,
  deleteObject,
} from "firebase/storage";
import { child, get, getDatabase, remove } from "firebase/database";
import { set, ref as rdbf } from "firebase/database";
import Cards from "../../components/Card";
import { Box } from "@mui/system";
import currentDate from "../../utils/date";
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import Stack from '@mui/material/Stack'
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import ShowAlert from '../../components/ShowAlert';


const db = getDatabase(app);
const storage = getStorage(app);

const Insert = () => {


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  // State to store uploaded file
  const [file, setFile] = useState("");
  const storageRef = ref(storage, `/Slapsh/${file.name}`);
  // const deleteImageRef = ref(storage, `/Slapsh/${file.name}`);
  // progress
  const [percent, setPercent] = useState(0);
  const [cards, setCards] = useState([]);
  // console.log("slapsh", cards);
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setalertMessage] = useState("")

  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  const handleUpload = () => {
    // write data

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        // update progress
        setPercent(percent);
        setOpenAlert(true)
        setalertMessage(`Image Uploaded : ${percent} %`)
      },
      (err) => alert(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const uid = new Date().getTime();
          set(rdbf(db, `/Slapsh/${uid}/`), {
            date: currentDate,
            seq: uid,
            img: url,
          }).then(() => {
            setPercent(0);
            setFile("");

            setOpenAlert(true)
            setalertMessage(`"Inserted Slapsh Succssfully"`)
          }).catch((err) => {

            setOpenAlert(true)
            setalertMessage(`Some error occurred try again!, ${err.message}`)
          });

        });
      }
    );
  };


  // read data
  useEffect(() => {
    const dbRef = rdbf(db);
    get(child(dbRef, `Slapsh/`))
      .then((snapshot) => {
        const data = snapshot.val();
        if (snapshot.exists()) {
          setCards([]);
          Object.values(data).map((cards) => {
            return setCards((oldCard) => [...oldCard, cards]);
          });
        } else {
          return
        }
      })
      .catch((error) => {
        // console.error(error);
        setOpenAlert(true)
        setalertMessage(` Some Error Occurred When Getting data ${error.message} `)
      });
  });



  const deleteItems = (seq, url) => {
    deleteObject(ref(storage, `${url}`));
    
      
      remove(rdbf(db, `Slapsh/${seq}`))
      .then(() => {
        setOpenAlert(true)
        setalertMessage("Url has been deleted")
      }).catch((err) => {

        setOpenAlert(true)
        setalertMessage(`Photo has been not deleted ${err.message}`);
        console.log("Error message",err.message)
      });
  };



  return (

    <Box m="20px" width="98%" >
      <Header title="Insert slides " subtitle="Insert your slides for home screen" />
      <ShowAlert
        sx={{ display: "none" }}
        message={alertMessage}
        show={openAlert}
        hide={() => { setOpenAlert(false) }}

      />
      <Stack direction="row" alignItems="center" marginBottom="20px" spacing={2}>
        <IconButton color="primary" aria-label="upload picture" component="label">
          <input hidden onChange={handleChange} accept="/image/*" type="file" />
          <AddPhotoAlternateOutlinedIcon
            sx={{
              color: colors.greenAccent[400],
              fontSize: "30px"
            }} />
        </IconButton>

        <Button disabled={!file} color="secondary" variant="outlined" component="label">
          Upload
          <Button onClick={handleUpload} hidden />
        </Button>
        <p>{percent} "% done"</p>
      </Stack>

      <Box sx={{ display: "flex", gap: "30px", flexWrap: "wrap" }} >
        {cards.map((card, index) => {
          return (
            <Cards
              key={index}
              img={card.img}
              date={card.date}
              deleteItem={() => {
                deleteItems(card.seq, card.img);
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Insert;

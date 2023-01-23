import * as React from 'react';
import { useEffect, useState } from "react";

import {
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  ref,
  deleteObject,
} from "firebase/storage";
import { child, get, getDatabase, remove } from "firebase/database";
import { set, ref as rdbf } from "firebase/database";

import { Box } from "@mui/system";

import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import Stack from '@mui/material/Stack'
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import currentDate from "../../utils/date";
import app from '../../firebase/config';
import Cards from '../../components/Card';
import Header from '../../components/Header';
import ShowAlert from '../../components/ShowAlert';



const db = getDatabase(app);
const storage = getStorage(app);

const Family = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store uploaded file
  const [file, setFile] = useState("");
  const storageRef = ref(storage, `/Slapsh/${file.name}`);
  // progress
  const [percent, setPercent] = useState(0);
  const [cards, setCards] = useState([]);
  // console.log(cards);

  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  // console.log("alertMessage", alertMessage);

  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  const handleUpload = () => {
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
          set(rdbf(db, `/family/${uid}/`), {
            date: currentDate,
            seq: uid,
            img: url,
          });
          setOpenAlert(true)
          setAlertMessage("Insert SuccessFully")
          setPercent(0)
          setFile("")
        });
      }
    );
  };


  // read data
  useEffect(() => {
    const dbRef = rdbf(db);
    get(child(dbRef, `family/`))
      .then((snapshot) => {
        const data = snapshot.val();
        if (snapshot.exists()) {
          setCards([]);
          Object.values(data).map((cards) => {
            return setCards((oldCard) => [...oldCard, cards]);
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const deleteItems = (uid, url) => {
    deleteObject(ref(storage, `${url}`));


    remove(rdbf(db, `family/${uid}`))
      .then(() => {
        setOpenAlert(true)
        setAlertMessage("Deleted successfully!!!!")
      })
      .catch((error) => {
        setOpenAlert(true)
        setAlertMessage(`url has been deleted ${error.message} !!!!!`);

      });;

  };
  return (
    <Box m="20px" width="98%" >
      <Header title="Family" subtitle="Shree balaji family" />
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
        <Button disabled={!file} type="submit" color="secondary" variant="outlined">
          Add

          <Button onClick={handleUpload} hidden style={{ width: "0px" }} />
        </Button>
        <p>{percent} "% done"</p>
      </Stack>

      <Box sx={{ display: "flex", gap: "30px", flexWrap: "wrap" }} >
        {cards.map((card, index) => {
          return (
            <Cards
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

export default Family;

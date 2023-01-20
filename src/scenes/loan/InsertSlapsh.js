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


const db = getDatabase(app);
const storage = getStorage(app);

const Insert = () => {


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  // State to store uploaded file
  const [file, setFile] = useState("");
  const storageRef = ref(storage, `/Slapsh/${file.name}`);
  // progress
  const [percent, setPercent] = useState(0);
  const [cards, setCards] = useState([]);
  console.log("slapsh",cards);
  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  const handleUpload = () => {
    // write data
    if (!file) {
      alert("Please upload an image first!");
    }

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );

        // update progress
        setPercent(percent);
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
          });
          alert("Inserted Succssfully");
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
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const deleteItems = (id) => {
    deleteObject(storageRef)
      .then(() => {
        alert("Url has been deleted");
      })
      .catch((error) => {
        alert("Url has been not deleted");

      });
      setTimeout(() => {
        remove(rdbf(db, `Slapsh/${cards[id].seq}`));
      }, 500);
  };
  return (

    <Box m="20px" width="98%" >
      <Header title="Insert slides " subtitle="Insert your slides for home screen" />

      <Stack direction="row" alignItems="center" marginBottom="20px" spacing={2}>
        <IconButton color="primary" aria-label="upload picture" component="label">
          <input hidden onChange={handleChange} accept="/image/*" type="file" />
          <AddPhotoAlternateOutlinedIcon
            sx={{
              color: colors.greenAccent[400],
              fontSize: "30px"
            }} />
        </IconButton>
        <Button color="primary" variant="contained" component="label">
          Upload
          <Button onClick={handleUpload} hidden />
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
                deleteItems(index);
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Insert;

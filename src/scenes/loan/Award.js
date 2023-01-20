import { useEffect, useState } from "react";
import Cards from "../../components/Card";
import Header from "../../components/Header";
import { IconButton, Box, Button, Stack } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import app from "../../firebase/config";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getDatabase, ref as rdbf, set, child, get, remove } from "firebase/database";
import currentDate from "../../utils/date";


const db = getDatabase(app);
const storage = getStorage(app);

const Award = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store uploaded file
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const storageRef = ref(storage, `/Award/${file.name}`);
  const [cards, setCards] = useState([]);

  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  // submit data
  function handleUpload(value) {
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
          set(rdbf(db, `/Award/${uid}/`), {
            date: currentDate,
            seq: uid,
            img: url
          }).catch(()=>{
            alert("Inserted Succssfully");
            setPercent(0)
          }).catch(err => alert("Not inserted some error.", err.message));
          
        });
      }
    );

  }

  // read data
  useEffect(() => {
    const dbRef = rdbf(db);
    get(child(dbRef, 'Award/'))
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
    setTimeout(() => {

      // delete image url
      deleteObject(storageRef)
        .then(() => {
          alert("Url has been deleted");
        }).catch(() => {
          alert("deleted")
        })
    }, 1500);



    // delete header text and other
    remove(rdbf(db, `Award/${cards[id].seq}`))

  }


  return (
    <Box m="20px" width="98%" >
      <Header title="Award page" subtitle="Enter Awards Details For your user" />
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
                deleteCardItems(index);
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
export default Award;


import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FavoritUserContext } from "../scenes/loan/AddServices";
import { useContext } from "react";



const Cards = ({ img, date, header, deleteItem, favoritUser, serviceAddSource }) => {
  // const a = useContext(FavoritUserContext);
  // console.log(a);
  return (
    <Card sx={{ maxWidth: 300, marginBottom: "30px" }}>
      <CardMedia key={1} onClick={serviceAddSource} component="img" alt="image" image={img} height="200" />
      <CardContent>
        <Typography key={2} gutterBottom variant="h5" component="div">
          {header}
        </Typography>
        <Typography key={3} variant="body2" color="text.secondary">
          Inserted At : {date}
        </Typography>
      </CardContent >
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={favoritUser}>
          <FavoriteIcon key={4} />
        </IconButton>
        <IconButton aria-label="share" onClick={deleteItem}>
          <DeleteIcon key={5} />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Cards;

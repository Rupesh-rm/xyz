import { useEffect, useState } from "react";
import { Box, Typography, useTheme, } from "@mui/material";
import { DataGrid, GridToolbar, } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";

import { Close, DownloadDone } from "@mui/icons-material";
import { child, get, getDatabase, ref, update, } from "firebase/database";
import app from '../firebase/config';
import ShowAlert from "../components/ShowAlert";
const db = getDatabase(app);

const InstallUsers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [newUserNotification, setNewUserNotification] = useState([])
  const [alertMessage, setalertMessage] = useState("")
  // console.log("newUserNotification", newUserNotification)
  const [openAlert, setOpenAlert] = useState(false);

  // columns configurations
  const columns = [
    { field: "seq", headerName: "Id" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "number",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "adress",
      headerName: "Address",
      flex: 1,
      width: "300px"
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,

    },
    {
      field: "seen",
      headerName: "Seen",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row: { seen } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              seen === true
                ? colors.greenAccent[600]
                : seen === false
                  ? colors.greenAccent[700]
                  : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {seen === false && <Close />}
            {seen === true && <DownloadDone />}

          </Box>
        )
      },

    },

  ];

  // read data for rows
  useEffect(() => {
    const dbRef = ref(db);
    get(child(dbRef, `Install/`))
      .then((snapshot) => {
        const data = snapshot.val();
        if (snapshot.exists()) {
          setNewUserNotification([])
          Object.values(data).map((installedUser) => {
            return setNewUserNotification((OldUserInstalledUser) => [...OldUserInstalledUser, installedUser])


          })
        }
      })
      .catch((error) => {
        console.log("data is not avilable", error.message);
      });
  });



  // handdleUpdateAppInstalledUser
  const handdleUpdateAppInstalledUser = (params) => {
    console.log(params.row.name, ":", params.row.seen, ":")

    const dbRef = ref(db);

    if (params.row.seen === false) {
      update(child(dbRef, `Install/${params.row.number}`), {
        seen: true
      }).then(() => {
        setOpenAlert(true)
        setalertMessage("Seen came true")
      }).catch(err => alert(err.message))
    } else {
      update(child(dbRef, `Install/${params.row.number}`), {
        seen: false
      }).then(() => {
        setalertMessage("Seen Came false")
      }).catch(err => alert(err.message))
    }
    // 
  }
  return (
    <Box m="20px">
      <Header title="Users" subtitle="App Installed Users" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        {/* */}
        <DataGrid
          getRowId={(newUserNotification) => newUserNotification.seq}
          checkboxSelection
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          columns={columns}
          rows={newUserNotification}
          onRowClick={handdleUpdateAppInstalledUser}
        />
        <ShowAlert 
        sx={{ display: "none" }} 
        message={alertMessage}
        show={openAlert} 
        hide={()=>{setOpenAlert(false)}}
         />
      </Box>
    </Box>
  )
}

export default InstallUsers;
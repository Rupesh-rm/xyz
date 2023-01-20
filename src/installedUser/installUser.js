import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";

import { Close, DownloadDone } from "@mui/icons-material";
import { child, get, getDatabase, ref, } from "firebase/database";
import app from '../firebase/config';
const db = getDatabase(app);

const InstallUsers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [newUserNotification, setNewUserNotification] = useState([])
  // console.log(newUserNotification)

  // columns configurations
  const columns = [
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
            <Typography color={colors.greenAccent[100]} sx={{ ml: "5px" }}>
              False
            </Typography>
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
          Object.values(data).map((installedUser) => {
            return setNewUserNotification((OldUserNotification) => [...OldUserNotification, installedUser])

          })
        }
      })
      .catch((error) => {
        console.log("data is not avilable", error.message);
      });
  }, []);

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
          checkboxSelection
          components={{ Toolbar: GridToolbar }}
          getRowId={(newUserNotification) => newUserNotification.seq}
          rows={newUserNotification} 
          columns={columns}
        />
      </Box>
    </Box>
  )
}

export default InstallUsers;
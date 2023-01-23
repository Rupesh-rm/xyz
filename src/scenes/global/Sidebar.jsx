import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import myImg from './../../images/img.png'
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import MessageIcon from "@mui/icons-material/MessageOutlined"
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMINIS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={myImg}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Sagar Verma
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  VP Fancy Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* services  */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Services
            </Typography>
            <Item
              title="Add Slides"
              to="/add-slides"
              icon={<DriveFileMoveOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Add Service"
              to="/add-services"
              icon={<AddCardOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Add Award"
              to="/add-award"
              icon={<EmojiEventsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Family"
              to="/balaji-family"
              icon={<Diversity2OutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />



            {/* Data  */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
         
      
            <Item
              title="All Client"
              to="/all-users"
              icon={<Diversity3OutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="My client"
              to="/my-client"
              icon={<GroupOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Messages"
              to="/client-messages"
              icon={<MessageIcon />}
              selected={selected}
              setSelected={setSelected}
            />
     
            <Item
              title="Installed User"
              to="/app-installed-user"
              icon={<ArrowCircleLeftOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />    
            <Item
              title="Request Services"
              to="/requset-services"
              icon={<DownloadDoneIcon />}
              selected={selected}
              setSelected={setSelected}
            />    
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;

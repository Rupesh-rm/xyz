import { useState } from "react";
import { Routes, Route, } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Award from "./scenes/loan/Award";
import Form from "./scenes/form";
import AddServices from "./scenes/loan/AddServices";
import InsertSlapsh from "./scenes/loan/InsertSlapsh"
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Family from "./scenes/loan/Family";
import Home from "./scenes/Home";
import AllUserList from "./scenes/client/AllUsers";
import MyClient from "./scenes/client/Myclient";
import ChatHome from "./scenes/chat/ChatHome";
import InstallUsers from "./installedUser/installUser";
import Notificatiions from "./notification/notificatio";
import RequestServices from "./requestService/reqService";
import UserDocuments from "./scenes/document/Document";
import InsertSlides from "./scenes/loan/InsertSlides";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-slides" element={<InsertSlides />} />
                <Route path="/add-slapsh" element={<InsertSlides />} />
                <Route path="/add-services" element={<AddServices />} />
                <Route path="/add-award" element={<Award />} />
                <Route path="/balaji-family" element={<Family />} />
                <Route path="/all-users" element={<AllUserList />} />
                <Route path="/my-client" element={<MyClient />} />
                <Route path="/client-messages" element={<ChatHome />} />
                <Route path="/notification" element={<Notificatiions />} />
                <Route path="/app-installed-user" element={<InstallUsers />} />
                <Route path="/requset-services" element={<RequestServices />} />
                <Route path="/documents/:id" element={<UserDocuments />} />
                <Route path="/award" element={<Award />} />
                <Route path="/form" element={<Form />} />
                <Route path="/calendar" element={<Calendar />} />

              </Routes>

            </main>
          </div>
         
       
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

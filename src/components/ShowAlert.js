

import { Alert, Stack, Snackbar } from "@mui/material"

const ShowAlert = ({ message, show, hide }) => {
    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar  maxsnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onDoubleClickCapture open={show} autoHideDuration={6000} onClose={hide}>
                <Alert onClose={hide} severity="success"  sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}

export default ShowAlert;

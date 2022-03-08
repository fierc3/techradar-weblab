import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Snackbar, Tab, Tabs } from '@mui/material';
import RegisterDialog from './RegisterDialog';
import { config } from '../Constants';

var ENDPOINT = config.url.API_URL;

const LoginDialog = (props) => {


    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm, setConfirm] = React.useState(false);
    const [warning, setWarning] = React.useState(false);
    const [value, setValue] = React.useState("1");

    const login = async () => {
        const response = await fetch(ENDPOINT + '/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        const result = await response.json()
        if (result) {
            setConfirm(true);
            localStorage.setItem('user', result)
            props.handleClose();
        } else {
            setWarning(true);
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Dialog open={props.open} onClose={props.handleClose}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab value="1" label="Login" />
                    <Tab value="2" label="Register" />
                </Tabs>
                {value === "1" && <>
                    <DialogTitle>Login</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Since this is a demo, there is an admin/CTO account available with the email "mike@amaruq.ch" and password "123"
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={email}
                            onChange={(v) => setEmail(v.target.value)}
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={password}
                            onChange={(v) => setPassword(v.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.handleClose}>Cancel</Button>
                        <Button onClick={() => login()}>Login</Button>
                    </DialogActions>
                </>
                }

                {value === "2" && <>
                    <RegisterDialog handleClose={props.handleClose}></RegisterDialog>
                </>
                }

            </Dialog>

            <Snackbar
                open={confirm}
                autoHideDuration={3000}
                onClose={() => setConfirm(false)}
            >
                <Alert severity="success">Login Successful!</Alert>
            </Snackbar>

            <Snackbar
                open={warning}
                autoHideDuration={3000}
                onClose={() => setWarning(false)}
            >
                <Alert severity="error">Login Failed!</Alert>
            </Snackbar>
        </>
    );
}

export default LoginDialog;
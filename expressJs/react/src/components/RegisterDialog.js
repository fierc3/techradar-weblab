import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import { config } from '../Constants';

var ENDPOINT = config.url.API_URL;

const RegisterDialog = (props) => {
    const [role, setRole] = React.useState(1);
    const [display, setDisplay] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [confirm, setConfirm] = React.useState(false);
    const [warning, setWarning] = React.useState(false);

    const register = async () => {
        const response = await fetch(ENDPOINT + '/api/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, role: role, display: display, password: password })
        })
        const result = await response.text()
        if (result === 'success') {
            setConfirm(true);
        } else {
            setWarning(true);
        }
    }

    const handleRegister = () => {
        register();
    }

    return (
        <>
            <DialogTitle>Register</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required={true}
                    margin="dense"
                    id="display"
                    label="Display Name"
                    fullWidth
                    variant="standard"
                    value={display}
                    onChange={(v) => setDisplay(v.target.value)}
                />
                <TextField
                    required={true}
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
                    required={true}
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={password}
                    onChange={(v) => setPassword(v.target.value)}
                />
                <br />
                <br />
                <FormControl>
                    <InputLabel color='primary' id="role-label">Label</InputLabel>
                    <Select
                        labelId="role-label"
                        id="demo-simple-select"
                        value={role}
                        label="Role"
                        onChange={(v) => { setRole(v.target.value) }}
                    >
                        <MenuItem value={1}>Viewer</MenuItem>
                        <MenuItem value={2}>Admin / CTO</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={handleRegister}>Register</Button>
            </DialogActions>

            <Snackbar
                open={confirm}
                autoHideDuration={3000}
                onClose={() => setConfirm(false)}
            >
                <Alert severity="success">Registration Successful!</Alert>
            </Snackbar>

            <Snackbar
                open={warning}
                autoHideDuration={3000}
                onClose={() => setWarning(false)}
            >
                <Alert severity="error">Registration Failed!</Alert>
            </Snackbar>
        </>
    );
}

export default RegisterDialog;
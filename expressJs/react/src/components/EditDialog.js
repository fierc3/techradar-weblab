import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { RING, CATEGORY, config } from '../Constants';
import { Alert, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';

const EditDialog = (props) => {
    var ENDPOINT = config.url.API_URL;

    const [category, setCategory] = React.useState(1);
    const [description, setDescription] = React.useState("");
    const [descriptionDecision, setDescriptionDecision] = React.useState("");
    const [name, setName] = React.useState("");
    const [ring, setRing] = React.useState(1);
    const [publish, setPublish] = React.useState(1);
    const [techId, setTechId] = React.useState(undefined);

    const [confirm, setConfirm] = React.useState(false);
    const [warning, setWarning] = React.useState(false);

    const save = async () => {
        const user = localStorage.getItem('user')
        const response = await fetch(ENDPOINT + '/api/tech', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tech_id: techId, name: name, category: category, ring: ring, description: description, description_decision: descriptionDecision, user_id: user, public: publish })
        })
        const result = await response.text()
        if (result === 'success') {
            setConfirm(true);
            props.handleClose();
        } else {
            setWarning(true);
        }
    }

    React.useEffect(() => {
        if (props.data !== undefined) {
            setCategory(props.data.category);
            setDescription(props.data.description);
            setDescriptionDecision(props.data.descriptionDecision);
            setName(props.data.name);
            setRing(props.data.ring);
            setTechId(props.data.tech_id);
            setPublish(props.data.public)
        } else {
            setCategory(1);
            setDescription("");
            setDescriptionDecision("");
            setName("");
            setRing(1);
            setTechId();
            setPublish(0)
        }
    }, [props.open])

    const handleSave = () => {
        save();
        //close
    }

    return (
        <>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>Add / Edit Technology</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required={true}
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(v) => setName(v.target.value)}
                    />
                    <TextField
                        required={true}
                        margin="dense"
                        id="description"
                        label="Description"
                        fullWidth
                        variant="standard"
                        value={description}
                        onChange={(v) => setDescription(v.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="dd"
                        label="Description Decision"
                        fullWidth
                        variant="standard"
                        value={descriptionDecision}
                        onChange={(v) => setDescriptionDecision(v.target.value)}
                    />
                    <br />
                    <br />
                    <FormControl>
                        <InputLabel color='primary' id="ring-label">Ring</InputLabel>
                        <Select
                            labelId="ring-label"
                            id="ring-simple-select"
                            value={ring}
                            label="Ring"
                            onChange={(v) => { setRing(v.target.value) }}
                        >
                            <MenuItem value={RING.Adopt}>Adopt</MenuItem>
                            <MenuItem value={RING.Assess}>Assess</MenuItem>
                            <MenuItem value={RING.Hold}>Hold</MenuItem>
                            <MenuItem value={RING.Trial}>Trial</MenuItem>
                        </Select>
                    </FormControl>
                    <br />
                    <br />
                    <FormControl>
                        <InputLabel color='primary' id="cat-label">Category</InputLabel>
                        <Select
                            labelId="cat-label"
                            id="cat-simple-select"
                            value={category}
                            label="Category"
                            onChange={(v) => { setCategory(v.target.value) }}
                        >
                            <MenuItem value={CATEGORY.Tools}>Tools</MenuItem>
                            <MenuItem value={CATEGORY.Techniques}>Techniques</MenuItem>
                            <MenuItem value={CATEGORY.Platforms}>Platforms</MenuItem>
                            <MenuItem value={CATEGORY.Languages}>Languages & Frameworks</MenuItem>
                        </Select>
                    </FormControl>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={publish === 1} onChange={(value) => setPublish( 0 + value.target.checked)} />} label="Published" />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={confirm}
                autoHideDuration={3000}
                onClose={() => setConfirm(false)}
            >
                <Alert severity="success">Saving Successful!</Alert>
            </Snackbar>

            <Snackbar
                open={warning}
                autoHideDuration={3000}
                onClose={() => setWarning(false)}
            >
                <Alert severity="error">Saving Failed!</Alert>
            </Snackbar>
        </>
    );
}

export default EditDialog;
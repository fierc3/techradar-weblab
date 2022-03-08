import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { config } from '../Constants';

const HistoryDialog = (props) => {
    var ENDPOINT = config.url.API_URL;

    const [history, setHistory] = React.useState([])

    const update = async () => {
        const response = await fetch(ENDPOINT + '/api/history/' + props.tech_id)
        const result = await response.json()
        setHistory(result.data);
    }

    React.useEffect(() => {
        update();
    }, [props.open])
    
    return (
        <>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>History</DialogTitle>
                <DialogContent>
                    {history.map(x => {
                        return <p>{x.text}</p>
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default HistoryDialog;
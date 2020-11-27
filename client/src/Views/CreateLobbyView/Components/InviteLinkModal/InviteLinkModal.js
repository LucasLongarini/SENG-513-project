import { React, useState } from 'react';
import Modal from 'react-modal';
import { Close, Link } from '@material-ui/icons';
import { IconButton, TextField, Button } from '@material-ui/core';
import './InviteLinkModal.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
Modal.setAppElement('#root');
function InviteLinkModal({isOpen, setIsOpen}) {

    function copyToClipboard() {
        var tempInput = document.createElement("input");
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        toast.info("Copied Link!");
    }
    
    return (
        <Modal overlayClassName='InviteLinkModal-overlay' className='InviteLinkModal-content' isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}>

            <IconButton style={{
                maxWidth:"150px",
                padding: "12px 0", 
                fontSize:"15px"}} 
                onClick={() => setIsOpen(false)}><Close />
            </IconButton>


            <div>
                <h3>Copy this link to invite friends!</h3>
                <TextField label="Invite Link" fullWidth={true} 
                variant="outlined" InputLabelProps={{shrink: true}} size='small'
                value={window.location.href}
                disabled
                style={{
                    marginTop: "20px"
                }} 
                />
                <Button variant="contained" color="secondary" fullWidth={true} style={{
                    borderRadius: 0,
                    color: "white",
                    marginTop: "20px",
                    backgroundColor: "#CE5BF7",
                }}
                    onClick={copyToClipboard}>    
                    <Link/> Copy Link
                </Button>
            </div>

        </Modal>
    );
}

export default InviteLinkModal;
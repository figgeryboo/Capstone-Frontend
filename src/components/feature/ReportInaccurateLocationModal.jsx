import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ReportInaccurateLocationModal = ({ open, onClose }) => {
  return (
 
    <Dialog open={open} onClose={onClose}     >
      <DialogTitle style={{  maxHeight: "200px", overflowY: "auto"
      }}>Thank you for your patience & feedback!</DialogTitle>
      <DialogContent>
        <p>We're working on our reporting feature to provide up more efficient data!</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}  variant="outline-secondary"
              size="sm"
              style={{
                backgroundColor: "rgb(234, 49, 135)",
                borderColor: "rgb(234, 49, 135)",
                color: "#fff",
                width: "100%",
                
              }}
              >
          Close
        </Button>
      </DialogActions>
    </Dialog>

  );
};

export default ReportInaccurateLocationModal;

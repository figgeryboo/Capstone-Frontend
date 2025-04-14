import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ReportInaccurateLocationModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Report Inaccurate Location</DialogTitle>
      <DialogContent>
        <p>We're working on a reporting feature! Thank you for your patience.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportInaccurateLocationModal;

import { DialogActions, DialogContent } from "@mui/material";
import { Dialog } from "../";
import { ActionButton } from "../Button";

export default {
  title: "Dialogs",
};

const defaultProps = {
  title: "Title",
  open: true,
  onClose: () => alert("onClose triggered"),
};

export const Default = () => (
    <Dialog {...defaultProps}>
      <DialogContent>Content</DialogContent>
    </Dialog>
  ),
  WithActions = () => (
    <Dialog {...defaultProps}>
      <DialogContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu gravida
        metus. Ut consectetur fringilla leo, tempor interdum nisi cursus vitae.
        Donec elementum sem et nunc finibus, et pharetra lacus pulvinar. Nunc at
        mi viverra, vehicula ex quis, viverra arcu.
      </DialogContent>
      <DialogActions>
        <ActionButton
          variant="outlined"
          onClick={() => alert('action "Foo" clicked')}
        >
          Foo
        </ActionButton>
        <ActionButton onClick={() => alert('action "Bar" clicked')}>
          Bar
        </ActionButton>
      </DialogActions>
    </Dialog>
  );

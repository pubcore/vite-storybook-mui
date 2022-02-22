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
        mi viverra, vehicula ex quis, viverra arcu. Sed faucibus diam justo, sit
        amet interdum nisi tempor a. Integer turpis sapien, euismod sed
        tincidunt sit amet, laoreet vel eros. Donec nunc ligula, placerat sed
        nisl sed, venenatis molestie purus. Mauris risus erat, pretium et erat
        vitae, efficitur tempus mauris. In vitae elit id tortor dictum
        sollicitudin. Nam maximus hendrerit tortor eu tincidunt. Etiam ut
        sollicitudin orci, sit amet commodo nunc. Interdum et malesuada fames ac
        ante ipsum primis in faucibus. Praesent venenatis ac odio sit amet
        elementum. Morbi quis ex ligula. Morbi condimentum sem vel venenatis
        vulputate. Class aptent taciti sociosqu ad litora torquent per conubia
        nostra, per inceptos himenaeos.
      </DialogContent>
      <DialogActions>
        <ActionButton onClick={() => alert('action "Foo" clicked')}>
          Foo
        </ActionButton>
        <ActionButton onClick={() => alert('action "Bar" clicked')}>
          Bar
        </ActionButton>
      </DialogActions>
    </Dialog>
  );

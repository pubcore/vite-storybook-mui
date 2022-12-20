import { useState, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { A } from "../";

const handleEvent = (handler?: () => void) => (event: SyntheticEvent) => {
  event.preventDefault();
  handler && handler();
};

interface FormValues {
  username: string;
  password: string;
}

export interface LoginProps {
  login: (values: FormValues) => Promise<{ textkey: string; severity: string }>;
  registerUri?: string;
}

export default function Login({ login, registerUri }: LoginProps) {
  const { t } = useTranslation();
  const [showPw, toggleShowPw] = useState(false);
  const [errorText, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors = {}, isSubmitting },
  } = useForm<FormValues>();
  const submit = async (values: FormValues) => {
    const { textkey, severity } = await login(values);
    if (severity != "success") {
      setError(t([textkey as "_", "login_error"]));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        maxWidth: "300",
        margin: 1,
      }}
      component="form"
      onSubmit={handleSubmit((values) => {
        submit(values);
      })}
      noValidate
    >
      <Box component="legend" sx={{ paddingBottom: 2.5 }}>
        <h1>{t("login_please")}</h1>
        {registerUri && (
          <>
            {t("register_please", "No account?")}&nbsp;
            <A href={registerUri}>{t("register")}</A>
          </>
        )}
      </Box>
      <TextField
        {...{
          ...register("username", {
            required: t("username_required"),
          }),
          type: "text",
          label: t("username"),
          autoComplete: "username",
          error: Boolean(errors?.username),
          helperText: errors?.username?.message || " ",
        }}
      />
      <FormControl
        {...{
          variant: "outlined",
          error: Boolean(errors?.password),
        }}
      >
        <InputLabel htmlFor="current-password">{t("password")}</InputLabel>
        <OutlinedInput
          {...{
            id: "current-password",
            ...register("password", { required: t("password_required") }),
            type: showPw ? "text" : "password",
            autoComplete: "current-password",
            endAdornment: (
              <InputAdornment position="end" title={t("password_visibility")}>
                <IconButton
                  aria-label={t("password_visibility")}
                  onClick={handleEvent(() => toggleShowPw(!showPw))}
                  onMouseDown={handleEvent()}
                  edge="end"
                >
                  {showPw ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
            label: t("password"),
          }}
        />
        <FormHelperText {...{ error: Boolean(errors?.password) }}>
          {errors?.password?.message || " "}
        </FormHelperText>
      </FormControl>
      <Button
        {...{
          type: "submit",
          color: "primary",
          disabled: isSubmitting,
        }}
      >
        {t("login")}
      </Button>
      {errorText && (
        <Snackbar
          {...{
            open: true,
            autoHideDuration: 5000,
          }}
        >
          <Alert {...{ onClose: () => setError("") }} severity="error">
            {errorText}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

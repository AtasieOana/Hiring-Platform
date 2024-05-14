import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  FormGroup,
  Icon,
  InputGroup,
  Intent,
  Spinner,
} from "@blueprintjs/core";
import "../styles/Register.css";
import { useTranslation } from "react-i18next";
import {
  BUCHAREST_RO,
  CANDIDATE_ACCOUNT,
  EMPLOYER_ACCOUNT,
} from "../../util/constants";
import {
  RegisterCandidateRequest,
  RegisterEmployerRequest,
  RegisterResponse,
  UserGoogleRequest,
} from "../../types/auth.types";
import AuthenticationService from "../../services/authentication.service";
import { AppToaster } from "../common/AppToaster";
import { signInWithGooglePopup } from "../google/firebase.utils";
import EmployerService from "../../services/employer.service";
import { setAuthData } from "../../redux/actions/authActions";
import { setProfileActionData } from "../../redux/actions/profileActions";
import CandidateService from "../../services/candidate.service";
import { useDispatch } from "react-redux";
import HeaderAuth from "../header/HeaderAuth";
import GoogleLogo from "../../resources-photo/GoogleLogo.png";
import CommonService from "../../services/common.service";
import { setAddressData } from "../../redux/actions/addressActions";

interface FormErrors {
  emailRequired?: boolean;
  emailInvalid?: boolean;
  firstnameRequired?: boolean;
  firstnameLen?: boolean;
  firstnameInvalid?: boolean;
  lastnameRequired?: boolean;
  lastnameLen?: boolean;
  lastnameInvalid?: boolean;
  passwordRequired?: boolean;
  passwordLen?: boolean;
  confirmPassword?: boolean;
  companyRequired?: boolean;
  companyLen?: boolean;
  companyInvalid?: boolean;
}

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState(CANDIDATE_ACCOUNT);
  const [errors, setErrors] = useState<FormErrors>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfPasswordVisibility = () => {
    setShowConfPassword(!showConfPassword);
  };

  const setEmployerInRedux = () => {
    EmployerService.getLoggedEmployer()
      .then((response: any) => {
        let registerResponse = response.data;
        if (registerResponse.token) {
          getAllCitiesByRegions();
          dispatch(
            setAuthData(
              true,
              null,
              registerResponse.employer,
              registerResponse.token,
            ),
          );
          dispatch(setProfileActionData(response.data.hasProfile));
          setIsLoading(false);
          if (response.data.hasProfile) {
            navigate("/allJobs");
          } else {
            navigate("/addProfile");
          }
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        navigate("/login");
      });
  };

  const setCandidateInRedux = () => {
    CandidateService.getLoggedCandidate()
      .then((response: any) => {
        let registerResponse = response.data;
        if (registerResponse.token) {
          getAllCitiesByRegions();
          dispatch(
            setAuthData(
              true,
              registerResponse.candidate,
              null,
              registerResponse.token,
            ),
          );
          dispatch(setProfileActionData(response.data.hasCv));
          setIsLoading(false);
          if (response.data.hasCv) {
            navigate("/allCv");
          } else {
            navigate("/addCv");
          }
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        navigate("/login");
      });
  };

  const handleRegisterCandidate = () => {
    // Validation for fields
    const newErrors: FormErrors = {}; // Define type for newErrors
    if (!email) {
      newErrors.emailRequired = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.emailInvalid = true;
      }
    }
    if (!firstName) {
      newErrors.firstnameRequired = true;
    } else {
      const usernameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ\- ]*$/;
      if (firstName.length < 3) {
        newErrors.firstnameLen = true;
      } else if (!usernameRegex.test(firstName)) {
        newErrors.firstnameInvalid = true;
      }
    }
    if (!lastName) {
      newErrors.lastnameRequired = true;
    } else {
      const usernameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ\- ]*$/;
      if (lastName.length < 3) {
        newErrors.lastnameLen = true;
      } else if (!usernameRegex.test(lastName)) {
        newErrors.lastnameInvalid = true;
      }
    }
    if (!password) {
      newErrors.passwordRequired = true;
    } else if (password.length < 5) {
      newErrors.passwordLen = true;
    }
    if (!newErrors.passwordLen && password !== confirmPassword) {
      newErrors.confirmPassword = true;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Call the API for register
    registerUserCandidate();
    // Reset the errors if successful
    setErrors({});
  };

  const registerUserCandidate = () => {
    setIsLoading(true);
    let registerRequest: RegisterCandidateRequest = {
      accountType: "",
      email: "",
      firstname: "",
      lastname: "",
      password: "",
    };
    registerRequest.email = email;
    registerRequest.password = password;
    registerRequest.lastname = lastName;
    registerRequest.firstname = firstName;
    registerRequest.accountType = userType;
    AuthenticationService.registerCandidate(registerRequest)
      .then((response: any) => {
        let registerResponse: RegisterResponse = response.data;
        setIsLoading(false);
        navigate(`/token/${registerResponse.email}`);
      })
      .catch((error) => {
        console.error("Error during authentication: " + error.message);
        AppToaster.show({
          message: t("auth_error"),
          intent: Intent.DANGER,
        });
      });
  };

  const handleRegisterEmployer = () => {
    // Validation for fields
    const newErrors: FormErrors = {}; // Define type for newErrors
    if (!email) {
      newErrors.emailRequired = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.emailInvalid = true;
      }
    }
    if (!companyName) {
      newErrors.companyRequired = true;
    } else {
      const usernameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ0-9\-& ]*$/;
      if (companyName.length < 3) {
        newErrors.companyLen = true;
      } else if (!usernameRegex.test(companyName)) {
        newErrors.companyInvalid = true;
      }
    }
    if (!password) {
      newErrors.passwordRequired = true;
    } else if (password.length < 5) {
      newErrors.passwordLen = true;
    }
    if (!newErrors.passwordLen && password !== confirmPassword) {
      newErrors.confirmPassword = true;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Call the API for register
    registerUserEmployer();
    // Reset the errors if successful
    setErrors({});
  };

  const registerUserEmployer = () => {
    setIsLoading(true);
    let registerRequest: RegisterEmployerRequest = {
      accountType: "",
      companyName: "",
      email: "",
      password: "",
    };
    registerRequest.email = email;
    registerRequest.password = password;
    registerRequest.companyName = companyName;
    registerRequest.accountType = userType;
    AuthenticationService.registerEmployer(registerRequest)
      .then((response: any) => {
        let registerResponse: RegisterResponse = response.data;
        setIsLoading(false);
        navigate(`/token/${registerResponse.email}`);
      })
      .catch((error) => {
        console.error("Error during authentication: " + error.message);
        AppToaster.show({
          message: t("auth_error"),
          intent: Intent.DANGER,
        });
      });
  };

  const logGoogleUser = async (accountType: string) => {
    try {
      setIsLoading(true);
      const response = await signInWithGooglePopup();
      let request: UserGoogleRequest = {
        accountType: "",
        email: "",
        familyName: "",
        givenName: "",
        name: "",
      };
      if (response.user.email != null && response.user.displayName != null) {
        let [givenName, familyName] = response.user.displayName.split(" ");
        if (
          givenName === null ||
          familyName === null ||
          givenName === undefined ||
          familyName === undefined ||
          givenName.length === 0 ||
          familyName.length === 0
        ) {
          [request.givenName, request.familyName] = [
            response.user.displayName,
            response.user.displayName,
          ];
        } else {
          [request.givenName, request.familyName] = [givenName, familyName];
        }
        request.email = response.user.email;
        request.name = response.user.displayName;
        request.accountType = accountType;
      }
      AuthenticationService.authGoogle(request)
        .then((response: any) => {
          if (response.data.roleName === CANDIDATE_ACCOUNT) {
            setCandidateInRedux();
          } else if (response.data.roleName === EMPLOYER_ACCOUNT) {
            setEmployerInRedux();
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error during authentication: " + error.message);
          AppToaster.show({
            message: t("auth_error"),
            intent: Intent.DANGER,
          });
        });
    } catch (error: any) {
      console.error("Error during register: " + error.message);
      setIsLoading(false);
      AppToaster.show({
        message: t("auth_error"),
        intent: Intent.DANGER,
      });
    }
  };

  const getAllCitiesByRegions = () => {
    CommonService.getAllCitiesByRegions()
      .then((response) => {
        const updatedResponseObj = { ...response.data };
        const newObjKey = "Bucharest";
        updatedResponseObj[newObjKey] = ["Bucharest"];
        dispatch(
          setAddressData(Object.keys(updatedResponseObj), updatedResponseObj),
        );
      })
      .catch((error) => {
        console.error("Error: ", error.message);
        AppToaster.show({
          message: t("city_region_err"),
          intent: Intent.DANGER,
        });
      });
  };

  let errorActive = false;
  let mailError = "";
  if (errors.emailRequired) {
    mailError = t("email_address_req");
    errorActive = true;
  } else if (errors.emailInvalid) {
    mailError = t("email_address_in");
    errorActive = true;
  }
  let lastnameError = "";
  if (errors.lastnameRequired) {
    lastnameError = t("lastname_req");
    errorActive = true;
  } else if (errors.lastnameLen) {
    lastnameError = t("lastname_len");
    errorActive = true;
  } else if (errors.lastnameInvalid) {
    lastnameError = t("lastname_content");
    errorActive = true;
  }
  let firstnameError = "";
  if (errors.firstnameRequired) {
    firstnameError = t("firstname_req");
    errorActive = true;
  } else if (errors.firstnameLen) {
    firstnameError = t("firstname_len");
    errorActive = true;
  } else if (errors.lastnameInvalid) {
    firstnameError = t("firstname_content");
    errorActive = true;
  }
  let companyError = "";
  if (errors.companyRequired) {
    companyError = t("company_req");
    errorActive = true;
  } else if (errors.companyLen) {
    companyError = t("company_len");
    errorActive = true;
  } else if (errors.companyInvalid) {
    companyError = t("company_content");
    errorActive = true;
  }
  let passwordError = "";
  if (errors.passwordRequired) {
    passwordError = t("password_req");
    errorActive = true;
  } else if (errors.passwordLen) {
    passwordError = t("password_len");
    errorActive = true;
  }
  let confirmError = "";
  if (errors.confirmPassword) {
    confirmError = t("password_confirm");
    errorActive = true;
  }

  const generatePasswordFields = () => {
    return (
      <div className="register-password-fields">
        <FormGroup
          label={t("password")}
          intent={passwordError ? Intent.DANGER : Intent.NONE}
          helperText={passwordError ? passwordError : ""}
          className="register-form-group"
          labelInfo={"*"}
        >
          <InputGroup
            type={showPassword ? "text" : "password"}
            value={password}
            autoComplete="new-password"
            placeholder={t("password_placeholder")}
            onChange={(e: any) => setPassword(e.target.value)}
            rightElement={
              <Button
                className="password-button"
                icon={showPassword ? "eye-off" : "eye-open"}
                minimal={true}
                onClick={togglePasswordVisibility}
                small={true}
                fill
              />
            }
          />
        </FormGroup>
        <FormGroup
          label={t("confirm_password")}
          intent={confirmError ? Intent.DANGER : Intent.NONE}
          helperText={confirmError ? confirmError : ""}
          className="register-form-group"
          labelInfo={"*"}
        >
          <InputGroup
            type={showConfPassword ? "text" : "password"}
            value={confirmPassword}
            placeholder={t("password_confirm_placeholder")}
            autoComplete="new-password"
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            rightElement={
              <Button
                className="password-button"
                icon={showConfPassword ? "eye-off" : "eye-open"}
                minimal={true}
                onClick={toggleConfPasswordVisibility}
                small={true}
                fill
              />
            }
          />
        </FormGroup>
      </div>
    );
  };

  const candidatePanel = () => {
    return (
      <div>
        <div
          className={
            errorActive
              ? "register-error-active register-container-form"
              : "register-container-form"
          }
        >
          <form className="register-forms">
            {renderCommonPart()}
            <FormGroup
              label={t("email_address")}
              intent={mailError ? Intent.DANGER : Intent.NONE}
              helperText={mailError ? mailError : ""}
              className="register-form-group"
              labelInfo={"*"}
            >
              <InputGroup
                value={email}
                placeholder={t("email_placeholder")}
                onChange={(e: any) => setEmail(e.target.value)}
                asyncControl={true}
              />
            </FormGroup>
            <div className="name-fields">
              <FormGroup
                label={t("lastname")}
                intent={lastnameError ? Intent.DANGER : Intent.NONE}
                helperText={lastnameError ? lastnameError : ""}
                className="register-form-group"
                labelInfo={"*"}
              >
                <InputGroup
                  type="text"
                  value={lastName}
                  placeholder="Popescu"
                  asyncControl={true}
                  onChange={(e: any) => setLastName(e.target.value)}
                />
              </FormGroup>
              <FormGroup
                label={t("firstname")}
                intent={firstnameError ? Intent.DANGER : Intent.NONE}
                helperText={firstnameError ? firstnameError : ""}
                className="register-form-group"
                labelInfo={"*"}
              >
                <InputGroup
                  type="text"
                  value={firstName}
                  placeholder="Maria"
                  autoComplete="new-user"
                  onChange={(e: any) => setFirstName(e.target.value)}
                />
              </FormGroup>
            </div>
            {generatePasswordFields()}
          </form>
          {isLoading ? (
            <Spinner className="central-spinner" size={40} />
          ) : (
            <div>
              <Button
                onClick={handleRegisterCandidate}
                small={true}
                className="register-button"
              >
                {t("register_button")}
              </Button>
              <div className="text-or-separator">
                <span className="text-or">OR</span>
              </div>
              <Button
                className="google-button google-button-register google-button-first"
                small={true}
                onClick={() => logGoogleUser(CANDIDATE_ACCOUNT)}
              >
                <img
                  className="google-button-img"
                  src={GoogleLogo}
                  alt="Google Logo"
                />
                {t("sign_google_candidate")}
              </Button>
              <Button
                className="google-button google-button-register"
                small={true}
                onClick={() => logGoogleUser(EMPLOYER_ACCOUNT)}
              >
                <img
                  className="google-button-img"
                  src={GoogleLogo}
                  alt="Google Logo"
                />
                {t("sign_google_employer")}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const employerPanel = () => {
    return (
      <div>
        <div
          className={
            errorActive
              ? "register-error-active register-container-form"
              : "register-container-form"
          }
        >
          <form className="register-forms">
            {renderCommonPart()}
            <FormGroup
              label={t("email_address")}
              intent={mailError ? Intent.DANGER : Intent.NONE}
              helperText={mailError ? mailError : ""}
              className="register-form-group"
              labelInfo={"*"}
            >
              <InputGroup
                value={email}
                placeholder={t("email_placeholder")}
                onChange={(e: any) => setEmail(e.target.value)}
                asyncControl={true}
              />
            </FormGroup>
            <FormGroup
              label={t("company")}
              intent={companyError ? Intent.DANGER : Intent.NONE}
              helperText={companyError ? companyError : ""}
              className="register-form-group"
              labelInfo={"*"}
            >
              <InputGroup
                type="text"
                value={companyName}
                placeholder="Joblistic"
                asyncControl={true}
                onChange={(e: any) => setCompanyName(e.target.value)}
              />
            </FormGroup>
            {generatePasswordFields()}
          </form>
          {isLoading ? (
            <Spinner className="central-spinner" size={40} />
          ) : (
            <div>
              <Button
                onClick={handleRegisterEmployer}
                small={true}
                className="register-button"
              >
                {t("register_button")}
              </Button>
              <div className="text-or-separator">
                <span className="text-or">OR</span>
              </div>
              <Button
                className="google-button google-button-register google-button-first"
                small={true}
                onClick={() => logGoogleUser(CANDIDATE_ACCOUNT)}
              >
                <img
                  className="google-button-img"
                  src={GoogleLogo}
                  alt="Google Logo"
                />
                {t("sign_google_candidate")}
              </Button>
              <Button
                className="google-button google-button-register"
                small={true}
                onClick={() => logGoogleUser(EMPLOYER_ACCOUNT)}
              >
                <img
                  className="google-button-img"
                  src={GoogleLogo}
                  alt="Google Logo"
                />
                {t("sign_google_employer")}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCommonPart = () => {
    return (
      <>
        <div
          className={
            errorActive
              ? "register-title-error-active register-title"
              : "register-title"
          }
        >
          {t("register_to")}!
        </div>
        <div className="register-go-to-login">
          {t("register_go_to_login1")}
          <Link to="/login">{t("register_go_to_login2")}</Link>
        </div>
        <FormGroup className="user-type-selection">
          <div className="tabs">
            <div
              className={`tab ${userType === CANDIDATE_ACCOUNT && "active"}`}
              onClick={() => {
                resetState();
                setUserType(CANDIDATE_ACCOUNT);
              }}
            >
              <Icon className="contact-icon" icon="person" size={40} />
              <div>{t("candidate_account_type")}</div>
            </div>
            <div
              className={`tab ${userType === EMPLOYER_ACCOUNT && "active"}`}
              onClick={() => {
                resetState();
                setUserType(EMPLOYER_ACCOUNT);
              }}
            >
              <Icon className="contact-icon" icon="office" size={40} />
              <div>{t("employer_account_type")}</div>
            </div>
          </div>
        </FormGroup>
      </>
    );
  };

  const resetState = () => {
    setEmail("");
    setCompanyName("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowPassword(false);
    setShowConfPassword(false);
  };

  return (
    <div>
      <HeaderAuth />
      <div className="register-container">
        <div className="register-content">
          {userType === CANDIDATE_ACCOUNT ? candidatePanel() : employerPanel()}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

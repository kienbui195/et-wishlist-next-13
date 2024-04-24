import { useEffect, useState } from "react";
import MailIcon from "assets/svg/MailIcon.svg";
import { PersonalProf } from ".";
import apis from "@/apis";
import { useAlertContext } from "@/context/alertContext";
import SingleSelect from "@/components/SingleSelect";
import { PHONE_NUMBER_CODE, REGEX } from "@/components/ETWComponent/SubmitYourPrd/helper";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { IDropdownItem } from "@/data/wl-types";
import FormInput from "@/components/FormInput/Input";
import DashboardButton from "../Components/Button";
import Modal from "@/components/CustomModal";
import { HiddenPass, ShowPass } from "@/utils/svgExport";

interface PersonalPanelProps {
  user: PersonalProf;
  onChange?: (value: any, field: string, nestedField?: string) => void;
  onChangeObj?: (value: any) => void;
  onChangePhone?: (phone: any) => void;
  errors: any;
  codePhone: IDropdownItem;
  onChangeRole?: (value: any) => void;
  onBlurPhoneNumberInput?: () => void;
}

const PersonalPanel: React.FC<PersonalPanelProps> = ({ user, onChange, onChangeObj, onChangeRole, errors, codePhone, onBlurPhoneNumberInput }) => {
  const [role, setRole] = useState([]);
  const [showModalResetPassword, setShowModalResetPassword] = useState<boolean>(false);
  const { showAlert } = useAlertContext();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
  const initErrorPassword = {
    currentPassword: "",
    password: "",
    passwordConfirmation: "",
  };
  const [errorPassword, setErrorsPassword] = useState(initErrorPassword);

  const handleGetRole = () => {
    apis
      .get("wl-bus-roles")
      .then((res) => {
        let data = res.data?.data.map((e: any) => {
          return {
            id: e.id,
            name: e.attributes.name,
          };
        });
        setRole(data);
      })
      .catch((err) => {
        showAlert("error", err.message);
      });
  };

  const handleCloseModalResetPassword = () => {
    setShowModalResetPassword(false);
    setCurrentPassword("");
    setPassword("");
    setPasswordConfirmation("");
    setErrorsPassword(initErrorPassword);
    setShowCurrentPassword(false);
    setShowPassword(false);
    setShowPasswordConfirm(false);
  };

  const validatePassword = () => {
    setErrorsPassword((preState) => ({
      ...preState,
      currentPassword: currentPassword === "" ? "Current password is required" : "",
      password:
        password === ""
          ? "New password is required"
          : password.length < 6
          ? "New password must be 6 characters at less"
          : password === currentPassword
          ? "New password must be different than current password"
          : "",
      passwordConfirmation:
        passwordConfirmation === "" ? "Password confirmation is required" : password !== passwordConfirmation ? "Password confirmation doesn't match" : "",
    }));
    let error = currentPassword === "" || password.length < 6 || password === currentPassword || password !== passwordConfirmation;

    return { error };
  };

  const handleResetPassword = () => {
    const { error } = validatePassword();
    if (!error) {
      apis
        .post(`auth/change-password`, {
          currentPassword,
          password,
          passwordConfirmation,
        })
        .then(() => {
          showAlert("success", "Change Password Successful");
          handleCloseModalResetPassword();
        })
        .catch(() => {
          let errorMessage = "Please enter a correct current password";
          setErrorsPassword({
            ...initErrorPassword,
            currentPassword: errorMessage,
          });
        });
    }
  };

  useEffect(() => {
    handleGetRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="panel-Personal Information"
      className="el-tab-pane flex justify-between relative"
      role="tabpanel"
      aria-hidden="true"
      aria-labelledby="tab-Personal Information"
    >
      <div className="mt-2.5 max-w-[555px]">
        <div className="el-form el-form--default el-form--label-top">
          <div className="el-form-item asterisk-left ">
            <FormInput
              required
              startIcon={MailIcon}
              label="Email"
              value={user.email}
              disabled
              labelError={errors.email}
              placeholder="example@gmail.com"
              onChange={(e) => onChange && onChange(e, "email")}
            />
          </div>
          <div className="mt-[30px] text-lg font-semibold leading-tight text-gray-1050">Account Owner</div>
          <div className="mt-[25px] grid max-w-[555px] grid-cols-2 gap-[15px]">
            <div className="el-form-item is-success is-required asterisk-right">
              <FormInput
                required
                label="First Name"
                value={user.first_name}
                labelError={errors.first_name}
                onChange={(e) => onChange && onChange(e, "first_name")}
                error={errors.first_name !== ""}
              />
            </div>
            <div className="el-form-item is-success is-required asterisk-right">
              <FormInput
                required
                label="Last Name"
                value={user.last_name}
                labelError={errors.last_name}
                onChange={(e) => onChange && onChange(e, "last_name")}
                error={errors.last_name !== ""}
              />
            </div>
          </div>
          <div className="el-form-item is-success is-required asterisk-right mt-5" role="group" aria-labelledby="el-id-3120-17">
            <PhoneNumberInput
              label="Phone Number"
              required
              list={PHONE_NUMBER_CODE}
              className="mt-4"
              value={user.phone}
              onChangeDropdown={(e) => {
                onChangeObj && onChangeObj(e);
              }}
              onChangeInput={(e) => {
                if (REGEX.ALLOW_CHARACTERS.test(e.target.value)) {
                  onChange && onChange(e, "phone");
                }
              }}
              prefixValue={codePhone.id}
              valueSelected={codePhone}
              labelError={errors.phone}
              error={errors.phone !== ""}
              onBlur={() => onBlurPhoneNumberInput && onBlurPhoneNumberInput()}
            />
          </div>
          <p className="mt-3 text-xs font-normal leading-none text-gray-2050">Number is used to secure account, please ensure this has sms capabilities</p>
          <div className="el-form-item is-required asterisk-right mt-5">
            <SingleSelect
              required
              label={"Role"}
              placeholder={"Choose a role"}
              list={role}
              value={user.business_role.name}
              onChange={(e) => {
                onChangeRole && onChangeRole(e);
              }}
              labelError={errors.business_role.name}
              error={errors.business_role.name !== ""}
            />
          </div>
          <div className="max-w-[480px]"></div>
        </div>
      </div>
      {user?.provider === "local" && (
        <div className="absolute top-0 right-0">
          <DashboardButton onClick={() => setShowModalResetPassword(true)} type="white" label="Reset Password" />
        </div>
      )}
      {showModalResetPassword && (
        <Modal onClose={handleCloseModalResetPassword} classNameContainer="!mt-[150px]">
          <form className="el-form el-form--default el-form--label-top">
            <div className="text-lg font-semibold leading-tight text-gray-1050">Reset Password</div>
            <div className="mt-3 text-xs font-normal leading-normal text-gray-2050">
              If you want to change your password, please enter {}
              <span className="cursor-pointer font-semibold text-black underline underline-offset-2">your current password</span>
            </div>
            <div className="el-form-item is-success is-required asterisk-right mt-[20px]">
              <FormInput
                label="Current Password"
                value={currentPassword}
                error={errorPassword.currentPassword !== ""}
                labelError={errorPassword.currentPassword}
                type={!showCurrentPassword ? "password" : "text"}
                onChange={(e) => setCurrentPassword(e.target.value)}
                endIcon={showCurrentPassword ? ShowPass : HiddenPass}
                endAction={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            </div>
            <div className="el-form-item is-success is-required asterisk-right mt-[20px]">
              <FormInput
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errorPassword.password !== ""}
                labelError={errorPassword.password}
                type={!showPassword ? "password" : "text"}
                endIcon={showPassword ? ShowPass : HiddenPass}
                endAction={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="el-form-item is-success is-required asterisk-right mt-[20px]">
              <FormInput
                label="Password Confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                error={errorPassword.passwordConfirmation !== ""}
                labelError={errorPassword.passwordConfirmation}
                type={!showPasswordConfirm ? "password" : "text"}
                endIcon={showPasswordConfirm ? ShowPass : HiddenPass}
                endAction={() => setShowPasswordConfirm(!showPasswordConfirm)}
              />
            </div>
            <div className="flex space-x-1 justify-end mt-[25px]">
              <DashboardButton label="Cancel" type="white" onClick={handleCloseModalResetPassword} />
              <DashboardButton label="Reset Password" onClick={handleResetPassword} />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PersonalPanel;

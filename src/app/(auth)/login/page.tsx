"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { CloseButton, EditIcon, ETIcon, ETLogoBeta, GoBackSvg, GoogleIcon, HiddenPass, KeyIcon, LoginRightImage, MailIcon, ShowPass } from "@/utils/svgExport";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
import ButtonLogin from "./ButtonLogin";
import apis from "@/apis";
import { createQuery } from "@/utils/function";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/features/authenticate/userSlice";
import { useAlertContext } from "@/context/alertContext";
import Input from "./Input";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const Login = () => {
  const initFormState = {
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    hasEMail: false,
  };
  const mediaWidth = useMediaQuery();
  const [step, setStep] = useState<number>(0);
  const pathname = usePathname();
  const router = useRouter();
  const isClient = useRef<boolean>(typeof window === "object");
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [denied, setDenied] = useState<boolean>(true);
  const [form, setForm] = useState(initFormState);
  const [retrieveUser, setRetrieveUser] = useState<any>(null);
  const dispatch = useDispatch();
  const { showAlert } = useAlertContext();
  const [loadingBtnLWPW, setLoadingBtnLWPW] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const staticPage = useSelector((state: RootState) => state.footer.footer);
  const termUrl = staticPage.submenu.find((item) => item.slug.includes("term"))?.slug || "#";
  const privacyUrl = staticPage.submenu.find((item) => item.slug.includes("privacy"))?.slug || "#";
  const EMAIL_REGEX = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleClose = () => {
    setStep(0);
    // setForm(initFormState)
    if (pathname === "/reset-password") {
      router.push("/");
    }
  };

  const handleLoginETSSO = () => {
    if (!isClient["current"]) return;

    const authEndpoint = process.env.REACT_APP_ET_AUTH_ENDPOINT;
    const clientId = process.env.REACT_APP_ET_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_ET_REDIRECT_URI;
    window.open(`${authEndpoint}/oauth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=sso-theepochtimes`, "_self");
  };

  const handleLoginGoogleSSO = () => {
    if (!isClient["current"]) return;
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/connect/google`, "_self");
  };

  const handleRetrieveUser = () => {
    setLoadingBtn(true);
    apis
      .get(
        "users",
        createQuery({
          fields: ["email", "username", "provider", "confirmed"],
          filters: {
            email: form.email,
          },
        })
      )
      .then((res) => {
        const { data } = res;
        const [user] = data;
        setRetrieveUser(user);
        setLoadingBtn(false);
        if (!user) {
          setStep(1);
        } else {
          const providers: Record<string, () => void> = {
            local: () => setStep(1),
            google: () => handleLoginGoogleSSO(),
            theepochtimes: () => handleLoginETSSO(),
          };
          const providerHandler = providers[user.provider];
          providerHandler && providerHandler();
        }
      })
      .catch((err) => {
        setLoadingBtn(false);
        console.log(err);
      });
  };

  const handleLogin = () => {
    if (retrieveUser) {
      switch (retrieveUser.provider) {
        case "local":
          setLoadingBtn(true);
          apis
            .post("auth/local", {
              identifier: form.email,
              password: form.password,
            })
            .then((res) => {
              const { user, jwt } = res.data;
              localStorage.setItem(
                "ETWL",
                JSON.stringify({
                  id: user.id,
                  username: user.username,
                  token: jwt,
                })
              );
              dispatch(setUser({ ...user, jwt }));
              setForm(initFormState);
              showAlert("success", "Login Successfully!");
              setStep(0);
              setLoadingBtn(false);
              router.push('/')
            })
            .catch((err) => {
              setLoadingBtn(false);
              console.log(err.message);
              showAlert("error", "Login failed! Please try again!");
            });
          break;
        case "google":
          handleLoginGoogleSSO();
          break;
        default:
          break;
      }
    } else {
      setLoadingBtn(true);
      apis
        .post("auth/local/register", {
          username: form.email,
          email: form.email,
          password: form.password,
        })
        .then((res) => {
          showAlert("success", "Register Successfully! Please click on the link we just send you to confirm");
          setStep(2);
          setLoadingBtn(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoadingBtn(false);
          showAlert("error", "Login failed! Please try again!");
        });
    }
  };

  const handleResentConfirmEmail = () => {
    setLoadingBtn(true);
    apis
      .post("auth/send-email-confirmation", {
        email: form.email,
      })
      .then((res) => {
        showAlert("success", "Please click on the link we just send you to confirm");
        setLoadingBtn(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingBtn(false);
        showAlert("error", "Login failed! Please try again!");
      });
  };

  const handleResentLWPWConfirmEmail = () => {
    setLoadingBtnLWPW(true);
    apis
      .post("auth/send-email-login-without-password-confirm", {
        email: form.email,
      })
      .then((res) => {
        showAlert("success", "Please click on the link we just send you to confirm");
        setLoadingBtnLWPW(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingBtnLWPW(false);
        showAlert("error", "Login failed! Please try again!");
      });
  };

  const handleResetPassword = () => {
    const code = searchParams.get("code");
    apis
      .post("auth/reset-password", {
        code,
        password: form.password,
        passwordConfirmation: form.confirmPassword,
      })
      .then((res) => {
        // const { user, jwt } = res.data
        setForm(initFormState);
        showAlert("success", "Reset password successfully! You can login with new password");
        router.push("/");
      })
      .catch((err) => {
        console.log(err.message);
        showAlert("error", "Something went wrong! Please try again!");
      });
  };

  const handleGoBackStep0 = () => {
    setStep(0);
    let timer = null;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (inputEmailRef && inputEmailRef.current) {
        inputEmailRef.current.focus();
      }
    }, 0);
  };

  const handleForgotPassword = () => {
    apis
      .post("auth/forgot-password", {
        email: form.email,
      })
      .then((res) => {
        showAlert("success", "Please click the link in the email we just sent you");
      })
      .catch((err) => {
        console.log(err.message);
        showAlert("error", err?.response?.data?.error || "Something went wrong! Please try again!");
      });
  };

  const handleLoginWithoutPassword = () => {
    setLoadingBtnLWPW(true);
    apis
      .post("auth/login-without-password", {
        email: form.email,
      })
      .then((res) => {
        showAlert("success", "Please click on the link we just send you to login without password");
        setStep(3);
        setLoadingBtnLWPW(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingBtnLWPW(false);
      });
  };

  useEffect(() => {
    if (EMAIL_REGEX.test(form.email)) {
      setDenied(false)
    } else {
      setDenied(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.email])

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div
        style={{
          boxShadow: "0 4px 20px 0 var(--modal-shadow)",
        }}
        className={`${mediaWidth > 900 ? "w-[900px]" : "w-fit"} h-fit bg-white border-2 rounded-3xl box-border flex p-8`}
      >
        <div className="flex flex-col gap-4">
          {step === 1 && <Image onClick={() => setStep(step - 1)} className="absolute top-[16px] left-[16px] cursor-pointer" src={GoBackSvg} alt="" />}
          <div className="flex md:flex-col md:space-y-6 md:mb-0 mb-[16px] items-center justify-between relative">
            <Image
              src={ETLogoBeta}
              alt=""
              className="h-[48px] object-contain"
              // className="mb-[30px] hidden md:block h-[18px] object-contain"
            />
            <div className="flex md:hidden cursor-pointer absolute -top-2 -right-2" onClick={handleClose}>
              <Image src={CloseButton} alt="close-icon" />
            </div>
            <div className="text-title-18 md:mb-[32px] md:p-0 break-normal text-center mb-0 p-2">
              To discover, vote and discounts, sign in to Wishlist below.
            </div>
          </div>
          {pathname !== "/reset-password" && step === 0 && (
            <Fragment>
              <div className="flex space-x-[14px] h-[40px] w-full">
                {/* <ButtonLogin
                  icon={AppleIcon}
                  className="bg-black flex-1"
                  labelColor="white"
                  label=""
                /> */}
                <ButtonLogin icon={ETIcon} className="bg-white flex-1" labelColor="white" label="" onClick={handleLoginETSSO} />
                <ButtonLogin icon={GoogleIcon} className="bg-white flex-1" labelColor="white" label="" onClick={handleLoginGoogleSSO} />
              </div>
              <div className="flex items-center space-x-[6px] my-[32px]">
                <div className="flex-1 border-b-[1px] border-[--gray-line] w-full"></div>
                <div className="R-title-explan text-[--gray]">OR</div>
                <div className="flex-1 border-b-[1px] border-[--gray-line] w-full"></div>
              </div>
            </Fragment>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (loadingBtn) return;
              if (pathname !== "/reset-password") {
                if (denied) return;
                if (step === 0) {
                  handleRetrieveUser();
                  // setStep(1)
                } else if (step === 1) {
                  handleLogin();
                } else if (step === 2) {
                  handleResentConfirmEmail();
                } else {
                  handleResentLWPWConfirmEmail();
                }
              } else {
                if (form.password !== form.confirmPassword) return;
                handleResetPassword();
              }
            }}
          >
            <div className={`flex flex-col space-y-[18px] mb-[32px]`}>
              {pathname !== "/reset-password" ? (
                step === 2 ? (
                  <div className="R-body-small text-[--gray] tracking-[0.2px] text-start">
                    Please click on the special link we just send you to confirm register
                  </div>
                ) : step === 3 ? (
                  <div className="R-body-small text-[--gray] tracking-[0.2px] text-start">
                    Please click on the special link we just send you to login without password
                  </div>
                ) : (
                  <Input
                    ref={inputEmailRef}
                    autoComplete="username"
                    label="E-Mail Address"
                    startIcon={MailIcon}
                    value={form.email}
                    onChange={(val) => {
                      setForm({
                        ...form,
                        email: val,
                        hasEMail: EMAIL_REGEX.test(val),
                      });
                    }}
                    {...(step === 1
                      ? {
                          disabled: true,
                          endIcon: EditIcon,
                          endAction: handleGoBackStep0,
                        }
                      : {})}
                  />
                )
              ) : (
                <Fragment>
                  <Input
                    autoComplete="current-password"
                    label="Password"
                    startIcon={KeyIcon}
                    value={form.password}
                    onChange={(val) => setForm({ ...form, password: val })}
                    endAction={() => {
                      setForm({ ...form, showPassword: !form.showPassword });
                    }}
                    type={form.showPassword ? "text" : "password"}
                    endIcon={form.showPassword ? ShowPass : HiddenPass}
                  />
                  <Input
                    label="Confirm Password"
                    startIcon={KeyIcon}
                    value={form.confirmPassword}
                    onChange={(val) => setForm({ ...form, confirmPassword: val })}
                    endAction={() => {
                      setForm({
                        ...form,
                        showConfirmPassword: !form.showConfirmPassword,
                      });
                    }}
                    type={form.showConfirmPassword ? "text" : "password"}
                    endIcon={form.showConfirmPassword ? ShowPass : HiddenPass}
                  />
                </Fragment>
              )}
              {pathname !== "/reset-password" && step === 1 && (
                <Input
                  label="Password"
                  startIcon={KeyIcon}
                  value={form.password}
                  onChange={(val) => setForm({ ...form, password: val })}
                  endAction={() => {
                    setForm({ ...form, showPassword: !form.showPassword });
                  }}
                  type={form.showPassword ? "text" : "password"}
                  endLabel="Forgot Password?"
                  endIcon={form.showPassword ? ShowPass : HiddenPass}
                  optionAction={handleForgotPassword}
                />
              )}
            </div>
            <ButtonLogin
              loading={loadingBtn}
              label={pathname !== "/reset-password" ? (step === 0 ? "Continue with email" : step === 1 ? "Next" : "Resend confirm email") : "Reset Password"}
              labelColor={"!text-white"}
              className={
                `bg-[--brand-primary] !h-[40px] mb-[16px] select-none ` +
                (pathname !== "/reset-password"
                  ? denied
                    ? "!cursor-not-allowed opacity-[30%] hover:!opacity-[30%]"
                    : "!cursor-pointer"
                  : form.password !== form.confirmPassword
                  ? "!cursor-not-allowed opacity-[30%] hover:!opacity-[30%]"
                  : "!cursor-pointer")
              }
              disabled={pathname !== "/reset-password" ? denied : form.password !== form.confirmPassword}
            />
            {step === 1 && (
              <Fragment>
                <div className="flex items-center space-x-[6px] my-[16px]">
                  <div className="flex-1 border-b-[1px] border-[--gray-line] w-full"></div>
                  <div className="R-title-explan text-[--gray]">OR</div>
                  <div className="flex-1 border-b-[1px] border-[--gray-line] w-full"></div>
                </div>
                <ButtonLogin
                  loading={loadingBtnLWPW}
                  label="Sign in without password"
                  labelColor="!text-[--brand-primary]"
                  type="button"
                  className="mb-[16px]"
                  onClick={handleLoginWithoutPassword}
                />
              </Fragment>
            )}
            <div className={`R-body-small text-[--gray] tracking-[0.2px] ${step === 0 ? "text-center" : "text-start"}`}>
              {step === 0 ? (
                <Fragment>
                  By continuing, you agree to the{" "}
                  <a href={termUrl} className="text-[--brand-primary] underline">
                    Terms of Service
                  </a>{" "}
                  and acknowledge our{" "}
                  <a href={privacyUrl} className="text-[--brand-primary] underline">
                    Privacy Policy.
                  </a>
                </Fragment>
              ) : (
                <Fragment>Get one-time login access sent to your email inbox. No need to enter your password.</Fragment>
              )}
            </div>
          </form>
        </div>
        <div className="flex flex-col">
          <div className="w-full md:!min-w-[450px] md:!w-[450px] flex-1 hidden md:flex md:flex-col md:relative">
            <Image onClick={handleClose} className="absolute top-[18px] right-[18px] cursor-pointer" src={CloseButton} alt="" />
            <Image src={LoginRightImage} alt="" className="w-[243px] h-[258px] absolute top-[97px] left-[119px]" />
            <div className="w-full h-[201px] bg-[--bg-hover] flex justify-center mt-[310px] rounded-[0_0_24px_0]">
              <div className="text-[--brand-primary] w-fit flex flex-col text-center items-center product-title-22 ">
                <div className="mt-[60px] mb-[13px] w-[308px] break-normal">Help Your Favorite Products Rise To The Top</div>
                <span className="btn-13">And unlock exclusive discounts just for you.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

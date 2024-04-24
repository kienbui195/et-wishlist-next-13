import { ChangeEvent, useEffect, useState } from "react";
import CompanyPanel from "./panelCompany";
import PersonalPanel from "./panelPersonal";
import { createQuery } from "@/utils/function";
import apis from "@/apis";
import { useAlertContext } from "@/context/alertContext";
import { IDropdownItem } from "@/data/wl-types";
import DashboardButton from "../Components/Button";
import { PHONE_NUMBER_CODE, REGEX } from "@/components/ETWComponent/SubmitYourPrd/helper";

interface CompanyProfChild {
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  province_name?: string;
  country: string;
  country_code: string;
  country_name: string;
  zip: string;
}
export interface imageCompany {
  id: number;
  name: string;
  url: string;
}
export interface CompanyProf {
  id: number;
  name: string;
  website: string;
  support_email: string;
  business_in_country: string;
  address: CompanyProfChild;
  logo: imageCompany;
}
export interface PersonalProf {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  business_role: {
    id: number;
    name: string;
  };
  provider: string;
}

const SettingsUser = () => {
  const [codePhoneNumber, setCodePhoneNumber] = useState<IDropdownItem>({
    id: "",
    name: "",
  });
  const [prdPanel, setPrdPanel] = useState("Company");
  const [country, setCountry] = useState([]);
  const { showAlert } = useAlertContext();
  const userId = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "").id;
  const [formDataCompany, setFormDataCompany] = useState<CompanyProf>({
    id: 0,
    name: "",
    logo: {
      id: 0,
      name: "",
      url: "",
    },
    website: "",
    support_email: "",
    business_in_country: "",
    address: {
      address1: "",
      address2: "",
      city: "",
      province: "",
      province_name: "",
      country: "",
      country_code: "",
      country_name: "",
      zip: "",
    },
  });
  const [user, setUser] = useState<PersonalProf>({
    id: 0,
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    business_role: {
      id: 0,
      name: "",
    },
    provider: "",
  });
  const [errorsCompany, setErrorsCompany] = useState({
    name: "",
    website: "",
    support_email: "",
    business_in_country: "",
    address: {
      address1: "",
      city: "",
      zip: "",
    },
    logo: {
      url: "",
    },
  });
  const [errorsPersonal, setErrorsPersonal] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    business_role: {
      name: "",
    },
  });

  const getCountry = () => {
    apis
      .getCountries()
      .then((res) => {
        setCountry(res.data.data);
      })
      .catch((err) => {
        showAlert("error", err.message);
      });
  };

  const handleGetPageDataUser = () => {
    apis
      .get(
        `users/me`,
        createQuery({
          fields: ["username", "email", "first_name", "last_name", "phone", "provider"],
          populate: {
            business_role: { fields: ["name"] },
          },
        })
      )
      .then((res) => {
        let data = res.data;
        let [, codePart = "", phoneNumberPart = ""] = (res.data && res.data.phone && res.data.phone.match(REGEX.SPLIT_AREA_CODE_VS_PHONE_NUMBER)) || [
          "",
          "+1",
          "",
        ];
        const indexCode = PHONE_NUMBER_CODE.findIndex((item) => item.id === codePart);
        let nameCodePart = res.data.phone ? (indexCode !== -1 ? PHONE_NUMBER_CODE[indexCode].name : "United States") : "United States";
        setUser((preState) => ({
          ...preState,
          ...data,
          phone: phoneNumberPart,
        }));
        setCodePhoneNumber((preState) => ({
          ...preState,
          id: codePart || "+1",
          name: nameCodePart || "United States",
        }));
      })
      .catch((err) => {
        showAlert("error", err.message);
      });
  };

  const handleGetPageDataCompany = () => {
    if (userId)
      apis
        .get(
          "wl-companies",
          createQuery({
            filters: {
              member: {
                id: userId,
              },
            },
            populate: {
              address: {
                fields: ["id", "address1", "address2", "city", "province", "province_name", "country", "country_code", "country_name", "zip"],
              },
              logo: {
                fields: ["id", "name", "url"],
              },
            },
          })
        )
        .then((res) => {
          let data = res.data?.data;
          if (data.length !== 0) {
            setFormDataCompany({
              ...data[0].attributes,
              id: data[0]?.id,
              logo: data[0].attributes.logo.data?.id
                ? {
                    id: data[0].attributes.logo.data.id,
                    name: data[0].attributes.logo.data.attributes.name,
                    url: data[0].attributes.logo.data.attributes.url,
                  }
                : {
                    id: 0,
                    name: "",
                    url: "",
                  },
            });
          }
        })
        .catch((err) => {
          setPrdPanel("Personal");
          showAlert("error", err.message);
        });
  };

  const handleChangeCompany = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, nestedField?: string) => {
    const { value } = e.target;
    setFormDataCompany((prevData: any) => ({
      ...prevData,
      [field]: nestedField ? { ...prevData[field], [nestedField]: value } : value,
    }));
  };

  const handleChangeImageCompany = (e: any, field: string, nestedField?: string) => {
    setFormDataCompany((prevData: any) => ({
      ...prevData,
      logo: {
        id: e.id,
        name: e.name,
        url: e.url,
      },
    }));
  };

  const handleChangePersonal = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, nestedField?: string) => {
    const { value } = e.target;
    setUser((prevData: any) => ({
      ...prevData,
      [field]: nestedField ? { ...prevData[field], [nestedField]: value } : value,
    }));
  };

  const renderDashBoardPanel = () => {
    switch (prdPanel) {
      case "Company":
        return (
          <CompanyPanel
            company={formDataCompany}
            onChange={handleChangeCompany}
            country={country}
            onChangeImg={handleChangeImageCompany}
            errors={errorsCompany}
          />
        );
      case "Personal":
        return (
          <PersonalPanel
            user={user}
            onChange={handleChangePersonal}
            codePhone={codePhoneNumber}
            onChangeObj={(val) => {
              setCodePhoneNumber(val);
            }}
            onChangeRole={(val) => setUser((preState) => ({ ...preState, business_role: val }))}
            errors={errorsPersonal}
            onBlurPhoneNumberInput={() => setUser((preState) => ({ ...preState, phone: user.phone.trim() }))}
          />
        );
      default:
        break;
    }
  };

  const validateCompany = (values: any) => {
    const listErrors = {
      name: "",
      website: "",
      support_email: "",
      business_in_country: "",
      address: {
        address1: "",
        city: "",
        zip: "",
      },
      logo: {
        url: "",
      },
    };

    if (values.name.trim() === "") {
      listErrors.name = "Please input Company Name";
    }

    if (values.website.trim() === "") {
      listErrors.website = "Please input website";
    } else if (!REGEX.WEBSITE.test(values.website)) {
      listErrors.website = "Please enter your website in the correct format http:// or https ://";
    }

    if (values.support_email.trim() === "") {
      listErrors.support_email = "Please input Email";
    } else if (!REGEX.EMAIL.test(values.support_email)) {
      listErrors.support_email = "Please enter your email in the correct format";
    }

    if (values.business_in_country === "") {
      listErrors.business_in_country = "Please input Country";
    }

    if (values.address.address1.trim() === "") {
      listErrors.address.address1 = "Please input Address";
    }

    if (values.address.city.trim() === "") {
      listErrors.address.city = "Please input City/Province";
    }

    let regex = /^[0-9]{5,}$/;
    if (values.address.zip === "") {
      listErrors.address.zip = "Please input Postal Code";
    } else if (!regex.test(values.address.zip)) {
      listErrors.address.zip = "Please enter a minimum 5-digit postal code";
    }

    if (values.logo.url === "") {
      listErrors.logo.url = "Please input logo";
    }

    return listErrors;
  };

  const validatePersonal = (values: any) => {
    const listErrors = {
      first_name: "",
      last_name: "",
      phone: "",
      business_role: {
        name: "",
      },
    };

    if (values.first_name.trim() === "") {
      listErrors.first_name = "Please input First Name";
    }
    if (values.last_name.trim() === "") {
      listErrors.last_name = "Please input Last Name";
    }
    if (values.phone.trim() === "") {
      listErrors.phone = "Please input Phone Number";
    } else if (!REGEX.ALLOW_CHARACTERS.test(values.phone.trim())) {
      listErrors.phone = "Invalid Phone Number";
    }

    if (values.business_role.name === "") {
      listErrors.phone = "Please input Role";
    }
    return listErrors;
  };

  const handleEditData = () => {
    const errorCompany = validateCompany(formDataCompany);

    if (
      errorCompany.name === "" &&
      errorCompany.business_in_country === "" &&
      errorCompany.support_email === "" &&
      errorCompany.website === "" &&
      errorCompany.address.address1 === "" &&
      errorCompany.address.city === "" &&
      errorCompany.address.zip === "" &&
      errorCompany.logo.url === ""
    ) {
      handleSubmitCompany();
      setErrorsCompany({
        name: "",
        website: "",
        support_email: "",
        business_in_country: "",
        address: {
          address1: "",
          city: "",
          zip: "",
        },
        logo: {
          url: "",
        },
      });
    } else {
      showAlert("error", "Please input fields require Company");
      setErrorsCompany(errorCompany);
    }

    const errorPerSonal = validatePersonal(user);
    if (errorPerSonal.first_name === "" && errorPerSonal.last_name === "" && errorPerSonal.phone === "" && errorPerSonal.business_role.name === "") {
      handleSubmitPer();
      setErrorsPersonal({
        first_name: "",
        last_name: "",
        phone: "",
        business_role: {
          name: "",
        },
      });
    } else {
      showAlert("error", "Please input fields require Personal");
      setErrorsPersonal(errorPerSonal);
    }
  };

  const handleSubmitCompany = () => {
    apis
      .update("wl-companies", formDataCompany.id, {
        data: {
          ...formDataCompany,
        },
      })
      .then(() => {
        showAlert("success", "Edit Company Info successfully!");
      })
      .catch((err) => {
        showAlert("error", "Edit Company failed! Please check and try again!");
      });
  };
  const handleSubmitPer = () => {
    apis
      .update("users", user.id, {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: `(${codePhoneNumber.id}) ` + user.phone.trim(),
        business_role: {
          name: user.business_role.name,
          id: user.business_role.id,
        },
      })
      .then(() => {
        showAlert("success", "Edit Personal Info successfully!");
      })
      .catch((err) => {
        showAlert("error", "Edit Personal Info failed! Please try again!");
      });
  };

  useEffect(() => {
    getCountry();
    handleGetPageDataUser();
    handleGetPageDataCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = "ET Wishlist | Brand Setting";
  }, []);

  return (
    <main className="w-full px-10 py-7 brand-settings" data-windy-selected="j40TRr61HoFnIlRP9PoGi">
      <div className="flex w-full items-start justify-between">
        <div className="shrink-0">
          <span className="cursor-pointer text-10 font-bold leading-none tracking-wide text-gray-1150">SETTINGS</span>
        </div>
        <DashboardButton onClick={handleEditData} label="Save Changes" />
      </div>
      <form className="el-form mt-[30px]">
        <div className="el-tabs el-tabs--top brand-settings-tabs">
          <div className="el-tabs__header is-top flex justify-between">
            <div className="el-tabs__nav-wrap is-top">
              <div className="el-tabs__nav-scroll">
                <div className="el-tabs__nav is-top space-x-[26px]" role="tablist" style={{ transform: "translateX(0px)" }}>
                  <div
                    className={`el-tabs__item is-top !m-0 !p-0 ${prdPanel === "Company" ? "is-active" : ""}`}
                    id="tab-Connections"
                    aria-controls="panel-Connections"
                    role="tab"
                    aria-selected="true"
                    tabIndex={prdPanel === "Company" ? 0 : -1}
                    onClick={() => setPrdPanel("Company")}
                  >
                    Company Info
                  </div>
                  <div
                    className={`el-tabs__item is-top !m-0 !p-0 ${prdPanel === "Personal" ? "is-active" : ""}`}
                    id="tab-Feed"
                    aria-controls="panel-Feed"
                    role="tab"
                    aria-selected="false"
                    tabIndex={prdPanel === "Personal" ? 0 : -1}
                    onClick={() => setPrdPanel("Personal")}
                  >
                    Personal Information
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="el-tabs__content mt-[25px]">{renderDashBoardPanel()}</div>
        </div>
      </form>
    </main>
  );
};
export default SettingsUser;

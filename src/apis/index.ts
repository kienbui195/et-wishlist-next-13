import axios, { CancelToken } from "axios";
import moment from "moment";
import { createQuery } from "../utils/function";

const apis = {
  get: async (url: string, query?: string) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;

    try {
      return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${url}${query ? `?${query}` : ""}`, {
        headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
      });
    } catch (err: any) {
      throw err;
    }
  },

  getOne: async (url: string, id: number, query?: string) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;
    try {
      return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${url}/${id}${query ? `?${query}` : ""}`, {
        headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
      });
    } catch (err: any) {
      throw err;
    }
  },

  post: async (url: string, data: any) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;
    try {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
        {
          ...data,
        },
        {
          headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  update: async (url: string, id: number, data: any) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;
    try {
      return await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${url}/${id}`,
        {
          ...data,
        },
        {
          headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  del: async (url: string, id: number) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;
    try {
      return await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${url}/${id}`, {
        headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
      });
    } catch (err: any) {
      throw err;
    }
  },

  checkLogin: async () => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;
    try {
      return await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me?${createQuery({
          fields: ["id", "username", "email", "provider", "confirmed", "first_name", "last_name", "phone", "how_did_you_hear", "first_name", "last_name"],
          populate: {
            business_role: {
              populate: {
                fields: ["id", "name"],
              },
            },
            wl_shop: {
              fields: ["id", "connected", "active"],
              populate: {
                wl_products: {
                  fields: ["name"],
                  filters: {
                    publishedAt: {
                      $notNull: true,
                    },
                  },
                },
              },
            },
            wl_member_type: {
              fields: ["name"],
            },
          },
        })}`,
        {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        }
      );
    } catch (err) {
      throw err;
    }
  },

  getCountries: async () => {
    try {
      return await axios.get(`https://countriesnow.space/api/v0.1/countries/flag/images`);
    } catch (err: any) {
      throw err;
    }
  },

  uploadImage: async (image: File, cancelToken?: CancelToken) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;

    const formData = new FormData();
    formData.append("files", image);

    return await axios.request({
      url: process.env.NEXT_PUBLIC_API_URL + "/upload",
      method: "POST",
      headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
      data: formData,
      ...(cancelToken ? { cancelToken } : {}),
    });
  },

  uploadMultiImage: async (images: FileList) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("files", images[i]);
    }

    return await axios.request({
      url: process.env.NEXT_PUBLIC_API_URL + "/upload",
      method: "POST",
      headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
      data: formData,
    });
  },

  upVote: async (prdId: number, spPrdId?: string) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;
    try {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upVote`,
        {
          product_id: prdId,
          ...(spPrdId ? { sp_product_id: spPrdId } : {}),
          date: moment().format("YYYYMMDD"),
        },
        {
          headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  unVote: async (prodId: number, votedId: number) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;
    try {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/unVote`,
        {
          prodId,
          votedId,
        },
        {
          headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  upVoteCuration: async (prdId: number) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;
    try {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upvote-curation`,
        {
          product_id: prdId,
          date: moment().format("YYYYMMDD"),
        },
        {
          headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  unVoteCuration: async (prodId: number, votedId: number) => {
    const localToken = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") || "")?.token;
    try {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/unvote-curation`,
        {
          prodId,
          votedId,
        },
        {
          headers: localToken && localToken !== "" ? { Authorization: `Bearer ${localToken}` } : {},
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  getGlobalData: async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;

      const res = await axios.get(
        `${url}/global?${createQuery({
          populate: {
            global_header: {
              populate: {
                logo: {
                  fields: ["name", "url"],
                },
                navigations: {
                  fields: ["title", "slug", "emoji", "isNew"],
                },
              },
            },
            global_footer: {
              populate: {
                menu: {
                  fields: ["title", "slug", "emoji", "isNew"],
                },
                submenu: {
                  fields: ["title", "slug", "emoji", "isNew"],
                },
              },
            },
            header_bar: {
              populate: {
                content: {
                  populate: {
                    image: {
                      fields: ["name", "url"],
                    },
                  },
                },
                options: "*",
              },
            },
            companyInfo: {
              populate: {
                logo: {
                  fields: ["url"],
                },
              },
            },
          },
        })}`
      );

      const { attributes } = res.data.data;
      if (attributes) {
        const { header_bar, companyInfo } = attributes;
        const { logo, navigations } = attributes.global_header;
        const { menu, submenu } = attributes.global_footer;

        return {
          logo: logo?.data?.attributes.url ?? '',
          navItems: navigations.data.reduce((acc: any, item: any) => {
            const { id, attributes } = item;
            acc.push({
              id,
              ...attributes,
            });
            return acc;
          }, []),
          footerMenu: menu.data.reduce((acc: any, item: any) => {
            const { id, attributes } = item;
            acc.push({
              id,
              ...attributes,
            });
            return acc;
          }, []),
          footerSubMenu: submenu.data.reduce((acc: any, item: any) => {
            const { id, attributes } = item;
            acc.push({
              id,
              ...attributes,
            });
            return acc;
          }, []),
          headerBar: header_bar,
          companyInfo,
        };
      }

      return {
        logo: "",
        navItems: [],
        footerMenu: [],
        footerSubMenu: [],
        headerBar: null,
        companyInfo: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error?.message,
      };
    }
  },
};

export default apis;

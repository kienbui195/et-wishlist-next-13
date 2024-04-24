import apis from "@/apis";
import { createQuery } from "@/utils/function";
import Curation from "./CurationDetail";
import axios from "axios";

export interface IOpenGraphImage {
  url: string;
  width: number;
  height: number;
}

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/wl-curations?${createQuery({
        isDetail: true,
        filters: {
          slug: params.slug,
        },
        fields: ["name", "short_intro"],
        populate: {
          images: {
            fields: ["url"],
          },
        },
      })}`
    );

    if (res.data.data.length > 0) {
      const { attributes } = res.data.data[0];
      const { name: title, short_intro: description, images } = attributes;

      return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_BE_URL as string),
        title,
        description,
        alternates: {
          canonical: `/${params.slug}`,
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: images.data
            ? Array.from(images.data).reduce((acc: string[], item: any) => {
                acc.push(`${item.attributes.url}`);
                return acc;
              }, [])
            : [],
        },
        openGraph: {
          title,
          description,
          url: `${process.env.NEXT_PUBLIC_FE_URL}/curation/${params.slug}`,
          type: "website",
          images: images.data
            ? Array.from(images.data).reduce((acc: IOpenGraphImage[], item: any) => {
                acc.push({
                  url: `${item.attributes.url}`,
                  width: 800,
                  height: 600,
                });
                return acc;
              }, [])
            : [],
        },
      };
    }

    return {
      title: "ET Wishlist",
      description: "",
    };
  } catch (error: any) {
    console.log("getMetadata Curation Detail", error?.message);

    return {
      title: "ET Wishlist",
      description: "The page you are looking for does not exist.",
    };
  }
};

const Page = ({ params }: { params: { slug: string } }) => {
  return <Curation params={params} />;
};

export default Page;

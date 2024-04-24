"use client";

import apis from "@/apis";
import { ICuration } from "@/components/PrdDetailCommon/prdDetailInterface";
import { useAlertContext } from "@/context/alertContext";
import { convertKeys, createQuery } from "@/utils/function";
import React, { useEffect, useState } from "react";
import CardSlider from "./CardSlider";

const SameCate = ({ curation }: { curation: ICuration }) => {
  const [sameCate, setSameCate] = useState<ICuration[]>([]);
  const { showAlert } = useAlertContext();

  useEffect(() => {
    const handleGetSameCate = (curation: ICuration) => {
      if (!curation.attributes.category.data) return [];
      apis
        .get(
          "wl-curations",
          createQuery({
            filters: {
              category: {
                id: curation.attributes.category.data.id,
              },
              id: {
                $notIn: [curation.id],
              },
            },
            populate: {
              thumbnail: {
                fields: ["name", "url"],
              },
              category: "*",
            },
            pagination: {
              start: 0,
              limit: 5,
            },
            sort: {
              votes: "desc",
              createdAt: "desc",
            },
          })
        )
        .then((res) => {
          const { data } = res.data;
          setSameCate(convertKeys(data));
        })
        .catch((err) => {
          console.log(err.message);
          showAlert("warning", "Product not found");
        });
    };

    handleGetSameCate(curation);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curation.id]);

  return (
    <div>
      {sameCate.length > 0 ? (
        <CardSlider
          heading="You may like"
          posts={sameCate}
          perView={2}
          className="md:pb-[98px] border-t border-[--gray-line] pb-[195px] h-[539px] md:h-[442px] pt-6"
          prefixHref="curation"
        />
      ) : (
        <div className="mt-[50px]"></div>
      )}
    </div>
  );
};

export default SameCate;

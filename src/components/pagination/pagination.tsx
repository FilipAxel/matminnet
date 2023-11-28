/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type PaginationItemValue, cn } from "@nextui-org/react";
import { type UseFormGetValues } from "react-hook-form";
import { type FormValues } from "../create-recipe-from/from-interface";

interface PaginationsProps {
  activePage: number;
  range: PaginationItemValue[];
  setPage: (pageNumber: number) => void;
  formErrorHandler: (length?: number, clearError?: boolean) => void;
  getFormValues: UseFormGetValues<FormValues>;
}

const Pagination: React.FC<PaginationsProps> = ({
  activePage,
  range,
  setPage,
  getFormValues,
  formErrorHandler,
}) => {
  const calculatePercentage = () => {
    const percentage = ((activePage - 1) / (range.length - 1)) * 100;
    return isNaN(percentage) ? 0 : percentage.toFixed(2);
  };

  return (
    <>
      <div className="relative flex flex-col gap-1">
        <div className="flex gap-2">
          <h1 className="text-[25px] font-[700] text-[#000]">
            {calculatePercentage()}%{" "}
          </h1>
          <p className="flex items-center text-[16px] font-normal text-[#636363]">
            Complete
          </p>
        </div>

        <ul className="flex items-start justify-start gap-3">
          {range.map((page) => {
            if (typeof page === "number") {
              return (
                <li key={page} aria-label={`page ${page}`}>
                  <button
                    className={cn(
                      "h-[10px] w-[50px]",
                      activePage !== page && "bg-[#898989]",
                      activePage === page && "bg-[#4643E2]"
                    )}
                    onClick={(_) => {
                      if (getFormValues("name").length >= 3) {
                        formErrorHandler(undefined, true);
                        setPage(page);
                      } else {
                        formErrorHandler(getFormValues("name").length);
                      }
                    }}
                  />
                </li>
              );
            }
          })}
        </ul>
      </div>
    </>
  );
};

export default Pagination;

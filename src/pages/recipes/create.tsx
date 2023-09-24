import {
  ScrollShadow,
  cn,
  useDisclosure,
  usePagination,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  type ImageFile,
  type FormValues,
} from "~/components/create-recipe-from/from-interface";
import AuthorComponent from "~/components/form/AuthorComponent";
import CollectionComponent from "~/components/form/CollectionComponent";
import CookTimeComponent from "~/components/form/CookTimeComponent";
import CountryComponent from "~/components/form/CountryComponent";
import DescriptionComponent from "~/components/form/DescriptionComponent";
import DirectionComponent, {
  type StepInterface,
} from "~/components/form/directions/DirectionComponent";
import UploadImageComponent from "~/components/form/UploadImageComponent";
import IngredientsComponent from "~/components/form/IngredientsComponent";
import NameComponent from "~/components/form/NameComponent";
import PublicationComponent from "~/components/form/PublicationComponent";
import ServingSizeComponent from "~/components/form/ServingSizeComponent";
import TagComponent from "~/components/form/TagComponent";
import Pagination from "~/components/pagination/pagination";
import { uploadFileToS3 } from "~/components/utils/s3";
import { api } from "~/utils/api";
import CreateRecipeLoader from "~/components/shared/create-recipe-loading";
import PaginationButtons from "~/components/pagination/pagination-buttons";

type CreateRecipeWithDataFunction = (
  submitedForm: FormValues | null,
  filteredDirectionsSteps: StepInterface[]
) => void;

const Create = () => {
  const { activePage, range, setPage, onNext, onPrevious } = usePagination({
    total: 6,
    defaultValue: 1,
    initialPage: 1,
    showControls: false,
    siblings: 6,
    boundaries: 6,
  });
  const router = useRouter();
  const { isOpen, onOpenChange: togglePublicationDialog } = useDisclosure();
  const [shadowSize, setShadowSize] = useState(50);
  const toggleSize = () => {
    setShadowSize((prevSize) => (prevSize === 50 ? 0 : 50));
  };
  const [showComponent, setShowComponent] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [directionsSteps, setDirectionsSteps] = useState<StepInterface[]>([
    {
      mainStepIndex: 1,
      mainStepValue: "",
      subSteps: [],
    },
  ]);

  const {
    control,
    reset,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      servingSize: "",
      cookingTime: null,
      tags: [],
      video: "",
      country: "",
      author: "",
      collections: [],
      ingredients: [],
      publicationStatus: false,
    },
  });

  const createPresignedUrlMutation =
    api.recipe.createPresignedUrl.useMutation();

  const {
    mutate: createRecipe,
    isLoading: loadingCreateddRecipe,
    isSuccess,
  } = api.recipe.createRecipe.useMutation({
    onSuccess: async (data, _variables, _context) => {
      if (data.status === "success" && imageFiles.length > 0) {
        await Promise.all(
          imageFiles.map(async ({ file }) => {
            const presignedUrlResponse =
              await createPresignedUrlMutation.mutateAsync({
                id: data.createdRecipe.id,
              });
            await uploadFileToS3({
              getPresignedUrl: () => Promise.resolve(presignedUrlResponse),
              file,
            });
          })
        );

        reset();
      }
    },
  });

  useEffect(() => {
    if (showComponent) {
      setTimeout(() => {
        void router.push("/recipes");
      }, 6000);
    }
  }, [showComponent, router]);

  const filterDirectionsSteps = (steps: StepInterface[]): StepInterface[] => {
    return steps
      .map((step) => {
        const filteredSubSteps = step.subSteps.filter(
          (subStep) => subStep.subStepValue.trim() !== ""
        );

        const timer =
          step.timer?.timeValue === 0 || step.timer?.timeValue === undefined
            ? null
            : step.timer;
        return {
          ...step,
          mainStepValue: step.mainStepValue.trim(),
          subSteps: filteredSubSteps.map((subStep) => ({
            ...subStep,
            timer:
              subStep.timer?.timeValue === 0 ||
              subStep.timer?.timeValue === undefined
                ? null
                : subStep.timer,
          })),
          timer: timer,
        };
      })
      .filter((step) => step.mainStepValue !== "");
  };

  const formErrorHandler = (length?: number, clearError = false) => {
    if (length === 0 && !clearError) {
      setError("name", {
        type: "required",
      });
    } else if (!clearError) {
      setError("name", {
        type: "minLength",
      });
    }
    if (clearError) {
      clearErrors("name");
    }
  };

  const createRecipeWithData: CreateRecipeWithDataFunction = (
    submitedForm,
    filteredDirectionsSteps
  ) => {
    if (submitedForm && filteredDirectionsSteps) {
      console.log(filteredDirectionsSteps);
      console.log(submitedForm);
      setShowComponent(true);
      /*  createRecipe({
        recipe: submitedForm,
        direction: filteredDirectionsSteps,
      }); */
    }
  };

  const submitForm = (): void => {
    const submitedData = getValues();
    togglePublicationDialog();
    if (!errors.name?.type) {
      createRecipeWithData(
        submitedData,
        filterDirectionsSteps(directionsSteps)
      );
    }
  };

  return (
    <>
      {showComponent ? (
        <CreateRecipeLoader />
      ) : (
        <div className="relative m-auto mb-16 mt-5 w-[90%]  pb-10">
          <PublicationComponent
            isOpen={isOpen}
            togglePublicationDialog={togglePublicationDialog}
            onSubmit={submitForm}
          />

          <Pagination
            activePage={activePage}
            range={range}
            setPage={setPage}
            getFormValues={getValues}
            formErrorHandler={formErrorHandler}
          />
          <PaginationButtons
            activePage={activePage}
            onNext={onNext}
            onPrevious={onPrevious}
            togglePublicationDialog={togglePublicationDialog}
            getFormValues={getValues}
            formErrorHandler={formErrorHandler}
          />

          {activePage === 1 && (
            <div className="flex flex-col justify-center gap-5 pt-10">
              <h1 className="text-4xl font-semibold">Create a New Recipe</h1>

              <ScrollShadow
                hideScrollBar
                onClick={toggleSize}
                size={shadowSize}
                className={cn("mb-2", {
                  "h-[55px]": shadowSize === 50,
                  "h-[80px]": shadowSize === 0,
                })}
              >
                <p className="max-w-[70ch] text-sm text-gray-500">
                  Let&apos;s begin crafting your culinary masterpiece! Enter the
                  essential details for your recipe below. Give it a name, a
                  brief description, specify the serving size, estimated cooking
                  time, and share a bit about its origin.
                </p>
              </ScrollShadow>

              <NameComponent control={control} errors={errors} />
              <DescriptionComponent control={control} />
              <ServingSizeComponent control={control} />
              <CookTimeComponent control={control} />
              <AuthorComponent control={control} />
              <CountryComponent control={control} />
            </div>
          )}

          {activePage === 2 && (
            <IngredientsComponent control={control} getValues={getValues} />
          )}

          {activePage === 3 && (
            <DirectionComponent
              directionsSteps={directionsSteps}
              setDirectionsSteps={setDirectionsSteps}
            />
          )}

          {activePage === 4 && (
            <UploadImageComponent
              setImageFiles={setImageFiles}
              imageFiles={imageFiles}
            />
          )}

          {activePage === 5 && (
            <div>
              <TagComponent control={control} getValues={getValues} />
            </div>
          )}

          {activePage >= 6 && (
            <CollectionComponent
              control={control}
              currentValue={getValues("collections") || []}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Create;

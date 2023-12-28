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
import CollectionComponent from "~/components/form/CollectionComponent";
import CookTimeComponent from "~/components/form/CookTimeComponent";
import CountryComponent from "~/components/form/CountryComponent";
import DescriptionComponent from "~/components/form/DescriptionComponent";
import DirectionComponent, {
  type StepInterface,
} from "~/components/form/directions/DirectionComponent";
import UploadImageComponent from "~/components/form/UploadImageComponent";
import NameComponent from "~/components/form/NameComponent";
import PublicationComponent from "~/components/form/PublicationComponent";
import ServingSizeComponent from "~/components/form/ServingSizeComponent";
import TagComponent from "~/components/form/TagComponent";
import Pagination from "~/components/pagination/pagination";
import { uploadFileToS3 } from "~/components/utils/s3";
import { api } from "~/utils/api";
import CreateRecipeLoader from "~/components/shared/create-recipe-loading";
import PaginationButtons from "~/components/pagination/pagination-buttons";
import IngredientsStepComponent, {
  type IngredientInterface,
} from "~/components/form/ingredients/IngredientsStepComponent";
import { useSession } from "next-auth/react";
import LoginActionDialog from "~/components/dialog/login-action-dialog";

type CreateRecipeWithDataFunction = (
  submitedForm: FormValues | null,
  filteredDirectionsSteps: StepInterface[]
) => void;

interface RecipeData {
  status: string;
  createdRecipe: {
    id: string;
  };
}

const Create = () => {
  const { data: session, status } = useSession();

  const { activePage, range, setPage, onNext, onPrevious } = usePagination({
    total: 6,
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
  const [ingredientSection, setIngredientSection] = useState<
    IngredientInterface[]
  >([]);
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
    setValue,
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
      collections: [],
      publicationStatus: false,
    },
  });

  const { data: countrys } = api.country.getCountries.useQuery(
    {
      page: 1,
      pageSize: 100,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const createPresignedUrlMutation =
    api.recipe.createPresignedUrl.useMutation();

  const { mutate: createRecipe } = api.recipe.createRecipe.useMutation({
    onSuccess: async (data: RecipeData, _variables, _context) => {
      if (data && data.status === "success" && imageFiles.length > 0) {
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
      }, 7450);
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
            ? undefined
            : step.timer;
        return {
          ...step,
          mainStepValue: step.mainStepValue.trim(),
          subSteps: filteredSubSteps.map((subStep) => ({
            ...subStep,
            timer:
              subStep.timer?.timeValue === 0 ||
              subStep.timer?.timeValue === undefined
                ? undefined
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
      setShowComponent(true);
      const updatedIngredientSection = ingredientSection.map((section) => {
        section.ingredients.forEach((ingredientOption) => {
          delete ingredientOption.error;
        });
        return section;
      });

      createRecipe({
        recipe: submitedForm,
        direction: filteredDirectionsSteps,
        ingredients: updatedIngredientSection,
      });
    }
  };

  const submitForm = (publicationStatus: boolean): void => {
    setValue("publicationStatus", publicationStatus);
    const submitedData = getValues();
    togglePublicationDialog();
    if (!errors.name?.type) {
      createRecipeWithData(
        submitedData,
        filterDirectionsSteps(directionsSteps)
      );
    }
  };

  if (status === "unauthenticated" && !session) {
    return <LoginActionDialog />;
  }

  return (
    <>
      {showComponent ? (
        <CreateRecipeLoader />
      ) : (
        <div className="relative m-auto mb-16 mt-5 w-[90%]  pb-10">
          <PublicationComponent
            isOpen={isOpen}
            togglePublicationDialog={togglePublicationDialog}
            submitForm={submitForm}
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
              <h1 className="text-4xl font-semibold">Skapa ett nytt recept</h1>
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
                  Låt oss börja skapa ditt kulinariska mästerverk! Ange de
                  väsentliga detaljerna för ditt recept nedan. Ge det ett namn,
                  en kort beskrivning, ange serveringsstorlek, uppskattad
                  tillagningstid och dela lite om dess ursprung.
                </p>
              </ScrollShadow>
              <NameComponent control={control} errors={errors} />
              <DescriptionComponent control={control} />
              <ServingSizeComponent control={control} />
              <CookTimeComponent control={control} />

              <CountryComponent control={control} countrys={countrys || []} />
            </div>
          )}

          {activePage === 2 && (
            <IngredientsStepComponent
              ingredientSection={ingredientSection}
              setIngredientSection={setIngredientSection}
            />
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
              <TagComponent setValue={setValue} getValues={getValues} />
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

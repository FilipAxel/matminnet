import { Button, Image, Link } from "@nextui-org/react";
import ActionCard from "~/components/shared/action-card";
import NextImage from "next/image";

export default function Home() {
  return (
    <>
      <div className="pt-20">
        <div className="container mx-auto flex flex-col flex-wrap items-center justify-center px-3 md:flex-row md:flex-nowrap md:px-0">
          <div className="flex w-full flex-col items-start justify-center text-center md:w-2/5 md:text-left">
            <p className="tracking-loose w-full text-[12px] uppercase">
              Upptäck läckra recept och dela dina kulinariska skapelser
            </p>
            <h1 className="my-6 text-4xl font-bold leading-tight md:text-5xl">
              Laga. Dela. Anslut Din receptcentral!
            </h1>
            <p className="text-1xl mx-1 mb-8   leading-normal">
              Trött på röriga kökshyllor fyllda med kokböcker? Gå med i vår
              gemenskap och gör ditt liv enklare.
            </p>

            <div className="flex w-full justify-center space-x-4   lg:justify-start">
              <Button
                href="/discover"
                as={Link}
                size="md"
                color="primary"
                radius="sm"
                variant="solid"
              >
                Utforska Recept
              </Button>
              <Button
                href="/recipes/create"
                as={Link}
                size="md"
                color="primary"
                variant="light"
              >
                Dela Dina Recept
              </Button>
            </div>
          </div>

          <Image
            as={NextImage}
            width={0}
            height={0}
            title="Dela Dina Recept"
            alt="hero placeholder image"
            priority
            className="z-0 mx-auto h-[520px] w-[520px] md:ml-7"
            src="/hero.svg"
          />
        </div>
      </div>
      <section className=" bg-white py-8">
        <div className="container m-8 mx-auto max-w-5xl">
          <div className="mb-4 w-full">
            <div className="gradient mx-auto my-0 h-1 w-64 rounded-t py-0 opacity-25"></div>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start">
            <div className="w-5/6 p-6 text-center sm:w-1/2 sm:text-left">
              <h3 className="mb-3 text-3xl font-bold leading-none text-gray-800">
                Behöver du middagsinspiration?
              </h3>
              <p className="mb-8 text-gray-600">
                Undrar du vad du ska laga till middag ikväll? Leta inte längre!
                Vår receptsamling är här för att rädda dig från dilemmat
                &quot;Vad ska vi äta ikväll?&quot;. <br />
                <br />
                <Link color="primary" className="underline" href="/discover">
                  Hitta inspiration här
                </Link>
              </p>
            </div>
            <div className="w-full p-6 sm:w-1/2">
              <Image
                title="Hitta inspiration här"
                alt="hero placeholder image"
                className="z-0 w-full md:w-3/5"
                src="hero.png"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse flex-wrap items-center  justify-center sm:flex-row sm:justify-start">
            <div className="mt-6 w-full p-6 sm:w-1/2">
              <Image
                alt="hero placeholder image"
                title="Förenkla din kokbokssamling"
                className="z-0 w-full md:w-3/5"
                src="hero.png"
              />
            </div>
            <div className="mt-6 w-full p-6 sm:w-1/2">
              <div className="text-center align-middle sm:text-left">
                <h3 className="mb-3 text-3xl font-bold leading-none text-gray-800">
                  Förenkla din kokbokssamling
                </h3>
                <p className="mb-8 text-gray-600">
                  Trött på röriga kökshyllor fyllda med kokböcker? Gå med i vår
                  gemenskap och gör ditt liv enklare. Genom att lägga till dina
                  favoritrecept på vår webbplats blir du en del av en
                  matlagningsrevolution.
                  <br />
                  <br />
                  <br />
                  <br />
                  <Link
                    color="primary"
                    className="underline"
                    href="/recipes/create"
                  >
                    Börja dela dina recept
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-8">
        <div className="container mx-auto flex flex-wrap gap-5 pb-12 pt-4">
          <h2 className="mx-4 my-2 w-full text-center text-4xl font-bold leading-tight text-gray-800 lg:text-5xl">
            Utforska våra receptfunktioner
          </h2>
          <div className="mb-4 w-full">
            <div className="gradient mx-auto my-0 h-1 w-64 rounded-t py-0 opacity-25"></div>
          </div>
          <ActionCard
            subTitle="Bygg dina egna recept"
            message="Med vår användarvänliga receptbyggare kan du skapa och anpassa dina egna läckra recept, komplett med ingredienser och tillagningsanvisningar. Låt din kulinariska kreativitet lysa!"
            buttonText="Kom igång"
            link="/recipes/create"
          />

          <ActionCard
            subTitle="Dela dina kulinariska skapelser"
            message="Dela dina kulinariska mästerverk med världen! Publicera dina recept, och de blir tillgängliga för alla, vilket gör det enkelt för andra att upptäcka och njuta av dina rätter. Börja dela din kärlek till matlagning idag!"
            buttonText="Publicera nu"
            link="/recipes/create"
          />

          <ActionCard
            subTitle="Hitta det rätta receptet"
            message="Letar du efter det perfekta rätten? Utforska vår omfattande samling av recept och hitta det som passar din smak. Din kulinariska resa börjar här!"
            buttonText="Sök nu"
            link="/discover"
          />
        </div>
      </section>
      <section className="container mx-auto mb-12 py-6 text-center">
        <div className="mx-auto mt-6 flex w-full justify-center p-6">
          <Image
            title="Dela dina kulinariska skapelser"
            alt="hero"
            className="z-0 mx-auto w-full"
            src="hero.png"
          />
        </div>
        <h2 className="my-2 w-full text-center text-4xl font-bold leading-tight">
          Dela dina kulinariska skapelser
        </h2>
        <div className="mb-4 w-full">
          <div className="mx-auto my-0 h-1 w-1/6 rounded-t bg-white py-0 opacity-25"></div>
        </div>
        <h3 className="my-4 ml-6 mr-2 text-center text-xl text-gray-600">
          Varför lägga till dina recept här? Med vår plattform kan du organisera
          dina recept utan ansträngning, hitta nya kulinariska inspirationer
          delade av andra användare och få tillgång till dina recept var som
          helst. Säg adjö till kaoset med traditionella kokböcker och omfamna
          bekvämligheten med en digital receptcentral.
        </h3>

        <Button
          href="/recipes/create"
          as={Link}
          size="lg"
          color="primary"
          className="mt-5"
          radius="full"
        >
          Skapa Recept
        </Button>
      </section>
    </>
  );
}

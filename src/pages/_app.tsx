import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Analytics } from "@vercel/analytics/react";
import "~/styles/globals.css";
import { NextUIProvider, Spacer } from "@nextui-org/react";
import NavigationBar from "~/components/navigation/navigation-bar";
import { SnackbarProvider } from "notistack";
import Head from "next/head";

const MatMinnet: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <SnackbarProvider>
        <NextUIProvider>
          <Head>
            <title>
              Matminnet Receptbyggare - Dela dina kulinariska skapelser.
            </title>
            <link rel="icon" href="/icon-512x512.png" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
          </Head>
          <NavigationBar />
          <Spacer y={1} />
          <div className={` m-auto max-w-[1200px]`}>
            <Component {...pageProps} />
          </div>
          <Analytics />
        </NextUIProvider>
      </SnackbarProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MatMinnet);

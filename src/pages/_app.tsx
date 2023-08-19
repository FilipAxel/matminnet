import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Analytics } from "@vercel/analytics/react";
import "~/styles/globals.css";

// 1. import `NextUIProvider` component
import { NextUIProvider, Spacer } from "@nextui-org/react";
import NavigationBar from "~/components/navigation/navigation-bar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <NavigationBar />
        <Spacer y={1} />
        <div className="m-auto max-w-[1200px]">
          <Component {...pageProps} />
        </div>

        <Analytics />
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

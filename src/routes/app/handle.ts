import { createHandle } from "@/lib/handle";

type AppHandleClient = {};

type AppHandleServer = {
  SidebarContent?: React.FunctionComponent<{}>;
};

type AppHandle = AppHandleClient & AppHandleServer;

export const { defineHandle, getServerHandle } = createHandle<
  AppHandle,
  {},
  AppHandle
>(({ SidebarContent }) => ({
  client: {},
  server: {
    SidebarContent,
  },
}));

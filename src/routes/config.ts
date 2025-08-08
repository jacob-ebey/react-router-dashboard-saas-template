import type { unstable_RSCRouteConfig as RSCRouteConfig } from "react-router";

export function routes() {
  return [
    {
      id: "root",
      path: "",
      lazy: () => import("./root/route"),
      children: [
        {
          id: "marketing",
          lazy: () => import("./marketing/route"),
          children: [
            {
              id: "marketing.home",
              index: true,
              lazy: () => import("./marketing/home/route"),
            },
            {
              id: "marketing.login",
              path: "login",
              lazy: () => import("./marketing/login/route"),
            },
            {
              id: "marketing.signup",
              path: "signup",
              lazy: () => import("./marketing/signup/route"),
            },
          ],
        },
        {
          id: "app",
          path: "app",
          lazy: () => import("./app/route"),
          children: [
            {
              id: "app.home",
              index: true,
              lazy: () => import("./app/home/route"),
            },
            {
              id: "app.profile",
              path: "profile",
              lazy: () => import("./app/profile/route"),
            },
            {
              id: "app.organization",
              path: "organization",
              children: [
                {
                  id: "app.organization.detail",
                  path: ":orgSlug",
                  lazy: () => import("./app/organization/route"),
                },
                {
                  id: "app.organization.settings",
                  path: ":orgSlug/settings",
                  lazy: () => import("./app/organization/settings/route"),
                },
                {
                  id: "app.organization.invite",
                  path: ":orgSlug/invite",
                  lazy: () => import("./app/organization/invite/route"),
                },
              ],
            },
            {
              id: "app.rest",
              path: "*",
              lazy: () => import("./app/home/route"),
            },
          ],
        },
      ],
    },
  ] satisfies RSCRouteConfig;
}

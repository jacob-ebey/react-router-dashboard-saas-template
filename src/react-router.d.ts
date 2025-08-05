import "react-router";

declare module "react-router" {
  declare interface RouteComponentProps {
    params: Readonly<Params<string>>;
    loaderData: any;
    actionData: any;
    matches: UIMatch<unknown, unknown>[];
  }
}

import { createRequestListener } from "@remix-run/node-fetch-server";
import express from "express";

import handler from "src/entry.rsc";

const app = express();

app.use(createRequestListener(handler));

export default app;

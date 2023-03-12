import dotenv from "dotenv";

import { ExpressReceiverFactory } from "./appConfig";

dotenv.config();

export const expressReceiver = new ExpressReceiverFactory().build();
import { z } from "zod";

export declare type Mention = string;

export const MentionSchema = z.string().startsWith("@");

export declare type Channel = string;

export const ChannelSchema = z.string().startsWith("#");

export declare type PRLink = string;

export const PRLinkSchema = z.string().url();

export declare type EstimatedReviewTime = string;

const ertRegex = new RegExp("^d{1,2}(h)?(hours|minutes|min|hrs|m|h)$");

export const EstimatedReviewTimeSchema = z.string().regex(ertRegex);

export declare type PRDescription = string;

export const PRDescriptionSchema = z.string().min(0).max(200);

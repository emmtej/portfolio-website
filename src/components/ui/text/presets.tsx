import type React from "react";
import { Text, type TextProps } from "./Text";

export const Heading: React.FC<TextProps> = (props) => <Text variant="h3" as="h3" {...props} />;
export const Title: React.FC<TextProps> = (props) => <Text variant="h2" as="h2" {...props} />;
export const MetaLabel: React.FC<TextProps> = (props) => <Text variant="meta" size="tiny" {...props} />;

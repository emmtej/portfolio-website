import { useTranslation } from "react-i18next";
import { Text } from "../ui/Typography";
import type { ProjectLinkNoticeKey } from "./projectLinkState";

export function ProjectLinkNotice({
  noticeKey,
}: {
  noticeKey: ProjectLinkNoticeKey | null;
}) {
  const { t } = useTranslation();

  if (!noticeKey) {
    return null;
  }

  return (
    <Text size="sm" className="text-secondary">
      {t(noticeKey)}
    </Text>
  );
}

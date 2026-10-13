import { types } from "../data/types.js";
import { getDetailedReport } from "./detailedReport.js";
export function personalityPoster(type, locale = "zh") {
  const data = types[type],
    report = getDetailedReport(type, locale);
  if (!data) return null;
  return {
    kind: "personality",
    kicker: locale === "zh" ? "人格探索" : "Personality exploration",
    title: type,
    subtitle: data.nickname[locale],
    description: data.tagline[locale],
    lines: report.highlights,
    tags: report.strengths,
  };
}

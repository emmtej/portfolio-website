import { test, expect } from "@playwright/test";

const experienceCases = [
  {
    path: "/",
    sectionTitle: "Experience",
    roles: [
      "Front-End Developer",
      "Audio Mastering Consultant",
      "IT Support I Intern",
    ],
    companies: [
      "Independent Contractor",
      "Mosholu Montefiore Community Center",
    ],
    sampleBullet:
      "Delivered and maintained 12+ responsive websites and React applications",
    removedEmployers: ["Brooklyn College", "Greative Media"],
  },
  {
    path: "/it",
    sectionTitle: "Esperienza",
    roles: [
      "Sviluppatore Front-End",
      "Consulente di Mastering Audio",
      "Tirocinante Supporto IT I",
    ],
    companies: [
      "Collaboratore indipendente",
      "Mosholu Montefiore Community Center",
    ],
    sampleBullet:
      "Ho consegnato e mantenuto oltre 12 siti web responsive e applicazioni React",
    removedEmployers: ["Brooklyn College", "Greative Media"],
  },
] as const;

for (const {
  path,
  sectionTitle,
  roles,
  companies,
  sampleBullet,
  removedEmployers,
} of experienceCases) {
  test.describe(`About experience (${path})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test("renders resume-aligned roles in order", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: sectionTitle }),
      ).toBeVisible();

      const experienceSection = page
        .getByRole("heading", { name: sectionTitle })
        .locator("xpath=ancestor::section[1]");
      const roleHeadings = experienceSection.getByRole("heading", { level: 3 });
      await expect(roleHeadings).toHaveCount(roles.length);

      for (const [index, role] of roles.entries()) {
        await expect(roleHeadings.nth(index)).toHaveText(role);
      }
    });

    test("renders bullet lists instead of legacy paragraph copy", async ({
      page,
    }) => {
      await expect(page.getByText(sampleBullet)).toBeVisible();
      await expect(
        page.locator("section ul li").first(),
      ).toBeVisible();
    });

    test("shows updated employers", async ({ page }) => {
      for (const company of companies) {
        await expect(page.getByText(company, { exact: false }).first()).toBeVisible();
      }
    });

    test("removes stale employer references", async ({ page }) => {
      for (const employer of removedEmployers) {
        await expect(page.getByText(employer, { exact: false })).toHaveCount(0);
      }
    });
  });
}

test("hero copy reflects React work since 2020", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("Since 2020, I’ve dedicated myself to the React ecosystem"),
  ).toBeVisible();
  await expect(page.getByText("Over the last 4 years")).toHaveCount(0);
});

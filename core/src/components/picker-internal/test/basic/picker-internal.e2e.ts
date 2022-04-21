import type { TestInfo } from '@playwright/test';
import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('picker-internal', () => {
  test('inline pickers should not have visual regression', async ({ page }) => {
    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `picker-internal-inline-diff-${page.getSnapshotSettings()}.png`
    );
  });

  test('popover picker should not have visual regression', async ({ page, userAgent }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'Mobile Safari' && userAgent?.includes('Linux') === true, 'Mobile Safari on Linux renders the selected option incorrectly');

    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    await page.click('#popover');

    await page.spyOnEvent('ionPopoverDidPresent');
    // Accounts for slight delay in showing the popover
    await page.waitForTimeout(100);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `picker-internal-popover-diff-${page.getSnapshotSettings()}.png`
    );
  });

  test('modal picker should not have visual regression', async ({ page, userAgent }, testInfo: TestInfo) => {
    test.skip(testInfo.project.name === 'Mobile Safari' && userAgent?.includes('Linux') === true, 'Mobile Safari on Linux renders the selected option incorrectly');

    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    await page.click('#modal');

    await page.spyOnEvent('ionModalDidPresent');

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      `picker-internal-modal-diff-${page.getSnapshotSettings()}.png`
    );
  });
});

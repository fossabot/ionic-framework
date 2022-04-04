import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, State, h } from '@stencil/core';
import { componentOnReady } from '@utils/helpers';
import { printIonError } from '@utils/logging';

import type { Color } from '../../interface';
import { getFormattedTime, getMonthDayAndYear } from '../datetime/utils/format';
import { is24Hour } from '../datetime/utils/helpers';
import { parseDate } from '../datetime/utils/parse';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-datetime-button',
  styleUrls: {
    ios: 'datetime-button.ios.scss',
    md: 'datetime-button.md.scss',
  },
  shadow: true,
})
export class DatetimeButton implements ComponentInterface {
  private datetimeEl: HTMLIonDatetimeElement | null = null;

  @State() dateText?: string;
  @State() timeText?: string;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The ID of the `ion-datetime` instance
   * associated with the datetime button.
   */
  @Prop() datetime?: string;

  async componentWillLoad() {
    const { datetime } = this;
    if (!datetime) {
      printIonError(
        'An ID associated with an ion-datetime instance is required for ion-datetime-button to function properly.'
      );
      return;
    }

    const datetimeEl = (this.datetimeEl = document.getElementById(datetime) as HTMLIonDatetimeElement | null);
    if (!datetimeEl) {
      printIonError(`No ion-datetime instance found for ID '${datetime}'.`);
      return;
    }

    componentOnReady(datetimeEl, () => {
      this.setDateTimeText();
      datetimeEl.addEventListener('ionChange', this.setDateTimeText);
    });
  }

  private setDateTimeText = () => {
    const { datetimeEl } = this;

    if (!datetimeEl) {
      return;
    }

    const { value, locale, hourCycle } = datetimeEl;
    const parsedDatetime = parseDate(value);
    const use24Hour = is24Hour(locale, hourCycle);

    this.dateText = getMonthDayAndYear(locale, parsedDatetime);
    this.timeText = getFormattedTime(parsedDatetime, use24Hour);
  };

  private handleDateClick = () => {
    const { datetimeEl } = this;

    if (!datetimeEl) {
      return;
    }

    datetimeEl.presentation = 'date';
  };

  private handleTimeClick = () => {
    const { datetimeEl } = this;

    if (!datetimeEl) {
      return;
    }

    datetimeEl.presentation = 'time';
  };

  render() {
    const { dateText, timeText } = this;

    return (
      <Host>
        <div class="date-target-container" aria-haspopup="dialog" onClick={() => this.handleDateClick()}>
          <slot name="date-target">
            <button>{dateText}</button>
          </slot>
        </div>

        <div class="time-target-container" aria-haspopup="dialog" onClick={() => this.handleTimeClick()}>
          <slot name="time-target">
            <button>{timeText}</button>
          </slot>
        </div>
      </Host>
    );
  }
}
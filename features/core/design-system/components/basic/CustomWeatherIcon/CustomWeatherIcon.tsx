import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { customWeatherIconStyles } from '@/features/core/design-system/components/basic/CustomWeatherIcon/CustomWeatherIcon.style';
import { colors } from '@/features/core/design-system/style/colors';

export const weatherConditions = {
  sunny: 'sunny',
  partlyCloudy: 'partlyCloudy',
  cloudy: 'cloudy',
  rain: 'rain',
  snow: 'snow',
  storm: 'storm',
} as const;

export type WeatherCondition = (typeof weatherConditions)[keyof typeof weatherConditions];

export const DEFAULT_WEATHER_ICON_SIZE = 32;

const WEATHER_ICON_VIEW_BOX = '0 0 80 80';

type WeatherIconPath = {
  name: string;
  d: string;
  fill: string;
  fillRule?: 'evenodd';
  transform?: string;
};

const PARTLY_CLOUDY_SUN_TRANSFORM = 'translate(-2.16 -2.16) scale(0.68)';

const PARTLY_CLOUDY_CLOUD_TRANSFORM = 'translate(13.5 12.438) scale(0.8125)';

/**
 * The one cloud every cloud-bearing glyph draws, from `glyphs:cloud-1-bold`. Rain, Snow and Storm
 * carry the same outline with a cut-out for their detail, which is why they keep their own copy.
 */
const CLOUD_PATH =
  'M57.064 21.575a15.58 15.58 0 0 1 7.37 9.446c.59 2.164.698 4.408.342 6.584a12.4 12.4 0 0 1 3.518 2.421l.082.08a12.1 12.1 0 0 1 0 17.27l-.082.08a12.37 12.37 0 0 1-8.667 3.543H56.81l-.03.001H20.373a12.37 12.37 0 0 1-8.667-3.543l-.082-.08a12.1 12.1 0 0 1 0-17.27l.082-.08a12.37 12.37 0 0 1 6.867-3.411q.088-.557.235-1.107a10.76 10.76 0 0 1 5.101-6.572a11.1 11.1 0 0 1 8.349-1.05a11.2 11.2 0 0 1 2.092.792l.786-1.336a16.1 16.1 0 0 1 9.781-7.382a16.1 16.1 0 0 1 12.02 1.541z';

const SUN_RAYS_PATH =
  'm40 12l6.965 11.185l12.834-2.984l-2.984 12.834L68 40l-11.185 6.965l2.984 12.834l-12.834-2.984L40 68l-6.965-11.185l-12.834 2.984l2.984-12.834L12 40l11.185-6.965l-2.984-12.834l12.834 2.984zm5.39 14.986a14.087 14.087 0 1 1-10.78 26.028a14.087 14.087 0 0 1 10.78-26.028';

const SUN_CORE_PATH = 'M44.243 29.757a11.086 11.086 0 1 0-8.486 20.484a11.086 11.086 0 0 0 8.486-20.484';

const RAIN_CLOUD_PATH =
  'M64.434 18.594a15.58 15.58 0 0 0-7.37-9.447l-.127-.072a16.1 16.1 0 0 0-12.02-1.542a16.1 16.1 0 0 0-9.781 7.383l-.786 1.335a11 11 0 0 0-2.092-.792a11.1 11.1 0 0 0-8.349 1.05a10.76 10.76 0 0 0-5.336 7.68a12.37 12.37 0 0 0-6.867 3.41l-.082.081a12.1 12.1 0 0 0 0 17.269l.082.08a12.37 12.37 0 0 0 8.667 3.544h5.667a10.3 10.3 0 0 1 2.744-4.632l4.543-4.405l2.605-3.35c2.276-2.926 6.951-1.673 7.46 1.999l.581 4.203l1.731 6.087q.015.048.027.098h11.05l.03-.002h2.816a12.37 12.37 0 0 0 8.667-3.543l.082-.08a12.1 12.1 0 0 0 0-17.269l-.082-.08a12.4 12.4 0 0 0-3.518-2.421c.356-2.177.249-4.42-.342-6.584m-24.94 29.979l-1.35-4.745a3 3 0 0 1-.086-.41l-.022-.163l-.102.13a3 3 0 0 1-.28.312l-4.693 4.551a4 4 0 0 0-.3.325z';

const RAIN_DROPS_PATH =
  'M38.3 38.028c.647-.831 1.975-.475 2.12.568l.61 4.411l1.788 6.289a7.32 7.32 0 0 1-1.12 6.284a7.23 7.23 0 0 1-4.695 2.892a7.2 7.2 0 0 1-5.683-1.523a7.23 7.23 0 0 1-2.618-4.851a7.32 7.32 0 0 1 2.17-6.003l4.694-4.552zm13.647 17.346c.631-.781 1.89-.444 2.045.548l.246 1.57c.196 1.255.483 2.494.857 3.708l1.051 3.412a5.945 5.945 0 0 1-4.844 7.636l-.187.027a6.4 6.4 0 0 1-4.852-1.3l-.149-.117a5.945 5.945 0 0 1-.377-9.035l2.617-2.43a26.5 26.5 0 0 0 2.596-2.782zM22.722 57.78c.646-.831 1.975-.475 2.12.568l.36 2.61l1.342 4.716a5.49 5.49 0 0 1-.841 4.713a5.398 5.398 0 0 1-9.747-2.612a5.49 5.49 0 0 1 1.628-4.502l3.52-3.413z';

const SNOW_CLOUD_PATH =
  'M57.064 10.147a15.58 15.58 0 0 1 7.37 9.447c.59 2.163.698 4.407.342 6.584a12.4 12.4 0 0 1 3.518 2.42l.082.081a12.1 12.1 0 0 1 0 17.269l-.082.08a12.37 12.37 0 0 1-7.848 3.516a5 5 0 0 0-.76-1.677a5 5 0 0 0-4.613-7.842a5 5 0 0 0-3.44-2.829a5 5 0 0 0-1.957-.059a5 5 0 0 0-1.03-1.665A4.99 4.99 0 0 0 44.54 33.9a5 5 0 0 0-9.077-.002a4.99 4.99 0 0 0-4.105 1.572a5 5 0 0 0-1.03 1.664a5 5 0 0 0-1.956.06a5 5 0 0 0-3.441 2.83a5 5 0 0 0-4.615 7.843a5 5 0 0 0-.76 1.677a12.37 12.37 0 0 1-7.85-3.516l-.082-.08a12.1 12.1 0 0 1 0-17.269l.083-.08a12.37 12.37 0 0 1 6.867-3.412q.088-.556.235-1.107a10.76 10.76 0 0 1 5.101-6.571a11.1 11.1 0 0 1 8.349-1.051c.727.195 1.428.461 2.092.792l.786-1.335a16.1 16.1 0 0 1 9.781-7.383a16.1 16.1 0 0 1 12.02 1.542z';

const SNOW_HALO_PATH =
  'M36.378 37.417a2 2 0 0 0-2.727 2.926zm3.624 6.111l-1.364 1.463a2 2 0 0 0 2.728 0zm-8.976 5.183l.586 1.912a2 2 0 0 0 1.363-2.362zm.417-7.094a2 2 0 0 0-3.898.9zm14.91-1.273a2 2 0 1 0-2.728-2.926zm6.105 2.174a2 2 0 1 0-3.897-.9zm-3.48 6.193l-1.949-.45a2 2 0 0 0 1.364 2.362zm6.026 3.935a2 2 0 1 0 1.17-3.825zm1.17 6.318a2 2 0 0 0-1.17-3.825zm-7.196.11l-.585-1.912a2 2 0 0 0-1.364 2.362zm-.373 7.284a2 2 0 0 0 3.898-.9zM43.769 70.5a2 2 0 0 0 2.727-2.926zm-3.767-6.244l1.364-1.463a2 2 0 0 0-2.727 0zm-6.495 3.32a2 2 0 0 0 2.728 2.925zm-6.006-2.117a2 2 0 0 0 3.898.9zm3.525-6.385l1.95.45a2 2 0 0 0-1.364-2.363zm-6.029-3.937a2 2 0 0 0-1.17 3.825zm-1.17-6.316a2 2 0 0 0 1.17 3.825zm9.824-8.48l4.987 4.65l2.728-2.927l-4.988-4.648zm-.676 7.92l-1.532-6.645l-3.898.9l1.533 6.643zm8.39-3.27l4.987-4.648l-2.727-2.926l-4.986 4.647zm7.196-3.373l-1.532 6.642l3.898.899l1.531-6.642zm-.168 9.004l6.61 2.023l1.171-3.825l-6.61-2.023zm6.61 4.516l-6.61 2.023l1.17 3.825l6.611-2.023zm-7.974 4.385l1.576 6.834l3.898-.9l-1.576-6.833zm-.533 8.051l-5.13-4.781l-2.727 2.926l5.13 4.781zm-7.858-4.781l-5.13 4.782l2.727 2.926l5.13-4.782zM31.4 66.359l1.576-6.835l-3.897-.899L27.5 65.46zm.213-9.197l-6.615-2.024l-1.17 3.825l6.614 2.024zm-6.615-4.515l6.615-2.024l-1.17-3.825l-6.615 2.024z';

const SNOW_FLAKE_PATH =
  'm40 36l2-.002a2 2 0 0 0-4 0zm15.589 9l1.001 1.731a2 2 0 0 0-2-3.464zm0 18l-.999 1.733a2 2 0 0 0 2-3.464zM40 72l-2 .002a2 2 0 0 0 4 0zm-15.588-9l-1.002-1.731a2 2 0 0 0 2 3.464zm0-18l.998-1.733a2 2 0 0 0-2 3.464zm12.004 6.915l-.998 1.733zm3.57-2.062l-2-.002zm-3.584 6.208l-1.002-1.73zm0-4.122l1.002-1.731zm3.584 6.208l2-.002zm-3.57-2.062l.998 1.733zm7.168 0l.998-1.733zm-3.57 2.062l2 .002zm3.584-6.208l1.002 1.73zm0 4.122l1.002-1.73zm-3.584-6.208l-2 .002zM38 36.002l.014 13.853l4-.004L42 35.998zm6.582 17.646l12.005-6.915l-1.997-3.466l-12.004 6.915zm10.005-10.379l-11.99 6.939L44.6 53.67l11.99-6.939zm-11.99 14.523l11.99 6.939l2.003-3.462L44.6 54.33zm13.99 3.475l-12.005-6.915l-1.996 3.466l12.004 6.915zm-18.573-3.122L38 71.998l4 .004l.014-13.853zM42 71.998l-.014-13.853l-4 .004L38 72.002zm-6.582-17.646l-12.005 6.915l1.997 3.466l12.004-6.915zM25.413 64.731l11.99-6.939L35.4 54.33l-11.99 6.94zm11.99-14.523l-11.99-6.939l-2.003 3.462L35.4 53.67zm-13.99-3.475l12.005 6.915l1.996-3.466l-12.004-6.915zm18.573 3.123L42 36.002l-4-.004l-.014 13.853zm-6.568 3.792c2.919 1.681 6.565-.424 6.568-3.793l-4-.004a.382.382 0 0 1-.572.33zm1.986 4.144c2.916-1.687 2.916-5.897 0-7.584L35.4 53.67a.381.381 0 0 1 0 .66zm4.582.353c-.003-3.37-3.649-5.474-6.568-3.793l1.996 3.466a.382.382 0 0 1 .572.33zm2.596-3.793c-2.919-1.681-6.565.424-6.568 3.793l4 .004c0-.294.318-.477.572-.33zm-1.986-4.144c-2.916 1.687-2.916 5.897 0 7.584L44.6 54.33a.381.381 0 0 1 0-.66zm-4.582-.353c.003 3.37 3.65 5.474 6.568 3.793l-1.996-3.466a.381.381 0 0 1-.572-.33z';

const STORM_CLOUD_PATH =
  'M64.434 21.594a15.58 15.58 0 0 0-7.37-9.447l-.127-.072a16.1 16.1 0 0 0-12.02-1.542a16.1 16.1 0 0 0-9.781 7.383l-.786 1.335a11 11 0 0 0-2.092-.792a11.1 11.1 0 0 0-8.349 1.05a10.76 10.76 0 0 0-5.336 7.68a12.37 12.37 0 0 0-6.867 3.41l-.082.081a12.1 12.1 0 0 0 0 17.269l.082.08a12.37 12.37 0 0 0 8.667 3.544h5.839l13.617-20.4l-.68 11.826l-5.723 8.574h5.23l.493-8.574l.014-.02l-.485 8.594h7.752l.437-.655h-3.452a3 3 0 0 1-3-3v-6.816l-1.252 1.876l.666-11.805c1.975-2.958 6.586-1.56 6.586 1.996v11.75h4.948c2.872 0 4.585 3.202 2.99 5.59l-.71 1.064h3.138l.03-.002h2.816a12.37 12.37 0 0 0 8.667-3.543l.082-.08a12.1 12.1 0 0 0 0-17.269l-.082-.08a12.4 12.4 0 0 0-3.518-2.421c.356-2.177.249-4.42-.342-6.584';

const STORM_BOLT_PATH =
  'M36.538 55.081H28.59a.595.595 0 0 1-.495-.925l14.23-21.318c.326-.49 1.09-.258 1.09.33v14.75h7.947c.476 0 .76.53.496.926l-14.23 21.317c-.327.49-1.09.259-1.09-.33z';

/**
 * The shipped weather artwork, and its only copy in the repository.
 *
 * Held inline rather than imported from `.svg` files because `react-native-svg-transformer` is
 * wired into Metro only: the web Storybook runs `@storybook/react-native-web-vite`, whose Vite
 * pipeline has no SVG handling and would resolve a `.svg` import to a URL string. `types/svg.d.ts`
 * declares `*.svg` as a component, so that mistake typechecks cleanly and renders blank.
 *
 * Source: the Iconify [`glyphs`](https://github.com/gorango/glyphs) set, `-bold` (solid) weight, by
 * Goran Spasojevic. All are natively `viewBox="0 0 80 80"`, so they share one grid and one weight;
 * the `d` values are upstream and unmodified. What this set changes is the `fill` values, which
 * glyphs are combined, and the `transform` that places them.
 *
 * Condition to glyph:
 *
 * - `sunny` — `glyphs:sun-bold`
 * - `partlyCloudy` — `glyphs:sun-bold` behind `glyphs:cloud-1-bold`
 * - `cloudy` — `glyphs:cloud-1-bold`
 * - `rain` — `glyphs:rain-1-bold`
 * - `snow` — `glyphs:snow-bold`
 * - `storm` — `glyphs:lightning-bold`
 *
 * `partlyCloudy` is the only composite, and it is scaled from the two measured 80x80 boxes so the
 * sun clears the cloud's top-left corner: the sun's 56 goes to 38 at (6, 6), the cloud's 64 to 52
 * at (20, 28.2), which keeps the glyph inside the same 66-wide footprint as the rest of the set.
 *
 * ```text
 * MIT License
 *
 * Copyright (c) 2018
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ```
 */
const weatherIconPaths: Record<WeatherCondition, readonly WeatherIconPath[]> = {
  [weatherConditions.sunny]: [
    {
      name: 'rays',
      d: SUN_RAYS_PATH,
      fill: colors.lime700,
      fillRule: 'evenodd',
    },
    // NOTE: upstream lists the core first, where the rays hide it: it only shows when drawn last.
    {
      name: 'core',
      d: SUN_CORE_PATH,
      fill: colors.lime500,
    },
  ],
  [weatherConditions.partlyCloudy]: [
    {
      name: 'rays',
      d: SUN_RAYS_PATH,
      fill: colors.lime700,
      fillRule: 'evenodd',
      transform: PARTLY_CLOUDY_SUN_TRANSFORM,
    },
    {
      name: 'core',
      d: SUN_CORE_PATH,
      fill: colors.lime500,
      transform: PARTLY_CLOUDY_SUN_TRANSFORM,
    },
    {
      name: 'cloud',
      d: CLOUD_PATH,
      fill: colors.primaryGrey,
      transform: PARTLY_CLOUDY_CLOUD_TRANSFORM,
    },
  ],
  [weatherConditions.cloudy]: [
    {
      name: 'cloud',
      d: CLOUD_PATH,
      fill: colors.primaryGrey,
      fillRule: 'evenodd',
    },
  ],
  [weatherConditions.rain]: [
    {
      name: 'cloud',
      d: RAIN_CLOUD_PATH,
      fill: colors.primaryGrey,
      fillRule: 'evenodd',
    },
    {
      name: 'drops',
      d: RAIN_DROPS_PATH,
      fill: colors.cyan500,
    },
  ],
  [weatherConditions.snow]: [
    {
      name: 'cloud',
      d: SNOW_CLOUD_PATH,
      fill: colors.primaryGrey,
      fillRule: 'evenodd',
    },
    // NOTE: traces the flake to keep its upper arms off the cloud, so it tracks the cloud colour.
    {
      name: 'halo',
      d: SNOW_HALO_PATH,
      fill: colors.primaryGrey,
    },
    {
      name: 'flake',
      d: SNOW_FLAKE_PATH,
      fill: colors.cyan500,
    },
  ],
  [weatherConditions.storm]: [
    {
      name: 'cloud',
      d: STORM_CLOUD_PATH,
      fill: colors.primaryGrey,
      fillRule: 'evenodd',
    },
    {
      name: 'bolt',
      d: STORM_BOLT_PATH,
      fill: colors.red500,
      fillRule: 'evenodd',
    },
  ],
};

export type CustomWeatherIconProps = {
  condition: WeatherCondition;
  size?: number;
  accessibilityLabel?: string;
};

export const CustomWeatherIcon = ({
  condition,
  size = DEFAULT_WEATHER_ICON_SIZE,
  accessibilityLabel,
}: CustomWeatherIconProps) => {
  const styles = customWeatherIconStyles({ size });

  return (
    // NOTE: the accessibility props belong on this wrapper, not on `Svg`: react-native-svg's web
    // build forwards unrecognised props straight onto the DOM `<svg>`, so `accessible` landed there
    // as a raw attribute and React logged a non-boolean-attribute error on every render.
    <View
      style={styles.container}
      // NOTE: a label alone never makes a native view an accessibility element, so an unlabelled
      // icon stays decorative and a labelled one is announced.
      accessible={accessibilityLabel !== undefined}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width={size} height={size} viewBox={WEATHER_ICON_VIEW_BOX}>
        {weatherIconPaths[condition].map(({ name, d, fill, fillRule, transform }) => (
          <Path key={name} d={d} fill={fill} fillRule={fillRule} transform={transform} />
        ))}
      </Svg>
    </View>
  );
};

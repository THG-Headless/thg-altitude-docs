---
title: "Altitude Global Context"
---

## Altitude Global Context

The integration will provide additional information about the config resolvement at runtime and attach it to `context.locals.altitude`. Please see all available attachments below.

### altitude.runtime.config

The build config object the integration has resolved to. For applications using the integration's [localisation](/docs/astro-integration/guides/i18n) solution this will be the locale specific config.

### altitude.runtime.kv.\<namespace>

The value of [KV](#kv) retrieved using the key provided. This will be attached using the namespace value provided in the KV for the key retrieved.

<h2 id="internationalisation">Internationalisation</h2>

These keys will be provided on the altitude namespace for applications that are using the built in i18n solution. Further information can be found [here](/docs/astro-integration/guides/i18n)

### altitude.locale

The locale the integration has resolved to from the request.

- `en-gb`

### altitude.availableLocales

Array containing all the locales a sites config supports.

- `['en-gb', 'fr-fr']`

### altitude.localeDomains (deprecated)

An object containing the ISO 639-1 code and domain path it corresponds to.

- `{'en-gb': 'https://www.example.com', 'fr-fr': 'https://www.example.fr'}`

### altitude.preferredLocale (deprecated)

ISO 639-1 code that resolves to the 'prefix' in the i18n section of the build config. If none are provided or invalid, `null` will be returned.
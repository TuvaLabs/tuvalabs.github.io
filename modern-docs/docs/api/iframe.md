---
outline: deep
---

# Iframe Bridge API

When TuvaDataTools is embedded in an `<iframe>` and the host page needs to drive it from outside, the `usePostMessageBridge` hook wires up two-way communication over `window.postMessage`.

Two protocols are supported on the same bridge:

- **New API** — structured messages with `source: 'tuva'`. Use this for new integrations.
- **Legacy API** — JSON-string messages, kept for backward compatibility.

## Wiring the hook

```jsx
import { usePostMessageBridge } from '@tuva-ui/components/src/api';

function Embedded({ iframeId }) {
  const tuvaActionsRef = useRef();

  const { onToolReady, onUserAction } = usePostMessageBridge({
    tuvaActionsRef,
    iframeId,
    viewOnly: false,
    onDataLoaded: (data) => {
      // `data` is the parsed payload from a datasetLoad message.
      // Apply it to your component state.
    },
  });

  return (
    <TuvaDataTools
      ref={(ele) => { if (ele?.actions) tuvaActionsRef.current = ele.actions; }}
      onReady={onToolReady}
      onUserAction={onUserAction}
      /* ...other props */
    />
  );
}
```

### UMD (no bundler)

The hook is attached to both UMD bundles as a static:

```html
<script src="tuva-data-tools-api.min.js"></script>
<script>
  const { usePostMessageBridge } = TuvaDataToolsAPI; // or AuthoringTool
</script>
```

## Options

| Option | Type | Required | Description |
|---|---|---|---|
| `tuvaActionsRef` | `React.RefObject` | Yes | Ref whose `.current` is the `actions` object exposed by `TuvaDataTools`. |
| `iframeId` | `string` | No | Identifier echoed back to the parent on every outgoing message. Required when the parent hosts multiple iframes. |
| `viewOnly` | `boolean` | No | When `true`, forces `conf.viewOnly = true` on incoming `plotStateSet` and legacy `plotState` writes. Does not affect `datasetLoad`. |
| `onDataLoaded` | `(data) => void` | No | Called after a `datasetLoad` message resolves to a `DataProviderData` shape. Apply it to your data state. |

## Return value

The hook returns `{ onToolReady, onUserAction }` — wire both to `TuvaDataTools`:

| Callback | Wire to | Effect |
|---|---|---|
| `onToolReady` | `onReady` | Sends `ready` then `frameReady` (1 s later), letting the parent know the bridge is bound. |
| `onUserAction` | `onUserAction` | When `changeListener` has been enabled, posts a `plotStateChange` message after each user action (500 ms debounce). |

The hook also assigns `window.tuvaDataTools = { actions }` as a convenience for same-window callers.

## Message protocol — new API

### Outbound (iframe → parent)

All outbound messages carry `frameId` (the `iframeId` passed to the hook, or `''` if unset).

| Event | Shape | When |
|---|---|---|
| `ready` | `{ source:'tuva', event:'ready', value:true, frameId }` | Immediately on `onToolReady`. |
| `frameReady` | `{ source:'tuva', event:'frameReady', value:true, frameId }` | 1 s after `ready`. Bridge is fully bound — wait for this before sending requests. |
| `datasetSave` | `{ source:'tuva', event:'datasetSave', value:<JSON string>, frameId }` | In response to an inbound `datasetSave` request. |
| `plotStateGet` | `{ source:'tuva', event:'plotStateGet', value:<plotState>, frameId }` | In response to an inbound `plotStateGet`. |
| `plotImageGet` | `{ source:'tuva', event:'plotImageGet', value:<PNG dataURL>, frameId }` | In response to an inbound `plotImageGet`. |
| `altTextGet` | `{ source:'tuva', event:'altTextGet', value:<string\|null>, frameId }` | In response to an inbound `altTextGet`. |
| `plotStateChange` | `{ source:'tuva', event:'plotStateChange', value:<plotState>, frameId }` | After each user action, when `changeListener` is enabled (500 ms debounce). |

### Inbound (parent → iframe)

#### datasetSave — request a snapshot

```javascript
iframe.contentWindow.postMessage(
  { source: 'tuva', event: 'datasetSave', type: 'full' },
  '*'
);
```

`type` selects what `value` (a JSON string) contains in the reply:

| `type` | `value` payload |
|---|---|
| `'full'` *(default)* | `{ rawData, columnIds, metaData, plotState, version: 1 }` |
| `'rawdata'` | `{ rawData, version: 1 }` — `rawData[0]` is the header row. |
| `'rawdatawithoutheader'` | Same as `rawdata` but with the header row dropped. |

#### datasetLoad — push data into the iframe

```javascript
iframe.contentWindow.postMessage(
  { source: 'tuva', event: 'datasetLoad', type: 'full', value: '<JSON string>' },
  '*'
);
```

`value` is always a JSON string. `type` controls how the bridge interprets it:

| `type` | Behavior |
|---|---|
| `'full'` *(default)* | Parse `value`, pass straight to `onDataLoaded`. |
| `'rawdata'` | Parse `value`, synthesize `metaData.fields` from the header row in `rawData[0]`, then call `onDataLoaded`. |
| `'rawdatawithoutheader'` | Parse `value`, prepend the iframe's current header row, reuse current `metaData`, then call `onDataLoaded`. |
| `'rawdataappend'` | Parse `value`, append `rawData` rows to the existing table via `actions.appendRawData`. Does **not** call `onDataLoaded`. |

#### plotStateGet / plotStateSet

```javascript
// Get current plotState — iframe replies with plotStateGet { value, frameId }
iframe.contentWindow.postMessage({ source: 'tuva', event: 'plotStateGet' }, '*');

// Apply a plotState. value is the plotState object (not stringified).
iframe.contentWindow.postMessage(
  { source: 'tuva', event: 'plotStateSet', value: savedPlotState },
  '*'
);
```

::: tip
`plotStateSet` honors the hook's `viewOnly` option — when `viewOnly: true`, the bridge forces `value.conf.viewOnly = true` before applying.
:::

#### plotImageGet

```javascript
iframe.contentWindow.postMessage({ source: 'tuva', event: 'plotImageGet' }, '*');
// Reply: { source:'tuva', event:'plotImageGet', value:'data:image/png;base64,…', frameId }
```

#### altTextGet / altTextSet

```javascript
// Read
iframe.contentWindow.postMessage({ source: 'tuva', event: 'altTextGet' }, '*');

// Write
iframe.contentWindow.postMessage(
  { source: 'tuva', event: 'altTextSet', value: 'Bar chart of …' },
  '*'
);
```

#### changeListener — subscribe / unsubscribe to plot changes

```javascript
// Enable
iframe.contentWindow.postMessage(
  { source: 'tuva', event: 'changeListener', value: true },
  '*'
);

// Disable
iframe.contentWindow.postMessage(
  { source: 'tuva', event: 'changeListener', value: false },
  '*'
);
```

While enabled, every user action triggers an outbound `plotStateChange` carrying the latest `plotState` (debounced by 500 ms). The legacy `listenOnChange` and the new `changeListener` are tracked independently — enabling one doesn't affect the other.

## Parent-side recipe

```javascript
const iframe = document.getElementById('tuva-frame');

window.addEventListener('message', (e) => {
  // New API: structured object — dispatch by event name
  if (e.data?.source === 'tuva') {
    switch (e.data.event) {
      case 'frameReady':       console.log('iframe ready', e.data.frameId); break;
      case 'datasetSave':      console.log('save',          JSON.parse(e.data.value)); break;
      case 'plotStateGet':     console.log('plotState',     e.data.value); break;
      case 'plotImageGet':     console.log('image dataURL', e.data.value); break;
      case 'altTextGet':       console.log('altText',       e.data.value); break;
      case 'plotStateChange':  console.log('user changed plot', e.data.value); break;
    }
    return;
  }

  // Legacy API: JSON strings (unchanged)
  if (typeof e.data === 'string' && e.data.trim().startsWith('{')) {
    const msg = JSON.parse(e.data);
    if (msg.state)     console.log('plotState', msg.state);
    if (msg.summary)   console.log('altText',   msg.summary);
    if (msg.plotImage) console.log('image',     msg.plotImage);
  }
});

// Wait for frameReady before sending anything, then for example:
iframe.contentWindow.postMessage(
  { source: 'tuva', event: 'changeListener', value: true },
  '*'
);
```

## Message protocol — legacy API

Each legacy message is a JSON-encoded string. Outbound messages echo `iframeId` so the parent can route between multiple frames.

### plotState

```javascript
// Read: post with plotState null
iframe.contentWindow.postMessage(JSON.stringify({ plotState: null }), '*');
// Reply: JSON.stringify({ iframeId, state })

// Write: post with plotState set
iframe.contentWindow.postMessage(JSON.stringify({ plotState: savedPlotState }), '*');
```

### plotImage

```javascript
iframe.contentWindow.postMessage(JSON.stringify({ plotImage: true }), '*');
// Reply: JSON.stringify({ iframeId, plotImage: '<PNG data URL>' })
```

### listenOnChange

```javascript
iframe.contentWindow.postMessage(JSON.stringify({ listenOnChange: true }), '*');
// After this, every user action emits JSON.stringify({ iframeId, state: <plotState> })
// (500 ms debounce). The legacy enable is one-way — there is no disable.
```

### altText

```javascript
// Read
iframe.contentWindow.postMessage(JSON.stringify({ altText: null }), '*');
// Reply: JSON.stringify({ iframeId, summary })

// Write
iframe.contentWindow.postMessage(JSON.stringify({ altText: 'Bar chart of …' }), '*');
```

## Notes & gotchas

::: warning Wait for `frameReady`
Posting messages to the iframe before the bridge has mounted is a no-op. Always wait for the `frameReady` event before sending requests.
:::

- **Always JSON-stringify `value` for `datasetSave` / `datasetLoad`.** Both directions carry the dataset payload as a stringified JSON, not a nested object. Other new-API events (`plotStateGet/Set`, `plotImageGet`, `altTextGet/Set`, `changeListener`) carry the value natively.
- **`rawdataappend` bypasses `onDataLoaded`.** It writes directly into TuvaDataTools via `actions.appendRawData`. Rows must omit the Case column.
- **Same-window access.** The hook also assigns `window.tuvaDataTools = { actions }` as a side effect for hosts that want direct access from the same window (e.g. tests). Prefer messages for cross-origin embedding.
- **`viewOnly` scope.** The option forces view-only mode for `plotStateSet` (new) and `plotState` (legacy) writes only. It does **not** apply to `datasetLoad`.

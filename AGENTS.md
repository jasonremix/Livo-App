Livo is the Expo/React Native app for mylivo.app – German driving-theory exam prep (Führerschein Klasse B). UI copy is German, "du"-form. Prioritize mobile-first patterns and cross-platform compatibility (iOS, Android, web).

## Expo has changed — do not trust your training data

This project is on Expo SDK 58. APIs you remember may be renamed, moved, or removed. Before touching an Expo, EAS, or React Native API, check the versioned docs (`https://docs.expo.dev/versions/v58.0.0/`) or the installed package's types in `node_modules`. Known SDK 58 specifics used here:

- JS bottom tabs come from `expo-router/js-tabs` (the `Tabs` export of `expo-router` is deprecated).
- TypeScript 6 does not load global `@types` automatically – `tsconfig.json` lists `types: ["jest", "node"]`.
- `ScrollView` refs are typed as `ScrollViewInstance` from `react-native`.
- The React Compiler is on (`experiments.reactCompiler`); its ESLint rules forbid impure calls during render and setState inside effects.

## Commands

```bash
npx expo install <package>   # use instead of npm install for native/Expo packages
npm start                    # dev server
npm test                     # jest (jest-expo)
npm run typecheck            # tsc
npm run lint                 # expo lint
npm run build:web            # static web export to dist/
npx tsc -p server/tsconfig.json   # typecheck the Livia server
```

Run test, typecheck and lint before declaring a task done.

## Layout

- Routes live in `src/app/` (Expo Router). Keep non-route code outside it.
- Content: `src/data/` (questions, courses, Livia FAQ). Questions are original wording – never paste the licensed official catalogue.
- Pure logic with tests: `src/lib/` (exam scoring, Leitner SRS, stats, offline Livia search).
- Global state: `src/store/useLivoStore.ts` (zustand + AsyncStorage persistence).
- Theme: `src/theme` – colors and fonts mirror mylivo.app (primary `#f5312c`, Unbounded + Manrope).
- `server/` is a separate Node project (Livia → Claude API); it is excluded from the app's tsconfig and ESLint.

## Rules

- `ios/` and `android/` are generated (Continuous Native Generation). Never create or edit them by hand – configure native behavior in `app.json`.
- `Alert.alert` does nothing on web – use `ConfirmDialog` from `src/components/ui.tsx`.
- Never ship API keys in the app; anything prefixed `EXPO_PUBLIC_` is bundled into the client.

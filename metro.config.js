// Expo SDK 55+ monorepo Metro config (CommonJS, no Tailwind/NativeWind)
const { getDefaultConfig } = require("expo/metro-config")
const { FileStore } = require("metro-cache")
const path = require("path")

process.env.EXPO_NO_METRO_WORKSPACE_ROOT = "1"

/**
 * @param {import("@expo/metro-config").MetroConfig & { reporter: { update(): void; }; watchFolders: string[]; resolver: { unstable_conditionsByPlatform: { ios: string[]; android: string[]; web: string[]; }; resolverMainFields: string[]; platforms: string[]; assetExts: string[]; sourceExts: string[]; nodeModulesPaths: string[]; blockList: RegExp[]; }; cacheStores: import("@expo/metro-config/build/file-store").FileStore<any>[]; watcher: { unstable_workerThreads: false; additionalExts: string[]; }; serializer: { isThirdPartyModule(module: { readonly path: string; }): boolean; createModuleIdFactory: () => (path: string, context?: { platform: string; environment?: string | null; }) => number; getModulesRunBeforeMainModule: () => string[]; getPolyfills: ({ platform }: { platform?: null | string; }) => any; }; server: { rewriteRequestUrl: (url: string) => string; port: number; unstable_serverRoot: string; }; symbolicator: { customizeFrame: ($$PARAM_0$$: { readonly file?: null | string; readonly lineNumber?: null | number; readonly column?: null | number; readonly methodName?: null | string; }) => (null | undefined | { readonly collapse?: boolean; }) | Promise<null | undefined | { readonly collapse?: boolean; }>; }; transformerPath: string; transformer: { unstable_workerThreads: true; unstable_renameRequire: false; _expoRouterPath: string | undefined; postcssHash: string | null; browserslistHash: string | null; sassVersion: string | null; reanimatedVersion: string | null; workletsVersion: string | null; _expoRelativeProjectRoot: string; unstable_allowRequireContext: true; allowOptionalDependencies: true; babelTransformerPath: string; asyncRequireModulePath: string; assetRegistryPath: string; enableBabelRuntime: string | undefined; getTransformOptions: () => Promise<{ transform: { experimentalImportSupport: true; inlineRequires: false; }; }>; }; }} config
 */
function withTurborepoManagedCache(config) {
  config.cacheStores = [new FileStore({ root: path.join(__dirname, "node_modules/.cache/metro") })]
  return config
}

const config = getDefaultConfig(__dirname)

const reactAsyncHookEntry = path.resolve(__dirname, "../../node_modules/react-async-hook/dist/index.js")
const defaultResolveRequest = config.resolver.resolveRequest

/** @type {NonNullable<import("expo/metro-config").MetroConfig["resolver"]["resolveRequest"]>} */
const resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-async-hook") {
    return {
      filePath: reactAsyncHookEntry,
      type: "sourceFile",
    }
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform)
  }

  return context.resolveRequest(context, moduleName, platform)
}

config.resolver = {
  ...config.resolver,
  resolveRequest,
}

const finalConfig = withTurborepoManagedCache(config)

module.exports = finalConfig

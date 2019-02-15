import {SakuliPresetProvider} from "@sakuli/core/dist/sakuli-preset-provider.interface";
import {SakuliPresetRegistry} from "@sakuli/core/dist/sakuli-preset-registry.class";
import {LegacyLifecycleHooks} from "./context/legacy-context-provider.class";
import {Builder} from "selenium-webdriver";
import {LegacyLoader} from "./loader/legacy-loader.class";
import {migrationCommandProvider} from "./migration/migration-command-provider.function";

export {LegacyLoader, LegacyLifecycleHooks};

const legacyPreset: SakuliPresetProvider = (reg: SakuliPresetRegistry) => {
    reg.registerContextProvider(new LegacyLifecycleHooks(new Builder()));
    reg.registerProjectLoader(new LegacyLoader());
    reg.registerCommandModule(migrationCommandProvider)
};

export default legacyPreset;